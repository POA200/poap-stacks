import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Convert IPFS URI to HTTP gateway URL
 * @param uri - IPFS URI (ipfs://QmXxxx...) or regular HTTP URL
 * @returns HTTP URL that can be rendered in browsers
 */
export function ipfsToHttp(uri: string | null | undefined): string | null {
  if (!uri) return null;
  
  // If already HTTP(S), return as is
  if (uri.startsWith('http://') || uri.startsWith('https://')) {
    return uri;
  }
  
  // Convert IPFS URI to HTTP gateway URL
  if (uri.startsWith('ipfs://')) {
    const hash = uri.replace('ipfs://', '');
    // Use Pinata gateway (fast and reliable)
    return `https://gateway.pinata.cloud/ipfs/${hash}`;
  }
  
  // If it's just a hash without prefix
  if (uri.startsWith('Qm') || uri.startsWith('bafy')) {
    return `https://gateway.pinata.cloud/ipfs/${uri}`;
  }
  
  return uri;
}
