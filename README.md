# Clyrovia Credit Analysis

Credit analysis platform for loan underwriting workflows.

## Tech Stack

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase

## Local Development

1. Install dependencies:

```sh
npm install
```

2. Start the development server:

```sh
npm run dev
```

3. Build for production:

```sh
npm run build
```

## Deployment

This project is configured for GitHub Pages deployment:

```sh
npm run deploy
```

## Environment Variables

Set these variables in your environment (or `.env`):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (for server-side/edge-function workflows)
- `AI_GATEWAY_URL` (for document parsing edge functions)
- `AI_GATEWAY_API_KEY` (for document parsing edge functions)
