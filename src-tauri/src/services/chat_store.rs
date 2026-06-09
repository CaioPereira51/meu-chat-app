use crate::services::paths::chats_dir;
use crate::types::{ChatSession, Message};
use chrono::Utc;
use std::fs;
use std::path::Path;
use uuid::Uuid;

pub fn list_chats(root: &Path) -> Result<Vec<ChatSession>, String> {
    let dir = chats_dir(root);
    fs::create_dir_all(&dir).map_err(|e| e.to_string())?;

    let mut chats = Vec::new();
    for entry in fs::read_dir(&dir).map_err(|e| e.to_string())?.flatten() {
        let path = entry.path();
        if path.extension().and_then(|e| e.to_str()) != Some("json") {
            continue;
        }
        let content = fs::read_to_string(&path).map_err(|e| e.to_string())?;
        if let Ok(chat) = serde_json::from_str::<ChatSession>(&content) {
            chats.push(chat);
        }
    }

    chats.sort_by(|a, b| b.updated_at.cmp(&a.updated_at));
    Ok(chats)
}

pub fn save_chat(root: &Path, chat: &ChatSession) -> Result<(), String> {
    let dir = chats_dir(root);
    fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    let path = dir.join(format!("{}.json", chat.id));
    let content = serde_json::to_string_pretty(chat).map_err(|e| e.to_string())?;
    fs::write(path, content).map_err(|e| e.to_string())
}

pub fn create_chat(root: &Path, model_id: &str, title: Option<&str>) -> Result<ChatSession, String> {
    let now = Utc::now().to_rfc3339();
    let chat = ChatSession {
        id: Uuid::new_v4().to_string(),
        title: title.unwrap_or("Nova conversa").to_string(),
        model_id: model_id.to_string(),
        messages: Vec::new(),
        created_at: now.clone(),
        updated_at: now,
    };
    save_chat(root, &chat)?;
    Ok(chat)
}

pub fn delete_chat(root: &Path, chat_id: &str) -> Result<(), String> {
    let path = chats_dir(root).join(format!("{chat_id}.json"));
    if path.exists() {
        fs::remove_file(path).map_err(|e| e.to_string())?;
    }
    Ok(())
}

pub fn rename_chat(root: &Path, chat_id: &str, title: &str) -> Result<(), String> {
    let path = chats_dir(root).join(format!("{chat_id}.json"));
    let content = fs::read_to_string(&path).map_err(|e| e.to_string())?;
    let mut chat: ChatSession = serde_json::from_str(&content).map_err(|e| e.to_string())?;
    chat.title = title.to_string();
    chat.updated_at = Utc::now().to_rfc3339();
    save_chat(root, &chat)
}

pub fn export_chat(root: &Path, chat_id: &str) -> Result<String, String> {
    let path = chats_dir(root).join(format!("{chat_id}.json"));
    fs::read_to_string(path).map_err(|e| e.to_string())
}

#[allow(dead_code)]
pub fn add_message(root: &Path, chat_id: &str, message: Message) -> Result<ChatSession, String> {
    let path = chats_dir(root).join(format!("{chat_id}.json"));
    let content = fs::read_to_string(&path).map_err(|e| e.to_string())?;
    let mut chat: ChatSession = serde_json::from_str(&content).map_err(|e| e.to_string())?;
    chat.messages.push(message);
    chat.updated_at = Utc::now().to_rfc3339();
    save_chat(root, &chat)?;
    Ok(chat)
}
