use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AppConfig {
    pub theme: String,
    pub language: String,
    pub models_directory: String,
    pub llamafile_port: u16,
    pub llamafile_host: String,
}

impl Default for AppConfig {
    fn default() -> Self {
        Self {
            theme: "dark".to_string(),
            language: "pt-BR".to_string(),
            models_directory: "modelos".to_string(),
            llamafile_port: 8080,
            llamafile_host: "127.0.0.1".to_string(),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ModelConfig {
    pub context: u32,
    pub temperature: f32,
    pub top_p: f32,
    pub seed: i32,
    pub system_prompt: String,
    pub gpu_enabled: bool,
}

impl Default for ModelConfig {
    fn default() -> Self {
        Self {
            context: 40960,
            temperature: 0.7,
            top_p: 0.95,
            seed: -1,
            system_prompt: String::new(),
            gpu_enabled: false,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GgufModel {
    pub id: String,
    pub file_name: String,
    pub display_name: String,
    pub size_bytes: u64,
    pub config: ModelConfig,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Message {
    pub id: String,
    pub role: String,
    pub content: String,
    pub created_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ChatSession {
    pub id: String,
    pub title: String,
    pub model_id: String,
    pub messages: Vec<Message>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SystemMetrics {
    pub ram_used_gb: f64,
    pub ram_total_gb: f64,
    pub cpu_percent: f64,
    pub tokens_per_second: f64,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct ModelsRegistry {
    pub models: std::collections::HashMap<String, ModelConfig>,
}
