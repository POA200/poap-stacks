# POAP Stacks - Deployment & Integration Guide

This guide walks you through deploying your POAP smart contract and connecting it to your frontend.

## 📋 Prerequisites

- **Clarinet CLI** - Install: `brew install clarinet` or [download](https://github.com/hirosystems/clarinet)
- **Stacks Wallet** - [Hiro Wallet](https://wallet.hiro.so) or [Leather](https://leather.io)
- **Testnet STX** - Get from [Stacks Testnet Faucet](https://explorer.hiro.so/sandbox/faucet?chain=testnet)
- **Node.js 18+** - For running the Next.js app

---

## 🚀 Step 1: Deploy Smart Contracts

### Option A: Deploy with Clarinet CLI (Recommended)

Navigate to contracts package:

```bash
cd packages/contracts
```

Generate deployment plan for testnet:

```bash
clarinet deployments generate --testnet
```

This creates `deployments/default.testnet-plan.yaml`. Deploy it:

```bash
clarinet deployments apply -p deployments/default.testnet-plan.yaml
```

Follow prompts to sign with your wallet and wait for confirmation.

### Option B: Deploy with Hiro Platform (No-Code)

1. Visit [Hiro Platform](https://platform.hiro.so)
2. Connect your wallet
3. Go to "Deploy Contract"
4. Upload and deploy `contracts/sip009-nft-trait.clar` first
5. Then upload and deploy `contracts/poap.clar`
6. Deploy to testnet

### ✅ Note Your Contract Addresses

After deployment, you'll receive addresses like:

```
ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.sip009-nft-trait
ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.poap
```

**Save these - you'll need them next!**

---

## ⚙️ Step 2: Configure Frontend

Navigate to web app:

```bash
cd ../../apps/web
```

### Update Contract Addresses

Edit `lib/contracts-config.ts` with your deployed addresses:

```typescript
export const CONTRACTS = {
  TESTNET: {
    POAP: "YOUR_ADDRESS.poap", // ← Replace this
    NFT_TRAIT: "YOUR_ADDRESS.sip009-nft-trait", // ← Replace this
  },
  MAINNET: {
    POAP: "",
    NFT_TRAIT: "",
  },
};
```

### Set Environment Variables

Create `.env.local` in `apps/web/`:

```bash
# Network (testnet or mainnet)
NEXT_PUBLIC_STACKS_NETWORK=testnet

# Database (if using Prisma)
DATABASE_URL="your-database-url"
```

---

## 🧪 Step 3: Test Integration

### Install Dependencies

From project root:

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

App starts at `http://localhost:3000`

### Test Contract Functions

1. **Connect Wallet**
   - Click "Connect Wallet" in navbar
   - Approve connection in your Stacks wallet

2. **Claim a Badge** (main feature!)
   - Go to an event page: `/events/[id]`
   - Click "Claim Badge"
   - Approve transaction in wallet
   - Wait for confirmation (~10 min on testnet)
   - Badge appears in your profile

3. **View Profile**
   - Go to `/profile` to see your claimed badges
   - Visit `/profile/[address]` to see any user's profile

4. **Create Event** (if admin)
   - Go to `/create`
   - Upload square banner, fill details
   - Submit to create event on-chain

---

## 🔍 Step 4: Verify Deployment

### Check Transaction

Visit Stacks Explorer:

- **Testnet**: `https://explorer.hiro.so/txid/YOUR_TX_ID?chain=testnet`
- **Mainnet**: `https://explorer.hiro.so/txid/YOUR_TX_ID?chain=mainnet`

### Check Contract

View deployed contract at:
`https://explorer.hiro.so/address/YOUR_ADDRESS?chain=testnet`

### Verify NFT

After claiming, check:

1. Stacks Explorer → "NFTs" tab
2. Your wallet's NFT section
3. `/profile` page in the app

---

## 🔧 Frontend Integration (Already Built!)

All integration code is ready in `lib/contract-calls.ts`:

### Available Functions

```typescript
import {
  claimBadge,
  createEvent,
  hasClaimedBadge,
  getEvent,
} from "@/lib/contract-calls";

// Claim badge for event
await claimBadge({
  eventId: 1,
  onFinish: (data) => console.log("Success!", data),
  onCancel: () => console.log("Cancelled"),
});

// Check if user claimed
const claimed = await hasClaimedBadge(eventId, userAddress);

// Get event details
const event = await getEvent(eventId);
```

### Usage Example

```typescript
'use client';
import { claimBadge } from '@/lib/contract-calls';
import { useState } from 'react';

export default function ClaimButton({ eventId }: { eventId: number }) {
  const [claiming, setClaiming] = useState(false);

  const handleClaim = async () => {
    setClaiming(true);
    await claimBadge({
      eventId,
      onFinish: (data) => {
        alert('Badge claimed! Check your wallet.');
        setClaiming(false);
      },
      onCancel: () => setClaiming(false),
    });
  };

  return (
    <button onClick={handleClaim} disabled={claiming}>
      {claiming ? 'Claiming...' : 'Claim Badge'}
    </button>
  );
}
```

---

## 🚨 Troubleshooting

### "Contract not found"

- ✅ Verify addresses in `contracts-config.ts` match deployed contracts
- ✅ Check `NEXT_PUBLIC_STACKS_NETWORK` matches deployment network
- ✅ Ensure contracts are deployed on testnet/mainnet

### Transaction Fails

- ✅ Check you have STX for gas fees
- ✅ Verify event is active: `event.active === true`
- ✅ Ensure not already claimed: use `hasClaimedBadge()`
- ✅ Check event time bounds (start/end times)

### Wallet Connection Issues

- ✅ Disconnect and reconnect wallet
- ✅ Clear browser cache
- ✅ Ensure wallet on correct network (testnet/mainnet)
- ✅ Try incognito mode

### Long Wait Times

- ⏱️ Testnet blocks: ~10 minutes
- ⏱️ Mainnet blocks: ~10 minutes
- ⏱️ Check transaction in Explorer for status

---

## 🌐 Deploy to Mainnet

### Prerequisites

- Real STX tokens (buy from exchange)
- Audited contracts (recommended for production)
- Hosting (Vercel/Netlify)

### Steps

1. **Deploy contracts to mainnet:**

   ```bash
   cd packages/contracts
   clarinet deployments generate --mainnet
   clarinet deployments apply -p deployments/default.mainnet-plan.yaml
   ```

2. **Update config:**

   ```typescript
   // lib/contracts-config.ts
   export const CONTRACTS = {
     MAINNET: {
       POAP: "YOUR_MAINNET_ADDRESS.poap",
       NFT_TRAIT: "YOUR_MAINNET_ADDRESS.sip009-nft-trait",
     },
   };
   ```

3. **Set production env:**

   ```bash
   NEXT_PUBLIC_STACKS_NETWORK=mainnet
   ```

4. **Deploy frontend:**
   ```bash
   npm run build
   # Deploy to your hosting platform
   ```

---

## ✅ Security Checklist

- ✅ All 8 contract tests passing
- ✅ Double-claim prevention implemented
- ✅ Event authorization checks
- ✅ SIP009 standard compliance
- ⚠️ Professional audit recommended for mainnet
- ⚠️ Test thoroughly on testnet first
- ⚠️ Start with small events

---

## 📚 Resources

- [Stacks Documentation](https://docs.stacks.co)
- [Clarity Language Reference](https://docs.stacks.co/clarity/)
- [Hiro Platform](https://platform.hiro.so)
- [Stacks Discord](https://discord.gg/stacks)
- [Clarinet Docs](https://docs.hiro.so/clarinet)

---

## 🎯 Quick Start Checklist

- [ ] Deploy contracts to testnet
- [ ] Update contract addresses in `contracts-config.ts`
- [ ] Set `NEXT_PUBLIC_STACKS_NETWORK=testnet` in `.env.local`
- [ ] Run `npm install && npm run dev`
- [ ] Connect wallet
- [ ] Test claiming badge
- [ ] Verify NFT in wallet
- [ ] Check profile page shows badge

## 🔧 Frontend Integration

### 1. **Install Required Packages**

```bash
cd /home/ipeter/poap-stacks/apps/web
npm install @stacks/connect @stacks/transactions @stacks/network
```

### 2. **Create Contract Configuration**

I'll create the integration files for you...
