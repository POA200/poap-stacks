"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
// Note: avoid top-level import of `@stacks/connect` to prevent
// provider injection races with wallet extensions in dev.

export default function WalletConnect() {
  const router = useRouter();
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSynced, setHasSynced] = useState(false);

  const syncUser = async (walletAddress: string) => {
    try {
      await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress }),
      });
      setHasSynced(true);
    } catch (error) {
      console.error("Failed to sync user:", error);
    }
  };

  useEffect(() => {
    // Check connection status on mount
    const checkConnection = () => {
      import("@stacks/connect")
        .then(({ isConnected, getLocalStorage }) => {
          const isWalletConnected = isConnected();
          setConnected(isWalletConnected);

          if (isWalletConnected) {
            const data = getLocalStorage();
            // Get STX testnet address (first STX address from the array)
            const stxAddress = data?.addresses?.stx?.[0]?.address;
            setAddress(stxAddress || null);
            setHasSynced(false);
          }
        })
        .catch((err) => {
          console.error("Stacks connect import failed:", err);
        });
    };

    checkConnection();
  }, []);

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      const { connect, getLocalStorage } = await import("@stacks/connect");
      await connect();

      // Get the stored data after connect
      const data = getLocalStorage();
      // Get STX testnet address (first STX address from the array)
      const stxAddress = data?.addresses?.stx?.[0]?.address;

      if (stxAddress) {
        setAddress(stxAddress);
        setConnected(true);
        setHasSynced(false);
        await syncUser(stxAddress);
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileClick = () => {
    router.push("/profile");
  };

  useEffect(() => {
    if (address && connected && !hasSynced) {
      syncUser(address);
    }
  }, [address, connected, hasSynced]);

  const getInitials = (addr: string): string => {
    return addr.slice(0, 2).toUpperCase();
  };

  const getSlicedAddress = (addr: string): string => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (connected && address) {
    return (
      <Button
        size="lg"
        variant="ghost"
        className="px-3 gap-2 cursor-pointer"
        onClick={handleProfileClick}
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          {getInitials(address)}
        </div>
        <span className="hidden sm:inline">{getSlicedAddress(address)}</span>
      </Button>
    );
  }

  return (
    <Button
      size="lg"
      className="px-5 gap-2 cursor-pointer"
      onClick={handleConnect}
      disabled={isLoading}
    >
      <Wallet className="h-4 w-4" />
      {isLoading ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
}
