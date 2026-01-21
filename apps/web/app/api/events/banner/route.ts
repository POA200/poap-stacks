import { NextRequest, NextResponse } from "next/server";

/**
 * Upload image to IPFS-compatible service
 * Supports Pinata (with JWT) or NFT.storage (fallback, no auth)
 */
async function uploadToIPFS(file: File): Promise<string> {
  const pinataJwt = process.env.PINATA_JWT;
  const nftStorageKey = process.env.NFT_STORAGE_KEY;
  
  // Try Pinata first if JWT is available
  if (pinataJwt) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${pinataJwt}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json() as { IpfsHash: string };
        return `ipfs://${data.IpfsHash}`;
      }
    } catch (e) {
      console.warn("Pinata upload failed, trying NFT.storage:", e);
    }
  }

  // Fallback to NFT.storage
  if (nftStorageKey) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("https://api.nft.storage/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${nftStorageKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`NFT.storage upload failed: ${error}`);
    }

    const data = await response.json() as { value: { cid: string } };
    return `ipfs://${data.value.cid}`;
  }

  throw new Error(
    "IPFS upload not configured. Please set PINATA_JWT or NFT_STORAGE_KEY environment variable."
  );
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // Validate file size (5MB max for IPFS services)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    // Upload to IPFS
    const ipfsUrl = await uploadToIPFS(file);

    // Return IPFS URL (max 256 chars, well within contract limit)
    return NextResponse.json(
      { url: ipfsUrl },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading banner:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload banner" },
      { status: 500 }
    );
  }
}
