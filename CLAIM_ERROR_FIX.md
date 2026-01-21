# Claim Error Fix: Unable to Claim - Invalid Value

## Problem

When trying to claim a badge, you get the error:

```
Unable to Claim
Invalid value. Values of type 'number' must be an integer.
```

## Root Cause

The event hasn't been linked to its on-chain contract event ID yet. The smart contract tracks events with numeric IDs (1, 2, 3, etc.), but the database stores events with CUID strings. We need to connect them.

## Solution

### How to Get Your Contract Event ID

1. **After Creating the Event**: When you create an event on-chain, the smart contract assigns it a numeric ID starting from 1
2. **Check Explorer**: Visit the Stacks blockchain explorer to find your event's on-chain ID from the transaction
3. **Or Use the Contract**: Call `get-last-event-id` on the POAP contract to see the most recent event ID

### Update Your Event (Temporary Workaround)

For now, you can manually set the contract event ID by sending a PATCH request:

```bash
curl -X PATCH "http://localhost:3000/api/events/[EVENT_ID]/update-contract-id" \
  -H "Content-Type: application/json" \
  -d '{"contractEventId": 1}'
```

Replace:

- `[EVENT_ID]` with your event's database ID (e.g., `cmknn-5x-f8000`)
- `1` with the on-chain event ID

### Permanent Fix (In Development)

We're implementing automatic tracking of contract event IDs. After creating an event:

1. The transaction will be monitored
2. The contract event ID will be automatically extracted
3. Your database event will be updated with this ID
4. You'll be able to claim immediately

## Current Event ID

If your event database ID is `cmknn-5x-f8000`, you need to find its corresponding on-chain ID (likely `1` if it's the first event created).

## Need Help?

Check the manage page for your event - soon there will be a UI to set or fetch the contract event ID automatically.
