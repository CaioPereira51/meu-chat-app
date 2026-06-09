mod services;
mod types;

use services::chat_store;
use services::config_service;
use services::llamafile_manager::LlamafileManager;
use services::model_service;
use services::paths::{app_root, logs_dir};
use services::system_metrics;
use std::sync::Arc;
use tauri::State;
use types::*;

struct AppState {
    llamafile: Arc<LlamafileManager>,
}

#[tauri::command]
fn load_config(app: tauri::AppHandle) -> Result<AppConfig, String> {
    let root = app_root(&app);
    config_service::load_config(&root)
}

#[tauri::command]
fn save_config(app: tauri::AppHandle, config: AppConfig) -> Result<(), String> {
    let root = app_root(&app);
    config_service::save_config(&root, &config)
}

#[tauri::command]
fn ensure_directories(app: tauri::AppHandle) -> Result<(), String> {
    let root = app_root(&app);
    config_service::ensure_directories(&root)
}

#[tauri::command]
fn scan_models(app: tauri::AppHandle) -> Result<Vec<GgufModel>, String> {
    let root = app_root(&app);
    let config = config_service::load_config(&root)?;
    model_service::scan_models(&root, &config.models_directory)
}

#[tauri::command]
fn get_model_config(app: tauri::AppHandle, file_name: String) -> Result<ModelConfig, String> {
    let root = app_root(&app);
    model_service::get_model_config(&root, &file_name)
}

#[tauri::command]
fn save_model_config(
    app: tauri::AppHandle,
    file_name: String,
    config: ModelConfig,
) -> Result<(), String> {
    let root = app_root(&app);
    model_service::save_model_config(&root, &file_name, config)
}

#[tauri::command]
async fn import_model(app: tauri::AppHandle) -> Result<Option<GgufModel>, String> {
    use tauri_plugin_dialog::DialogExt;

    let file = app
        .dialog()
        .file()
        .add_filter("GGUF Models", &["gguf"])
        .blocking_pick_file();

    let Some(path) = file else {
        return Ok(None);
    };

    let source = path
        .into_path()
        .map_err(|e| format!("Caminho inválido: {e}"))?;

    let root = app_root(&app);
    let config = config_service::load_config(&root)?;
    let model = model_service::import_model(&root, &config.models_directory, &source)?;
    Ok(Some(model))
}

#[tauri::command]
fn remove_model(app: tauri::AppHandle, file_name: String) -> Result<(), String> {
    let root = app_root(&app);
    let config = config_service::load_config(&root)?;
    model_service::remove_model(&root, &config.models_directory, &file_name)
}

#[tauri::command]
fn start_llamafile(
    app: tauri::AppHandle,
    state: State<'_, AppState>,
    model: GgufModel,
) -> Result<(), String> {
    let root = app_root(&app);
    let config = config_service::load_config(&root)?;
    state.llamafile.start(
        &root,
        &config.models_directory,
        &model,
        config.llamafile_port,
    )
}

#[tauri::command]
fn stop_llamafile(state: State<'_, AppState>) -> Result<(), String> {
    state.llamafile.stop()
}

#[tauri::command]
async fn health_check(app: tauri::AppHandle) -> Result<bool, String> {
    let root = app_root(&app);
    let config = config_service::load_config(&root)?;
    let url = format!(
        "http://{}:{}/health",
        config.llamafile_host, config.llamafile_port
    );

    match reqwest::get(&url).await {
        Ok(res) => Ok(res.status().is_success()),
        Err(_) => Ok(false),
    }
}

#[tauri::command]
fn list_chats(app: tauri::AppHandle) -> Result<Vec<ChatSession>, String> {
    let root = app_root(&app);
    chat_store::list_chats(&root)
}

#[tauri::command]
fn create_chat(
    app: tauri::AppHandle,
    model_id: String,
    title: Option<String>,
) -> Result<ChatSession, String> {
    let root = app_root(&app);
    chat_store::create_chat(&root, &model_id, title.as_deref())
}

#[tauri::command]
fn save_chat(app: tauri::AppHandle, chat: ChatSession) -> Result<(), String> {
    let root = app_root(&app);
    chat_store::save_chat(&root, &chat)
}

#[tauri::command]
fn delete_chat(app: tauri::AppHandle, chat_id: String) -> Result<(), String> {
    let root = app_root(&app);
    chat_store::delete_chat(&root, &chat_id)
}

#[tauri::command]
fn rename_chat(app: tauri::AppHandle, chat_id: String, title: String) -> Result<(), String> {
    let root = app_root(&app);
    chat_store::rename_chat(&root, &chat_id, &title)
}

#[tauri::command]
fn export_chat(app: tauri::AppHandle, chat_id: String) -> Result<String, String> {
    let root = app_root(&app);
    chat_store::export_chat(&root, &chat_id)
}

#[tauri::command]
fn get_system_metrics() -> SystemMetrics {
    system_metrics::get_system_metrics()
}

#[tauri::command]
fn open_logs_folder(app: tauri::AppHandle) -> Result<(), String> {
    let root = app_root(&app);
    let dir = logs_dir(&root);
    std::fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    #[cfg(target_os = "windows")]
    {
        std::process::Command::new("explorer")
            .arg(&dir)
            .spawn()
            .map_err(|e| e.to_string())?;
    }
    #[cfg(not(target_os = "windows"))]
    {
        std::process::Command::new("xdg-open")
            .arg(&dir)
            .spawn()
            .map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .manage(AppState {
            llamafile: Arc::new(LlamafileManager::new()),
        })
        .invoke_handler(tauri::generate_handler![
            load_config,
            save_config,
            ensure_directories,
            scan_models,
            get_model_config,
            save_model_config,
            import_model,
            remove_model,
            start_llamafile,
            stop_llamafile,
            health_check,
            list_chats,
            create_chat,
            save_chat,
            delete_chat,
            rename_chat,
            export_chat,
            get_system_metrics,
            open_logs_folder,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
