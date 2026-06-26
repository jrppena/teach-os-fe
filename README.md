# Teacher OS — Web App (Frontend)

The web interface for **Teacher OS**, a tool that helps teachers turn a few simple inputs into a complete, ready-to-use lesson plan in seconds.

---

## Introduction

Planning lessons takes time that teachers would rather spend teaching. **Teacher OS** removes the blank-page problem: you tell it what you want to teach, and it generates a structured lesson plan you can review, save, and reuse.

This repository is the **frontend** — the part you see and click in your browser. You sign in (with an email and password or your Google account), open a short step-by-step wizard, and describe your lesson. Behind the scenes the app sends your request to the Teacher OS backend, which uses an AI provider of your choice to write the plan. The result appears on your dashboard, where you can open, revisit, or delete it any time.

In short: **plain inputs in, a polished lesson plan out** — with your work saved to your account so it's there when you come back.

---

## Technology Stack

The core technologies that power this app:

- **React 19** + **TypeScript** — the user interface, written in a type-safe way
- **Vite 8** — fast development server and build tool
- **Tailwind CSS v4** + **shadcn/ui** — styling and ready-made UI components (with `lucide` icons)
- **TanStack React Query v5** — keeps the screen in sync with data from the backend
- **Firebase Authentication** — secure sign-in with email/password and Google
- **Axios** — talks to the Teacher OS backend REST API
- **Zustand** — lightweight in-app state (e.g. notifications)
- **Zod** — validates forms and environment settings
- **React Router v7** — page navigation
- **Vitest** + **Testing Library** — automated tests

---

## Quick Start

This guide gets the app running on your computer.

### What you'll need first

- **Node.js** (version 20 or newer) and **npm** installed
- The **Teacher OS backend** running and reachable (this frontend cannot work on its own — it needs the backend for sign-in and lesson generation)
- A **Firebase project** (used for sign-in)

### 1. Install

From the project folder, install the dependencies:

```bash
npm install
```

### 2. Add your settings

Create a `.env` file in the project root and fill in the values below. The API URL points to your running backend; the Firebase values come from your Firebase project settings.

```bash
# API
VITE_TEACHER_OS_API_URL=http://localhost:8000   # your backend address
VITE_TEACHER_OS_APP_URL=http://localhost:3000

# Firebase (from your Firebase project settings)
VITE_TEACHER_OS_FIREBASE_API_KEY=...
VITE_TEACHER_OS_FIREBASE_AUTH_DOMAIN=...
VITE_TEACHER_OS_FIREBASE_PROJECT_ID=...
VITE_TEACHER_OS_FIREBASE_STORAGE_BUCKET=...
VITE_TEACHER_OS_FIREBASE_MESSAGING_SENDER_ID=...
VITE_TEACHER_OS_FIREBASE_APP_ID=...
VITE_TEACHER_OS_FIREBASE_MEASUREMENT_ID=...
```

> **Tip:** If any required value is missing, the app will stop and tell you exactly which one — so you're never left guessing.

### 3. Start the app

```bash
npm run dev
```

Then open **http://localhost:3000** in your browser.

### Other handy commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the app for development (port 3000) |
| `npm run build` | Build the app for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Check the code for problems |
| `npx vitest` | Run the automated tests |

---

## User Manual — Your First Lesson Plan

Once the app is open in your browser, here's how to go from sign-in to your first finished plan:

1. **Create an account or sign in.** Use your email and password, or click **Sign in with Google**. New Google users are asked to confirm their name once before continuing.
2. **Add an AI provider key (one-time setup).** Open **Settings** from the menu in the top-right corner and add a key for your chosen AI provider (e.g. Grok or Gemini). This is what powers the lesson generation. Your key is stored securely and never shown back to you.
3. **Generate a plan.** Go to **Generate** and follow the short wizard — describe your subject, level, and what you want to cover.
4. **Review and confirm.** The final step shows a summary. If you haven't added a provider key yet, the app will gently remind you and link you to Settings. When you're ready, click **Generate**.
5. **Find it on your dashboard.** Your new plan is saved automatically. From the **Dashboard** you can open any saved plan to read it, or delete plans you no longer need.

That's it — a complete lesson plan from a few simple inputs.

---

*Built to give teachers their time back.*
