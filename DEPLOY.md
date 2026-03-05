# LeadTrack CRM - Deployment Guide

This project is ready to be deployed on Netlify.

## Deployment Steps

1.  **Push to GitHub**:
    -   Create a new repository on GitHub.
    -   Push this code to the repository.

2.  **Connect to Netlify**:
    -   Log in to [Netlify](https://www.netlify.com/).
    -   Click "Add new site" -> "Import from an existing project".
    -   Select GitHub and choose your repository.

3.  **Configure Build Settings**:
    -   Netlify should automatically detect the settings from `netlify.toml`.
    -   **Build command**: `npm run build`
    -   **Publish directory**: `dist`

4.  **Add Environment Variables**:
    -   In the Netlify dashboard for your site, go to **Site configuration > Environment variables**.
    -   Add the following variables (copy them from your `.env` or AI Studio secrets):
        -   `VITE_SUPABASE_URL`: Your Supabase Project URL
        -   `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key

5.  **Deploy**:
    -   Click "Deploy site".

## Notes

-   The `netlify.toml` file handles the rewrite rules for React Router (SPA), so refreshing pages will work correctly.
-   Ensure your Supabase project is active and the database table is created.
