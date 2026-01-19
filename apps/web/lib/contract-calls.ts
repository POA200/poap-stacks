import { openContractCall } from '@stacks/connect';
import {
  AnchorMode,
  PostConditionMode,
  stringUtf8CV,
  uintCV,
  stringAsciiCV,
  principalCV,
  boolCV,
  cvToJSON,
  fetchCallReadOnlyFunction,
} from '@stacks/transactions';
import {
  getCurrentNetwork,
  getContractAddress,
  CONTRACT_FUNCTIONS,
} from './contracts-config';

// Helper to parse contract address
const parseContractAddress = (contractId: string) => {
  const [address, name] = contractId.split('.');
  return { address, name };
};

/**
 * Create a new event
 */
export const createEvent = async ({
  name,
  description,
  imageUri,
  startTime,
  endTime,
  maxAttendees,
  onFinish,
  onCancel,
}: {
  name: string;
  description: string;
  imageUri: string;
  startTime: number;
  endTime: number;
  maxAttendees: number;
  onFinish?: (data: { txId: string }) => void;
  onCancel?: () => void;
}) => {
  const network = getCurrentNetwork();
  const { POAP } = getContractAddress();
  const { address, name: contractName } = parseContractAddress(POAP);

  const functionArgs = [
    stringUtf8CV(name),
    stringUtf8CV(description),
    stringAsciiCV(imageUri),
    uintCV(startTime),
    uintCV(endTime),
    uintCV(maxAttendees),
  ];

  await openContractCall({
    network,
    anchorMode: AnchorMode.Any,
    contractAddress: address,
    contractName,
    functionName: CONTRACT_FUNCTIONS.CREATE_EVENT,
    functionArgs,
    postConditionMode: PostConditionMode.Deny,
    postConditions: [],
    onFinish,
    onCancel,
  });
};

/**
 * Claim a badge for an event
 */
export const claimBadge = async ({
  eventId,
  onFinish,
  onCancel,
}: {
  eventId: number;
  onFinish?: (data: { txId: string }) => void;
  onCancel?: () => void;
}) => {
  const network = getCurrentNetwork();
  const { POAP } = getContractAddress();
  const { address, name: contractName } = parseContractAddress(POAP);

  const functionArgs = [uintCV(eventId)];

  await openContractCall({
    network,
    anchorMode: AnchorMode.Any,
    contractAddress: address,
    contractName,
    functionName: CONTRACT_FUNCTIONS.CLAIM_BADGE,
    functionArgs,
    postConditionMode: PostConditionMode.Deny,
    postConditions: [],
    onFinish,
    onCancel,
  });
};

/**
 * Update event status (activate/deactivate)
 */
export const updateEventStatus = async ({
  eventId,
  active,
  onFinish,
  onCancel,
}: {
  eventId: number;
  active: boolean;
  onFinish?: (data: { txId: string }) => void;
  onCancel?: () => void;
}) => {
  const network = getCurrentNetwork();
  const { POAP } = getContractAddress();
  const { address, name: contractName } = parseContractAddress(POAP);

  const functionArgs = [uintCV(eventId), boolCV(active)];

  await openContractCall({
    network,
    anchorMode: AnchorMode.Any,
    contractAddress: address,
    contractName,
    functionName: CONTRACT_FUNCTIONS.UPDATE_EVENT_STATUS,
    functionArgs,
    postConditionMode: PostConditionMode.Deny,
    postConditions: [],
    onFinish,
    onCancel,
  });
};

/**
 * Read-only: Get event details
 */
export const getEvent = async (eventId: number) => {
  const network = getCurrentNetwork();
  const { POAP } = getContractAddress();
  const { address, name: contractName } = parseContractAddress(POAP);

  const result = await fetchCallReadOnlyFunction({
    network,
    contractAddress: address,
    contractName,
    functionName: CONTRACT_FUNCTIONS.GET_EVENT,
    functionArgs: [uintCV(eventId)],
    senderAddress: address,
  });

  return cvToJSON(result);
};

/**
 * Read-only: Check if user has claimed badge
 */
export const hasClaimedBadge = async (
  eventId: number,
  userAddress: string
) => {
  const network = getCurrentNetwork();
  const { POAP } = getContractAddress();
  const { address, name: contractName } = parseContractAddress(POAP);

  const result = await fetchCallReadOnlyFunction({
    network,
    contractAddress: address,
    contractName,
    functionName: CONTRACT_FUNCTIONS.HAS_CLAIMED_BADGE,
    functionArgs: [uintCV(eventId), principalCV(userAddress)],
    senderAddress: address,
  });

  return cvToJSON(result);
};

/**
 * Read-only: Get last token ID
 */
export const getLastTokenId = async () => {
  const network = getCurrentNetwork();
  const { POAP } = getContractAddress();
  const { address, name: contractName } = parseContractAddress(POAP);

  const result = await fetchCallReadOnlyFunction({
    network,
    contractAddress: address,
    contractName,
    functionName: CONTRACT_FUNCTIONS.GET_LAST_TOKEN_ID,
    functionArgs: [],
    senderAddress: address,
  });

  return cvToJSON(result);
};

/**
 * Read-only: Get token owner
 */
export const getTokenOwner = async (tokenId: number) => {
  const network = getCurrentNetwork();
  const { POAP } = getContractAddress();
  const { address, name: contractName } = parseContractAddress(POAP);

  const result = await fetchCallReadOnlyFunction({
    network,
    contractAddress: address,
    contractName,
    functionName: CONTRACT_FUNCTIONS.GET_OWNER,
    functionArgs: [uintCV(tokenId)],
    senderAddress: address,
  });

  return cvToJSON(result);
};

/**
 * Read-only: Get token URI
 */
export const getTokenUri = async (tokenId: number) => {
  const network = getCurrentNetwork();
  const { POAP } = getContractAddress();
  const { address, name: contractName } = parseContractAddress(POAP);

  const result = await fetchCallReadOnlyFunction({
    network,
    contractAddress: address,
    contractName,
    functionName: CONTRACT_FUNCTIONS.GET_TOKEN_URI,
    functionArgs: [uintCV(tokenId)],
    senderAddress: address,
  });

  return cvToJSON(result);
};
