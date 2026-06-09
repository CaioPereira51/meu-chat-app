use std::path::{Path, PathBuf};
use tauri::Manager;

pub fn app_root(app: &tauri::AppHandle) -> PathBuf {
    if let Ok(resource) = app.path().resource_dir() {
        let dev_root = resource.join("..").join("..").join("..");
        if dev_root.join("modelos").exists() || dev_root.join("config").exists() {
            return dev_root.canonicalize().unwrap_or(dev_root);
        }
    }

    if let Ok(cwd) = std::env::current_dir() {
        if cwd.join("modelos").exists() || cwd.join("config").exists() {
            return cwd;
        }
        let parent = cwd.join("..");
        if parent.join("modelos").exists() {
            return parent.canonicalize().unwrap_or(parent);
        }
    }

    std::env::current_dir().unwrap_or_else(|_| PathBuf::from("."))
}

pub fn config_dir(root: &Path) -> PathBuf {
    root.join("config")
}

pub fn models_dir(root: &Path, models_directory: &str) -> PathBuf {
    let path = PathBuf::from(models_directory);
    if path.is_absolute() {
        path
    } else {
        root.join(path)
    }
}

pub fn data_dir(root: &Path) -> PathBuf {
    root.join("data")
}

pub fn chats_dir(root: &Path) -> PathBuf {
    data_dir(root).join("chats")
}

pub fn logs_dir(root: &Path) -> PathBuf {
    data_dir(root).join("logs")
}

pub fn cache_dir(root: &Path) -> PathBuf {
    data_dir(root).join("cache")
}

pub fn app_config_path(root: &Path) -> PathBuf {
    config_dir(root).join("app.json")
}

pub fn models_config_path(root: &Path) -> PathBuf {
    config_dir(root).join("models.json")
}

pub fn llamafile_binary(root: &Path) -> PathBuf {
    let candidates = [
        root.join("llamafile-0.10.3.exe"),
        root.join("llamafile.exe"),
        root.join("src-tauri")
            .join("binaries")
            .join("llamafile-x86_64-pc-windows-msvc.exe"),
        root.join("binaries").join("llamafile-x86_64-pc-windows-msvc.exe"),
    ];
    for c in candidates {
        if c.exists() {
            return c;
        }
    }
    root.join("llamafile.exe")
}
