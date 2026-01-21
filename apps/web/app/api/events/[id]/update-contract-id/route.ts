import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { contractEventId } = body;

    if (!contractEventId || isNaN(parseInt(contractEventId))) {
      return NextResponse.json(
        { error: "Valid contractEventId is required" },
        { status: 400 }
      );
    }

    const event = await prisma.event.update({
      where: { id },
      data: {
        contractEventId: parseInt(contractEventId),
      },
    });

    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    console.error("Error updating event contract ID:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}
