import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const walletAddress = body?.walletAddress?.trim();

    if (!walletAddress) {
      return NextResponse.json(
        { error: "walletAddress is required" },
        { status: 400 }
      );
    }

    // Find user first
    const existingUser = await prisma.user.findUnique({
      where: { walletAddress },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prepare update data
    const updateData: {
      username?: string;
      bio?: string;
      avatarUrl?: string;
      email?: string;
    } = {};

    if (body.username !== undefined) {
      const trimmedUsername = body.username?.trim();
      if (trimmedUsername) {
        // Check if username is already taken by another user
        const existingUsername = await prisma.user.findUnique({
          where: { username: trimmedUsername },
        });

        if (existingUsername && existingUsername.id !== existingUser.id) {
          return NextResponse.json(
            { error: "Username is already taken" },
            { status: 409 }
          );
        }
        updateData.username = trimmedUsername;
      } else {
        updateData.username = null as any; // Allow clearing username
      }
    }

    if (body.bio !== undefined) {
      updateData.bio = body.bio?.trim() || null as any;
    }

    if (body.avatarUrl !== undefined) {
      updateData.avatarUrl = body.avatarUrl?.trim() || null as any;
    }

    if (body.email !== undefined) {
      const trimmedEmail = body.email?.trim();
      if (trimmedEmail) {
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
          return NextResponse.json(
            { error: "Invalid email format" },
            { status: 400 }
          );
        }

        // Check if email is already taken by another user
        const existingEmail = await prisma.user.findUnique({
          where: { email: trimmedEmail },
        });

        if (existingEmail && existingEmail.id !== existingUser.id) {
          return NextResponse.json(
            { error: "Email is already taken" },
            { status: 409 }
          );
        }
        updateData.email = trimmedEmail;
      } else {
        updateData.email = null as any; // Allow clearing email
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { walletAddress },
      data: updateData,
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

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
