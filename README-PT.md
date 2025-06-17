# Google Drive Report Automation - Guia de Utilização

## 📋 Pré-requisitos

- **Node.js** 18+
- **Conta Google Workspace** com uma **Organização** configurada
- **Conta de Serviço Google** configurada para acesso às APIs
- **Credenciais** na raíz do projeto

---

## 🔧 Configuração

### 1. Clonar o repositório
```bash
git clone https://github.com/diego2005eduardo/google-drive-logs-management.git
cd google-drive-logs-management
```
### 2. Configurar credenciais
1. **Criar credenciais no Google Cloud Console** (veja o tutorial detalhado na seção [🛠️ Tutorial de Configuração no Google](#google-setup-tutorial)).
2. Salvar o arquivo JSON das credenciais da **Conta de Serviço** na pasta raíz do projeto com o nome `credentials.json`.
3. Configurar as variáveis no arquivo `.env` na raíz:
   ```properties
    SERVICE_ACCOUNT_USER=
    ACCOUNT_USER="EMAIL_USER"
    JSON_FILE_PATH=
    WHATSAPP_GROUP_ID=""
    EVOLUTION_API_URL="http://evolutionapi.seudominio.com.br/message/sendText/"
    EVOLUTION_API_KEY=""
    EVOLUTION_INSTANCE_NAME="Instancia"
   ```
### 3. Executar o projeto
```bash
npm run build
node . || node dist/core/index.js || npm run dev
```
---
## 🌐 EvolutionAPI Endpoints

### 1. Enviar mensagem para grupo/usuário
**`POST http://evolutionapi.seudominio.com.br/message/sendText/{instancia}`**  

Envia mensagem para um grupo/usuário através do Whatsapp

OBS: @g.us para grupos e @s.whatsapp.net para usuários

**Request Body**:
```json
{
   "number": "NUMBER@g.us",
   "text": "Olá!"
}
```

**Headers:**
```json
  "apikey": "API_KEY"
```
---

### 2. Procurar ID do grupo
**`POST http://evolutionapi.seudominio.com.br/group/fetchAllGroups/{instancia}?getParticipants=false`**

Procura o ID do grupo desejado.

**Headers:**
```json
  "apikey": "API_KEY"
```

---
<h2 id="google-setup-tutorial">🛠️ Tutorial de Configuração no Google</h2>

### Passo 1: Criar Projeto no Google Cloud Console
1. Acesse o [Google Cloud Console](https://console.cloud.google.com/).
2. Crie um novo projeto clicando em **Criar Projeto** no topo da página.

---

### Passo 2: Habilitar a Admin SDK API
1. No Google Cloud Console, vá para **APIs e Serviços > Biblioteca**.
2. Pesquise por **Admin SDK API** e clique em **Ativar**.

---

### Passo 3: Criar Credenciais
1. Acesse **APIs e Serviços > Credenciais** no menu lateral.
2. Clique em **Criar Credenciais** e escolha:
    - **Conta de Serviço**:
        - Crie uma conta de serviço para permitir acesso programático.
        - Após criar, baixe o arquivo JSON das credenciais e salve na pasta raíz do projeto.
    - **Conta OAuth 2.0**:
        - Crie credenciais OAuth para autenticação adicional, caso necessário.

---

### Passo 4: Configurar Permissões no Google Admin
1. Acesse o **Google Admin Console** em [Admin Console](https://admin.google.com/).
2. Navegue para:  
   **Segurança > Controle de Dados e Acesso > Controles de API > Gerenciar Delegação**.
3. Adicione o **ID do Cliente** da **Conta de Serviço** e configure os seguintes escopos:
   ```
   https://www.googleapis.com/auth/admin.reports.audit.readonly
   ```
4. Salve as alterações.

---
