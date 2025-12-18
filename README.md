# Hospital Management System

A complete hospital management system built with **Next.js 16**, **Supabase Postgres**, and TypeScript.

## Setup (Postgres via Neon or Supabase)

1) Create a Neon (recommended for Vercel) or Supabase project.
2) Run the SQL schema `supabase_schema.sql` (works for Neon too):
   - **Neon**: Dashboard ➜ SQL Editor ➜ paste the file contents ➜ Run.
   - **Supabase**: Dashboard ➜ SQL Editor ➜ New query ➜ paste the file contents ➜ Run.
   This creates all tables and seeds a default admin so you can log in immediately.
3) Copy `.env.local.example` to `.env.local` and fill in your keys:
   - `DATABASE_URL` = **Neon pooled** connection string (Connection Details ➜ Connection Strings ➜ `Pooled` ➜ `psql/node`). Append `?sslmode=require` if not present.
   - (Optional) Storage settings (`NEXT_PUBLIC_SUPABASE_URL`, keys, bucket) if you want reports stored in Supabase Storage.
   - No Supabase Auth setup is required; this app uses its own simple session cookies.

## Quick Start

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to access the application.

## Default Admin Account

- **Email**: `admin@hospital.com`
- **Username**: `admin`
- **Password**: `admin123`

**Important**: Change the default admin password after first login!

Patient self-registration is disabled; administrators create patient logins from the admin panel.

## Features

Role-based access control (Admin, Doctor, Nurse, Radiologist, Patient), patient management, staff management, assignment system, prescriptions, radiology reports, and notifications.

## Technology Stack

Next.js 16, Supabase Postgres, TypeScript, Tailwind CSS

## Notes about file uploads

- If `SUPABASE_REPORTS_BUCKET` + `SUPABASE_SERVICE_ROLE_KEY` are set, uploads go to **Supabase Storage** (recommended for Vercel).
- Otherwise, uploads fall back to `public/uploads` (fine for local dev, not persistent on serverless).
