import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const walletAddress = body?.walletAddress?.trim();

    if (!walletAddress) {
      return NextResponse.json(
        { error: "walletAddress is required" },
        { status: 400 }
      );
    }

    const username = body?.username?.trim() || null;
    const avatarUrl = body?.avatarUrl?.trim() || null;
    const email = body?.email?.trim() || null;
    const bio = body?.bio?.trim() || null;

    const user = await prisma.user.upsert({
      where: { walletAddress },
      create: {
        walletAddress,
        username,
        avatarUrl,
        email,
        bio,
      },
      update: {
        username: username ?? undefined,
        avatarUrl: avatarUrl ?? undefined,
        email: email ?? undefined,
        bio: bio ?? undefined,
      },
      include: {
        hostedEvents: {
          include: { _count: { select: { claims: true } } },
          orderBy: { createdAt: "desc" },
        },
        claims: {
          include: {
            event: {
              include: {
                host: {
                  select: {
                    id: true,
                    walletAddress: true,
                    username: true,
                    avatarUrl: true,
                  },
                },
              },
            },
          },
          orderBy: { claimedAt: "desc" },
        },
      },
    });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error upserting user:", error);
    return NextResponse.json(
      { error: "Failed to upsert user" },
      { status: 500 }
    );
  }
}
