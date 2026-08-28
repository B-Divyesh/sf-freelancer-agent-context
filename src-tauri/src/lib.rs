use aes_gcm::{aead::{Aead, KeyInit}, Aes256Gcm, Nonce};
use base64::{engine::general_purpose::STANDARD, Engine};
use rand::{rngs::OsRng, RngCore};
use std::{fs, path::PathBuf};
use tauri::{AppHandle, Manager};

const SERVICE: &str = "in.sociobot.freelancer-agent-context";
const ACCOUNT: &str = "local-vault-key";

fn vault_path(app: &AppHandle) -> Result<PathBuf, String> {
    let dir = app.path().app_data_dir().map_err(|error| error.to_string())?;
    fs::create_dir_all(&dir).map_err(|error| error.to_string())?;
    Ok(dir.join("workspace.vault"))
}

fn vault_key() -> Result<[u8; 32], String> {
    let entry = keyring::Entry::new(SERVICE, ACCOUNT).map_err(|error| error.to_string())?;
    if let Ok(encoded) = entry.get_password() {
        let bytes = STANDARD.decode(encoded).map_err(|error| error.to_string())?;
        return bytes.try_into().map_err(|_| "Stored vault key has the wrong length".to_string());
    }
    let mut key = [0u8; 32]; OsRng.fill_bytes(&mut key);
    entry.set_password(&STANDARD.encode(key)).map_err(|error| error.to_string())?;
    Ok(key)
}

fn encrypt(contents: &[u8], key: &[u8; 32]) -> Result<Vec<u8>, String> {
    let cipher = Aes256Gcm::new_from_slice(key).map_err(|error| error.to_string())?;
    let mut nonce_bytes = [0u8; 12]; OsRng.fill_bytes(&mut nonce_bytes);
    let encrypted = cipher.encrypt(Nonce::from_slice(&nonce_bytes), contents).map_err(|error| error.to_string())?;
    let mut output = nonce_bytes.to_vec(); output.extend(encrypted); Ok(output)
}

fn decrypt(encrypted: &[u8], key: &[u8; 32]) -> Result<Vec<u8>, String> {
    if encrypted.len() < 13 { return Err("The local vault is damaged.".into()); }
    let cipher = Aes256Gcm::new_from_slice(key).map_err(|error| error.to_string())?;
    cipher.decrypt(Nonce::from_slice(&encrypted[..12]), &encrypted[12..]).map_err(|_| "The local vault could not be opened with this device key.".to_string())
}

#[tauri::command]
fn save_vault(app: AppHandle, contents: String) -> Result<(), String> {
    let output = encrypt(contents.as_bytes(), &vault_key()?)?;
    fs::write(vault_path(&app)?, output).map_err(|error| error.to_string())
}

#[tauri::command]
fn load_vault(app: AppHandle) -> Result<Option<String>, String> {
    let path = vault_path(&app)?; if !path.exists() { return Ok(None); }
    let encrypted = fs::read(path).map_err(|error| error.to_string())?;
    let plain = decrypt(&encrypted, &vault_key()?)?;
    String::from_utf8(plain).map(Some).map_err(|error| error.to_string())
}

#[tauri::command]
fn delete_vault(app: AppHandle) -> Result<(), String> {
    let path = vault_path(&app)?; if path.exists() { fs::remove_file(path).map_err(|error| error.to_string())?; }
    if let Ok(entry) = keyring::Entry::new(SERVICE, ACCOUNT) { let _ = entry.delete_credential(); }
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![save_vault, load_vault, delete_vault])
        .run(tauri::generate_context!())
        .expect("error while running Client Context Firewall");
}

#[cfg(test)]
mod tests {
    use super::{decrypt, encrypt};

    #[test]
    fn encrypted_vault_round_trips_and_rejects_another_key() {
        let key = [7u8; 32]; let other_key = [8u8; 32];
        let encrypted = encrypt(br#"{\"client\":\"Northstar\"}"#, &key).unwrap();
        assert_ne!(&encrypted[12..], br#"{\"client\":\"Northstar\"}"#);
        assert_eq!(decrypt(&encrypted, &key).unwrap(), br#"{\"client\":\"Northstar\"}"#);
        assert!(decrypt(&encrypted, &other_key).is_err());
    }
}
