import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, username, bio, avatarUrl } = body;

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    // Upsert user: create if doesn't exist, update if exists
    const user = await prisma.user.upsert({
      where: {
        walletAddress,
      },
      update: {
        username: username || undefined,
        bio: bio || undefined,
        avatarUrl: avatarUrl || undefined,
        updatedAt: new Date(),
      },
      create: {
        walletAddress,
        username: username || null,
        bio: bio || null,
        avatarUrl: avatarUrl || null,
      },
    });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error upserting user:", error);
    return NextResponse.json(
      { error: "Failed to create or update user" },
      { status: 500 }
    );
  }
}
