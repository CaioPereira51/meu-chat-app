use crate::services::paths::{models_config_path, models_dir};
use crate::types::{GgufModel, ModelConfig, ModelsRegistry};
use std::fs;
use std::path::Path;

fn infer_display_name(file_name: &str) -> String {
    let stem = file_name
        .trim_end_matches(".gguf")
        .trim_end_matches(".GGUF");
    stem.replace(['_', '-'], " ")
        .split_whitespace()
        .map(|w| {
            let mut c = w.chars();
            match c.next() {
                None => String::new(),
                Some(f) => f.to_uppercase().collect::<String>() + c.as_str(),
            }
        })
        .collect::<Vec<_>>()
        .join(" ")
}

fn load_registry(root: &Path) -> Result<ModelsRegistry, String> {
    let path = models_config_path(root);
    if !path.exists() {
        return Ok(ModelsRegistry::default());
    }
    let content = fs::read_to_string(&path).map_err(|e| e.to_string())?;
    serde_json::from_str(&content).map_err(|e| e.to_string())
}

fn save_registry(root: &Path, registry: &ModelsRegistry) -> Result<(), String> {
    use crate::services::paths::config_dir;
    fs::create_dir_all(config_dir(root)).map_err(|e| e.to_string())?;
    let content = serde_json::to_string_pretty(registry).map_err(|e| e.to_string())?;
    fs::write(models_config_path(root), content).map_err(|e| e.to_string())
}

pub fn scan_models(root: &Path, models_directory: &str) -> Result<Vec<GgufModel>, String> {
    let dir = models_dir(root, models_directory);
    fs::create_dir_all(&dir).map_err(|e| e.to_string())?;

    let registry = load_registry(root)?;
    let mut models = Vec::new();

    let entries = fs::read_dir(&dir).map_err(|e| e.to_string())?;
    for entry in entries.flatten() {
        let path = entry.path();
        if !path.is_file() {
            continue;
        }
        let file_name = path
            .file_name()
            .and_then(|n| n.to_str())
            .unwrap_or("")
            .to_string();
        if !file_name.to_lowercase().ends_with(".gguf") {
            continue;
        }

        let metadata = fs::metadata(&path).map_err(|e| e.to_string())?;
        let config = registry
            .models
            .get(&file_name)
            .cloned()
            .unwrap_or_default();

        models.push(GgufModel {
            id: file_name.clone(),
            file_name: file_name.clone(),
            display_name: infer_display_name(&file_name),
            size_bytes: metadata.len(),
            config,
        });
    }

    models.sort_by(|a, b| a.display_name.cmp(&b.display_name));
    Ok(models)
}

pub fn get_model_config(root: &Path, file_name: &str) -> Result<ModelConfig, String> {
    let registry = load_registry(root)?;
    Ok(registry
        .models
        .get(file_name)
        .cloned()
        .unwrap_or_default())
}

pub fn save_model_config(root: &Path, file_name: &str, config: ModelConfig) -> Result<(), String> {
    let mut registry = load_registry(root)?;
    registry.models.insert(file_name.to_string(), config);
    save_registry(root, &registry)
}

pub fn import_model(
    root: &Path,
    models_directory: &str,
    source_path: &Path,
) -> Result<GgufModel, String> {
    let file_name = source_path
        .file_name()
        .and_then(|n| n.to_str())
        .ok_or("Nome de arquivo inválido")?
        .to_string();

    if !file_name.to_lowercase().ends_with(".gguf") {
        return Err("Apenas arquivos .gguf são suportados".to_string());
    }

    let dest_dir = models_dir(root, models_directory);
    fs::create_dir_all(&dest_dir).map_err(|e| e.to_string())?;
    let dest = dest_dir.join(&file_name);
    fs::copy(source_path, &dest).map_err(|e| e.to_string())?;

    let metadata = fs::metadata(&dest).map_err(|e| e.to_string())?;
    Ok(GgufModel {
        id: file_name.clone(),
        file_name: file_name.clone(),
        display_name: infer_display_name(&file_name),
        size_bytes: metadata.len(),
        config: ModelConfig::default(),
    })
}

pub fn remove_model(root: &Path, models_directory: &str, file_name: &str) -> Result<(), String> {
    let path = models_dir(root, models_directory).join(file_name);
    if path.exists() {
        fs::remove_file(&path).map_err(|e| e.to_string())?;
    }
    let mut registry = load_registry(root)?;
    registry.models.remove(file_name);
    save_registry(root, &registry)
}
