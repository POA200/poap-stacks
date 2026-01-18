"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
// Note: avoid top-level import of `@stacks/connect` to prevent
// provider injection races with wallet extensions in dev.

interface UserProfile {
  username: string | null;
  avatarUrl: string | null;
}

export default function WalletConnect() {
  const router = useRouter();
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSynced, setHasSynced] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

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

  const fetchUserProfile = async (walletAddress: string) => {
    try {
      const response = await fetch(`/api/user/${walletAddress}`);
      if (response.ok) {
        const data = await response.json();
        setUserProfile({
          username: data.username,
          avatarUrl: data.avatarUrl,
        });
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
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

  useEffect(() => {
    if (address && connected) {
      fetchUserProfile(address);
    }
  }, [address, connected]);

  const getInitials = (addr: string): string => {
    return addr.slice(0, 2).toUpperCase();
  };

  const getSlicedAddress = (addr: string): string => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getDefaultUsername = (addr: string): string => {
    return `User-${addr.slice(-4)}`;
  };

  if (connected && address) {
    const displayUsername =
      userProfile?.username || getDefaultUsername(address);
    const displayAvatar = userProfile?.avatarUrl;

    return (
      <Button
        size="lg"
        variant="ghost"
        className="px-2 gap-3 cursor-pointer h-auto py-1.5"
        onClick={handleProfileClick}
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary text-xs font-semibold flex-shrink-0 overflow-hidden">
          {displayAvatar ? (
            <Image
              src={displayAvatar}
              alt={displayUsername}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          ) : (
            getInitials(address)
          )}
        </div>
        <div className="hidden sm:flex flex-col items-start">
          <span className="text-sm font-medium leading-tight">
            {displayUsername}
          </span>
          <span className="text-xs text-muted-foreground">
            {getSlicedAddress(address)}
          </span>
        </div>
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
