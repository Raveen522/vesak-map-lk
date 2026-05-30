# Vesak Map LK

A free, community-moderated, mobile-first web mapping application to locate and verify **Vesak Thoran (Pandols)**, **Vesak Koodu (Lantern displays)**, and **Dansal** in Sri Lanka. 

Users register using their name and mobile number to pin new displays, while the community collaborates by confirming or reporting coordinates to calculate trust metrics in real-time.

---

## 🚀 Tech Stack

- **Core**: Next.js 16 (App Router, Server Components & Server Actions)
- **Styling**: Tailwind CSS v4 (Harmonious gold and deep slate theme)
- **Map Renderer**: Leaflet & React Leaflet (OpenStreetMap tile provider)
- **Database Backend**: Supabase (PostgreSQL with Row Level Security and indexes)
- **Language**: TypeScript

---

## 🛠️ Step-by-Step Supabase Setup Guide

Follow these instructions to create and configure your database backend correctly:

### 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign in (or sign up for a free account).
2. Click **New Project** and choose your Organization.
3. Set the project details:
   - **Name**: `Vesak Map LK`
   - **Database Password**: *Generate a secure password and save it somewhere safe.*
   - **Region**: Select `ap-southeast-1` (Singapore) or `ap-south-1` (Mumbai) for low latency in Sri Lanka.
   - **Pricing Plan**: Choose the **Free Plan** tier.
4. Click **Create new project** and wait 1-2 minutes for provisioning to complete.

### 2. Copy API Keys and Endpoints
Once your project dashboard is ready:
1. Navigate to **Project Settings** (gear icon on bottom left) -> **API**.
2. Locate the following configurations and copy them:
   - **Project URL**: Under *API Settings*. This is your `NEXT_PUBLIC_SUPABASE_URL`.
   - **Project API keys (anon public)**: Under *Project API keys*. This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
   - **Project API keys (service_role secret)**: Scroll down to locate the secret `service_role` token. *Do not share this token.* This is your `SUPABASE_SERVICE_ROLE_KEY`.

### 3. Run Database Migrations
1. Click the **SQL Editor** tab (terminal icon on left sidebar).
2. Click **New query** (or **Blank query**).
3. Open the file [001_initial_schema.sql](file:///c:/Users/Raveen/Documents/GitHub/Vesak-Map-LK/supabase/migrations/001_initial_schema.sql) in this repository, copy its entire contents, and paste it into the Supabase SQL editor.
4. Click the **Run** button (bottom right of SQL editor).
5. Verify that it executes successfully. This creates the tables, columns, indexes, and row-level security policy controls.

---

## 💻 Local Setup & Development

### 1. Clone the project and install packages
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to create a `.env` file at the root:
```bash
cp .env.example .env
```

If you do **not** have Supabase keys yet, leave the fields blank. The application will automatically boot in **Demo Mock Mode**—seeding realistic map pins (like Gangarama Vesak Zone and Thotalanga Thorana) and storing new pins inside browser `localStorage`. This allows you to demo and work on the UI instantly!

Once you set up Supabase, fill out the variables in `.env`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-secret-service-role-key
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🧪 Development Commands

- `npm run dev` - Run development server
- `npm run build` - Compile and build production Next.js bundle
- `npm run lint` - Code linting checks

---

## 🔒 Security & Community Disclaimer

Because registration is lightweight (Name + Mobile number without OTP setup to preserve free tier limits), we implement several security designs:
- **Zero Public Exposure**: Mobile numbers are stored in the database but are never returned to client-side pages or displayed on maps. They are handled only inside secure server actions.
- **Sri Lanka Geo-fencing**: Coordinates submitted outside Sri Lankan approximate boundary boxes (lat: `5.8` to `10.1`, lng: `79.5` to `82.1`) are rejected.
- **Trust Recalculation**: Pins that gather negative feedback or fake/spam reports are dynamically updated to `likely_wrong` or `hidden_by_community` and hidden from the public map automatically.
