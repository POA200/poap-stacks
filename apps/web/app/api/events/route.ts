import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      where: {
        isActive: true,
      },
      include: {
        host: {
          select: {
            id: true,
            walletAddress: true,
            username: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: {
            claims: true,
          },
        },
      },
      orderBy: {
        startTime: "desc",
      },
    });

    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      startTime,
      endTime,
      claimOpensAt,
      claimClosesAt,
      bannerUrl,
      maxAttendees,
      walletAddress,
      txId,
      contractEventId,
    } = body;

    // Validate required fields
    if (!title || !startTime || !endTime || !walletAddress) {
      return NextResponse.json(
        { error: "Missing required fields: title, startTime, endTime, walletAddress" },
        { status: 400 }
      );
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { walletAddress },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { walletAddress },
      });
    }

    // Create event
    const event = await prisma.event.create({
      data: {
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        claimOpensAt: claimOpensAt ? new Date(claimOpensAt) : null,
        claimClosesAt: claimClosesAt ? new Date(claimClosesAt) : null,
        bannerUrl,
        maxAttendees,
        hostId: user.id,
        contractEventId: contractEventId ? parseInt(contractEventId) : null,
        contractAddress: txId, // Store transaction ID as reference
        isActive: true,
      },
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
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
