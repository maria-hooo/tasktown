# TaskTown (Next.js + Auth + Prisma + Postgres)

A small full-stack tasks app:
- Email/password auth (NextAuth Credentials)
- Task CRUD (API routes)
- PostgreSQL via Prisma

## 1) Local setup

### Requirements
- Node.js 18+ (recommended 20+)
- Docker (recommended) OR a local Postgres install

### Install
```bash
npm install
```

### Start Postgres (Docker)
```bash
docker compose up -d
```

### Configure env
Copy `.env.example` to `.env` and adjust if needed:
```bash
cp .env.example .env
```

### Migrate DB
```bash
npx prisma migrate dev --name init
```

### Run
```bash
npm run dev
```

Open http://localhost:3000

## 2) Deployment (AWS idea)

Fast path:
- Elastic Beanstalk (Node.js) for the app server
- RDS PostgreSQL for DATABASE_URL
- S3 for uploads (optional)

Set env vars in EB:
- DATABASE_URL
- NEXTAUTH_SECRET
- NEXTAUTH_URL

Build uses `output: "standalone"` in `next.config.js`.
