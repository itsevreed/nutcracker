# 🥜 Nut Cracker

A shared, real-time nut-cracking tracker for you and your friends.
Built with React + Vite + Supabase. Deploy to Vercel for a shareable link.

---

## 🚀 Deploy in 4 Steps

### Step 1 — Set up Supabase (free)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click **"New Project"** — name it `nutcracker`, pick any region, set a DB password
3. Once the project is ready, go to **SQL Editor** (left sidebar)
4. Paste the entire contents of `supabase_setup.sql` and click **Run**
5. Go to **Project Settings → API**
6. Copy your **Project URL** and **anon/public key** — you'll need them next

---

### Step 2 — Configure environment variables

Duplicate `.env.example` and rename it to `.env.local`:

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in your values:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

---

### Step 3 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit 🥜"
# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/nutcracker.git
git push -u origin main
```

---

### Step 4 — Deploy to Vercel (free)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"** and import your `nutcracker` repo
3. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL` → your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` → your Supabase anon key
4. Click **Deploy**

Vercel gives you a URL like `nutcracker.vercel.app` — share it with friends!

---

## 💻 Local Development

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`

---

## 🛠 Tech Stack

- **React 18** + Vite
- **Supabase** — Postgres database + realtime subscriptions
- **Vercel** — hosting + CDN

---

## ✨ Features

- 💥 One-tap crack logging with confetti
- 📜 Shared real-time feed with emoji reactions
- 📅 Schedule group crack events with RSVP
- 🏆 Live leaderboard
- 👤 Personal stats + unlockable badges
- 🥜 Mr. Peanut mascot with random reactions
