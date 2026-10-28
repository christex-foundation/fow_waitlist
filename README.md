# Future of Work — Landing Page

A freelance marketplace built in Africa for the world, à la Upwork/Fiverr.
This repo is the **marketing landing page** whose job is to capture waitlist
signups into **Airtable**.

## Stack

- **Vite + React + TypeScript** — fast, single-page React app
- **Tailwind CSS v4** — mobile-first styling
- **React Hook Form + Zod** — validated waitlist form
- **Vercel Edge Function** (`api/waitlist.ts`) — proxies submissions to Airtable
  so the Airtable token never reaches the browser
- **Vercel** — hosting (serves the static SPA + the function)

## Develop

```bash
npm install
npm run dev            # Vite dev server (UI only; /api/waitlist not available)
```

To run the **Airtable function locally**, use the Vercel CLI:

```bash
cp .env.example .env   # fill in your Airtable token, base id, table
npm i -g vercel        # if not already installed
vercel dev             # serves the SPA + /api/waitlist together
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
| Interest Area     | Single select (`Media`, `Software Engineering`, `Operations & Strategy`) |
| Assessment Responses | Long text (the assessment answers are saved as formatted JSON) |
| Source            | Single line text  |
| Created           | Created time      |

> The function sends `typecast: true`, so a missing single-select option is
> created automatically.

Add the **Interest Area** and **Assessment Responses** fields to an existing
Waitlist table before accepting assessment submissions. Airtable does not
create missing fields automatically.

## Environment variables

Set these in Vercel → Project → Settings → Environment Variables (and in a local
`.env` for `vercel dev`):

- `AIRTABLE_TOKEN` — Airtable Personal Access Token
- `AIRTABLE_BASE_ID` — e.g. `appXXXXXXXXXXXXXX`
- `AIRTABLE_TABLE` — optional, defaults to `Waitlist`

## Deploy

Import the repo at [vercel.com/new](https://vercel.com/new). Vercel auto-detects
Vite:

- Build command: `npm run build`
- Output directory: `dist`

Add the environment variables above (Production + Preview), then deploy. Pushes
deploy automatically. Or from the CLI: `vercel --prod`.
