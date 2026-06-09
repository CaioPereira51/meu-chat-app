use crate::services::paths::{llamafile_binary, models_dir};
use crate::types::GgufModel;
use std::path::Path;
use std::process::{Child, Command, Stdio};
use std::sync::Mutex;

pub struct LlamafileManager {
    child: Mutex<Option<Child>>,
}

impl LlamafileManager {
    pub fn new() -> Self {
        Self {
            child: Mutex::new(None),
        }
    }

    pub fn stop(&self) -> Result<(), String> {
        let mut guard = self.child.lock().map_err(|e| e.to_string())?;
        if let Some(mut child) = guard.take() {
            let _ = child.kill();
            let _ = child.wait();
        }
        Ok(())
    }

    pub fn start(
        &self,
        root: &Path,
        models_directory: &str,
        model: &GgufModel,
        port: u16,
    ) -> Result<(), String> {
        self.stop()?;

        let binary = llamafile_binary(root);
        if !binary.exists() {
            return Err(format!(
                "Llamafile não encontrado em: {}",
                binary.display()
            ));
        }

        let model_path = models_dir(root, models_directory).join(&model.file_name);
        if !model_path.exists() {
            return Err(format!("Modelo não encontrado: {}", model_path.display()));
        }

        let gpu_arg = if model.config.gpu_enabled {
            "auto"
        } else {
            "disable"
        };

        let child = Command::new(&binary)
            .arg("--server")
            .arg("--model")
            .arg(&model_path)
            .arg("-c")
            .arg(model.config.context.to_string())
            .arg("--gpu")
            .arg(gpu_arg)
            .arg("--port")
            .arg(port.to_string())
            .arg("--host")
            .arg("127.0.0.1")
            .stdout(Stdio::null())
            .stderr(Stdio::null())
            .spawn()
            .map_err(|e| format!("Falha ao iniciar Llamafile: {e}"))?;

        let mut guard = self.child.lock().map_err(|e| e.to_string())?;
        *guard = Some(child);
        Ok(())
    }
}
