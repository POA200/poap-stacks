# 🚀 Quick Deployment Guide

## Choose Your Deployment Method

### ⭐ **Option 1: Hiro Platform (Recommended for Beginners)**

**Easiest way - No command line setup needed!**

#### Steps:

1. **Get Testnet STX**
   - Visit: https://explorer.hiro.so/sandbox/faucet?chain=testnet
   - Connect your wallet
   - Request testnet STX (free!)

2. **Deploy on Hiro Platform**
   - Go to: https://platform.hiro.so
   - Click "Deploy Contract"
   - Connect your Stacks wallet

3. **Deploy First Contract**
   - Select: `packages/contracts/contracts/sip009-nft-trait.clar`
   - Choose network: **Testnet**
   - Click "Deploy"
   - Approve in your wallet
   - **SAVE THE CONTRACT ADDRESS!**

4. **Deploy Second Contract**
   - Select: `packages/contracts/contracts/poap.clar`
   - Choose network: **Testnet**
   - Click "Deploy"
   - Approve in your wallet
   - **SAVE THE CONTRACT ADDRESS!**

5. **Update Frontend Config**
   - Open: `apps/web/lib/contracts-config.ts`
   - Replace the testnet addresses with your deployed addresses:

   ```typescript
   export const CONTRACTS = {
     TESTNET: {
       POAP: "YOUR_ADDRESS.poap",
       NFT_TRAIT: "YOUR_ADDRESS.sip009-nft-trait",
     },
   };
   ```

6. **Set Environment**
   - Create `apps/web/.env.local`:

   ```bash
   NEXT_PUBLIC_STACKS_NETWORK=testnet
   ```

7. **Test It!**
   ```bash
   cd apps/web
   npm run dev
   ```

✅ **Done!** Your contracts are deployed!

---

### 💻 **Option 2: Clarinet CLI**

**For developers who prefer command line**

#### Prerequisites:

- Clarinet installed ✅ (you have v3.6.1)
- Stacks wallet seed phrase (12-24 words)
- Testnet STX in your wallet

#### Steps:

1. **Get Testnet STX**

   ```bash
   # Visit faucet: https://explorer.hiro.so/sandbox/faucet?chain=testnet
   ```

2. **Configure Mnemonic**
   - Get your wallet's seed phrase from Hiro Wallet or Leather
   - Edit: `packages/contracts/settings/Testnet.toml`
   - Replace `<YOUR PRIVATE TESTNET MNEMONIC HERE>` with your 12-24 word seed phrase
   - ⚠️ **NEVER commit this file to git!**

3. **Generate Deployment Plan**

   ```bash
   cd packages/contracts
   clarinet deployments generate --testnet
   ```

4. **Review the Plan**
   - Check: `deployments/default.testnet-plan.yaml`
   - Verify both contracts are listed

5. **Deploy**

   ```bash
   clarinet deployments apply -p deployments/default.testnet-plan.yaml
   ```

6. **Save Contract Addresses**
   - After deployment, note the addresses shown
   - Format: `ST...ADDRESS.poap` and `ST...ADDRESS.sip009-nft-trait`

7. **Update Frontend** (same as Option 1, steps 5-7 above)

---

## 📝 After Deployment

### Update Your Config

Edit `apps/web/lib/contracts-config.ts`:

```typescript
export const CONTRACTS = {
  TESTNET: {
    // Replace with YOUR deployed addresses
    POAP: "ST1ABC...XYZ.poap",
    NFT_TRAIT: "ST1ABC...XYZ.sip009-nft-trait",
  },
};
```

### Create Environment File

Create `apps/web/.env.local`:

```bash
NEXT_PUBLIC_STACKS_NETWORK=testnet
DATABASE_URL="your-existing-database-url"
```

### Test the Integration

```bash
cd /home/ipeter/poap-stacks
npm run dev
```

Then:

1. Open http://localhost:3000
2. Connect your wallet
3. Go to an event page
4. Click "Claim Badge"
5. Approve transaction
6. Wait ~10 minutes
7. Check your wallet for the NFT!

---

## 🔍 Verify Deployment

### Check in Stacks Explorer

Visit: `https://explorer.hiro.so/address/YOUR_ADDRESS?chain=testnet`

You should see:

- Your deployed contracts
- Contract source code
- Available functions

---

## 🆘 Troubleshooting

### "Mnemonic is invalid"

- Make sure you copied the full seed phrase (12-24 words)
- Check for extra spaces or line breaks
- Ensure words are separated by single spaces

### "Insufficient funds"

- Get testnet STX from faucet: https://explorer.hiro.so/sandbox/faucet?chain=testnet
- Wait a few minutes after requesting

### "Contract deployment failed"

- Check you have enough STX (~1-2 STX should be plenty)
- Verify network connection
- Try again in a few minutes

---

## ✅ Success Checklist

After deployment, you should have:

- [x] Both contracts deployed to testnet
- [x] Contract addresses saved
- [x] `contracts-config.ts` updated with your addresses
- [x] `.env.local` file created with `NEXT_PUBLIC_STACKS_NETWORK=testnet`
- [x] App running with `npm run dev`
- [x] Able to connect wallet in the app
- [x] Can claim badges successfully

---

## 🎉 You're Done!

Your POAP app is now live on Stacks testnet!

**Next steps:**

- Share the link with friends to test
- Create some events
- Claim badges
- View them in profiles
- When ready, deploy to mainnet using same process but with `--mainnet` flag

Need help? Check:

- DEPLOYMENT_GUIDE.md (detailed docs)
- SMART_CONTRACT_INTEGRATION.md (technical details)
- Stacks Discord: https://discord.gg/stacks
