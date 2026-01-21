import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        host: {
          select: {
            id: true,
            walletAddress: true,
            username: true,
            avatarUrl: true,
          },
        },
        claims: {
          include: {
            user: {
              select: {
                walletAddress: true,
                username: true,
              },
            },
          },
          orderBy: {
            claimedAt: "desc",
          },
          take: 10, // Get last 10 claims
        },
        _count: {
          select: {
            claims: true,
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}
