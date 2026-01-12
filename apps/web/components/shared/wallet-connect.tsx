"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { connect, isConnected, getLocalStorage } from "@stacks/connect";

export default function WalletConnect() {
  const router = useRouter();
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check connection status on mount
    const checkConnection = () => {
      const isWalletConnected = isConnected();
      setConnected(isWalletConnected);

      if (isWalletConnected) {
        const data = getLocalStorage();
        // Get STX testnet address (first STX address from the array)
        const stxAddress = data?.addresses?.stx?.[0]?.address;
        setAddress(stxAddress || null);
      }
    };

    checkConnection();
  }, []);

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      await connect();

      // Get the stored data after connect
      const data = getLocalStorage();
      // Get STX testnet address (first STX address from the array)
      const stxAddress = data?.addresses?.stx?.[0]?.address;

      if (stxAddress) {
        setAddress(stxAddress);
        setConnected(true);
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

  const getInitials = (addr: string) => {
    return addr.slice(0, 2).toUpperCase();
  };

  const getSlicedAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (connected && address) {
    return (
      <Button
        size="lg"
        variant="outline"
        className="px-3 gap-2"
        onClick={handleProfileClick}
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
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
