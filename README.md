# DI Namams — Full Vite Web Project (MVP)

This archive contains a ready-to-deploy Vite + React project with:
- Supabase auth (Google + Email)
- Supabase tables for profiles, subscriptions and quotas
- Stripe subscription checkout and webhook handler
- OpenAI proxy (serverless) for chat completions
- Minimal modern UI and logo

## Quick start (locally)
1. Install dependencies: `npm install`
2. Create `.env` (see `.env.example`)
3. Run locally: `npm run dev`

## Deploy to Vercel
1. Push repo to GitHub.
2. Import repo to Vercel (choose Vite).
3. Add Environment Variables in Vercel (see `.env.example`)
4. Deploy — Vercel will build and host both frontend and serverless `api/*` functions.

## Important
- Never commit your secret keys (OpenAI / Stripe secret / Supabase service role) into Git.
- `SUPABASE_SERVICE_ROLE_KEY` must be set only in Vercel env and used server-side.

