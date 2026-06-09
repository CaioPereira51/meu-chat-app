# MeuChat - Planejamento de Arquitetura

## Objetivo

Criar uma aplicação desktop para execução local de modelos GGUF através do Llamafile, com interface gráfica própria, gerenciamento de modelos e experiência semelhante ao LM Studio, porém focada em simplicidade, portabilidade e facilidade de uso.

---

# Tecnologias

## Backend de Inferência

* Llamafile
* Modelos GGUF
* API local HTTP (localhost)

## Aplicação Desktop

### Recomendado

* Tauri

### Alternativas

* Electron
* .NET (WPF / WinUI)
* PySide6

---

# Estrutura do Projeto

```text
MeuChat/
│
├── MeuChat.exe
├── llamafile.exe
│
├── modelos/
│   ├── qwen3-4b.gguf
│   ├── mistral-7b.gguf
│   └── gemma-3.gguf
│
├── config/
│   ├── app.json
│   ├── models.json
│   └── prompts/
│
├── data/
│   ├── chats/
│   ├── logs/
│   └── cache/
│
└── interface/
    ├── splash/
    ├── launcher/
    └── chat/
```

---

# Fluxo da Aplicação

## Inicialização

```text
Usuário abre MeuChat.exe
        ↓
Splash Screen
        ↓
Carrega configurações
        ↓
Escaneia pasta modelos/
        ↓
Abre Model Hub
        ↓
Usuário escolhe modelo
        ↓
Llamafile inicia
        ↓
Health Check localhost:8080
        ↓
Abre Chat
```

---

# Tela 1 - Splash Screen

## Objetivo

Exibir carregamento inicial da aplicação.

### Ações

* Carregar configurações
* Verificar integridade dos arquivos
* Escanear modelos disponíveis
* Preparar ambiente

### Componentes

* Logo
* Nome do aplicativo
* Barra de progresso
* Status atual

Exemplo:

```text
MeuChat

Carregando configurações...
Verificando modelos...
Preparando ambiente...
```

---

# Tela 2 - Model Hub

## Objetivo

Central de gerenciamento e seleção de modelos.

### Funcionalidades

* Listar modelos instalados
* Selecionar modelo
* Adicionar modelo
* Remover modelo
* Visualizar informações do modelo
* Configurar parâmetros padrão

---

## Estrutura Visual

```text
Modelos Instalados

[ Qwen3 4B Thinking ]
[ Mistral 7B ]
[ Gemma 3 ]

+ Adicionar Modelo

Selecionar
Remover
Configurações
```

---

# Detecção Automática de Modelos

Ao iniciar o aplicativo:

```text
modelos/
├─ qwen3.gguf
├─ mistral.gguf
└─ gemma.gguf
```

O sistema detecta automaticamente:

```text
✓ Qwen3
✓ Mistral
✓ Gemma
```

Sem necessidade de cadastro manual.

---

# Configuração por Modelo

Cada modelo poderá possuir configurações próprias.

Exemplo:

```json
{
  "name": "Qwen3 4B Thinking",
  "file": "qwen3-4b-thinking-2507.Q4_K_M.gguf",
  "context": 40960,
  "temperature": 0.7,
  "top_p": 0.95
}
```

---

# Importação de Modelos

## Botão

```text
Adicionar Modelo
```

## Fluxo

```text
Selecionar arquivo .gguf
        ↓
Copiar para pasta modelos/
        ↓
Atualizar lista automaticamente
```

---

# Tela 3 - Chat

## Objetivo

Conversar com o modelo selecionado.

---

## Componentes

### Área Principal

* Histórico de mensagens
* Mensagens do usuário
* Respostas da IA

### Barra Inferior

* Campo de texto
* Upload de arquivos
* Botão enviar

---

## Menu Lateral

```text
Novo Chat
Histórico
Trocar Modelo
Configurações
Logs
```

---

# Troca de Modelo

Fluxo:

```text
Usuário seleciona novo modelo
        ↓
Encerrar Llamafile atual
        ↓
Carregar novo modelo
        ↓
Abrir novo chat
```

---

# Histórico de Conversas

Estrutura:

```text
data/chats/

chat_001.json
chat_002.json
chat_003.json
```

---

## Funcionalidades

* Criar conversa
* Renomear conversa
* Excluir conversa
* Exportar conversa

---

# Configurações

## Configurações Globais

* Tema claro/escuro
* Idioma
* Diretório padrão de modelos
* Atualizações

---

## Configurações do Modelo

* Contexto
* Temperatura
* Top-P
* Seed
* Prompt de sistema

---

# Indicador de Recursos

Exibir informações em tempo real:

```text
Modelo: Qwen3 4B
RAM: 9.2 GB / 16 GB
CPU: 42%
Contexto: 40k
Tokens/s: 5.1
```

---

# Integração com Llamafile

## Inicialização

Exemplo:

```bash
llamafile.exe \
--server \
--model modelos/qwen3.gguf \
-c 40960
```

---

## Health Check

Endpoint:

```text
http://127.0.0.1:8080
```

Fluxo:

```text
Iniciar processo
        ↓
Aguardar resposta da API
        ↓
Liberar acesso ao chat
```

---

# Estrutura de Dados

## Configurações

```text
config/
```

## Conversas

```text
data/chats/
```

## Logs

```text
data/logs/
```

## Cache

```text
data/cache/
```

---

# Roadmap V1

## Obrigatório

* Splash Screen
* Model Hub
* Seleção de modelos
* Importação de modelos
* Inicialização automática do Llamafile
* Chat funcional
* Histórico de conversas
* Configurações básicas

---

# Roadmap V2

## Melhorias

* Busca em conversas
* Perfis de configuração
* Múltiplos chats simultâneos
* Sistema de favoritos
* Exportação Markdown
* Exportação PDF
* Temas personalizados

---

# Roadmap V3

## Recursos Avançados

* RAG local
* Banco vetorial local
* Agentes
* Ferramentas customizadas
* Plugins
* OCR
* Processamento de documentos
* Busca semântica
* Integração com código

---

# Objetivo Final

Transformar o MeuChat em um gerenciador completo de modelos locais, combinando:

* Simplicidade de uso
* Portabilidade
* Gerenciamento de modelos
* Conversação local
* Extensibilidade futura

Sem depender de serviços externos ou conexão com APIs de terceiros.
