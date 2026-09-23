# GitHub Scorecard Generator — Netlify Ready

A modern web application that analyzes a GitHub user's public profile and repositories, then generates a professional scorecard (0-1000) based on coding activity, repository quality, contribution history, open-source engagement, profile completeness, and overall developer impact.

---

## 🚀 Deploying to Netlify

This project is pre-configured for seamless 1-click or Git deployment to **Netlify** using Netlify Serverless Functions and Vite SPA hosting.

### Option 1: Deploy via GitHub / GitLab / Bitbucket (Recommended)

1. Push this repository to your GitHub account.
2. Log in to [Netlify](https://app.netlify.com/) and click **"Add new site"** > **"Import an existing project"**.
3. Select your repository.
4. Netlify will automatically detect settings from `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Functions directory:** `netlify/functions`
5. Under **Site configuration > Environment variables**, add:
   - `GEMINI_API_KEY`: Your Google Gemini API key.
   - `GITHUB_TOKEN` *(Optional)*: A GitHub personal access token (increases rate limit from 60 to 5,000 requests/hr).
6. Click **"Deploy site"**.

---

### Option 2: Deploy using Netlify CLI

1. Install Netlify CLI globally:
   ```bash
   npm install -g netlify-cli
   ```
2. Log in to your Netlify account:
   ```bash
   netlify login
   ```
3. Initialize and link the site:
   ```bash
   netlify init
   ```
4. Set your environment variables in Netlify:
   ```bash
   netlify env:set GEMINI_API_KEY "your_gemini_api_key_here"
   ```
5. Deploy to production:
   ```bash
   netlify deploy --build --prod
   ```

---

## 🛠 Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set environment variables:**
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Architecture & Netlify Configuration

- `netlify.toml`: Defines build commands, publish folder (`dist`), serverless functions directory (`netlify/functions`), and SPA redirect rules.
- `netlify/functions/api.ts`: Netlify Serverless Function wrapping the Express API endpoints (`/api/analyze/:username`, `/api/leaderboard`, `/api/compare`).
- `public/_redirects`: Netlify SPA rewrite rules and API proxy fallback.
- `server-api.ts`: Modular API core shared across local development and Netlify serverless functions.
