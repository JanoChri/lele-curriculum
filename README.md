# LeLe Curriculum

React/Vite-App für eine LeLe-Modulübersicht mit Matrix, Lücken, Bearbeitung und Supabase-Speicherung.

## Netlify Build

- Build command: `npm run build`
- Publish directory: `dist`

## Environment Variables in Netlify

Unter Site configuration → Environment variables anlegen:

- `VITE_SUPABASE_URL` = deine Supabase API URL
- `VITE_SUPABASE_ANON_KEY` = dein Supabase Publishable Key

Nicht den Secret Key eintragen.

## Supabase

Die Tabelle liegt in `supabase-modules.sql`.
