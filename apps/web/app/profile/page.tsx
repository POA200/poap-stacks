"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Unlink } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { disconnect, isConnected, getLocalStorage } from "@stacks/connect";

export default function ProfilePage() {
  const router = useRouter();
  const [address, setAddress] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

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
      } else {
        // Redirect to home if not connected
        router.push("/");
      }
    };

    checkConnection();
  }, [router]);

  const handleDisconnect = () => {
    disconnect();
    setConnected(false);
    setAddress(null);
    // Reload and redirect to landing page
    window.location.href = "/";
  };

  if (!connected) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Profile & Settings</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Wallet Information</CardTitle>
            <CardDescription>Your connected wallet details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Wallet Address</p>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <code className="text-sm font-mono">{address}</code>
              </div>
            </div>

            <div className="pt-4">
              <Button
                variant="destructive"
                className="gap-2"
                onClick={handleDisconnect}
              >
                <Unlink className="h-4 w-4" />
                Disconnect
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
            <CardDescription>
              Manage your POAP profile and settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Event History</h3>
                <p className="text-sm text-muted-foreground">
                  View all events you&apos;ve attended
                </p>
              </div>
              <Button variant="outline" disabled>
                Coming Soon
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Badge Collection</h3>
                <p className="text-sm text-muted-foreground">
                  Browse your earned badges
                </p>
              </div>
              <Button variant="outline" disabled>
                Coming Soon
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  Manage your notification preferences
                </p>
              </div>
              <Button variant="outline" disabled>
                Coming Soon
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Badges</CardTitle>
            <CardDescription>
              View all badges you&apos;ve earned from attending events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground text-sm">
                  No badges yet
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
