# Manoz's Portfolio — Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Install shadcn/ui components needed
```bash
npx shadcn@latest add button input label textarea select
```

### 3. Set up environment variables
Copy `.env.local` — all values are already filled in.

### 4. Run locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## 🔥 Firebase Setup

### Deploy Firestore Rules
```bash
npm install -g firebase-tools
firebase login
firebase init firestore  # select your project: manozportfolio
firebase deploy --only firestore:rules
```

### Set Admin Role (One-time)
After signing in with `sentraderofficial@gmail.com`, go to Firebase Console:
- Firestore → users → find your document → edit `role` to `"admin"`

---

## ☁️ Cloudinary Notes
- Upload preset name must be exactly: `Portfolio Uploads`
- Make sure it is set to **Unsigned** in Cloudinary dashboard
- Folder: uploads go to `portfolio/` folder automatically

---

## 📁 Project Structure

```
manoz-portfolio/
├── app/                  # Next.js App Router pages
│   ├── page.tsx          # Homepage
│   ├── login/            # Google sign-in
│   ├── projects/         # Gallery + Case studies
│   ├── dashboard/        # Client dashboard
│   ├── demo/[id]/        # Demo viewer
│   ├── request-demo/     # Demo request form
│   └── admin/            # Admin panel (protected)
├── components/
│   ├── layout/           # Navbar, Footer
│   ├── home/             # Hero, ProjectsPreview, DemoForm
│   ├── projects/         # ProjectCard, Filter, Carousel
│   ├── admin/            # AdminLayout, Forms, DemoManager
│   └── shared/           # StatusBadge, WhatsAppButton
├── lib/                  # Firebase, Firestore, Cloudinary helpers
├── context/              # AuthContext
├── types/                # TypeScript interfaces
└── public/
    └── profile.jpg       # Your profile photo
```

---

## 🚀 Deploy to Vercel (Free)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import your repo
3. Add all env variables from `.env.local`
4. Deploy!

---

## 📱 Admin Panel Access

- URL: `yoursite.com/admin`
- Only works for `sentraderofficial@gmail.com`
- Fully mobile-friendly

## 🔑 Features

- ✅ Google Sign-In only
- ✅ Client demo dashboard
- ✅ Admin panel (projects, demos, users, settings)
- ✅ Cloudinary image upload from mobile
- ✅ WhatsApp CTAs throughout
- ✅ Secure Firestore rules
- ✅ ISR (Incremental Static Regeneration) on homepage
