# Stellar License OS

## Product overview
Stellar License OS is a digital asset licensing platform for creators and businesses that want to monetize, protect, and distribute intellectual property and digital tokens with transparent on-chain workflows.

## Problem statement
Creators often rely on fragmented licensing tools, manual royalty tracking, and opaque approval flows. Stellar License OS consolidates licensing, wallet interactions, activity tracking, and transaction monitoring into a production-style operating layer on Stellar.

##Deployed_link:
  [vercel](https://digital-asset-xrme-ng6fhl9ou-zeroschenieders-projects.vercel.app)

## Architecture diagram
```mermaid
flowchart LR
  User[Creator / Licensee] --> Frontend[Next.js App]
  Frontend --> Wallet[Stellar Wallets Kit]
  Frontend --> Registry[License Registry Contract]
  Frontend --> Router[Royalty Router Contract]
  Registry --> Router
  Router --> Events[Activity Events]
  Events --> UI[Live Activity Feed]
```

## Smart contract design
- License Registry: creates licenses, tracks state transitions, stores creator-owned license records, and exposes upgrade hooks.
- Royalty Router: handles royalty routing intents and demonstrates inter-contract design patterns.

## Inter-contract communication flow
```mermaid
sequenceDiagram
  participant UI as Frontend
  participant Router as Royalty Router
  participant Registry as License Registry
  UI->>Router: submit royalty intent
  Router->>Registry: invoke licensing workflow
  Registry-->>Router: return state update
  Router-->>UI: emit activity event
```

## Features
- Landing, dashboard, activity, transaction center, analytics, and settings pages
- Wallet connection and network switching primitives
- Transaction lifecycle states with explorer links and retry actions
- Live activity feed and observable event emissions

## Tech stack
- Next.js 15 + TypeScript + Tailwind CSS
- Zustand + React Query
- Stellar Wallets Kit + Stellar SDK
- Soroban smart contracts
- Vitest + Testing Library

## Local development
```bash
git clone <repo-url>
cd knm
npm install
cp .env.example .env.local
npm run dev
```

## Environment variables
- NEXT_PUBLIC_HORIZON_URL
- NEXT_PUBLIC_NETWORK
- NEXT_PUBLIC_CONTRACT_REGISTRY
- NEXT_PUBLIC_CONTRACT_ROUTER
- NEXT_PUBLIC_SENTRY_DSN
- NEXT_PUBLIC_POSTHOG_KEY

## Testing
```bash
npm run test
```

## CI/CD
GitHub Actions workflows are included for pull request checks and deployment on merge to main.

## Deployment
See the deployment scripts in the scripts directory.

## Security considerations
- Use authenticated contract entry points.
- Validate all input values.
- Keep private keys off-chain.
- Review contract upgrades before applying them.

## Screenshots
- Add screenshots in docs/screenshots after running the app locally.

## Contract addresses
Transaction id:78bdb5db5f51ca76340ea3ad0d586da68606709e03ee35e4171aed96feaf4217
 #Screenshot:
 <img width="1920" height="1080" alt="Screenshot (203)" src="https://github.com/user-attachments/assets/86e8da5d-5205-4245-aa8b-cc37203ee9f8" />

  #screenshots :
  
  #1
  <img width="1920" height="1080" alt="Screenshot (5)" src="https://github.com/user-attachments/assets/d8e47afa-94f1-457e-ad24-3eef9e9d1a42" />
  #2
  <img width="1920" height="1080" alt="Screenshot (271)" src="https://github.com/user-attachments/assets/87eefdd6-2453-4fc9-8a7a-2c33e65fd85f" />

  
  

