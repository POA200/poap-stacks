# 🎯 POAP Stacks - Smart Contract Integration

This document explains how the frontend integrates with the Clarity smart contracts.

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                   Next.js Frontend                  │
│  ┌─────────────────────────────────────────────┐   │
│  │   React Components (UI Layer)                │   │
│  │   - Event Pages, Profile, Badges             │   │
│  └──────────────────┬──────────────────────────┘   │
│                     │                               │
│  ┌──────────────────▼──────────────────────────┐   │
│  │   Contract Calls (lib/contract-calls.ts)    │   │
│  │   - claimBadge(), createEvent()              │   │
│  │   - hasClaimedBadge(), getEvent()            │   │
│  └──────────────────┬──────────────────────────┘   │
│                     │                               │
│  ┌──────────────────▼──────────────────────────┐   │
│  │   Config (lib/contracts-config.ts)          │   │
│  │   - Contract addresses, network settings     │   │
│  └──────────────────┬──────────────────────────┘   │
└────────────────────┼────────────────────────────────┘
                     │
                     │ @stacks/connect
                     │ @stacks/transactions
                     │
┌────────────────────▼────────────────────────────────┐
│            Stacks Blockchain                        │
│  ┌──────────────────────────────────────────────┐  │
│  │   poap.clar (Smart Contract)                 │  │
│  │   - create-event, claim-badge                │  │
│  │   - SIP009 NFT implementation                │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

## Key Files

### 1. `lib/contracts-config.ts` - Configuration Layer

**Purpose**: Central configuration for contract addresses and network settings.

```typescript
export const CONTRACTS = {
  TESTNET: {
    POAP: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.poap",
    NFT_TRAIT: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.sip009-nft-trait",
  },
  MAINNET: {
    POAP: "SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.poap",
    NFT_TRAIT: "SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.sip009-nft-trait",
  },
};
```

**Functions**:

- `getCurrentNetwork()` - Returns StacksTestnet or StacksMainnet based on env
- `getContractAddress()` - Returns correct contract addresses for current network
- `getExplorerUrl(txId)` - Generates explorer URL for transactions

### 2. `lib/contract-calls.ts` - Smart Contract Interface

**Purpose**: Wrapper functions for all smart contract interactions.

#### Write Functions (Requires Wallet Signature)

```typescript
// Claim a badge for an event
await claimBadge({
  eventId: 1,
  onFinish: (data) => {
    console.log("Transaction ID:", data.txId);
    // Update UI, show success message
  },
  onCancel: () => {
    console.log("User cancelled transaction");
  },
});
```

```typescript
// Create a new event (admin only)
await createEvent({
  name: "ETHDenver 2024",
  description: "Largest Ethereum event",
  imageUri: "ipfs://...",
  startTime: 1234567890,
  endTime: 1234567990,
  maxAttendees: 1000,
  onFinish: (data) => console.log("Event created!", data),
});
```

```typescript
// Update event status (activate/deactivate)
await updateEventStatus({
  eventId: 1,
  active: true,
  onFinish: (data) => console.log("Event activated", data),
});
```

#### Read Functions (No Wallet Required)

```typescript
// Check if user has claimed badge
const result = await hasClaimedBadge(eventId, userAddress);
console.log("Claimed:", result.value); // true or false
```

```typescript
// Get event details
const event = await getEvent(eventId);
console.log("Event:", event);
// Returns: { name, description, image-uri, start-time, end-time, ... }
```

```typescript
// Get NFT owner
const owner = await getTokenOwner(tokenId);
console.log("Owner address:", owner);
```

```typescript
// Get token URI for metadata
const uri = await getTokenUri(tokenId);
console.log("Metadata URI:", uri);
```

### 3. `app/events/[id]/page.tsx` - Event Page with Claim Button

**Integration Example**:

```typescript
const handleClaim = async () => {
  try {
    setClaimStatus("checking");

    // Check if already claimed
    const { hasClaimedBadge } = await import("@/lib/contract-calls");
    const claimed = await hasClaimedBadge(eventId, walletAddress);

    if (claimed.value === true) {
      setClaimStatus("already-claimed");
      return;
    }

    // Claim badge
    const { claimBadge } = await import("@/lib/contract-calls");
    await claimBadge({
      eventId,
      onFinish: (data) => {
        setTxId(data.txId);
        setClaimStatus("success");
      },
      onCancel: () => {
        setClaimStatus("idle");
      },
    });
  } catch (error) {
    setClaimStatus("error");
  }
};
```

## Smart Contract Functions

The Clarity contract (`packages/contracts/contracts/poap.clar`) exposes these functions:

### Public Functions (Write)

| Function              | Parameters                                                        | Description                            |
| --------------------- | ----------------------------------------------------------------- | -------------------------------------- |
| `create-event`        | name, description, image-uri, start-time, end-time, max-attendees | Create new event (owner only)          |
| `claim-badge`         | event-id                                                          | Claim attendance badge for event       |
| `update-event-status` | event-id, active                                                  | Activate/deactivate event (owner only) |
| `transfer`            | token-id, sender, recipient                                       | Transfer NFT to another user           |

### Read-Only Functions (Query)

| Function            | Parameters     | Returns                                        |
| ------------------- | -------------- | ---------------------------------------------- |
| `get-event`         | event-id       | Event details (name, description, times, etc.) |
| `has-claimed-badge` | event-id, user | Boolean - whether user claimed                 |
| `get-last-token-id` | -              | Latest minted token ID                         |
| `get-owner`         | token-id       | Principal (address) of NFT owner               |
| `get-token-uri`     | token-id       | Metadata URI for token                         |

## Data Flow: Claiming a Badge

```
1. User clicks "Claim Badge" button
   ↓
2. Frontend checks if wallet connected
   ↓
3. Call hasClaimedBadge() to verify not already claimed
   ↓
4. Call claimBadge() which opens wallet popup
   ↓
5. User signs transaction in wallet
   ↓
6. Transaction submitted to Stacks blockchain
   ↓
7. onFinish callback triggered with transaction ID
   ↓
8. Frontend updates UI with success message
   ↓
9. ~10 minutes later: transaction confirmed
   ↓
10. NFT appears in user's wallet and profile
```

## Environment Configuration

Create `.env.local` in `apps/web/`:

```bash
# Network: 'testnet' or 'mainnet'
NEXT_PUBLIC_STACKS_NETWORK=testnet

# Database (Prisma)
DATABASE_URL="postgresql://..."
```

## Error Handling

Common errors and solutions:

### Contract Not Found

```typescript
// Error: Contract principal not found
// Solution: Verify contract addresses in contracts-config.ts
```

### Transaction Failed

```typescript
// Error: (err u104) - Already claimed
// Solution: Check hasClaimedBadge() before claiming

// Error: (err u103) - Event not active
// Solution: Verify event.active === true

// Error: (err u101) - Unauthorized
// Solution: Only contract owner can create events
```

### Wallet Errors

```typescript
// Error: User cancelled transaction
// Solution: Handle in onCancel callback

// Error: Insufficient funds
// Solution: User needs STX for gas fees
```

## Testing Integration

### 1. Local Development

Run contract tests:

```bash
cd packages/contracts
npm test  # All 8 tests should pass
```

Run frontend:

```bash
cd apps/web
npm run dev
```

### 2. Testnet Testing

1. Deploy contracts to testnet (see DEPLOYMENT_GUIDE.md)
2. Update contract addresses in `contracts-config.ts`
3. Get testnet STX from faucet
4. Test claiming badges
5. Verify NFTs in Stacks Explorer

### 3. Mainnet Deployment

1. Audit contracts (recommended)
2. Deploy to mainnet
3. Update `NEXT_PUBLIC_STACKS_NETWORK=mainnet`
4. Update mainnet contract addresses
5. Test with small events first

## Performance Considerations

### Transaction Times

- Testnet: ~10 minutes per block
- Mainnet: ~10 minutes per block
- Use pending states in UI

### Read Operations

- Read-only functions are instant
- No gas fees for reads
- Cache results when possible

### Gas Costs

- Claiming badge: ~0.01-0.05 STX
- Creating event: ~0.1-0.5 STX
- Varies by network congestion

## Security Best Practices

✅ **Implemented**:

- Double-claim prevention in smart contract
- Event authorization checks
- SIP009 standard compliance
- All tests passing (8/8)

⚠️ **Recommendations**:

- Professional audit before mainnet
- Rate limiting on API endpoints
- Input validation on all forms
- Secure database credentials
- HTTPS in production

## Monitoring & Analytics

### Transaction Tracking

```typescript
import { getExplorerUrl } from "@/lib/contracts-config";

// After successful claim
const explorerUrl = getExplorerUrl(txId);
console.log("View transaction:", explorerUrl);
// Opens: https://explorer.hiro.so/txid/0x...?chain=testnet
```

### Event Metrics

Track in your database:

- Total claims per event
- Claim timestamps
- User participation
- NFT token IDs

## Future Enhancements

Potential additions:

- [ ] Batch claiming for multiple events
- [ ] Event categories and tags
- [ ] Badge rarity tiers on-chain
- [ ] Secondary marketplace integration
- [ ] Event analytics dashboard
- [ ] QR code scanning for claims
- [ ] Social sharing with NFT preview

## Resources

- [Stacks.js Documentation](https://docs.stacks.co/stacks.js/)
- [Clarity Language Reference](https://docs.stacks.co/clarity/)
- [SIP009 NFT Standard](https://github.com/stacksgov/sips/blob/main/sips/sip-009/sip-009-nft-standard.md)
- [Hiro Platform](https://platform.hiro.so)
- [Stacks Explorer](https://explorer.hiro.so)

## Support

For issues or questions:

1. Check this documentation
2. Review DEPLOYMENT_GUIDE.md
3. Check contract tests in `packages/contracts/tests/`
4. Visit [Stacks Discord](https://discord.gg/stacks)
