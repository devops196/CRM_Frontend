# Internal CRM Pro Frontend

## Run locally

1. Install Node.js 20+.
2. Run `npm install`.
3. Copy `.env.local.example` to `.env.local`.
4. Set `NEXT_PUBLIC_API_URL` to the running FastAPI URL. Set `NEXT_PUBLIC_GOOGLE_CLIENT_ID` to your Google OAuth Web client ID for live sign-in.
5. Run `npm run dev` and open `http://localhost:3000`.

The Explore demo workspace button works without a backend or OAuth setup. Demo changes stay local to the current browser session. Live employee data is loaded from FastAPI.

## Included experience

Premium dashboard, employee directory with filters/editing, leave workflows, credits, company announcements, onboarding/offboarding tasks, reports, CSV exports, Admin audit page, dark theme, notifications, keyboard command palette (`Ctrl+K`), responsive navigation, and interactive demo records.
