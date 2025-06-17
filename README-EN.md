# Google Drive Report Automation - User Guide

## 📋 Prerequisites

- **Node.js** 18+
- Google Workspace account with an Organization configured
- **Google Service Account** configured for access to APIs
- **Credentials** in the project root

---

## 🔧 Configuration

### Clone the repository
```bash
git clone https://github.com/diego2005eduardo/google-drive-logs-management.git
cd google-drive-logs-management
```
### 2. Configure credentials
1. **Create credentials in Google Cloud Console (see the detailed tutorial in the section [🛠️ Google Configuration Tutorial](#google-setup-tutorial)).
2. Save the Service Account credentials JSON file in the project root folder with the name `credentials.json`.
3. Configure the variables in the `.env` file in the root:
 ```properties
 SERVICE_ACCOUNT_USER=
 ACCOUNT_USER="EMAIL_USER"
 JSON_FILE_PATH=
 WHATSAPP_GROUP_ID=""
 EVOLUTION_API_URL="http://evolutionapi.seudominio.com.br/message/sendText/"
 EVOLUTION_API_KEY=""
 EVOLUTION_INSTANCE_NAME="Instance"
 ```
### 3. Run the project
```bash
npm run build
node . || node dist/core/index.js || npm run dev
```
---
## 🌐 EvolutionAPI Endpoints

### 1. Send message to group/user
**`POST http://evolutionapi.seudominio.com.br/message/sendText/{instancia}`**

Sends a message to a group/user via Whatsapp

NOTE: @g.us for groups and @s.whatsapp.net for users

**Request Body**:
```json
{
 "number": "NUMBER@g.us",
 "text": "Hello!"
}
```

**Headers:**
```json
 "apikey":"API_KEY"
```
---

### 2. Search for group ID
**`POST http://evolutionapi.seudominio.com.br/group/fetchAllGroups/{instancia}?getParticipants=false`**

Searches for the ID of the desired group.

**Headers:**
```json
 "apikey":"API_KEY"
```

---
<h2 id="google-setup-tutorial">🛠️ Google Setup Tutorial</h2>

### Step 1: Create Project in Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project by clicking on **Create Project** at the top of the page.

---

### Step 2: Enable the Admin SDK API
1. In Google Cloud Console, go to **APIs and Services > Library**.
2. Search for **Admin SDK API** and click **Enable**.

---

### Step 3: Create Credentials
1. Go to **APIs & Services > Credentials** in the side menu.
2. Click on **Create Credentials** and choose:
    - **Service Account**:
        - Create a service account to allow programmatic access.
        - Once created, download the credentials JSON file and save it in the project root folder.
    - **OAuth Account 2.0**:
        - Create OAuth credentials for additional authentication, if necessary.

---

### Step 4: Configure Permissions in Google Admin
1. Access the **Google Admin Console** at [Admin Console](https://admin.google.com/).
2. Navigate to:  
   **Security > Data & Access Control > API Controls > Manage Delegation.**
3. Add the **Client ID** of the **Service Account** and configure the following scopes:
 ```
 https://www.googleapis.com/auth/admin.reports.audit.readonly
 ```
4. Save the changes.

---