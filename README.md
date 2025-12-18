# Hospital Management System

A complete hospital management system built with **Next.js 16**, **Supabase Postgres**, and TypeScript.

## Setup (Supabase)

1) Create a Supabase project.
2) In Supabase Dashboard ➜ **SQL Editor**, run the file `supabase_schema.sql` from this repo.
3) Copy `.env.local.example` to `.env.local` and fill in your keys:
   - `DATABASE_URL` (Supabase connection string)
   - (Optional) Storage settings (`NEXT_PUBLIC_SUPABASE_URL`, keys, bucket)

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

## Features

Role-based access control (Admin, Doctor, Nurse, Radiologist, Patient), patient management, staff management, assignment system, prescriptions, radiology reports, and notifications.

## Technology Stack

Next.js 16, Supabase Postgres, TypeScript, Tailwind CSS

## Notes about file uploads

- If `SUPABASE_REPORTS_BUCKET` + `SUPABASE_SERVICE_ROLE_KEY` are set, uploads go to **Supabase Storage** (recommended for Vercel).
- Otherwise, uploads fall back to `public/uploads` (fine for local dev, not persistent on serverless).
