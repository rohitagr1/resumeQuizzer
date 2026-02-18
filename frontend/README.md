# Resume MCQ Generator Frontend

A minimal, modern Next.js + Tailwind + TypeScript app for generating and taking resume-based MCQs.

## Features
- Upload PDF resume (client-only stub)
- Forward-only quiz flow with immediate feedback and explanations
- Session persistence using sessionStorage
- Minimal, attractive UI with glassmorphism and gradient backgrounds

## Setup
1. Install dependencies:

```bash
cd frontend
npm install
```

2. Start the dev server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure
- `app/` — Next.js app directory
- `components/` — Quiz and QuestionCard components
- `data/` — Sample MCQ data
- `types/` — TypeScript types
- `lib/` — sessionStorage helpers

## Customization
- Edit `data/sampleQuestions.ts` for your own MCQs
- Tweak `app/globals.css` for colors and glassmorphism

## Deployment
- Deploy to Vercel or any Next.js-compatible platform
