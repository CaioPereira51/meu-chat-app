# MeuChat

**Converse com modelos de IA localmente — sem nuvem, sem API externa.**

MeuChat é um aplicativo desktop para executar modelos **GGUF** no seu próprio computador, usando o [Llamafile](https://github.com/Mozilla-Ocho/llamafile) como motor de inferência. A interface foi pensada para ser simples e direta, inspirada em ferramentas como o LM Studio, mas com foco em portabilidade e facilidade de uso.

Tudo roda na sua máquina. Seus modelos, suas conversas e seus dados permanecem locais.

---

## Principais recursos

- **Model Hub** — visualize, importe e configure modelos GGUF em um painel centralizado
- **Detecção automática** — modelos na pasta `modelos/` são reconhecidos sem cadastro manual
- **Chat em tempo real** — converse com o modelo selecionado com streaming de respostas
- **Histórico de conversas** — crie, renomeie, exclua e exporte chats em JSON
- **Configuração por modelo** — contexto, temperatura, top-p e prompt de sistema
- **Métricas do sistema** — acompanhe uso de RAM, CPU e desempenho em tempo real
- **Tema escuro** — interface moderna com React e Tailwind CSS

---

## Como funciona

```
Abrir MeuChat
      ↓
Splash Screen (carrega configurações e escaneia modelos)
      ↓
Model Hub (selecione ou importe um modelo .gguf)
      ↓
Llamafile inicia em localhost:8080
      ↓
Health check da API local
      ↓
Chat liberado
```

---

## Capturas de tela

> Adicione aqui prints do Model Hub e da tela de Chat quando estiverem disponíveis.

---

## Requisitos

### Para usar (build de produção)

- **Windows 10/11** (64 bits)
- Modelos no formato **`.gguf`**
- RAM suficiente para o modelo escolhido (varia conforme tamanho e quantização)

### Para desenvolver

| Ferramenta | Versão sugerida |
|---|---|
| [Node.js](https://nodejs.org/) | 20+ |
| [Rust](https://www.rust-lang.org/) | via `rustup` |
| [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) | com workload **Desktop development with C++** |

---

## Instalação e uso

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd MeuChat
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Adicione seus modelos

Coloque arquivos `.gguf` na pasta `modelos/`:

```
modelos/
├── qwen3-4b-thinking.gguf
├── mistral-7b.gguf
└── gemma-3.gguf
```

O MeuChat detecta automaticamente os arquivos ao iniciar.

### 4. Execute em modo de desenvolvimento

```bash
npm run tauri:dev
```

### 5. Gere o executável

```bash
npm run tauri:build
```

O instalador será gerado em `src-tauri/target/release/bundle/`.

---

## Estrutura do projeto

```
MeuChat/
├── config/              # Configurações globais e por modelo
│   ├── app.json
│   └── models.json
├── modelos/             # Arquivos .gguf (não versionados)
├── data/                # Chats, logs e cache (gerados em runtime)
├── src/                 # Frontend React + TypeScript
│   ├── pages/           # Splash, Model Hub e Chat
│   ├── components/      # UI reutilizável
│   └── hooks/           # Lógica de estado e integração
├── src-tauri/           # Backend Rust (Tauri 2)
│   └── src/services/    # Llamafile, modelos, chats, métricas
└── scripts/             # Scripts PowerShell para dev e build
```

---

## Stack tecnológica

| Camada | Tecnologia |
|---|---|
| Desktop | [Tauri 2](https://tauri.app/) |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS |
| Estado | Zustand, React Router |
| Backend | Rust (Tokio, Serde, Reqwest) |
| Inferência | Llamafile + modelos GGUF |
| API local | `http://127.0.0.1:8080` |

---

## Configuração

As preferências globais ficam em `config/app.json`:

```json
{
  "theme": "dark",
  "language": "pt-BR",
  "modelsDirectory": "modelos",
  "llamafilePort": 8080,
  "llamafileHost": "127.0.0.1"
}
```

Cada modelo pode ter parâmetros próprios (contexto, temperatura, top-p, prompt de sistema), salvos em `config/models.json`.

---

## Roadmap

### v1 — Atual
- Splash Screen, Model Hub, Chat, histórico, importação de modelos e configurações básicas

### v2 — Planejado
- Busca em conversas, perfis de configuração, exportação Markdown/PDF e temas personalizados

### v3 — Futuro
- RAG local, agentes, plugins, OCR e integração com código

---

## Privacidade

O MeuChat **não envia dados para servidores externos**. Toda inferência acontece localmente via Llamafile. Conversas são armazenadas em `data/chats/` no seu disco.

---

## Licença

Defina a licença do projeto aqui (ex.: MIT, Apache 2.0).

---

## Contribuindo

Contribuições são bem-vindas. Abra uma issue para discutir mudanças maiores ou envie um pull request com melhorias e correções.

---

<p align="center">
  <strong>MeuChat</strong> — IA local, simples e sob seu controle.
</p>
