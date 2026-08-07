# 🚀 Vercel Deployment Guide — VisitHub

This guide provides step-by-step instructions for deploying the **VisitHub Visitor Pass Management System** (React 19 Frontend + Express Node.js Backend + MongoDB Atlas) to **Vercel**.

---

## 🏗️ Deployment Architecture Overview

On Vercel, a full-stack MERN application is deployed using two decoupled services within Vercel:

1. **Backend Service (Express API)**: Deployed as a Vercel Serverless Function communicating with a cloud-hosted database (**MongoDB Atlas**).
2. **Frontend Service (React + Vite)**: Deployed as a static Single Page Application (SPA) with Vercel's global CDN and routing rewrites.

---

## 📋 Prerequisites Checklist

Before beginning deployment, ensure you have:
- [x] A **GitHub** account with the repository pushed.
- [x] A **Vercel** account ([sign up at vercel.com](https://vercel.com/signup)).
- [x] A free **MongoDB Atlas** account ([sign up at mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)).

---

## 🗄️ Step 1: Set Up MongoDB Atlas (Cloud Database)

Since Vercel serverless functions are ephemeral, you must use a cloud-hosted MongoDB database (MongoDB Atlas).

1. Log into **MongoDB Atlas** and create a cluster (the free M0 cluster is sufficient).
2. Go to **Security > Database Access**:
   - Click **Add New Database User**.
   - Set authentication method to **Password**.
   - Create a username (e.g., `visithub_user`) and a strong password.
   - Grant role: `Read and write to any database`.
3. Go to **Security > Network Access**:
   - Click **Add IP Address**.
   - Select **Allow Access from Anywhere** (`0.0.0.0/0`). *This is required so Vercel's dynamic serverless IP range can reach your database.*
4. Go to **Database > Connect**:
   - Choose **Drivers** (Node.js).
   - Copy your connection string. It will look like:
     ```text
     mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/visitor_pass_db?retryWrites=true&w=majority
     ```
   - Replace `<username>` and `<password>` with your database user credentials.

---

## ⚙️ Step 2: Prepare Backend for Vercel Serverless Functions

To allow Express to run seamlessly as a Serverless Function on Vercel:

### 1. Create Serverless Handler (`server/api/index.js`)
Create a file at `server/api/index.js` inside your project:

```javascript
import app from '../app.js';
import { connectDB } from '../config/db.js';

export default async function handler(req, res) {
  // Ensure MongoDB connection is established before handling request
  await connectDB();
  return app(req, res);
}
```

### 2. Create Vercel Configuration (`server/vercel.json`)
Create `vercel.json` inside the `server/` directory:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "api/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "api/index.js"
    }
  ]
}
```

---

## 📦 Step 3: Deploy Backend API to Vercel

1. Log into your **Vercel Dashboard** and click **Add New > Project**.
2. Import your GitHub repository.
3. In the project setup screen:
   - **Project Name**: `visithub-api` (or your preferred name)
   - **Framework Preset**: Select **Other**
   - **Root Directory**: Click **Edit** and select `server`
4. Expand **Environment Variables** and add the following:

| Key | Example Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production mode |
| `MONGODB_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | `your_super_secret_production_key_32chars` | Secure random key for signing JWTs |
| `JWT_EXPIRE` | `30d` | Token validity duration |
| `CLIENT_URL` | `https://visithub-app.vercel.app` | Your frontend Vercel URL (for CORS) |

5. Click **Deploy**.
6. Once deployed, copy your backend URL (e.g., `https://visithub-api.vercel.app`). Test it in your browser:
   - Visiting `https://visithub-api.vercel.app/api/auth/me` should return an authorization error or status response.

---

## 🌱 Step 4: Seed the Production Database

Seed default employee records and role logins into your MongoDB Atlas cluster using your local terminal:

```bash
# In your local project directory:
cd server

# Set MONGODB_URI to your Atlas connection string and run seed
MONGODB_URI="mongodb+srv://user:pass@cluster0.abcde.mongodb.net/visitor_pass_db?retryWrites=true&w=majority" node seed.js
```

You should see output confirming employees and user accounts (`admin`, `receptionist`, `employee`, `employee2`) were seeded successfully into MongoDB Atlas.

---

## 💻 Step 5: Deploy Frontend React Client to Vercel

### 1. Create Frontend Vercel Config (`client/vercel.json`)
To handle client-side routing in React Router (avoiding 404 on page refresh), create `vercel.json` in the `client/` directory:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 2. Deploy Frontend on Vercel
1. Return to **Vercel Dashboard** and click **Add New > Project**.
2. Select the same GitHub repository.
3. Configure project settings:
   - **Project Name**: `visithub-app` (or `visithub-client`)
   - **Framework Preset**: **Vite**
   - **Root Directory**: Select `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Expand **Environment Variables** and add:

| Key | Value | Description |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `https://visithub-api.vercel.app/api` | Your deployed Vercel backend API URL |

5. Click **Deploy**.

---

## 🔗 Step 6: Post-Deployment CORS & Connection Verification

1. Once the client is deployed, copy its production URL (e.g., `https://visithub-app.vercel.app`).
2. Go back to your **Backend project (`visithub-api`)** on Vercel:
   - Navigate to **Settings > Environment Variables**.
   - Update `CLIENT_URL` to match your frontend Vercel URL (`https://visithub-app.vercel.app`).
   - Re-deploy the backend project (or go to **Deployments > Redeploy**).
3. Open your deployed frontend URL `https://visithub-app.vercel.app` in your browser.
4. Log in using pre-seeded test credentials:
   - **Admin**: `admin` / `admin123`
   - **Receptionist**: `receptionist` / `receptionist123`
   - **Employee**: `employee` / `employee123`

---

## 🛠️ Troubleshooting & Common Issues

### 1. CORS Error (`Access-Control-Allow-Origin`)
- **Cause**: Backend `CLIENT_URL` env variable does not match the exact domain of your frontend.
- **Fix**: Ensure `CLIENT_URL` in backend Vercel env settings matches your frontend URL (including `https://` and without trailing slashes).

### 2. React Router 404 Error on Refresh
- **Cause**: Vercel tries to serve static files for client-side routes like `/admin/dashboard` or `/receptionist/desk`.
- **Fix**: Ensure `client/vercel.json` contains the SPA rewrite rule:
  ```json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```

### 3. Serverless Function Timeout / MongoDB Connection Lag
- **Cause**: Cold starts creating fresh Mongoose connections.
- **Fix**: The `server/config/db.js` file handles connection reuse automatically. Ensure `serverSelectionTimeoutMS: 5000` is set in connection options.

---

## 🏁 Summary of Environment Variables

### Backend Environment Variables (`visithub-api`):
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/visitor_pass_db?retryWrites=true&w=majority
JWT_SECRET=your_secure_32_character_jwt_secret
JWT_EXPIRE=30d
CLIENT_URL=https://visithub-app.vercel.app
```

### Frontend Environment Variables (`visithub-app`):
```env
VITE_API_BASE_URL=https://visithub-api.vercel.app/api
```
