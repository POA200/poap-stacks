# 🚀 Direct Contract Deployment (No Clarinet.toml Issues)

## The Hiro Platform issue is with the Clarinet.toml. Let's deploy directly!

### Option 1: Use Hiro Platform's Direct Upload (Recommended)

Instead of importing the project, upload the contract files directly:

1. **Go to Hiro Platform**: https://platform.hiro.so

2. **Click "Deploy Contract"** (not "Import Project")

3. **Deploy sip009-nft-trait first**:
   - Click "Upload Contract" or "New Contract"
   - Copy the contents of: `/home/ipeter/poap-stacks/packages/contracts/contracts/sip009-nft-trait.clar`
   - Paste into the editor
   - Contract name: `sip009-nft-trait`
   - Choose: **Testnet**
   - Click **Deploy**
   - Approve in wallet
   - **SAVE THE ADDRESS!** (e.g., `ST1ABC...XYZ.sip009-nft-trait`)

4. **Deploy poap contract**:
   - Click "Upload Contract" or "New Contract"
   - Copy the contents of: `/home/ipeter/poap-stacks/packages/contracts/contracts/poap.clar`
   - Paste into the editor
   - Contract name: `poap`
   - Choose: **Testnet**
   - Click **Deploy**
   - Approve in wallet
   - **SAVE THE ADDRESS!** (e.g., `ST1ABC...XYZ.poap`)

---

### Option 2: Use Stacks Explorer Direct Deploy

An even simpler alternative:

1. **Go to**: https://explorer.hiro.so/sandbox/deploy?chain=testnet

2. **Connect your wallet**

3. **Deploy sip009-nft-trait**:
   - Paste contract code
   - Name: `sip009-nft-trait`
   - Deploy
   - Save address

4. **Deploy poap**:
   - Paste contract code
   - Name: `poap`
   - Deploy
   - Save address

---

### Option 3: Use CLI with Manual Deployment (Advanced)

If you want to use the command line, we can deploy using stacks-cli:

```bash
# Install stacks-cli if not already installed
npm install -g @stacks/cli

# Deploy sip009-nft-trait
stx deploy_contract \
  packages/contracts/contracts/sip009-nft-trait.clar \
  sip009-nft-trait \
  2500 \
  0 \
  --testnet

# Then deploy poap
stx deploy_contract \
  packages/contracts/contracts/poap.clar \
  poap \
  2500 \
  0 \
  --testnet
```

---

## After Deployment:

Once you have both contract addresses, update your frontend:

```bash
cd /home/ipeter/poap-stacks
```

Edit `apps/web/lib/contracts-config.ts`:

```typescript
export const CONTRACTS = {
  TESTNET: {
    POAP: "ST1ABC123XYZ.poap", // ← Your deployed address
    NFT_TRAIT: "ST1ABC123XYZ.sip009-nft-trait", // ← Your deployed address
  },
};
```

Create `.env.local`:

```bash
echo "NEXT_PUBLIC_STACKS_NETWORK=testnet" > apps/web/.env.local
```

Test:

```bash
cd apps/web
npm run dev
```

---

## Quick Commands to Get Contract Contents:

```bash
# Copy sip009-nft-trait contract
cat /home/ipeter/poap-stacks/packages/contracts/contracts/sip009-nft-trait.clar

# Copy poap contract
cat /home/ipeter/poap-stacks/packages/contracts/contracts/poap.clar
```

The issue with Hiro Platform importing your project is likely because it's in a monorepo structure. Direct upload bypasses this completely!
