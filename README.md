# LeadTrack CRM

A simple, mobile-first lead management system for tracking customer follow-ups.

## Features

- **Fast Lead Entry**: Add new leads in seconds.
- **Smart Dashboard**: Automatically categorizes leads into Overdue, Today, and Upcoming.
- **One-Click Actions**: Call customers directly from the app.
- **Quick Rescheduling**: Easily change follow-up dates and times.
- **Search**: Instantly find customers by name, number, or location.

## Setup Instructions

### 1. Supabase Setup

This application uses Supabase for the backend.

1.  Create a new project at [Supabase.com](https://supabase.com).
2.  Go to the **SQL Editor** and run the script found in `src/pages/SetupInstructions.tsx` (or click "View Setup Instructions" in the app).
3.  Go to **Project Settings -> API**.
4.  Copy the `Project URL` and `anon public key`.

### 2. Environment Variables

In AI Studio, add the following secrets:

-   `VITE_SUPABASE_URL`: Your Project URL
-   `VITE_SUPABASE_ANON_KEY`: Your anon public key

### 3. Run the App

The app will automatically connect to your Supabase database.

## Tech Stack

-   **Frontend**: React, Tailwind CSS, Lucide Icons
-   **Backend**: Supabase (PostgreSQL)
-   **Routing**: React Router
-   **Date Handling**: date-fns
