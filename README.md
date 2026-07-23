# LicenseCraft – Soroban Level 4 Platform

Your one-click digital asset license generator for NFTs, smart contracts, and tokens on Stellar.

## Quick Links
- **Live Demo**: [Vercel Deployment](https://digital-asset-xrme.vercel.app/)
- **GitHub**: [Ritesh-Gupta-op/digital_asset](https://github.com/Ritesh-Gupta-op/digital_asset)
- **Smart Contracts**: License Registry + Royalty Router on Stellar testnet
- **Deployment TX**: `78bdb5db5f51ca76340ea3ad0d586da68606709e03ee35e4171aed96feaf4217`

## Product Overview
Creators often rely on fragmented licensing tools, manual royalty tracking, and opaque approval flows. LicenseCraft consolidates licensing, wallet interactions, activity tracking, and transaction monitoring into a production-style operating layer on Stellar Soroban.

## Features
- **Wallet Integration**: Freighter, Lobstr, Albedo support
- **Transaction Lifecycle**: Draft → Confirmed → Failed states with Stellar Expert links
- **License Management**: Create, activate, and transfer licenses on-chain
- **Analytics Dashboard**: Monitor activity, transactions, and royalty routes
- **Responsive UI**: Mobile-first design with light/dark themes
- **Network Switching**: Testnet/Mainnet selection
- **Live Activity Feed**: Real-time transaction events

## Architecture
```
User → Next.js Frontend → Stellar Wallets Kit
        ↓
    License Registry Contract
        ↓
    Royalty Router Contract → Activity Events → UI Feed
```

## Tech Stack
- Frontend: Next.js 15, TypeScript, Tailwind CSS, Zustand, React Query
- Wallets: Stellar Wallets Kit (Freighter, Lobstr, Albedo)
- Contracts: Soroban (Rust)
- Testing: Vitest + Testing Library
- Deployment: Vercel

## User Interactions & Feedback
### Wallet Integration Proof (10+ interactions)
1. Connect wallet (Freighter/Lobstr/Albedo)
2. Authenticate transaction signature
3. Submit XLM payment
4. Record license metadata on-chain
5. Switch networks (testnet ↔ mainnet)
6. View transaction history
7. Approve license state transitions
8. Sign multi-operation transactions
9. Retry failed transactions
10. Disconnect and reconnect wallet

### User Feedback Summary
- Smooth wallet UX with multiple provider options
- Clear transaction status indicators (pending, confirmed, failed)
- Explorer links enable transaction verification
- Mobile-responsive design improves accessibility
- Dark mode reduces eye strain for creators working at night
- Activity feed provides transparency into licensing events
- Settings page allows network and preferences customization

## Screenshots

### Product UI - Dashboard
![Dashboard](https://github.com/user-attachments/assets/d8e47afa-94f1-457e-ad24-3eef9e9d1a42)

### Mobile Responsive Design
![Mobile](https://github.com/user-attachments/assets/86e8da5d-5205-4245-aa8b-cc37203ee9f8)

### Analytics & Transaction Monitoring
![Analytics](https://github.com/user-attachments/assets/87eefdd6-2453-4fc9-8a7a-2c33e65fd85f)

## Getting Started
```bash
git clone https://github.com/Ritesh-Gupta-op/digital_asset.git
cd digital_asset
npm install
cp .env.example .env.local
npm run dev
```

## Environment Setup
```env
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_NETWORK=testnet
NEXT_PUBLIC_CONTRACT_REGISTRY=CC... (deploy contract first)
NEXT_PUBLIC_CONTRACT_ROUTER=CC... (deploy contract first)
```

## Testing
```bash
npm run test          # Run all tests (5 test files, 6 tests passing)
npm run test:watch   # Watch mode
```

## Smart Contract Design
**License Registry**: State machine managing license lifecycle (draft → active → completed) with creator authorization.

**Royalty Router**: Inter-contract communication pattern demonstrating Soroban's contract-to-contract calls with event emissions.

## Deployment
1. Build contracts: `cd contracts/license_registry && cargo build --target wasm32-unknown-unknown --release`
2. Deploy to testnet using `soroban contract deploy`
3. Update `.env.local` with contract addresses
4. Deploy app: `vercel deploy`

## Security
- Authenticated contract entry points
- Input validation for terms hashes and royalty values
- Private keys stay in user wallets (never server-side)
- Contract upgrade review process
- Rate limiting on transaction submissions

## Commits: 21 meaningful commits (exceeds 15+ requirement)
Check [commit history](https://github.com/Ritesh-Gupta-op/digital_asset/commits/main)

## License
MIT


  
  

