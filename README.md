# Future of Work — Landing Page

A Salone-first (Sierra Leone–first) freelance marketplace, à la Upwork/Fiverr.
This repo is the **marketing landing page** whose job is to capture waitlist
signups into **Airtable**.

## Stack

- **Vite + React + TypeScript** — fast, single-page React app
- **Tailwind CSS v4** — mobile-first styling
- **React Hook Form + Zod** — validated waitlist form
- **Cloudflare Pages Function** (`functions/api/waitlist.ts`) — proxies submissions
  to Airtable so the Airtable token never reaches the browser
- **Cloudflare Pages** — hosting (serves the static SPA + the function)

## Develop

```bash
npm install
npm run dev            # Vite dev server (UI only; /api/waitlist not available)
```

To run the **Airtable function locally**, build then serve with Wrangler:

```bash
cp .env.example .dev.vars   # fill in your Airtable token, base id, table
npm run build
npx wrangler pages dev dist
```

## Airtable setup

Create a base with a table (default name **`Waitlist`**) and these fields:

| Field             | Type              |
| ----------------- | ----------------- |
| Name              | Single line text  |
| Email             | Email             |
| Phone             | Phone number      |
| Role              | Single select (`Freelancer`, `Client`) |
| Skill / Interest  | Single line text  |
| Location          | Single line text  |
| Source            | Single line text  |
| Created           | Created time      |

> The function sends `typecast: true`, so a missing single-select option is
> created automatically.

## Environment variables

Set these as **secrets** in Cloudflare Pages → Settings → Variables (and in
`.dev.vars` locally):

- `AIRTABLE_TOKEN` — Airtable Personal Access Token
- `AIRTABLE_BASE_ID` — e.g. `appXXXXXXXXXXXXXX`
- `AIRTABLE_TABLE` — optional, defaults to `Waitlist`

## Deploy

Connect the repo to **Cloudflare Pages** with:

- Build command: `npm run build`
- Output directory: `dist`

Then add the environment variables above. Pushes deploy automatically.
