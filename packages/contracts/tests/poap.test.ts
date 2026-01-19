import { describe, it, expect, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";

describe("POAP Contract", () => {
  let deployer: string;
  let wallet1: string;

  beforeEach(async () => {
    deployer = simnet.getAccounts().get("deployer")!;
    wallet1 = simnet.getAccounts().get("wallet_1")!;
  });

  describe("Event Management", () => {
    it("should create an event", () => {
      const response = simnet.callPublicFn(
        "poap",
        "create-event",
        [
          Cl.stringUtf8("Bitcoin Conference 2026"),
          Cl.stringUtf8("Annual Bitcoin developer conference"),
          Cl.stringAscii("ipfs://Qm..."),
          Cl.uint(1),
          Cl.uint(2),
          Cl.uint(100),
        ],
        deployer
      );

      expect(response.result).toBeOk(Cl.uint(1));
    });

    it("should fail to create event with invalid params", () => {
      // start-time >= end-time should fail
      const response = simnet.callPublicFn(
        "poap",
        "create-event",
        [
          Cl.stringUtf8("Event"),
          Cl.stringUtf8("Description"),
          Cl.stringAscii("uri"),
          Cl.uint(2),
          Cl.uint(1), // end-time < start-time
          Cl.uint(10),
        ],
        deployer
      );

      expect(response.result).toBeErr(Cl.uint(108));
    });
  });

  describe("Badge Claiming", () => {
    it("should allow claiming a badge for an active event", () => {
      // Create event
      simnet.callPublicFn(
        "poap",
        "create-event",
        [
          Cl.stringUtf8("Event 1"),
          Cl.stringUtf8("Test event"),
          Cl.stringAscii("uri"),
          Cl.uint(1),
          Cl.uint(10),
          Cl.uint(100),
        ],
        deployer
      );

      // Claim badge
      const claimResponse = simnet.callPublicFn(
        "poap",
        "claim-badge",
        [Cl.uint(1)],
        wallet1
      );

      expect(claimResponse.result).toBeOk(Cl.uint(1));
    });

    it("should prevent double-claiming badges", () => {
      // Create event
      simnet.callPublicFn(
        "poap",
        "create-event",
        [
          Cl.stringUtf8("Event 2"),
          Cl.stringUtf8("Test event"),
          Cl.stringAscii("uri"),
          Cl.uint(1),
          Cl.uint(10),
          Cl.uint(100),
        ],
        deployer
      );

      // First claim
      simnet.callPublicFn(
        "poap",
        "claim-badge",
        [Cl.uint(1)],
        wallet1
      );

      // Second claim should fail
      const doubleClaimResponse = simnet.callPublicFn(
        "poap",
        "claim-badge",
        [Cl.uint(1)],
        wallet1
      );

      expect(doubleClaimResponse.result).toBeErr(Cl.uint(104));
    });
  });

  describe("SIP009 Trait Functions", () => {
    it("should return the correct last token id", () => {
      // Create event and claim badge
      simnet.callPublicFn(
        "poap",
        "create-event",
        [
          Cl.stringUtf8("Event 3"),
          Cl.stringUtf8("Test"),
          Cl.stringAscii("uri"),
          Cl.uint(1),
          Cl.uint(10),
          Cl.uint(100),
        ],
        deployer
      );

      simnet.callPublicFn(
        "poap",
        "claim-badge",
        [Cl.uint(1)],
        wallet1
      );

      const response = simnet.callReadOnlyFn("poap", "get-last-token-id", [], deployer);
      expect(response.result).toBeOk(Cl.uint(1));
    });

    it("should return token owner", () => {
      // Create event and claim badge
      simnet.callPublicFn(
        "poap",
        "create-event",
        [
          Cl.stringUtf8("Event 4"),
          Cl.stringUtf8("Test"),
          Cl.stringAscii("uri"),
          Cl.uint(1),
          Cl.uint(10),
          Cl.uint(100),
        ],
        deployer
      );

      simnet.callPublicFn(
        "poap",
        "claim-badge",
        [Cl.uint(1)],
        wallet1
      );

      const response = simnet.callReadOnlyFn(
        "poap",
        "get-owner",
        [Cl.uint(1)],
        deployer
      );
      // Should return Some(wallet1) address since wallet1 claimed the badge
      expect(response.result).toStrictEqual(Cl.ok(Cl.some(Cl.principal(wallet1))));
    });
  });

  describe("Event Status", () => {
    it("should allow organizer to update event status", () => {
      // Create event
      simnet.callPublicFn(
        "poap",
        "create-event",
        [
          Cl.stringUtf8("Event 5"),
          Cl.stringUtf8("Test"),
          Cl.stringAscii("uri"),
          Cl.uint(1),
          Cl.uint(10),
          Cl.uint(100),
        ],
        deployer
      );

      // Update status (deactivate)
      const response = simnet.callPublicFn(
        "poap",
        "update-event-status",
        [Cl.uint(1), Cl.bool(false)],
        deployer
      );

      expect(response.result).toBeOk(Cl.bool(true));
    });

    it("should prevent non-organizer from updating event status", () => {
      // Create event
      simnet.callPublicFn(
        "poap",
        "create-event",
        [
          Cl.stringUtf8("Event 6"),
          Cl.stringUtf8("Test"),
          Cl.stringAscii("uri"),
          Cl.uint(1),
          Cl.uint(10),
          Cl.uint(100),
        ],
        deployer
      );

      // Non-organizer tries to update
      const response = simnet.callPublicFn(
        "poap",
        "update-event-status",
        [Cl.uint(1), Cl.bool(false)],
        wallet1
      );

      expect(response.result).toBeErr(Cl.uint(106));
    });
  });
});
