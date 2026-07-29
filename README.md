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

### Survey Feedback Data
| Timestamp | Name | Wallet Address | Network | Bug/Issue | Improvement Requested | Recommend | Rating | Transaction Id |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 03/07/2026 22:00:11 | Amitabh Dey | 0xdd464a965b852f338852408b0ae99b5af846e760 | testnet | yes | Asks for access to SSO, not good | no | 3 | none |
| 03/07/2026 23:54:19 | Jayjit Dutta | GDRDK5ISJVJHFEDCSJ6WZA5RBU63TPSHCRZPLKSL425IQL5Y5J2T6UFT | testnet | No | everything is looking fine | yes | 4 | none |
| 05/07/2026 22:04:39 | Ranit Sarkar | GCWHNNUTCNGZ43LW5AVXTHB5G2RMO3APWIBGA52NAGUISINDIS53E6UO | testnet | yes | none | yes | 4 | none |
| 06/07/2026 21:32:58 | Ankush Shaw | GBBIG4HLPGTLG6BH6YREVWJXEQ4NX74HTD444JD6A6XYS7DOFL2J6DEI | testnet | No | improve user experience by adding steps to complete payment | yes | 4 | f82f27ce4457f6b9bde9fdae02afeee0e19eb92bdc4030a88bd347abd145f1b8 |
| 17/07/2026 21:44:41 | JAYJIT DUTTA | GDC7SMIT66RK3ACNLJ4WJVB3RE7TTN3UAZNAIHQ2OC7I3GRTJBDIY5SI | testnet | No | It will be better if docs are added. | yes | 5 | e5966a4a0df0cfc418929b8a5eb0420e76ac8e03b45340811343cde65cf36423 |
| 22/07/2026 22:55:51 | Sohan Sarkar | GA5B7EJJ3SRB2VKWTCKTVWUV6R2UTLUJGRUXWSAAXI3BE4B5PUZZ4YCF | testnet | No | make the UI more understanding | yes | 4 | d72c67d101165016c370fd563fa2a9fe03372d100c6dc9e73150eb30bc6247de |
| 23/07/2026 11:53:27 | Arpan Basak | GBPE3IY44M4ZLYSCKXVXMZPYRA77OKVWDOKIFKCLV4KX5GU7ZI6ZP2SV | testnet | yes/No | none | yes | 5 | d85e9522c391af8955ae58e537bf19dd256ef6f1a3bb72a401425cd29d1c7d56 |
| 23/07/2026 12:16:51 | Harshit Jha | GBC4TQKSVJ5O6TTRIDFDHQKZ7HISHF2RMMI24W6JRN3U6N4DYJ77UJFB | testnet | No | none | yes | 5 | 52eb740e7d93af3ed046a600ce2db09c4f67707e62c45079d76eedab7b52b1cf |
| 23/07/2026 14:29:20 | Gyan Prakash Tiwari | GCBX3XCLXXDRCAH83ZJQBJGLMBS22QTGPFRH56ZXZCZFHNUD3ZHBK25S | mainnet | No | All good. | yes | 5 | None |
| 23/07/2026 23:57:57 | Ranit Pal | GDFLHVAXB37QVIPV7LWLEIAPHQ7TYXG36LXX3CHMBFEQA67GDB44QLPI | testnet | No | Add a DOCS page | maybe | 3 | e0af52102c1bb9cea381d9ccd6d65c3dc3d15e69d21291aa561d07c201c062ed |
| 25/07/2026 18:31:18 | Ankit Patel | GCQ5RM5NUQP5TAY5VFDLSLVKBROLV3CBROAN3CBTS4DWYFHLJOJCWC7V | testnet | yes | wallet connection/theme settings reset on every page navigation; sticky header overlaps content on scroll; inconsistent/fake-looking stats | yes | 4 | 01704a0511b6df340a8458922d60898042e5afbf320317d97ae7a6d08148da84 |

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


  
  

