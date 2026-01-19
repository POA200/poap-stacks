# 🎯 Deploy Using Hiro Platform (What You Have Open)

## You're already in the right place! Here's what to do:

### Step 1: Get Testnet STX

1. Open https://explorer.hiro.so/sandbox/faucet?chain=testnet
2. Connect your wallet
3. Click "Request STX"
4. Wait ~30 seconds for confirmation

### Step 2: Deploy in Hiro Platform (Where you are now!)

Looking at your screenshot, you're already on the right screen!

#### Deploy First Contract:

1. **Click on `sip009-nft-trait`** in the left sidebar (NOT poap yet)
2. Click the **"Generate Testnet Plan"** button
3. Select **Testnet** (not Devnet)
4. Click **Deploy**
5. Your wallet will popup - **Approve the transaction**
6. Wait for confirmation (~30 seconds)
7. **COPY AND SAVE THE CONTRACT ADDRESS** - it will look like:
   ```
   ST1ABC123XYZ.sip009-nft-trait
   ```

#### Deploy Second Contract:

1. **Click on `poap`** in the left sidebar
2. Click the **"Generate Testnet Plan"** button
3. Select **Testnet**
4. Click **Deploy**
5. Approve in wallet
6. Wait for confirmation
7. **COPY AND SAVE THIS CONTRACT ADDRESS TOO**:
   ```
   ST1ABC123XYZ.poap
   ```

### Step 3: Update Your Frontend

Once you have BOTH contract addresses, update your config:

```bash
cd /home/ipeter/poap-stacks
```

Open `apps/web/lib/contracts-config.ts` and replace:

```typescript
export const CONTRACTS = {
  TESTNET: {
    POAP: "YOUR_ADDRESS.poap", // ← Paste your poap address here
    NFT_TRAIT: "YOUR_ADDRESS.sip009-nft-trait", // ← Paste your trait address here
  },
};
```

### Step 4: Set Environment

```bash
echo "NEXT_PUBLIC_STACKS_NETWORK=testnet" > apps/web/.env.local
```

### Step 5: Test!

```bash
cd apps/web
npm run dev
```

## ⚠️ Important Notes:

- **Deploy sip009-nft-trait FIRST** (poap depends on it)
- **Both contracts must use the SAME deployer address** (they will automatically if you use the same wallet)
- **Save both contract addresses** - you'll need them for the config
- **The addresses will have the same prefix** (your wallet address)

## 🎉 That's it!

No need for CLI deployment or mnemonic configuration when using Hiro Platform!
