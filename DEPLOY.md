# Deployment Guide

## Overview

The Tally web app deploys to AWS S3 + CloudFront via GitHub Actions on every push to `main`.
Firebase handles authentication and database storage (no backend server).

---

## Step 1 — Firebase Setup

### 1a. Create a Firebase project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Add a **Web app** → copy the config values

### 1b. Enable Authentication
- Firebase Console → Authentication → Sign-in method → Enable **Google**
- Add your CloudFront domain to "Authorized domains" once you have it

### 1c. Enable Firestore
- Firebase Console → Firestore Database → Create database → Start in **production mode**

### 1d. Deploy Security Rules
- Open `firestore.rules` in this repo
- Go to Firebase Console → Firestore → Rules tab
- Paste the contents → click **Publish**

### 1e. Create Firestore Composite Indexes
Go to Firebase Console → Firestore → Indexes → Composite → Add index:

| Collection | Fields | Order |
|---|---|---|
| `log` | `uid` (ASC), `dateKey` (ASC) | — |
| `log` | `uid` (ASC), `taskId` (ASC) | — |
| `tasks` | `uid` (ASC), `order` (ASC) | — |

### 1f. Fill in `.env.local`
Copy your Firebase config values into `.env.local` (never commit this file).

---

## Step 2 — AWS Setup (one-time)

### 2a. Create S3 Bucket
1. AWS Console → S3 → Create bucket (e.g. `tally-app-2024`)
2. **Uncheck** "Block all public access" (CloudFront will access it)
3. Enable **Static website hosting** → index: `index.html`, error: `index.html`

### 2b. Create CloudFront Distribution
1. AWS Console → CloudFront → Create distribution
2. Origin domain: select your S3 bucket
3. Use **Origin Access Control (OAC)** — do NOT use public S3 URLs
4. Copy the generated bucket policy → apply it to your S3 bucket
5. Set **Default root object**: `index.html`
6. Add **Custom error responses**:
   - 403 → `/index.html` → HTTP 200
   - 404 → `/index.html` → HTTP 200
7. Note your CloudFront distribution ID and domain name

### 2c. Create IAM User for GitHub Actions
1. AWS IAM → Users → Create user (e.g. `tally-github-deploy`)
2. Attach this inline policy (replace placeholders):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:DeleteObject", "s3:ListBucket"],
      "Resource": [
        "arn:aws:s3:::YOUR_BUCKET_NAME",
        "arn:aws:s3:::YOUR_BUCKET_NAME/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": "cloudfront:CreateInvalidation",
      "Resource": "arn:aws:cloudfront::YOUR_ACCOUNT_ID:distribution/YOUR_DIST_ID"
    }
  ]
}
```

3. Create access keys → save `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`

---

## Step 3 — GitHub Secrets

Go to your GitHub repo → Settings → Secrets and variables → Actions → New repository secret.

Add these secrets:

| Secret name | Value |
|---|---|
| `AWS_ACCESS_KEY_ID` | From IAM user |
| `AWS_SECRET_ACCESS_KEY` | From IAM user |
| `S3_BUCKET_NAME` | Your S3 bucket name |
| `CLOUDFRONT_DISTRIBUTION_ID` | Your CloudFront distribution ID |
| `VITE_FIREBASE_API_KEY` | From Firebase config |
| `VITE_FIREBASE_AUTH_DOMAIN` | From Firebase config |
| `VITE_FIREBASE_PROJECT_ID` | From Firebase config |
| `VITE_FIREBASE_STORAGE_BUCKET` | From Firebase config |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | From Firebase config |
| `VITE_FIREBASE_APP_ID` | From Firebase config |

---

## Step 4 — Deploy

Push to `main` — GitHub Actions will:
1. Install dependencies
2. Build the React app with your Firebase keys injected
3. Sync the build to S3 (with optimal cache headers)
4. Invalidate the CloudFront cache

Your app will be live at your CloudFront domain (e.g. `https://d1234abcdef.cloudfront.net`).

---

## Local Development

```bash
cd web
npm install
# Fill in .env.local with your Firebase config
npm run dev
```

App runs at `http://localhost:5173`.
