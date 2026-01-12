"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Copy,
  Edit,
  Unlink,
  Download,
  Bell,
  Lock,
  Settings,
  Wallet,
  Plus,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { disconnect, isConnected, getLocalStorage } from "@stacks/connect";

type TabType = "general" | "wallets" | "notifications" | "privacy";

interface ProfileState {
  displayName: string;
  bio: string;
  bnsName: string;
}

interface NotificationPreferences {
  claimSuccess: boolean;
  newAirdrops: boolean;
  windowOpening: boolean;
  platformUpdates: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const [address, setAddress] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [copied, setCopied] = useState(false);

  // Profile state
  const [profile, setProfile] = useState<ProfileState>({
    displayName: "Anonymous Collector",
    bio: "",
    bnsName: "",
  });
  const [profileEdited, setProfileEdited] = useState(false);

  // Notification state
  const [notifications, setNotifications] = useState<NotificationPreferences>({
    claimSuccess: true,
    newAirdrops: true,
    windowOpening: false,
    platformUpdates: true,
  });

  // Privacy state
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    const checkConnection = () => {
      const isWalletConnected = isConnected();
      setConnected(isWalletConnected);

      if (isWalletConnected) {
        const data = getLocalStorage();
        const stxAddress = data?.addresses?.stx?.[0]?.address;
        setAddress(stxAddress || null);
      } else {
        router.push("/");
      }
    };

    checkConnection();
  }, [router]);

  const handleDisconnect = () => {
    disconnect();
    setConnected(false);
    setAddress(null);
    window.location.href = "/";
  };

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const truncateAddress = (addr: string): string => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleProfileChange = (field: keyof ProfileState, value: string) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
    setProfileEdited(true);
  };

  const handleSaveProfile = () => {
    // TODO: Persist profile to backend/storage
    setProfileEdited(false);
  };

  const handleNotificationChange = (key: keyof NotificationPreferences) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleExportHistory = () => {
    // TODO: Implement export functionality
    const data = {
      address,
      exportedAt: new Date().toISOString(),
      eventHistory: [],
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `poap-history-${address?.slice(-4)}.json`;
    a.click();
  };

  if (!connected || !address) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Profile Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="flex items-center justify-between gap-6">
            {/* Left: Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-white text-2xl font-bold">
                {profile.displayName.charAt(0).toUpperCase()}
              </div>
              <button className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors">
                <Edit className="h-4 w-4" />
              </button>
            </div>

            {/* Center: User Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-foreground">
                {profile.displayName}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <code className="text-sm font-mono text-muted-foreground">
                  {truncateAddress(address)}
                </code>
                <button
                  onClick={handleCopyAddress}
                  className="p-1 hover:bg-muted rounded transition-colors"
                  title={copied ? "Copied!" : "Copy address"}
                >
                  <Copy className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Right: Wallet Status & Disconnect */}
            <div className="flex flex-col items-end gap-3 flex-shrink-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 text-xs font-medium">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                Connected
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="gap-2"
                onClick={handleDisconnect}
              >
                <Unlink className="h-4 w-4" />
                Disconnect
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex gap-8">
            {(
              [
                { id: "general", label: "General", icon: Settings },
                { id: "wallets", label: "Wallets", icon: Wallet },
                { id: "notifications", label: "Notifications", icon: Bell },
                { id: "privacy", label: "Privacy", icon: Lock },
              ] as const
            ).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* General Tab */}
        {activeTab === "general" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Manage your public profile details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Display Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={profile.displayName}
                    onChange={(e) =>
                      handleProfileChange("displayName", e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Your display name"
                  />
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">
                      Bio
                    </label>
                    <span className="text-xs text-muted-foreground">
                      {profile.bio.length}/160
                    </span>
                  </div>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => {
                      const value = e.target.value.slice(0, 160);
                      handleProfileChange("bio", value);
                    }}
                    maxLength={160}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {/* BNS Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Stacks Name
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={profile.bnsName}
                      readOnly
                      className="flex-1 px-3 py-2 border rounded-md bg-muted text-foreground cursor-not-allowed"
                      placeholder="Not set"
                    />
                    <a
                      href="https://www.stacks.co/bns"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Manage BNS
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            {profileEdited && (
              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} size="lg">
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Wallets Tab */}
        {activeTab === "wallets" && (
          <div className="space-y-6">
            {/* Primary Wallet */}
            <Card className="border-2 border-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Primary Wallet</CardTitle>
                    <CardDescription>
                      Your main connected wallet
                    </CardDescription>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                    Primary
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                  <div className="font-mono text-sm text-foreground">
                    {address}
                  </div>
                  <button
                    onClick={handleCopyAddress}
                    className="p-2 hover:bg-background rounded transition-colors"
                  >
                    <Copy className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Secondary Wallets (placeholder) */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">
                Secondary Wallets
              </h3>
              <div className="text-sm text-muted-foreground p-4 text-center border border-dashed rounded-lg">
                No secondary wallets linked yet
              </div>
            </div>

            {/* Add Wallet Button */}
            <Button variant="outline" className="gap-2" disabled>
              <Plus className="h-4 w-4" />
              Link Secondary Wallet
            </Button>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div className="space-y-6">
            {/* Claim Activity Group */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Claim Activity</CardTitle>
                <CardDescription>
                  Get notified about your claim events
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="font-medium text-foreground">Claim Success</p>
                    <p className="text-sm text-muted-foreground">
                      When you successfully claim a POAP
                    </p>
                  </div>
                  <button
                    onClick={() => handleNotificationChange("claimSuccess")}
                    className={`relative w-10 h-6 rounded-full transition-colors ${
                      notifications.claimSuccess
                        ? "bg-primary"
                        : "bg-muted-foreground/30"
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        notifications.claimSuccess ? "right-1" : "left-1"
                      }`}
                    ></div>
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="font-medium text-foreground">New Airdrops</p>
                    <p className="text-sm text-muted-foreground">
                      When new airdrops are available for you
                    </p>
                  </div>
                  <button
                    onClick={() => handleNotificationChange("newAirdrops")}
                    className={`relative w-10 h-6 rounded-full transition-colors ${
                      notifications.newAirdrops
                        ? "bg-primary"
                        : "bg-muted-foreground/30"
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        notifications.newAirdrops ? "right-1" : "left-1"
                      }`}
                    ></div>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Event Alerts Group */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Event Alerts</CardTitle>
                <CardDescription>
                  Get notified about platform events
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="font-medium text-foreground">
                      Window Opening
                    </p>
                    <p className="text-sm text-muted-foreground">
                      When a new event window opens
                    </p>
                  </div>
                  <button
                    onClick={() => handleNotificationChange("windowOpening")}
                    className={`relative w-10 h-6 rounded-full transition-colors ${
                      notifications.windowOpening
                        ? "bg-primary"
                        : "bg-muted-foreground/30"
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        notifications.windowOpening ? "right-1" : "left-1"
                      }`}
                    ></div>
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="font-medium text-foreground">
                      Platform Updates
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Important updates and announcements
                    </p>
                  </div>
                  <button
                    onClick={() => handleNotificationChange("platformUpdates")}
                    className={`relative w-10 h-6 rounded-full transition-colors ${
                      notifications.platformUpdates
                        ? "bg-primary"
                        : "bg-muted-foreground/30"
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        notifications.platformUpdates ? "right-1" : "left-1"
                      }`}
                    ></div>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Privacy Tab */}
        {activeTab === "privacy" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>
                  Control how your data is shared
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Public Profile Toggle */}
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="font-medium text-foreground">
                      Public Profile
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Show my collection to the public
                    </p>
                  </div>
                  <button
                    onClick={() => setIsPublic(!isPublic)}
                    className={`relative w-10 h-6 rounded-full transition-colors ${
                      isPublic ? "bg-primary" : "bg-muted-foreground/30"
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        isPublic ? "right-1" : "left-1"
                      }`}
                    ></div>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Data Management */}
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Export and manage your data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="font-medium text-foreground">Event History</p>
                    <p className="text-sm text-muted-foreground">
                      Download your event attendance records as JSON
                    </p>
                  </div>
                  <button
                    onClick={handleExportHistory}
                    className="text-sm font-medium text-primary hover:underline flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download JSON
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
