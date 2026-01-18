"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Copy,
  Unlink,
  Download,
  Bell,
  Lock,
  Settings,
  Wallet,
  Plus,
  Calendar,
  Users,
  ArrowRight,
  Clock,
  MapPin,
  Award,
  Upload,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { disconnect, isConnected, getLocalStorage } from "@stacks/connect";
import { toast } from "sonner";

type TabType = "general" | "wallets" | "notifications" | "privacy" | "events";

interface HostedEvent {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  startTime: string;
  endTime: string;
  bannerUrl: string | null;
  isActive: boolean;
  _count: {
    claims: number;
  };
}

interface ClaimedEvent {
  id: string;
  tokenId: string | null;
  txId: string | null;
  claimedAt: string;
  event: HostedEvent & { hostId: string };
}

interface UserData {
  id: string;
  walletAddress: string;
  username: string | null;
  email: string | null;
  bio: string | null;
  avatarUrl: string | null;
  hostedEvents: HostedEvent[];
  claims: ClaimedEvent[];
}

interface NotificationPreferences {
  claimSuccess: boolean;
  newAirdrops: boolean;
  windowOpening: boolean;
  platformUpdates: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [copied, setCopied] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loadingUserData, setLoadingUserData] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // Profile state - separate from userData for editing
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
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

  // Fetch user data when address is available
  useEffect(() => {
    if (!address) return;

    const fetchUserData = async () => {
      try {
        setLoadingUserData(true);
        const response = await fetch(`/api/user/${address}`);
        if (!response.ok) {
          // User doesn't exist yet, create one
          if (response.status === 404) {
            await fetch("/api/user", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ walletAddress: address }),
            });
            // Fetch again
            const retryResponse = await fetch(`/api/user/${address}`);
            if (retryResponse.ok) {
              const data = await retryResponse.json();
              setUserData(data);
              populateFormFields(data);
            }
          }
        } else {
          const data = await response.json();
          setUserData(data);
          populateFormFields(data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoadingUserData(false);
      }
    };

    fetchUserData();
  }, [address]);

  const populateFormFields = (data: UserData) => {
    setUsername(data.username || "");
    setBio(data.bio || "");
    setEmail(data.email || "");
    setAvatarUrl(data.avatarUrl || "");
  };

  // Track if form fields have been edited
  useEffect(() => {
    if (!userData) return;
    const hasChanges =
      username !== (userData.username || "") ||
      bio !== (userData.bio || "") ||
      email !== (userData.email || "") ||
      avatarUrl !== (userData.avatarUrl || "");
    setProfileEdited(hasChanges);
  }, [username, bio, email, avatarUrl, userData]);

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

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPEG, PNG, GIF, and WebP images are allowed");
      return;
    }

    try {
      setUploadingAvatar(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/user/avatar", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload avatar");
      }

      const data = await response.json();
      setAvatarUrl(data.url);
      toast.success("Avatar uploaded successfully!");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload avatar",
      );
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!address) return;

    try {
      setSavingProfile(true);
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: address,
          username: username || null,
          bio: bio || null,
          email: email || null,
          avatarUrl: avatarUrl || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update profile");
      }

      const updatedData = await response.json();
      setUserData(updatedData);
      populateFormFields(updatedData);
      setProfileEdited(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile",
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handleNotificationChange = (key: keyof NotificationPreferences) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    // TODO: Persist to backend
    toast.success("Notification preferences updated");
  };

  const handleExportHistory = () => {
    const data = {
      address,
      exportedAt: new Date().toISOString(),
      hostedEvents: userData?.hostedEvents || [],
      claimedEvents: userData?.claims || [],
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `poap-history-${address?.slice(-4)}.json`;
    a.click();
    toast.success("History exported successfully");
  };

  if (!connected || !address) {
    return null;
  }

  const getDefaultUsername = (addr: string): string => {
    return `User-${addr.slice(-4)}`;
  };

  const displayName = username || getDefaultUsername(address);
  const displayAvatar = avatarUrl;

  return (
    <div className="min-h-screen bg-background">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Profile Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="flex items-center justify-between gap-6">
            {/* Left: Avatar */}
            <div className="relative flex-shrink-0">
              {displayAvatar ? (
                <img
                  src={displayAvatar}
                  alt={displayName}
                  className="w-20 h-20 rounded-full object-cover border-2 border-primary/20"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-white text-2xl font-bold">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
              <button
                onClick={handleAvatarClick}
                disabled={uploadingAvatar}
                className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50"
                title="Change avatar"
              >
                {uploadingAvatar ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Center: User Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-foreground">
                {displayName}
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
          <div className="flex gap-2 md:gap-8 overflow-x-auto scrollbar-hide">
            {(
              [
                { id: "general", label: "General", icon: Settings },
                { id: "events", label: "Events", icon: Calendar },
                { id: "wallets", label: "Wallets", icon: Wallet },
                { id: "notifications", label: "Notifications", icon: Bell },
                { id: "privacy", label: "Privacy", icon: Lock },
              ] as const
            ).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-3 md:px-4 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
                  activeTab === id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{label}</span>
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
                {/* Username */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Your username"
                    maxLength={50}
                  />
                  <p className="text-xs text-muted-foreground">
                    This will be your public display name
                  </p>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="your.email@example.com"
                  />
                  <p className="text-xs text-muted-foreground">
                    Used for notifications and updates
                  </p>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">
                      Bio
                    </label>
                    <span className="text-xs text-muted-foreground">
                      {bio.length}/160
                    </span>
                  </div>
                  <textarea
                    value={bio}
                    onChange={(e) => {
                      const value = e.target.value.slice(0, 160);
                      setBio(value);
                    }}
                    maxLength={160}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {/* Wallet Address (Read-only) */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Wallet Address
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={address || ""}
                      readOnly
                      className="flex-1 px-3 py-2 border rounded-md bg-muted text-foreground font-mono text-sm cursor-not-allowed"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyAddress}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            {profileEdited && (
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (userData) populateFormFields(userData);
                    setProfileEdited(false);
                  }}
                  disabled={savingProfile}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  className="gap-2"
                >
                  {savingProfile ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Events Tab */}
        {activeTab === "events" && (
          <div className="space-y-8">
            {/* Hosted Events Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Hosted Events
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Events you&apos;ve created and managed
                  </p>
                </div>
                <Button asChild className="gap-2">
                  <Link href="/create">
                    <Plus className="h-4 w-4" />
                    Create Event
                  </Link>
                </Button>
              </div>

              {loadingUserData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <Skeleton key={idx} className="h-64 rounded-2xl" />
                  ))}
                </div>
              ) : userData?.hostedEvents && userData.hostedEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userData.hostedEvents.map((event) => (
                    <Card
                      key={event.id}
                      className="border border-primary-dark/40 bg-gradient-to-br from-primary/5 via-background to-background hover:shadow-lg transition-shadow"
                    >
                      <div className="relative h-32 bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800">
                        {event.bannerUrl ? (
                          <img
                            src={event.bannerUrl}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 opacity-25 bg-primary/40" />
                        )}
                        {event.isActive && (
                          <div className="absolute top-3 right-3 flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                            </span>
                            Active
                          </div>
                        )}
                      </div>

                      <CardContent className="space-y-3 p-5">
                        <div>
                          <h3 className="font-semibold text-foreground line-clamp-1">
                            {event.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {event.description || "No description"}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                          {event.startTime && (
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(event.startTime).toLocaleDateString()}
                            </span>
                          )}
                          {event.location && (
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {event.location}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {event._count?.claims || 0} claims
                          </span>
                        </div>

                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="w-full"
                        >
                          <Link href={`/events/${event.id}`}>
                            View Details
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Calendar}
                  title="No hosted events yet"
                  description="Create your first POAP event and start rewarding your community."
                  actionLabel="Create Event"
                  actionHref="/create"
                />
              )}
            </div>

            {/* Claimed Events Section */}
            <div className="space-y-4 border-t pt-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Claimed Badges
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Events you&apos;ve attended and claimed badges for
                </p>
              </div>

              {loadingUserData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <Skeleton key={idx} className="h-64 rounded-2xl" />
                  ))}
                </div>
              ) : userData?.claims && userData.claims.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userData.claims.map((claim) => (
                    <Card
                      key={claim.id}
                      className="border border-primary-dark/40 bg-gradient-to-br from-primary/5 via-background to-background hover:shadow-lg transition-shadow"
                    >
                      <CardHeader className="space-y-1 pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="line-clamp-1 text-base">
                            {claim.event.title}
                          </CardTitle>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {claim.event.description ||
                            "On-chain proof of attendance"}
                        </p>
                      </CardHeader>

                      <CardContent className="space-y-3">
                        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                          {claim.event.startTime && (
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(
                                claim.event.startTime,
                              ).toLocaleDateString()}
                            </span>
                          )}
                          {claim.claimedAt && (
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              Claimed{" "}
                              {new Date(claim.claimedAt).toLocaleDateString()}
                            </span>
                          )}
                          {claim.event.location && (
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {claim.event.location}
                            </span>
                          )}
                        </div>

                        {claim.event.bannerUrl && (
                          <div className="overflow-hidden rounded-lg">
                            <img
                              src={claim.event.bannerUrl}
                              alt={claim.event.title}
                              className="h-24 w-full object-cover"
                            />
                          </div>
                        )}

                        {claim.tokenId && (
                          <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
                            <span className="font-mono">
                              Token: {claim.tokenId}
                            </span>
                          </div>
                        )}

                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="w-full"
                        >
                          <Link href={`/events/${claim.event.id}`}>
                            View Event
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Award}
                  title="No claimed badges yet"
                  description="Explore events and claim your first POAP badge."
                  actionLabel="Browse Events"
                  actionHref="/events"
                />
              )}
            </div>
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
