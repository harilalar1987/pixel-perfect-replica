# Clyrovia Credit Analysis

Credit analysis platform for loan underwriting workflows.

## Tech Stack

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase

## Setup

1. Clone the repo and run `npm install`.
2. Create a `.env` file with Supabase keys and other required environment variables.
3. Run `npm run dev` to start the app locally.

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

Deploy using GitHub Pages or Vercel. For GitHub Pages, use `npm run deploy` after building.

## Environment Variables

Set these variables in your environment (or `.env`):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (for server-side/edge-function workflows)
- `AI_GATEWAY_URL` (for document parsing edge functions)
- `AI_GATEWAY_API_KEY` (for document parsing edge functions)

## Troubleshooting

- If you see database errors, check your Supabase keys and table schemas.
- For credits tracking, ensure the `credits_usage` table exists (see Settings > DB Tools for SQL).
- For admin tools, use the Settings page tabs.
- For UI consistency, use the Button component everywhere.
- For accessibility, review all interactive elements.

## Testing

Run `npm test` for unit/integration tests. Add more tests for critical flows.

## Contributing

Open issues or PRs for improvements. See the todo list in Settings for ongoing tasks.
