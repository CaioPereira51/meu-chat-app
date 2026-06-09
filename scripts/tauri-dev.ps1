$ErrorActionPreference = "Stop"

# Garante Cargo no PATH
$cargoBin = Join-Path $env:USERPROFILE ".cargo\bin"
if (Test-Path $cargoBin) {
    $env:Path = "$cargoBin;$env:Path"
}

# Configura ambiente MSVC (link.exe) via vcvars64
$vswhere = Join-Path ${env:ProgramFiles(x86)} "Microsoft Visual Studio\Installer\vswhere.exe"
if (Test-Path $vswhere) {
    $vsPath = & $vswhere -latest -products * -requires Microsoft.VisualStudio.Component.VC.Tools.x86.x64 -property installationPath 2>$null
    if ($vsPath) {
        $vcvars = Join-Path $vsPath "VC\Auxiliary\Build\vcvars64.bat"
        if (Test-Path $vcvars) {
            cmd /c "`"$vcvars`" >nul 2>&1 && set" | ForEach-Object {
                if ($_ -match "^(.*?)=(.*)$") {
                    Set-Item -Path "env:$($matches[1])" -Value $matches[2]
                }
            }
            Write-Host "Ambiente MSVC configurado: $vsPath"
        }
    }
}

if (-not (Get-Command cargo -ErrorAction SilentlyContinue)) {
    Write-Error "Cargo nao encontrado. Instale Rust: winget install Rustlang.Rustup"
    exit 1
}

if (-not (Get-Command link -ErrorAction SilentlyContinue)) {
    Write-Error @"
link.exe (MSVC) nao encontrado no PATH.
Instale Visual Studio Build Tools com C++:
  winget install Microsoft.VisualStudio.2022.BuildTools --override "--wait --passive --add Microsoft.VisualStudio.Workload.VCTools --includeRecommended"
"@
    exit 1
}

Set-Location $PSScriptRoot\..
npx tauri dev
