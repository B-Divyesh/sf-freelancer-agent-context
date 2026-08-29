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

/// Everything the connector needs to begin one checked client session. This is
/// deliberately written inside the connector profile rather than passed on a
/// command line, where the brief or draft could leak to process listings.
#[derive(Debug, Clone, Deserialize, Serialize, PartialEq)]
#[serde(rename_all = "camelCase")]
struct SessionSource {
    id: String,
    label: String,
    account: String,
    kind: String,
    connector: String,
    folder: String,
}

#[derive(Debug, Clone, Deserialize, Serialize, PartialEq)]
#[serde(rename_all = "camelCase")]
struct LaunchRequest {
    session_id: String,
    workspace_id: String,
    workspace_name: String,
    source_id: String,
    source_label: String,
    connector: String,
    folder: String,
    selected_sources: Vec<SessionSource>,
    brief: String,
    writing_rule: String,
    redaction_rules: Vec<RedactionRule>,
    checked_draft: String,
}

#[derive(Debug, Clone, Deserialize, Serialize, PartialEq)]
#[serde(rename_all = "camelCase")]
struct RedactionRule {
    term: String,
    replacement: String,
}

#[derive(Debug, Clone, Deserialize, Serialize, PartialEq)]
#[serde(rename_all = "camelCase")]
struct AgentSessionContext {
    version: u8,
    session_id: String,
    workspace_id: String,
    workspace_name: String,
    source_id: String,
    source_label: String,
    connector: String,
    folder: String,
    selected_sources: Vec<SessionSource>,
    brief: String,
    writing_rule: String,
    redaction_rules: Vec<RedactionRule>,
    checked_draft: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct LaunchReceipt {
    profile_dir: String,
    context_path: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct PreparedSessionReceipt {
    profile_dir: String,
    context_path: String,
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

fn connector_name(value: &str) -> Result<String, String> {
    match value {
        "codex" | "claude" | "gemini" => Ok(value.into()),
        _ => Err("Choose Codex, Claude Code, or Gemini CLI.".into()),
    }
}

fn validate_request(request: &LaunchRequest) -> Result<(), String> {
    safe_id(&request.session_id)?;
    safe_id(&request.workspace_id)?;
    safe_id(&request.source_id)?;
    connector_name(&request.connector)?;
    if request.workspace_name.trim().is_empty()
        || request.source_label.trim().is_empty()
        || request.brief.trim().is_empty()
        || request.writing_rule.trim().is_empty()
    {
        return Err("The saved client brief, writing rule, and source label are required.".into());
    }
    if request.selected_sources.is_empty()
        || !request.selected_sources.iter().any(|source| {
            source.id == request.source_id
                && source.connector == request.connector
                && source.folder == request.folder
        })
    {
        return Err("The launch source must be one of the checked session sources.".into());
    }
    for source in &request.selected_sources {
        safe_id(&source.id)?;
        connector_name(&source.connector)?;
    }
    Ok(())
}

fn session_context(request: &LaunchRequest, folder: &Path) -> AgentSessionContext {
    AgentSessionContext {
        version: 1,
        session_id: request.session_id.clone(),
        workspace_id: request.workspace_id.clone(),
        workspace_name: request.workspace_name.clone(),
        source_id: request.source_id.clone(),
        source_label: request.source_label.clone(),
        connector: request.connector.clone(),
        folder: folder.to_string_lossy().into_owned(),
        selected_sources: request.selected_sources.clone(),
        brief: request.brief.clone(),
        writing_rule: request.writing_rule.clone(),
        redaction_rules: request.redaction_rules.clone(),
        checked_draft: request.checked_draft.clone(),
    }
}

fn launch_scope(
    base: &Path,
    request: &LaunchRequest,
    folder: PathBuf,
) -> Result<LaunchScope, String> {
    validate_request(request)?;
    let connector = connector_name(&request.connector)?;
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
    // The process starts from this small, documented allowlist. In particular,
    // no provider or generic API-token environment is inherited from the app,
    // desktop session, or shell that launched it.
    let mut environment = inherited_runtime_environment();
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
    environment.insert("CCF_SESSION_ID".into(), request.session_id.clone());
    environment.insert(
        "CCF_SESSION_CONTEXT_PATH".into(),
        profile_dir
            .join("sessions")
            .join(format!("{}.json", request.session_id))
            .to_string_lossy()
            .into_owned(),
    );
    Ok(LaunchScope {
        connector,
        folder,
        profile_dir,
        environment,
    })
}

/// Variables required to start a terminal or connector. This is intentionally
/// an allowlist: credentials are never safe to inherit across a client switch.
fn inherited_runtime_environment() -> BTreeMap<String, String> {
    const ALLOWLIST: &[&str] = &[
        "PATH",
        "LANG",
        "LC_ALL",
        "LC_CTYPE",
        "TERM",
        "COLORTERM",
        "DISPLAY",
        "WAYLAND_DISPLAY",
        "XAUTHORITY",
        "DBUS_SESSION_BUS_ADDRESS",
        "SYSTEMROOT",
        "WINDIR",
        "COMSPEC",
        "PATHEXT",
        "TEMP",
        "TMP",
    ];
    ALLOWLIST
        .iter()
        .filter_map(|key| env::var(key).ok().map(|value| ((*key).into(), value)))
        .collect()
}

fn write_session_context(scope: &LaunchScope, request: &LaunchRequest) -> Result<PathBuf, String> {
    let context_path = PathBuf::from(
        scope
            .environment
            .get("CCF_SESSION_CONTEXT_PATH")
            .ok_or("The scoped session context path is missing.")?,
    );
    let parent = context_path
        .parent()
        .ok_or("The scoped session context folder is invalid.")?;
    fs::create_dir_all(parent)
        .map_err(|error| format!("Could not create the checked session context: {error}"))?;
    let contents = serde_json::to_vec_pretty(&session_context(request, &scope.folder))
        .map_err(|error| error.to_string())?;
    fs::write(&context_path, contents)
        .map_err(|error| format!("Could not save the checked session context: {error}"))?;
    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        fs::set_permissions(&context_path, fs::Permissions::from_mode(0o600))
            .map_err(|error| format!("Could not protect the checked session context: {error}"))?;
    }
    Ok(context_path)
}

fn prepare_scoped_session_at(
    base: &Path,
    request: &LaunchRequest,
) -> Result<(LaunchScope, PathBuf), String> {
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
    let scope = launch_scope(base, request, folder)?;
    let context_path = write_session_context(&scope, request)?;
    Ok((scope, context_path))
}

fn prepared_scope_at(base: &Path, request: &LaunchRequest) -> Result<LaunchScope, String> {
    let folder = fs::canonicalize(&request.folder).map_err(|_| {
        "The local folder is no longer available. Check it, then run the boundary check again."
            .to_string()
    })?;
    if !folder.is_dir() {
        return Err("The local source is no longer a folder. Run the boundary check again.".into());
    }
    if !command_exists(&request.connector) {
        return Err(format!(
            "{} is not installed or is not on PATH.",
            request.connector
        ));
    }
    let scope = launch_scope(base, request, folder)?;
    let context_path = PathBuf::from(
        scope
            .environment
            .get("CCF_SESSION_CONTEXT_PATH")
            .ok_or("The scoped session context path is missing.")?,
    );
    let stored: AgentSessionContext =
        serde_json::from_slice(&fs::read(&context_path).map_err(|_| {
            "This checked session is no longer prepared. Run the boundary check again.".to_string()
        })?)
        .map_err(|_| {
            "This checked session context is damaged. Run the boundary check again.".to_string()
        })?;
    if stored != session_context(request, &scope.folder) {
        return Err("The checked session context changed. Run the boundary check again.".into());
    }
    Ok(scope)
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

/// Apply the complete child environment after clearing every inherited value.
/// Keeping this separate makes the security boundary directly regression-testable.
fn apply_scoped_environment(command: &mut Command, scope: &LaunchScope) {
    command
        .env_clear()
        .envs(&scope.environment)
        .current_dir(&scope.folder);
}

/// All supported interactive connectors accept an initial instruction. The
/// sensitive material remains in the mode-600 context file; the command line
/// only tells the connector where to read its already checked session.
fn connector_instruction(scope: &LaunchScope) -> String {
    format!(
        "Read and follow the checked Client Context Firewall session at {} before acting. It binds the client brief, writing rule, redaction rules, selected sources, and checked draft to this session.",
        scope.environment["CCF_SESSION_CONTEXT_PATH"]
    )
}

#[cfg(target_os = "linux")]
fn spawn_scope(scope: &LaunchScope) -> Result<(), String> {
    let mut env_args: Vec<String> = scope
        .environment
        .iter()
        .map(|(key, value)| format!("{key}={value}"))
        .collect();
    env_args.insert(0, "-i".into());
    env_args.push(scope.connector.clone());
    env_args.push(connector_instruction(scope));
    let candidates: [(&str, &[&str]); 4] = [
        ("x-terminal-emulator", &["-e", "env"]),
        ("gnome-terminal", &["--", "env"]),
        ("konsole", &["-e", "env"]),
        ("xterm", &["-e", "env"]),
    ];
    for (program, prefix) in candidates {
        let mut command = Command::new(program);
        command.args(prefix).args(&env_args);
        apply_scoped_environment(&mut command, scope);
        if command.spawn().is_ok() {
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
    let env_args = scope
        .environment
        .iter()
        .map(|(key, value)| format!("{key}={}", shell_literal(value)))
        .collect::<Vec<_>>()
        .join(" ");
    let contents = format!(
        "#!/bin/sh\ncd {}\nexec /usr/bin/env -i {env_args} {} {}\n",
        shell_literal(&scope.folder.to_string_lossy()),
        scope.connector,
        shell_literal(&connector_instruction(scope))
    );
    fs::write(&script, contents)
        .map_err(|error| format!("Could not prepare the scoped terminal: {error}"))?;
    fs::set_permissions(&script, fs::Permissions::from_mode(0o700))
        .map_err(|error| error.to_string())?;
    let mut command = Command::new("/usr/bin/open");
    command.arg(&script);
    apply_scoped_environment(&mut command, scope);
    command
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
        "Get-ChildItem Env: | ForEach-Object {{ Remove-Item -LiteralPath (\"Env:\" + $_.Name) }}\r\n{exports}\r\nSet-Location -LiteralPath {}\r\n& {} {}\r\n",
        ps_literal(&scope.folder.to_string_lossy()),
        scope.connector,
        ps_literal(&connector_instruction(scope))
    );
    fs::write(&script, contents)
        .map_err(|error| format!("Could not prepare the scoped terminal: {error}"))?;
    let mut command = Command::new("powershell.exe");
    command
        .args(["-NoLogo", "-NoExit", "-ExecutionPolicy", "Bypass", "-File"])
        .arg(&script);
    apply_scoped_environment(&mut command, scope);
    command
        .spawn()
        .map_err(|error| format!("Could not open PowerShell: {error}"))?;
    Ok(())
}

#[tauri::command]
fn prepare_scoped_session(
    app: AppHandle,
    request: LaunchRequest,
) -> Result<PreparedSessionReceipt, String> {
    let (scope, context_path) = prepare_scoped_session_at(
        &app.path()
            .app_data_dir()
            .map_err(|error| error.to_string())?,
        &request,
    )?;
    Ok(PreparedSessionReceipt {
        profile_dir: scope.profile_dir.to_string_lossy().into_owned(),
        context_path: context_path.to_string_lossy().into_owned(),
    })
}

#[tauri::command]
fn launch_scoped_agent(app: AppHandle, request: LaunchRequest) -> Result<LaunchReceipt, String> {
    let scope = prepared_scope_at(
        &app.path()
            .app_data_dir()
            .map_err(|error| error.to_string())?,
        &request,
    )?;
    spawn_scope(&scope)?;
    Ok(LaunchReceipt {
        profile_dir: scope.profile_dir.to_string_lossy().into_owned(),
        context_path: scope.environment["CCF_SESSION_CONTEXT_PATH"].clone(),
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

fn vault_key_from_entry(entry: &keyring::Entry) -> Result<[u8; 32], String> {
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

fn vault_key() -> Result<[u8; 32], String> {
    let entry = keyring::Entry::new(SERVICE, ACCOUNT).map_err(|error| error.to_string())?;
    vault_key_from_entry(&entry)
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
            prepare_scoped_session,
            launch_scoped_agent
        ])
        .run(tauri::generate_context!())
        .expect("error while running Client Context Firewall");
}

#[cfg(test)]
mod tests {
    use super::{
        apply_scoped_environment, connector_instruction, decrypt, delete_workspace_scope_at,
        encrypt, launch_scope, prepare_scoped_session_at, vault_key_from_entry,
        write_session_context, LaunchRequest, RedactionRule, SessionSource,
    };
    use base64::Engine;
    use std::{env, fs, process::Command};

    fn request(workspace: &str, folder: &std::path::Path) -> LaunchRequest {
        let source = SessionSource {
            id: "repo".into(),
            label: "client/repository".into(),
            account: "developer@client.example".into(),
            kind: "Git".into(),
            connector: "codex".into(),
            folder: folder.to_string_lossy().into_owned(),
        };
        LaunchRequest {
            session_id: format!("{workspace}-session"),
            workspace_id: workspace.into(),
            workspace_name: format!("{workspace} client"),
            source_id: source.id.clone(),
            source_label: source.label.clone(),
            connector: source.connector.clone(),
            folder: source.folder.clone(),
            selected_sources: vec![source],
            brief: "Ship the checked client change.".into(),
            writing_rule: "Use short sentences.".into(),
            redaction_rules: vec![RedactionRule {
                term: "CLIENT_SECRET".into(),
                replacement: "[REDACTED]".into(),
            }],
            checked_draft: "The checked draft is safe to deliver.".into(),
        }
    }

    #[test]
    fn encrypted_vault_round_trips_and_rejects_another_key() {
        let credential = keyring::mock::default_credential_builder()
            .build(None, "test-service", "test-user")
            .unwrap();
        let entry = keyring::Entry::new_with_credential(credential);
        assert!(matches!(entry.get_password(), Err(keyring::Error::NoEntry)));
        let key = vault_key_from_entry(&entry).unwrap();
        let stored = entry.get_password().unwrap();
        assert_eq!(
            base64::engine::general_purpose::STANDARD
                .decode(stored)
                .unwrap(),
            key
        );
        assert_eq!(vault_key_from_entry(&entry).unwrap(), key);
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
        let northstar =
            launch_scope(&base, &request("northstar", &folder), folder.clone()).unwrap();
        let juniper = launch_scope(&base, &request("juniper", &folder), folder.clone()).unwrap();
        assert_ne!(northstar.profile_dir, juniper.profile_dir);
        assert_ne!(northstar.environment["HOME"], juniper.environment["HOME"]);
        assert_ne!(
            northstar.environment["XDG_CONFIG_HOME"],
            juniper.environment["XDG_CONFIG_HOME"]
        );
        assert_eq!(northstar.connector, "codex");
        for connector in ["codex", "claude", "gemini"] {
            let mut allowed = request("northstar", &folder);
            allowed.connector = connector.into();
            allowed.selected_sources[0].connector = connector.into();
            assert!(launch_scope(&base, &allowed, folder.clone()).is_ok());
        }
        let mut invalid = request("northstar", &folder);
        invalid.connector = "sh".into();
        invalid.selected_sources[0].connector = "sh".into();
        assert!(launch_scope(&base, &invalid, base.clone()).is_err());
        fs::remove_dir_all(base).unwrap();
    }

    /// Regression for verifier P1-1/P1-2: a child started from a process with
    /// client-A provider tokens receives neither token, but does receive the
    /// selected workspace identity and the complete checked context file.
    #[cfg(unix)]
    #[test]
    fn scoped_launch_clears_parent_provider_credentials_and_binds_checked_context() {
        let base = env::temp_dir().join(format!("ccf-native-launch-test-{}", std::process::id()));
        let folder = base.join("project");
        fs::create_dir_all(&folder).unwrap();
        let request = request("northstar", &folder);
        let scope = launch_scope(&base, &request, folder.clone()).unwrap();
        let context_path = write_session_context(&scope, &request).unwrap();
        let instruction = connector_instruction(&scope);

        let mut child = Command::new("sh");
        // These stand in for arbitrary API credentials inherited from the app's
        // parent shell. apply_scoped_environment must remove them after this.
        child
            .env("OPENAI_API_KEY", "client-a-openai-sentinel")
            .env("ANTHROPIC_API_KEY", "client-a-anthropic-sentinel")
            .env("GOOGLE_API_KEY", "client-a-google-sentinel")
            .args([
                "-c",
                "printf '%s|%s|%s|%s|%s\\n' \"${OPENAI_API_KEY-unset}\" \"${ANTHROPIC_API_KEY-unset}\" \"${GOOGLE_API_KEY-unset}\" \"$CCF_WORKSPACE_ID\" \"$1\"; cat \"$CCF_SESSION_CONTEXT_PATH\"",
                "--",
                instruction.as_str(),
            ]);
        apply_scoped_environment(&mut child, &scope);
        let output = child.output().unwrap();
        assert!(output.status.success());
        let output = String::from_utf8(output.stdout).unwrap();
        assert!(output.starts_with("unset|unset|unset|northstar|Read and follow the checked Client Context Firewall session at "));
        assert!(!output.contains("client-a-"));
        assert!(output.contains("Ship the checked client change."));
        assert!(output.contains("Use short sentences."));
        assert!(output.contains("CLIENT_SECRET"));
        assert!(output.contains("The checked draft is safe to deliver."));
        assert!(context_path.exists());
        fs::remove_dir_all(base).unwrap();
    }

    /// Regression for verifier P1-3: a failed local path check creates neither
    /// a scoped profile nor anything that could be exported as a passed record.
    #[test]
    fn failed_native_preflight_refuses_provenance_without_a_real_workspace_path() {
        let base = env::temp_dir().join(format!("ccf-preflight-test-{}", std::process::id()));
        let missing = base.join("this-folder-does-not-exist");
        let request = request("impossible", &missing);
        let error = prepare_scoped_session_at(&base, &request).unwrap_err();
        assert!(error.contains("does not exist"));
        assert!(!base.join("connector-scopes/impossible").exists());
        assert!(!base.join("connector-scopes").exists());
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
