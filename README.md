AI Campaign Tracker

An AI-powered SaaS tool to analyze marketing campaign performance and generate actionable insights.

---

## Tech Stack

* Next.js (App Router)
* Tailwind CSS
* PostgreSQL (Neon recommended)
* Prisma ORM
* OpenAI API
* Clerk (Authentication: Email, Google, Apple)

---

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd ai-campaign-tracker
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Setup environment variables

Create a `.env` file in the root:

```env
# Database (PostgreSQL - Neon or any provider)
DATABASE_URL=

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# OpenAI
OPENAI_API_KEY=
```

> The app uses PostgreSQL. Neon is recommended for serverless setups, but any PostgreSQL provider will work.

---

### 4. Setup database (Prisma)

```bash
npx prisma generate
npx prisma db push
```

(Optional: open Prisma Studio)

```bash
npx prisma studio
```

---

### 5. Run the development server

```bash
npm run dev
```

App will be available at:

```
http://localhost:3000
```

---

## Features (Planned)

* Campaign data ingestion (CSV / API)
* AI-generated performance insights
* Interactive dashboard
* Scalable backend architecture

---

## Architecture

The application follows a **feature-based frontend architecture** and a **layered backend architecture**, with clear separation between UI, business logic, and data access.

### Key Principles

* `app/` → Routing (Next.js App Router)
* `features/` → Frontend domain logic (UI, hooks, API calls)
* `server/` → Backend domain logic (services, repositories)
* `app/api/` → API layer (bridge between frontend & backend)
* Route groups → Structure the app by product domains (`(auth)` and `(app)`)

---

## Folder Structure

```bash
src/
│
├── app/                                # Next.js App Router
│
│   ├── (auth)/                         # 🔐 Authentication routes
│   │   ├── sign-in/
│   │   │   └── [[...sign-in]]/page.tsx
│   │   ├── sign-up/
│   │   │   └── [[...sign-up]]/page.tsx
│   │   └── layout.tsx                  # Optional auth layout
│   │
│   ├── (app)/                          # 🚀 Main application (protected)
│   │   ├── layout.tsx                  # Uses AppShell
│   │   ├── page.tsx                    # Dashboard
│   │   │
│   │   ├── campaigns/
│   │   │   └── page.tsx
│   │   │
│   │   └── settings/
│   │       └── page.tsx
│   │
│   ├── api/
│   │   └── campaigns/
│   │       └── route.ts                # API endpoint
│   │
│   ├── layout.tsx                      # Root layout (ClerkProvider)
│   └── globals.css
│
├── features/                           # Frontend domain modules
│
│   ├── app-shell/                      # App UI shell
│   │   ├── AppShell.tsx                # Sidebar + header wrapper
│   │   └── components/
│   │       ├── Sidebar.tsx
│   │       ├── Header.tsx
│   │       └── SidebarToggle.tsx
│   │
│   └── campaigns/                      # Campaign feature (frontend)
│       ├── components/
│       │   └── CampaignTable.tsx
│       │
│       ├── api/
│       │   └── campaigns.api.ts
│       │
│       ├── hooks/
│       │   └── useCampaigns.ts
│       │
│       ├── types.ts
│       └── index.ts
│
├── server/                             # Backend domain modules
│   ├── db/
│   │   └── client.ts                   # Prisma client
│   │
│   └── campaigns/
│       ├── campaigns.repository.ts
│       ├── campaigns.service.ts
│       └── campaigns.handler.ts
│
├── components/                         # Shared UI (shadcn)
│   └── ui/
│       ├── button.tsx
│       ├── input.tsx
│       └── ...
│
├── lib/                                # Shared utilities
│
├── types/                              # Global shared types
│
└── middleware.ts                       # Auth protection (Clerk)
```

---

## Routing Strategy

* `(auth)` → Public authentication routes (sign-in, sign-up)
* `(app)` → Main product (protected via middleware)
* Middleware ensures all non-auth routes require authentication

---

## Status

🚧 Currently in active development (MVP phase)
