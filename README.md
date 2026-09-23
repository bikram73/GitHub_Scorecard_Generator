# ⚡ GitScore — AI-Powered GitHub Scorecard Generator

<div align="center">

![GitScore Banner](https://img.shields.io/badge/GitHub_Score-1000%2F1000--S%2B-8b5cf6?style=for-the-badge&logo=github&logoColor=white)
![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Google_Gemini-2.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Netlify Ready](https://img.shields.io/badge/Deploy-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)

<p align="center">
  <strong>Transform public GitHub profiles into quantifiable 1000-point developer scorecards, AI code quality audits, side-by-side comparisons, and recruiter-ready career insights.</strong>
</p>

[🚀 Features](#-key-features) • [🛠️ Tech Stack](#-tech-stack) • [📦 Installation](#-quick-start--installation) • [☁️ Netlify Deployment](#-netlify-deployment) • [📐 Scoring Algorithm](#-1000-point-scoring-algorithm)

</div>

---

## 🌟 Overview

**GitScore** is a full-stack developer analytics platform that extracts real public profile metadata, contribution volumes, and repository architectures directly via the GitHub API. It evaluates profiles through a multi-dimensional 1000-point scoring model combined with **Google Gemini 2.5 Flash AI** to provide actionable feedback, cognitive complexity estimates, README badge snippets, and career alignment recommendations.

---

## ✨ Key Features

### 🎯 1. Dedicated Scorecard Generator (`0-1000 Pts`)
- 🔍 Instant evaluation for any public GitHub handle or profile link (e.g. `torvalds`, `github.com/username`).
- ⚡ 1-click popular presets to test instant profiles (`@torvalds`, `@yyx990803`, `@gvanrossum`, `@BikramManna`).
- 🏆 Tiered grade rankings: **S+**, **S**, **A+**, **A**, **B+**, **B**, **C**, and **Beginner**.
- 📈 Real-time global percentile calculation (e.g., *Top 0.5% Globally*).

### 🤖 2. Gemini AI Code & Repository Audits
- 🧠 Deep inspection of repository descriptions, languages, licenses, star distributions, and topic tags.
- 🐞 Cognitive complexity estimations, estimated technical debt hours, and refactor opportunities.
- 💡 Personalized AI feedback highlighting strengths and exact areas for profile improvement.

### ⚔️ 3. Head-to-Head Profile Comparison
- 🥊 Compare any two GitHub developers side-by-side in real time.
- 📊 Metric-by-metric comparison across profile completeness, repository quality, commit streaks, followers, and open-source impact.
- 🏅 Automatic winner determination with highlight cards.

### 🌍 4. Global & Academic Leaderboards
- 🥇 Live rankings sorted by developer scores and percentiles.
- 🏫 Filtering by **Global All**, **Colleges & Universities**, and **Country / Regions**.
- 🔎 Instant search across registered developers.

### 💼 5. Career & Recruiter Insights
- 🎯 Recommended suitable technical roles (e.g., *Full Stack Engineer*, *Distributed Systems Architect*, *Cloud & DevOps*).
- 🏷️ Seniority / skill level benchmarking (*Intermediate*, *Advanced*, *Elite*).
- 📋 Summary assessments tailored for hiring managers, hackathons, and placement resumes.

### 🛡️ 6. Dynamic Markdown Badges & Print-Ready Scorecards
- 📋 1-click Markdown badge copy to embed live scorecards inside your GitHub profile `README.md`.
- 🖨️ Clean print & PDF export stylesheets optimized for recruiter portfolios.

---

## 🛠️ Tech Stack & Languages

### **Frontend**
| Technology | Description |
| :--- | :--- |
| **React 19** | Modern UI components with hooks and functional state architecture |
| **TypeScript** | Strict typing for scorecard entities, metrics, and API responses |
| **Tailwind CSS v4** | Modern responsive dark-mode styling and utility animations |
| **Motion (Framer Motion)** | Smooth page transitions, animated radar charts, and spinners |
| **Lucide React** | Scalable, clean developer and analytics icons |
| **Vite 6** | Blazing-fast frontend bundling and HMR dev server |

### **Backend & Serverless API**
| Technology | Description |
| :--- | :--- |
| **Node.js & Express** | RESTful backend routing for profile analysis, comparisons, and leaderboards |
| **Google Gemini AI SDK (`@google/genai`)** | Gemini 2.5 Flash for structured evaluation via JSON schema |
| **GitHub REST API v3** | Real-time user profiles, public repositories, and activity metrics |
| **Serverless-HTTP** | Wraps Express routes into Netlify Serverless Functions |
| **Esbuild / TSX** | High-performance TypeScript execution and production bundling |

---

## 📁 File Structure

```bash
├── 📁 .netlify/functions/     # Netlify Serverless Function build output
├── 📁 netlify/
│   └── 📁 functions/
│       └── 📄 api.ts         # Netlify serverless handler wrapping Express API
├── 📁 public/
│   ├── 📄 _redirects         # Netlify SPA rewrite and API proxy rules
│   └── 📄 favicon.ico        # App favicon
├── 📁 src/
│   ├── 📄 App.tsx            # Main SPA dashboard, tabs, comparison & scoring UI
│   ├── 📄 index.css          # Tailwind CSS v4 imports & custom dark theme styling
│   ├── 📄 main.tsx           # React root entry point
│   └── 📄 types.ts           # TypeScript interfaces for scorecards, repos & leaderboards
├── 📄 .env.example           # Template for required environment variables
├── 📄 .gitignore             # Git ignore patterns
├── 📄 db.json                # Baseline database for leaderboards & cached profiles
├── 📄 index.html             # HTML entry point with SEO metadata
├── 📄 metadata.json          # Google AI Studio app configuration
├── 📄 netlify.toml           # Netlify build settings, functions & redirect mappings
├── 📄 package.json           # Project dependencies and build scripts
├── 📄 README.md              # Project documentation
├── 📄 server-api.ts          # Shared modular API router & Gemini scoring logic
├── 📄 server.ts              # Local development Express server + Vite middleware
├── 📄 tsconfig.json          # TypeScript compiler options
└── 📄 vite.config.ts         # Vite configuration with React & Tailwind plugins
```

---

## 📐 1000-Point Scoring Algorithm

The scorecard calculates an objective developer score out of **1,000 points** distributed across 7 core pillars:

```
┌───────────────────────────────────────────────┬────────────┐
│ Metric Category                               │ Max Points │
├───────────────────────────────────────────────┼────────────┤
│ 📋 Profile Completeness & Bio Documentation    │  100 Pts   │
│ 👥 Social Reach & Follower Ratio              │  100 Pts   │
│ ⭐ Repository Quality, Topics & Clean Code    │  200 Pts   │
│ 🔥 Commit Frequency & Contribution Velocity   │  250 Pts   │
│ 🌐 Open Source Engagement (PRs & Issues)      │  150 Pts   │
│ ⚡ Consistency Streak & Contribution Regularity│  100 Pts   │
│ 🤝 Community Collaboration & Star Impact      │  100 Pts   │
├───────────────────────────────────────────────┼────────────┤
│ 🏆 TOTAL MAXIMUM SCORE                        │ 1000 Pts   │
└───────────────────────────────────────────────┴────────────┘
```

### Grade Distribution Tiers
- **S+ Tier (`950 – 1000 pts`)**: Top 0.1% — Legendary open-source creators & core maintainers.
- **S Tier (`900 – 949 pts`)**: Top 1.5% — High-impact contributors with large reach.
- **A+ Tier (`850 – 899 pts`)**: Top 4.0% — Highly consistent, production-grade developers.
- **A Tier (`800 – 849 pts`)**: Top 10% — Active coders with well-documented projects.
- **B+ Tier (`700 – 799 pts`)**: Top 20% — Solid builders with regular commits.
- **B Tier (`600 – 699 pts`)**: Top 35% — Steady contributors growing their portfolio.
- **C / Beginner (`< 600 pts`)**: Early-stage developers starting their open-source journey.

---

## 📦 Quick Start & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0 or higher)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)
- A Google Gemini API Key ([Get one free at Google AI](https://ai.google.dev/))

### 1. Clone the repository
```bash
git clone https://github.com/your-username/github-scorecard-generator.git
cd github-scorecard-generator
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
Create a `.env` file in the root directory:
```env
# Required for AI evaluations
GEMINI_API_KEY="your_google_gemini_api_key_here"

# Optional: Increases GitHub API rate limit from 60 to 5,000 requests/hr
GITHUB_TOKEN="ghp_your_personal_access_token"
```

### 4. Run development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Netlify Deployment

This application is **100% Netlify Ready** with pre-configured serverless functions (`netlify.toml` + `netlify/functions/api.ts`).

### Option A: Deploy with Git (Recommended)

1. Push your code to **GitHub**, **GitLab**, or **Bitbucket**.
2. Go to [Netlify](https://app.netlify.com/) and click **"Add new site"** > **"Import an existing project"**.
3. Select your repository.
4. Netlify will auto-detect settings from `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Functions directory:** `netlify/functions`
5. Go to **Site configuration** > **Environment variables** and add:
   - `GEMINI_API_KEY`: `your_gemini_api_key`
   - `GITHUB_TOKEN` *(Optional)*: `ghp_your_token`
6. Click **"Deploy site"**! 🎉

### Option B: Deploy using Netlify CLI

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Login to your Netlify account
netlify login

# 3. Link or create project
netlify init

# 4. Set Environment Variable
netlify env:set GEMINI_API_KEY "your_gemini_api_key_here"

# 5. Build and deploy to production
netlify deploy --build --prod
```

---

## 🔌 API Reference

### `GET /api/analyze/:username`
Fetches and scores a GitHub developer profile.
- **Params:** `username` (string) — GitHub handle
- **Response:**
  ```json
  {
    "profile": {
      "username": "torvalds",
      "name": "Linus Torvalds",
      "avatarUrl": "https://avatars.githubusercontent.com/u/1024025?v=4",
      "publicRepos": 7,
      "followers": 215000
    },
    "scorecard": {
      "overallScore": 998,
      "grade": "S+",
      "percentile": 0.01,
      "metrics": {
        "profileCompleteness": 95,
        "followers": 100,
        "repositoryQuality": 200,
        "contributionActivity": 250,
        "openSourceEngagement": 150,
        "codeConsistency": 100,
        "communityImpact": 100
      }
    }
  }
  ```

### `GET /api/compare?user1=:user1&user2=:user2`
Compares two profiles side-by-side.
- **Query:** `user1`, `user2`
- **Response:** `{ "user1": { ...report }, "user2": { ...report } }`

### `GET /api/leaderboard`
Returns the global developer rankings.
- **Response:** `{ "leaderboard": [ ...developers ] }`

---

## 🛡️ License

This project is open-source and available under the [MIT License](LICENSE).

