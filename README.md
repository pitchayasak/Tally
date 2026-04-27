# Tally — Daily & Monthly Habit Tracker

A React web app for tracking medications, exercise, and spending habits. Migrated from Flutter.

## Stack

- **Frontend**: React 18 + Vite + TypeScript
- **Auth**: Firebase Auth (Google Sign-In)
- **Database**: Firestore (per-user, real-time)
- **Hosting**: AWS S3 + CloudFront
- **CI/CD**: GitHub Actions (auto-deploy on push to `main`)

## Quick Start

```bash
cd web
npm install
cp .env.example .env.local
# Fill in .env.local with your Firebase config values
npm run dev
```

## Features

- **Daily tracking** — Log medications, exercise, spending per day
- **Monthly tracking** — Track monthly habits and budgets
- **History** — 18-week heatmap per task with streak stats
- **Task management** — Add, edit, delete, and reorder tasks
- **Settings** — Toggle progress bar, wipe data, generate sample data
- **Google Sign-In** — All data synced to your account via Firestore

## Deployment

See [DEPLOY.md](DEPLOY.md) for full AWS + Firebase setup instructions.

## Required GitHub Secrets

```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
S3_BUCKET_NAME
CLOUDFRONT_DISTRIBUTION_ID
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```
