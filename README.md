# Stayful Sales Assistant

A second-screen reference tool for a sales presenter to use during web meetings.
The lead **cannot** see it — the presenter shares only the presentation tab and
runs this app in a separate window.

**Core function:** instant FAQ lookup by search or voice, returning the answer
plus the exact voice command to say to navigate the sales presentation to the
relevant slide.

## Features

- **Instant search** — filters as you type, zero latency (all data is
  pre-loaded as a JS constant; no backend, no API calls during use).
- **Voice input** — Web Speech API captures spoken keywords, populates the
  search bar and filters results. Matching is purely local against the
  pre-loaded data — no external API call.
- **42 FAQ cards**, each showing a frequency-tier badge, category tag,
  question, full answer and (where applicable) a `say this →` voice command to
  cue the presentation slide. Click a command to copy it.
- **Frequency tiers** — Tier 1 (every meeting) = Stayful green, Tier 2 (most
  meetings) = amber, Tier 3 (common) = slate blue, Tier 4 (situational) = grey.
- **Category tabs** — All, Revenue, Fees, Service, Contract, Setup, Legal &
  Tax, Situations.
- **Dark UI** optimised for a narrow side window. Brand colour `rgb(93,129,86)`.

### Keyboard

- `/` — focus the search box
- `Esc` — clear the search

## Tech

React + Vite single-page app. No backend. Deploys to Vercel.

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build      # outputs to dist/
npm run preview
```

## Deploy to Vercel

Import the GitHub repo into Vercel. Settings are picked up from `vercel.json`
(framework: Vite, output: `dist`). No environment variables required.

## Data

All FAQ content lives in [`src/faqData.js`](src/faqData.js) — questions,
answers, frequency tiers, categories and slide voice-commands. Sourced from the
Stayful Web Meeting Presenter Script.

## Access / security

The app is publicly accessible (no password). The content is confidential, so
keeping the **GitHub repository private** is recommended so the source and FAQ
data aren't browsable on GitHub. A `noindex` tag keeps it out of search engines.

> Confidential — internal use only.
