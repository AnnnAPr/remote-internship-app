# Remote Internship Search

A minimalist, high-performance web application designed to help users find and manage remote internship opportunities.

## Features

- **Global Search:** Real-time filtering for remote internship roles.
- **AI Summarization:** One-click job summaries powered by **Groq AI**.
- **Secure Auth:** Quick login via **Google OAuth** through Supabase.
- **Save for Later:** Personalized dashboard to save and track interesting roles.

## Tech Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS
- **Backend/Database:** Supabase (Postgres)
- **Authentication:** Supabase Auth (Google Provider)
- **AI Integration:** Groq SDK for intelligent job analysis

## Setup

1. Clone the repository and install dependencies:

```
  git clone <repository-url>
  npm install
```

2. Environment Configuration

Create a _.env.local_ file in the root directory and add the following keys:

```
  # Supabase Configuration
  NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

  # Groq AI Configuration
  GROQ_API_KEY=your_groq_api_key
```

3. Run the Development Server

```
    npm run dev
```

Open http://localhost:3000 to view the application.
