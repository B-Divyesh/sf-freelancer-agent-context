use aes_gcm::{
    aead::{Aead, KeyInit},
    Aes256Gcm, Nonce,
};
use base64::{engine::general_purpose::STANDARD, Engine};
use rand::{rngs::OsRng, RngCore};
use serde::{Deserialize, Serialize};
use std::{
    collections::BTreeMap,
    env, fs,
    path::{Path, PathBuf},
    process::Command,
};
use tauri::{AppHandle, Manager};

const SERVICE: &str = "in.sociobot.freelancer-agent-context";
const ACCOUNT: &str = "local-vault-key";

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct LaunchRequest {
    workspace_id: String,
    workspace_name: String,
    source_id: String,
    connector: String,
    folder: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct LaunchReceipt {
    profile_dir: String,
}

#[derive(Debug)]
struct LaunchScope {
    connector: String,
    folder: PathBuf,
    profile_dir: PathBuf,
    environment: BTreeMap<String, String>,
}

fn safe_id(value: &str) -> Result<&str, String> {
    if !value.is_empty()
        && value.len() <= 80
        && value
            .bytes()
            .all(|byte| byte.is_ascii_alphanumeric() || matches!(byte, b'-' | b'_'))
    {
        Ok(value)
    } else {
        Err("The workspace or source identifier is invalid.".into())
    }
}

fn launch_scope(
    base: &Path,
    request: &LaunchRequest,
    folder: PathBuf,
) -> Result<LaunchScope, String> {
    let connector = match request.connector.as_str() {
        "codex" | "claude" | "gemini" => request.connector.clone(),
        _ => return Err("Choose Codex, Claude Code, or Gemini CLI.".into()),
    };
    let profile_dir = base
        .join("connector-scopes")
        .join(safe_id(&request.workspace_id)?)
        .join(safe_id(&request.source_id)?);
    let config_dir = profile_dir.join("config");
    let data_dir = profile_dir.join("data");
    let cache_dir = profile_dir.join("cache");
    for path in [&profile_dir, &config_dir, &data_dir, &cache_dir] {
        fs::create_dir_all(path)
            .map_err(|error| format!("Could not create the client profile: {error}"))?;
    }
    let mut environment = BTreeMap::new();
    environment.insert("HOME".into(), profile_dir.to_string_lossy().into_owned());
    environment.insert(
        "XDG_CONFIG_HOME".into(),
        config_dir.to_string_lossy().into_owned(),
    );
    environment.insert(
        "XDG_DATA_HOME".into(),
        data_dir.to_string_lossy().into_owned(),
    );
    environment.insert(
        "XDG_CACHE_HOME".into(),
        cache_dir.to_string_lossy().into_owned(),
    );
    environment.insert("APPDATA".into(), config_dir.to_string_lossy().into_owned());
    environment.insert(
        "LOCALAPPDATA".into(),
        data_dir.to_string_lossy().into_owned(),
    );
    environment.insert(
        "USERPROFILE".into(),
        profile_dir.to_string_lossy().into_owned(),
    );
    environment.insert("CCF_WORKSPACE_ID".into(), request.workspace_id.clone());
    environment.insert("CCF_WORKSPACE_NAME".into(), request.workspace_name.clone());
    environment.insert("CCF_SOURCE_ID".into(), request.source_id.clone());
    Ok(LaunchScope {
        connector,
        folder,
        profile_dir,
        environment,
    })
}

fn delete_workspace_scope_at(base: &Path, workspace_id: &str) -> Result<(), String> {
    let profile_root = base.join("connector-scopes").join(safe_id(workspace_id)?);
    if profile_root.exists() {
        fs::remove_dir_all(&profile_root).map_err(|error| {
            format!("Could not remove the isolated agent profile for this workspace: {error}")
        })?;
    }
    Ok(())
}

fn command_exists(command: &str) -> bool {
    env::var_os("PATH").is_some_and(|paths| {
        env::split_paths(&paths).any(|path| {
            let candidate = path.join(command);
            candidate.is_file()
                || cfg!(target_os = "windows")
                    && ["exe", "cmd", "bat"]
                        .iter()
                        .any(|extension| candidate.with_extension(extension).is_file())
        })
    })
}

#[cfg(target_os = "linux")]
fn spawn_scope(scope: &LaunchScope) -> Result<(), String> {
    let mut env_args: Vec<String> = scope
        .environment
        .iter()
        .map(|(key, value)| format!("{key}={value}"))
        .collect();
    env_args.push(scope.connector.clone());
    let candidates: [(&str, &[&str]); 4] = [
        ("x-terminal-emulator", &["-e", "env"]),
        ("gnome-terminal", &["--", "env"]),
        ("konsole", &["-e", "env"]),
        ("xterm", &["-e", "env"]),
    ];
    for (program, prefix) in candidates {
        if Command::new(program)
            .args(prefix)
            .args(&env_args)
            .current_dir(&scope.folder)
            .spawn()
            .is_ok()
        {
            return Ok(());
        }
    }
    Err("No supported terminal was found. Install x-terminal-emulator, GNOME Terminal, Konsole, or xterm.".into())
}

#[cfg(target_os = "macos")]
fn spawn_scope(scope: &LaunchScope) -> Result<(), String> {
    use std::os::unix::fs::PermissionsExt;
    fn shell_literal(value: &str) -> String {
        format!("'{}'", value.replace('\'', "'\"'\"'"))
    }
    let script = scope.profile_dir.join("open-agent.command");
    let exports = scope
        .environment
        .iter()
        .map(|(key, value)| format!("export {key}={}", shell_literal(value)))
        .collect::<Vec<_>>()
        .join("\n");
    let contents = format!(
        "#!/bin/sh\n{exports}\ncd {}\nexec {}\n",
        shell_literal(&scope.folder.to_string_lossy()),
        scope.connector
    );
    fs::write(&script, contents)
        .map_err(|error| format!("Could not prepare the scoped terminal: {error}"))?;
    fs::set_permissions(&script, fs::Permissions::from_mode(0o700))
        .map_err(|error| error.to_string())?;
    Command::new("/usr/bin/open")
        .arg(&script)
        .spawn()
        .map_err(|error| format!("Could not open Terminal: {error}"))?;
    Ok(())
}

#[cfg(target_os = "windows")]
fn spawn_scope(scope: &LaunchScope) -> Result<(), String> {
    fn ps_literal(value: &str) -> String {
        format!("'{}'", value.replace('\'', "''"))
    }
    let script = scope.profile_dir.join("open-agent.ps1");
    let exports = scope
        .environment
        .iter()
        .map(|(key, value)| format!("$env:{key} = {}", ps_literal(value)))
        .collect::<Vec<_>>()
        .join("\r\n");
    let contents = format!(
        "{exports}\r\nSet-Location -LiteralPath {}\r\n& {}\r\n",
        ps_literal(&scope.folder.to_string_lossy()),
        scope.connector
    );
    fs::write(&script, contents)
        .map_err(|error| format!("Could not prepare the scoped terminal: {error}"))?;
    Command::new("powershell.exe")
        .args(["-NoLogo", "-NoExit", "-ExecutionPolicy", "Bypass", "-File"])
        .arg(&script)
        .spawn()
        .map_err(|error| format!("Could not open PowerShell: {error}"))?;
    Ok(())
}

#[tauri::command]
fn launch_scoped_agent(app: AppHandle, request: LaunchRequest) -> Result<LaunchReceipt, String> {
    let folder = fs::canonicalize(&request.folder).map_err(|_| {
        "The local folder does not exist. Choose an existing project folder.".to_string()
    })?;
    if !folder.is_dir() {
        return Err("The local source must be a folder.".into());
    }
    if !command_exists(&request.connector) {
        return Err(format!(
            "{} is not installed or is not on PATH.",
            request.connector
        ));
    }
    let scope = launch_scope(
        &app.path()
            .app_data_dir()
            .map_err(|error| error.to_string())?,
        &request,
        folder,
    )?;
    spawn_scope(&scope)?;
    Ok(LaunchReceipt {
        profile_dir: scope.profile_dir.to_string_lossy().into_owned(),
    })
}

fn vault_path(app: &AppHandle) -> Result<PathBuf, String> {
    let dir = app
        .path()
        .app_data_dir()
        .map_err(|error| error.to_string())?;
    fs::create_dir_all(&dir).map_err(|error| error.to_string())?;
    Ok(dir.join("workspace.vault"))
}

fn vault_key() -> Result<[u8; 32], String> {
    let entry = keyring::Entry::new(SERVICE, ACCOUNT).map_err(|error| error.to_string())?;
    if let Ok(encoded) = entry.get_password() {
        let bytes = STANDARD
            .decode(encoded)
            .map_err(|error| error.to_string())?;
        return bytes
            .try_into()
            .map_err(|_| "Stored vault key has the wrong length".to_string());
    }
    let mut key = [0u8; 32];
    OsRng.fill_bytes(&mut key);
    entry
        .set_password(&STANDARD.encode(key))
        .map_err(|error| error.to_string())?;
    Ok(key)
}

fn encrypt(contents: &[u8], key: &[u8; 32]) -> Result<Vec<u8>, String> {
    let cipher = Aes256Gcm::new_from_slice(key).map_err(|error| error.to_string())?;
    let mut nonce_bytes = [0u8; 12];
    OsRng.fill_bytes(&mut nonce_bytes);
    let encrypted = cipher
        .encrypt(Nonce::from_slice(&nonce_bytes), contents)
        .map_err(|error| error.to_string())?;
    let mut output = nonce_bytes.to_vec();
    output.extend(encrypted);
    Ok(output)
}

fn decrypt(encrypted: &[u8], key: &[u8; 32]) -> Result<Vec<u8>, String> {
    if encrypted.len() < 13 {
        return Err("The local vault is damaged.".into());
    }
    let cipher = Aes256Gcm::new_from_slice(key).map_err(|error| error.to_string())?;
    cipher
        .decrypt(Nonce::from_slice(&encrypted[..12]), &encrypted[12..])
        .map_err(|_| "The local vault could not be opened with this device key.".to_string())
}

#[tauri::command]
fn save_vault(app: AppHandle, contents: String) -> Result<(), String> {
    let output = encrypt(contents.as_bytes(), &vault_key()?)?;
    fs::write(vault_path(&app)?, output).map_err(|error| error.to_string())
}

#[tauri::command]
fn load_vault(app: AppHandle) -> Result<Option<String>, String> {
    let path = vault_path(&app)?;
    if !path.exists() {
        return Ok(None);
    }
    let encrypted = fs::read(path).map_err(|error| error.to_string())?;
    let plain = decrypt(&encrypted, &vault_key()?)?;
    String::from_utf8(plain)
        .map(Some)
        .map_err(|error| error.to_string())
}

#[tauri::command]
fn delete_vault(app: AppHandle) -> Result<(), String> {
    let path = vault_path(&app)?;
    if path.exists() {
        fs::remove_file(path).map_err(|error| error.to_string())?;
    }
    if let Ok(entry) = keyring::Entry::new(SERVICE, ACCOUNT) {
        let _ = entry.delete_credential();
    }
    Ok(())
}

#[tauri::command]
fn delete_workspace_scope(app: AppHandle, workspace_id: String) -> Result<(), String> {
    let app_data = app
        .path()
        .app_data_dir()
        .map_err(|error| error.to_string())?;
    delete_workspace_scope_at(&app_data, &workspace_id)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            save_vault,
            load_vault,
            delete_vault,
            delete_workspace_scope,
            launch_scoped_agent
        ])
        .run(tauri::generate_context!())
        .expect("error while running Client Context Firewall");
}

#[cfg(test)]
mod tests {
    use super::{decrypt, delete_workspace_scope_at, encrypt, launch_scope, LaunchRequest};
    use std::{env, fs};

    #[test]
    fn encrypted_vault_round_trips_and_rejects_another_key() {
        let key = [7u8; 32];
        let other_key = [8u8; 32];
        let encrypted = encrypt(br#"{\"client\":\"Northstar\"}"#, &key).unwrap();
        assert_ne!(&encrypted[12..], br#"{\"client\":\"Northstar\"}"#);
        assert_eq!(
            decrypt(&encrypted, &key).unwrap(),
            br#"{\"client\":\"Northstar\"}"#
        );
        assert!(decrypt(&encrypted, &other_key).is_err());
    }

    #[test]
    fn scoped_launch_separates_connector_credentials() {
        let base = env::temp_dir().join(format!("ccf-scope-test-{}", std::process::id()));
        let folder = base.join("project");
        fs::create_dir_all(&folder).unwrap();
        let request = |workspace: &str| LaunchRequest {
            workspace_id: workspace.into(),
            workspace_name: workspace.into(),
            source_id: "repo".into(),
            connector: "codex".into(),
            folder: folder.to_string_lossy().into_owned(),
        };
        let northstar = launch_scope(&base, &request("northstar"), folder.clone()).unwrap();
        let juniper = launch_scope(&base, &request("juniper"), folder.clone()).unwrap();
        assert_ne!(northstar.profile_dir, juniper.profile_dir);
        assert_ne!(northstar.environment["HOME"], juniper.environment["HOME"]);
        assert_ne!(
            northstar.environment["XDG_CONFIG_HOME"],
            juniper.environment["XDG_CONFIG_HOME"]
        );
        assert_eq!(northstar.connector, "codex");
        for connector in ["codex", "claude", "gemini"] {
            let mut allowed = request("northstar");
            allowed.connector = connector.into();
            assert!(launch_scope(&base, &allowed, folder.clone()).is_ok());
        }
        let mut invalid = request("northstar");
        invalid.connector = "sh".into();
        assert!(launch_scope(&base, &invalid, base.clone()).is_err());
        fs::remove_dir_all(base).unwrap();
    }

    #[test]
    fn deleting_workspace_removes_its_connector_scope_and_credentials() {
        let base = env::temp_dir().join(format!("ccf-delete-test-{}", std::process::id()));
        let deleted_credential =
            base.join("connector-scopes/northstar/repo/config/credential.json");
        let retained_credential = base.join("connector-scopes/juniper/repo/config/credential.json");
        fs::create_dir_all(deleted_credential.parent().unwrap()).unwrap();
        fs::create_dir_all(retained_credential.parent().unwrap()).unwrap();
        fs::write(&deleted_credential, "northstar-secret").unwrap();
        fs::write(&retained_credential, "juniper-secret").unwrap();

        delete_workspace_scope_at(&base, "northstar").unwrap();

        assert!(!base.join("connector-scopes/northstar").exists());
        assert!(!deleted_credential.exists());
        assert!(retained_credential.exists());
        assert_eq!(
            fs::read_to_string(retained_credential).unwrap(),
            "juniper-secret"
        );
        fs::remove_dir_all(base).unwrap();
    }
}
