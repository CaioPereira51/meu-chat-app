use crate::services::paths::{app_config_path, config_dir};
use crate::types::AppConfig;
use std::fs;
use std::path::Path;

pub fn load_config(root: &Path) -> Result<AppConfig, String> {
    let path = app_config_path(root);
    if !path.exists() {
        let config = AppConfig::default();
        save_config(root, &config)?;
        return Ok(config);
    }
    let content = fs::read_to_string(&path).map_err(|e| e.to_string())?;
    serde_json::from_str(&content).map_err(|e| e.to_string())
}

pub fn save_config(root: &Path, config: &AppConfig) -> Result<(), String> {
    fs::create_dir_all(config_dir(root)).map_err(|e| e.to_string())?;
    let path = app_config_path(root);
    let content = serde_json::to_string_pretty(config).map_err(|e| e.to_string())?;
    fs::write(path, content).map_err(|e| e.to_string())
}

pub fn ensure_directories(root: &Path) -> Result<(), String> {
    use crate::services::paths::{cache_dir, chats_dir, config_dir, logs_dir};
    for dir in [
        config_dir(root),
        chats_dir(root),
        logs_dir(root),
        cache_dir(root),
        root.join("modelos"),
    ] {
        fs::create_dir_all(dir).map_err(|e| e.to_string())?;
    }
    Ok(())
}
