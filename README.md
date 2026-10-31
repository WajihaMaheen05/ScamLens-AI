# ScamLens AI — Trust, but verify.

A cyberpunk pixel-art screenshot safety checker powered by **Gemma 4** through the Gemini API. Upload a screenshot of a suspicious message, email, job offer, or payment request and get a cautious risk indicator, visible warning signs, and practical next steps.

## What's included

- React + TypeScript + Vite frontend
- Custom retro cyberpunk interface and CSS pixel-art mascot
- Screenshot upload with client-side resizing
- Vercel serverless API route (`/api/analyze`)
- Gemma 4 image analysis using the Gemini API
- Structured results: risk indicator, signals, safe actions, independent checks
- Demo result to preview the interface without an API key
- Mobile-responsive layout

## 1. Open the project in VS Code

1. Download and unzip `scamlens-ai.zip`.
2. Open VS Code.
3. Choose **File → Open Folder...**
4. Select the unzipped `scamlens-ai` folder.

## 2. Install dependencies

Open **Terminal → New Terminal** in VS Code and run:

```bash
npm install
```

You need Node.js 20 or newer. Check with:

```bash
node -v
npm -v
```

## 3. Get your Gemma 4 API key

1. Visit [Google AI Studio API keys](https://aistudio.google.com/apikey).
2. Create an API key.
3. Keep it private. Do not paste it into React code or commit it to GitHub.

The backend uses the hosted Gemma 4 model `gemma-4-26b-a4b-it` through the Gemini API. The image is resized in the browser and sent to the serverless API route. The API key is read only on the server from `GEMINI_API_KEY`.

## 4. Run locally only for testing (optional)

Create a file named `.env.local` in the project root:

```env
GEMINI_API_KEY=PASTE_YOUR_KEY_HERE
```

Vite itself does not execute the Vercel `/api` function locally. To test the complete API locally, install the Vercel CLI and run:

```bash
npm install -g vercel
vercel dev
```

When prompted, link the project or choose the default options. The local preview is for testing only; deployment below creates your public URL.

## 5. Publish it and get a public URL with Vercel

You do **not** need to keep your MacBook running for the deployed site to work.

### A. Put the project on GitHub

1. Create a new empty repository on [GitHub](https://github.com/new), for example `scamlens-ai`.
2. In the VS Code terminal, run these commands from the project folder:

```bash
git init
git add .
git commit -m "Build ScamLens AI"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/scamlens-ai.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username. If Git asks you to sign in, complete the browser sign-in.

### B. Deploy on Vercel

1. Open [Vercel](https://vercel.com/) and sign in with GitHub.
2. Select **Add New → Project**.
3. Import your `scamlens-ai` repository.
4. Keep the detected Vite settings (Build Command: `npm run build`; Output Directory: `dist`).
5. Before deploying, add an Environment Variable:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** your Google AI Studio API key
   - Enable it for Production (and Preview if you want preview deployments to work).
6. Click **Deploy**.

Vercel will create a public URL similar to `https://scamlens-ai-yourname.vercel.app`. The exact URL is assigned by Vercel and may differ.

### C. After changing code or environment variables

Push code changes to GitHub to trigger a new deployment. If you change the API key, redeploy from Vercel so the new environment variable is applied.

## Demo mode

On the home page, choose **View a sample scan**. This shows a sample analysis so you can present the interface even before adding an API key. It is a clearly labelled sample, not a live model result.

## Important safety and privacy notes

- ScamLens provides a second opinion, not a definitive fraud verdict. AI can miss context or make mistakes.
- Do not upload screenshots containing passwords, OTPs, UPI PINs, full card numbers, or other sensitive information.
- The app does not store uploaded images or analysis in a database. The image is transmitted to the configured Google Gemini API for analysis. Review Google's current API data policies before handling real user data.
- The serverless endpoint includes basic input validation, but this starter project does not include user authentication, rate limiting, abuse monitoring, or a production privacy policy. Add these before a public launch with real users.
- The API key is not included in this ZIP. Add it privately through Vercel Environment Variables.

## Project structure

```text
scamlens-ai/
├── api/
│   └── analyze.js          # Server-side Gemma 4 API route
├── src/
│   ├── App.tsx             # App UI and interactions
│   ├── main.tsx            # React entry point
│   ├── styles.css          # Cyberpunk pixel-art visual system
│   └── types.ts            # Analysis response types
├── .env.example            # Environment variable template
├── .gitignore
├── index.html
├── package.json
├── tsconfig*.json
├── vercel.json
└── vite.config.ts
```

## Useful links

- [Gemma 4 on Gemini API](https://ai.google.dev/gemma/docs/core/gemma_on_gemini_api)
- [Google AI Studio API keys](https://aistudio.google.com/apikey)
- [Vercel: Vite deployments](https://vercel.com/docs/frameworks/frontend/vite)
- [Vercel Functions](https://vercel.com/docs/functions)


## Added field-tool pages

- **Link Inspector:** locally checks URL structure for a handful of warning patterns. It does not open the URL or query threat-intelligence services, and it never labels a URL safe.
- **Scam Atlas:** interactive mini-library of common scam and manipulation patterns.
- **Safety Lab:** short scenario-based quiz with explanations.
- **Response Center:** India-focused first-response checklist with a link to the official National Cyber Crime Reporting Portal.

These are educational and triage features, not proof of fraud or a substitute for bank, police, or cybersecurity services.
