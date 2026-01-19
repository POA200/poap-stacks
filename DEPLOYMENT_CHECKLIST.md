# 🚀 Quick Deployment Checklist

Use this checklist to deploy your POAP smart contracts and integrate with the frontend.

## ☑️ Pre-Deployment

- [ ] All tests passing: `cd packages/contracts && npm test`
- [ ] Clarinet installed: `clarinet --version`
- [ ] Stacks wallet installed (Hiro or Leather)
- [ ] Testnet STX in wallet ([Get from faucet](https://explorer.hiro.so/sandbox/faucet?chain=testnet))

## ☑️ Deploy Contracts

### Testnet Deployment

```bash
cd packages/contracts

# Generate deployment plan
clarinet deployments generate --testnet

# Deploy contracts
clarinet deployments apply -p deployments/default.testnet-plan.yaml
```

- [ ] `sip009-nft-trait.clar` deployed
- [ ] `poap.clar` deployed
- [ ] Contract addresses saved

**Your addresses**:

```
sip009-nft-trait: _______________________________
poap:             _______________________________
```

## ☑️ Configure Frontend

### Update Contract Addresses

Edit `apps/web/lib/contracts-config.ts`:

```typescript
export const CONTRACTS = {
  TESTNET: {
    POAP: "YOUR_ADDRESS.poap", // ← Update
    NFT_TRAIT: "YOUR_ADDRESS.sip009-nft-trait", // ← Update
  },
};
```

- [ ] Updated `POAP` address
- [ ] Updated `NFT_TRAIT` address

### Set Environment Variables

Create `apps/web/.env.local`:

```bash
NEXT_PUBLIC_STACKS_NETWORK=testnet
DATABASE_URL="your-database-connection-string"
```

- [ ] `.env.local` created
- [ ] Network set to `testnet`
- [ ] Database URL configured

## ☑️ Test Integration

```bash
# From project root
npm install
npm run dev
```

Open `http://localhost:3000`:

- [ ] App loads without errors
- [ ] Connect wallet successfully
- [ ] Navigate to event page
- [ ] Click "Claim Badge"
- [ ] Wallet popup appears
- [ ] Transaction submitted
- [ ] Success message shown

## ☑️ Verify On-Chain

Check transaction in Stacks Explorer:

```
https://explorer.hiro.so/txid/YOUR_TX_ID?chain=testnet
```

- [ ] Transaction confirmed
- [ ] NFT appears in wallet
- [ ] Badge shows in `/profile`
- [ ] Token visible in Explorer

## ☑️ Production Ready

For mainnet deployment:

- [ ] Contracts audited (recommended)
- [ ] Extensive testnet testing completed
- [ ] Frontend bugs fixed
- [ ] Database backed up
- [ ] Monitoring setup
- [ ] Deploy contracts to mainnet
- [ ] Update `NEXT_PUBLIC_STACKS_NETWORK=mainnet`
- [ ] Update mainnet contract addresses
- [ ] Deploy frontend to hosting (Vercel/Netlify)

## 📊 Post-Deployment

- [ ] Monitor first few transactions
- [ ] Check gas costs
- [ ] Verify NFT metadata
- [ ] Test on different wallets
- [ ] Collect user feedback

## 🆘 Troubleshooting

**Contract not found**: Check addresses in `contracts-config.ts`  
**Transaction fails**: Verify STX balance and event status  
**Wallet won't connect**: Try incognito mode or different browser  
**Long wait times**: Testnet blocks take ~10 minutes

## 📚 Documentation

- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Full deployment instructions
- [SMART_CONTRACT_INTEGRATION.md](./SMART_CONTRACT_INTEGRATION.md) - Integration details
- [packages/contracts/README.md](./packages/contracts/README.md) - Contract documentation

## ✅ Success Indicators

You're fully deployed when:

- ✅ Contracts deployed and verified on Explorer
- ✅ Frontend connects to correct network
- ✅ Users can claim badges successfully
- ✅ NFTs appear in wallets
- ✅ Profile page displays claimed badges
- ✅ No console errors in browser

---

**Need Help?**

- Read full documentation: `DEPLOYMENT_GUIDE.md`
- Check integration guide: `SMART_CONTRACT_INTEGRATION.md`
- Visit [Stacks Discord](https://discord.gg/stacks)
