# 🚀 Cost Calculator

Welcome to **[cost-calculator]**\! This is a modern full-stack application built to [analyze and manage Bills of Materials (BOM) for cost analysis].

## ✨ Key Features

  * **[Feature 1:]** Admin can create and view metarial info
  * **[Feature 2:]** User can calculte cost by metarial info and other info

## 🛠️ Tech Stack

This project is built upon the following robust technology stack:

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js** (App Router) | High-performance React framework for full-stack development. |
| **Styling** | **[e.g., Tailwind CSS / Emotion / SCSS]** | [Describe your styling library]. |
| **Backend/Database** | **Supabase** | An open-source Firebase alternative providing PostgreSQL, authentication, and storage. |
| **Language** | **TypeScript** | Used for enhanced code quality and maintainability. |

## 📦 Local Setup Guide

Follow these steps to get your local development environment running:

### 1. Clone the Repository

```bash
git clone https://github.com/wyaol/cost-caculator.git
cd cost-caculator
```

### 2. Install Dependencies

```bash
nvm use
npm install
```

### 3. Configure Environment Variables (Crucial Step!)

The application requires credentials to connect to the Supabase backend. Create a file named `.env.local` in the project root directory and add the following variables:

> ⚠️ **IMPORTANT:** The build process (e.g., `npm run build`) requires these variables to be present, especially if your Supabase initialization logic runs during server-side rendering (SSR) or static site generation (SSG).

```env
# --- Supabase API Credentials (Required) ---
# 1. Supabase URL (Found in Supabase > Project Settings > API)
NEXT_PUBLIC_SUPABASE_URL="[GET YOUR PROJECT URL FROM SUPABASE]"

# 2. Supabase Anon Key (Found in Supabase > Project Settings > API)
NEXT_PUBLIC_SUPABASE_ANON_KEY="[GET YOUR ANON PUBLIC KEY FROM SUPABASE]"

# 3. Private Variables (If needed for server-side API routes) ---
# SUPABASE_SERVICE_ROLE_KEY="[KEEP THIS PRIVATE AND SERVER-ONLY]"
```

### 4. Run the Development Server

```bash
npm run dev
# OR
yarn dev
```

Open your browser to `http://localhost:3000` to see the application running.

## 🚀 Deployment

This project is ready to be deployed on platforms that support Next.js, such as **Vercel**.

When deploying to production, ensure that all the necessary environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, etc.) are correctly configured in the **Environment Variables settings** section of your chosen hosting platform.

## QA enviroment
admin page: https://cost-caculator-rzmg.vercel.app/admin/materials  
user page: https://cost-caculator-rzmg.vercel.app/user/editor

## 🤝 Contributing

  * **Yao Wang** - Initial development
