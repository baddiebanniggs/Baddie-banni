# BADDIE BANNI store (Part 1: foundation)

## What is real in this ZIP
- Done in code: full database design, server-side pricing and discount rules with passing tests, storefront shell (home page reads products from the database), SEO basics (robots, database-driven sitemap), security headers, Docker files, sample-data script.
- Not built yet (coming in later parts): customer login, product/cart/checkout pages, admin dashboard, payment gateway, shipping, notifications, marketing emails, cookie banner, legal pages, buy-one-get-one and bundle offers.
- Not run yet: this was written without internet access, so `npm install`, the build and the database migration are untested. Expect to fix small issues on first run.

## Phone workflow
1. In the GitHub app/website: New repository, name it, choose **Private**.
2. Upload the files from this ZIP (unzip first; GitHub cannot unzip). Never upload a real `.env`.
3. GitHub does not run the app. To run it you need a host (a cloud dev environment such as GitHub Codespaces from your phone browser, or later a VPS).

## First run (in Codespaces or any server with Node 22 and Postgres)
    cp .env.example .env     # then edit DATABASE_URL and AUTH_SECRET
    npm install
    npx prisma migrate dev --name init
    npm run test
    npm run db:seed          # optional sample products
    npm run dev

## Later: VPS
`docker compose up -d --build` with a `.env` containing DB_PASSWORD. Put a reverse proxy (Caddy or Nginx) with HTTPS in front; `/api/health` is the health check. Back up the `dbdata` volume with `pg_dump`.
