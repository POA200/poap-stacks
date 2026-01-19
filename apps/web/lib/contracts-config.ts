// Contract configuration
export const CONTRACTS = {
  TESTNET: {
    POAP: 'ST16R99CR18X1A20JBV0N546BH07HGWMKBRTCRK90.poap',
    NFT_TRAIT: 'ST16R99CR18X1A20JBV0N546BH07HGWMKBRTCRK90.sip009-nft-trait',
  },
  MAINNET: {
    POAP: 'SP000000000000000000002Q6VF78.poap', // Replace after mainnet deployment
    NFT_TRAIT: 'SP000000000000000000002Q6VF78.sip009-nft-trait',
  },
};

// Network configuration - Using object literals to avoid type issues
export const NETWORK_CONFIG = {
  testnet: {
    url: 'https://api.testnet.hiro.so',
    chainId: 0x80000000,
  },
  mainnet: {
    url: 'https://api.hiro.so',
    chainId: 0x00000001,
  },
} as const;

// Get current network configuration
export const getCurrentNetwork = (): 'testnet' | 'mainnet' => {
  const networkType = process.env.NEXT_PUBLIC_STACKS_NETWORK as 'testnet' | 'mainnet';
  return networkType || 'testnet';
};

// Get contract address for current network
export const getContractAddress = () => {
  const network = process.env.NEXT_PUBLIC_STACKS_NETWORK || 'testnet';
  return network === 'mainnet' ? CONTRACTS.MAINNET : CONTRACTS.TESTNET;
};

// Contract function names
export const CONTRACT_FUNCTIONS = {
  // Write functions
  CREATE_EVENT: 'create-event',
  CLAIM_BADGE: 'claim-badge',
  UPDATE_EVENT_STATUS: 'update-event-status',
  TRANSFER: 'transfer',
  
  // Read-only functions
  GET_EVENT: 'get-event',
  GET_LAST_TOKEN_ID: 'get-last-token-id',
  GET_TOKEN_URI: 'get-token-uri',
  GET_OWNER: 'get-owner',
  HAS_CLAIMED_BADGE: 'has-claimed-badge',
  GET_TOKEN_EVENT: 'get-token-event',
} as const;

// Explorer URL generator
export const getExplorerUrl = (txId: string) => {
  const network = process.env.NEXT_PUBLIC_STACKS_NETWORK || 'testnet';
  const chain = network === 'mainnet' ? 'mainnet' : 'testnet';
  return `https://explorer.hiro.so/txid/${txId}?chain=${chain}`;
};
