use crate::types::SystemMetrics;
use sysinfo::{CpuRefreshKind, MemoryRefreshKind, RefreshKind, System};

pub fn get_system_metrics() -> SystemMetrics {
    let mut sys = System::new_with_specifics(
        RefreshKind::nothing()
            .with_memory(MemoryRefreshKind::everything())
            .with_cpu(CpuRefreshKind::everything()),
    );
    sys.refresh_memory();
    sys.refresh_cpu_usage();

    let ram_total = sys.total_memory() as f64 / (1024.0 * 1024.0 * 1024.0);
    let ram_used = sys.used_memory() as f64 / (1024.0 * 1024.0 * 1024.0);
    let cpu_percent: f64 = sys.cpus().iter().map(|c| c.cpu_usage() as f64).sum::<f64>()
        / sys.cpus().len().max(1) as f64;

    SystemMetrics {
        ram_used_gb: ram_used,
        ram_total_gb: ram_total,
        cpu_percent,
        tokens_per_second: 0.0,
    }
}
