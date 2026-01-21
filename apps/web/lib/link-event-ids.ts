/**
 * Quick Fix Script: Link Database Events to Contract Event IDs
 * 
 * Usage: Run this in your browser console on the manage event page,
 * or modify and use in your Next.js API route
 */

export async function linkEventToContractId(eventId: string, contractEventId: number) {
  try {
    const response = await fetch(`/api/events/${eventId}/update-contract-id`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contractEventId }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Failed to update:", error);
      return { success: false, error: error.error };
    }

    const updated = await response.json();
    console.log("Event linked successfully:", updated);
    return { success: true, data: updated };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// Example usage:
// await linkEventToContractId("cmknn-5x-f8000", 1);

/**
 * Bulk fix: Link multiple events
 * If you've created multiple events, they'll have contract IDs 1, 2, 3, etc. in order
 */
export async function linkRecentEventsToContractIds() {
  try {
    // Get all events
    const eventsResponse = await fetch("/api/events");
    if (!eventsResponse.ok) throw new Error("Failed to fetch events");
    const events = await eventsResponse.json();

    // For each event without a contractEventId, try to assign sequential IDs
    // This is a simple approach - in production, you'd query the contract
    let contractId = 1;
    
    for (const event of events) {
      if (!event.contractEventId) {
        const result = await linkEventToContractId(event.id, contractId);
        if (result.success) {
          console.log(`✓ Linked ${event.title} to contract ID ${contractId}`);
          contractId++;
        } else {
          console.warn(`✗ Failed to link ${event.title}: ${result.error}`);
        }
      } else {
        console.log(`- ${event.title} already linked to contract ID ${event.contractEventId}`);
      }
    }

    console.log("Linking complete!");
  } catch (error) {
    console.error("Bulk linking failed:", error);
  }
}

// Usage in browser console:
// import { linkEventToContractId, linkRecentEventsToContractIds } from '@/lib/link-event-ids';
// await linkEventToContractId("cmknn-5x-f8000", 1);
// OR for bulk:
// await linkRecentEventsToContractIds();
