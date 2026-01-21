"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Loader2,
  AlertCircle,
  ExternalLink,
  Calendar,
  Clock,
  MapPin,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ipfsToHttp } from "@/lib/utils";

interface EventPageProps {
  params: Promise<{
    id: string;
  }>;
}

interface EventData {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  startTime: string;
  endTime: string;
  bannerUrl: string | null;
  maxAttendees: number | null;
  contractEventId: number | null;
  isActive: boolean;
  host: {
    id: string;
    walletAddress: string;
    username: string | null;
    avatarUrl: string | null;
  };
  claims: Array<{
    id: string;
    claimedAt: string;
    user: {
      walletAddress: string;
      username: string | null;
    };
  }>;
  _count: {
    claims: number;
  };
}

type ClaimStatus =
  | "idle"
  | "checking"
  | "claiming"
  | "success"
  | "error"
  | "already-claimed"
  | "not-eligible";

export default function EventPage({ params }: EventPageProps) {
  const [eventId, setEventId] = useState<string>("");
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [claimStatus, setClaimStatus] = useState<ClaimStatus>("idle");
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [txId, setTxId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    params.then((p) => setEventId(p.id));
  }, [params]);

  useEffect(() => {
    if (!eventId) return;

    // Fetch event data
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/events/${eventId}`);
        if (!response.ok) throw new Error("Failed to fetch event");
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error("Error fetching event:", error);
        setErrorMessage("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    // Check wallet connection
    const checkWallet = async () => {
      try {
        const { isConnected, getLocalStorage } =
          await import("@stacks/connect").catch(() => ({
            isConnected: () => false,
            getLocalStorage: () => null,
          }));
        const isWalletConnected = isConnected();

        if (isWalletConnected) {
          const data = getLocalStorage();
          const stxAddress = data?.addresses?.stx?.[0]?.address;
          setWalletAddress(stxAddress || null);
        }
      } catch {
        // Silently fail - wallet extension might not be available
      }
    };

    checkWallet();
  }, []);

  const handleClaim = async () => {
    if (!walletAddress) {
      setClaimStatus("error");
      setErrorMessage("Please connect your wallet to claim this badge");
      return;
    }

    if (!event?.contractEventId) {
      setClaimStatus("error");
      setErrorMessage(
        "This event is not yet registered on-chain. Please try again later.",
      );
      return;
    }

    try {
      setClaimStatus("checking");
      setProgress(20);

      // Check if user has already claimed
      const { hasClaimedBadge } = await import("@/lib/contract-calls");
      const claimed = await hasClaimedBadge(
        event.contractEventId,
        walletAddress,
      );

      if (claimed.value === true) {
        setClaimStatus("already-claimed");
        return;
      }

      setProgress(40);
      setClaimStatus("claiming");

      // Call smart contract to claim badge
      const { claimBadge } = await import("@/lib/contract-calls");
      await claimBadge({
        eventId: event.contractEventId,
        onFinish: (data) => {
          setProgress(100);
          setTxId(data.txId);
          setClaimStatus("success");
        },
        onCancel: () => {
          setClaimStatus("idle");
          setProgress(0);
          setErrorMessage("Transaction cancelled by user");
        },
      });
    } catch (error) {
      setClaimStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to claim badge. Please try again.",
      );
      setProgress(0);
    }
  };

  const handleConnectWallet = async () => {
    try {
      const stacksConnect = await import("@stacks/connect").catch(() => null);
      if (!stacksConnect) {
        setErrorMessage("Stacks wallet extension not available");
        return;
      }

      const { connect, getLocalStorage } = stacksConnect;
      await connect();

      const data = getLocalStorage();
      const stxAddress = data?.addresses?.stx?.[0]?.address;

      if (stxAddress) {
        setWalletAddress(stxAddress);
        setClaimStatus("idle");
        setErrorMessage("");
      }
    } catch {
      setErrorMessage("Failed to connect wallet");
    }
  };

  const getSlicedAddress = (addr: string): string => {
    return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getTimeAgo = (date: string) => {
    const seconds = Math.floor(
      (new Date().getTime() - new Date(date).getTime()) / 1000,
    );
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <Skeleton className="h-10 w-32 mb-6" />
          <Skeleton className="h-64 rounded-3xl mb-8" />
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-start gap-4 flex-1">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-5 w-1/3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <Link
            href="/events"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Link>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Event Not Found</AlertTitle>
            <AlertDescription>
              The event you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Back Navigation */}
        <Link
          href="/events"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Link>

        {/* Hero Banner */}
        <div className="relative h-64 rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800 overflow-hidden mb-8 shadow-xl">
          {event.bannerUrl ? (
            <img
              src={ipfsToHttp(event.bannerUrl) || event.bannerUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 opacity-20 mix-blend-overlay" />
          )}
        </div>

        {/* Event Title Section */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🎙️</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">{event.title}</h1>
              <p className="text-muted-foreground">
                {event.description || "No description provided"}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button size="lg" variant="outline" asChild>
              <Link href={`/events/${eventId}/manage`}>
                <Settings className="mr-2 h-4 w-4" />
                Manage
              </Link>
            </Button>
            <Button
              size="lg"
              className="gap-2"
              onClick={
                claimStatus === "idle" || claimStatus === "error"
                  ? handleClaim
                  : undefined
              }
            >
              {claimStatus === "checking" || claimStatus === "claiming" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {claimStatus === "checking" ? "Checking..." : "Claiming..."}
                </>
              ) : claimStatus === "success" ? (
                <>
                  <Check className="h-4 w-4" />
                  Claimed
                </>
              ) : (
                <>
                  Claim Badge
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Status Alerts */}
        {claimStatus === "error" && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Unable to Claim</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {claimStatus === "not-eligible" && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Not Eligible</AlertTitle>
            <AlertDescription>
              You are not eligible to claim this badge. This may be because you
              didn&apos;t attend the event or have already claimed your badge.
            </AlertDescription>
          </Alert>
        )}

        {claimStatus === "success" && (
          <Alert className="border-green-500 bg-green-500/10 mb-6">
            <Check className="h-4 w-4 text-green-500" />
            <AlertTitle className="text-green-500">
              Badge Claimed Successfully!
            </AlertTitle>
            <AlertDescription className="text-green-600 dark:text-green-400">
              Your attendance badge has been successfully minted to your wallet.
              It may take a few moments to appear in your profile.
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Event Details Card */}
          <Card className="border-primary/20">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Host:
                  </h3>
                  <p className="text-sm font-medium text-right">
                    {event.host.username ||
                      getSlicedAddress(event.host.walletAddress)}
                  </p>
                </div>
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Event ID:
                  </h3>
                  <p className="text-sm font-mono">{event.id.slice(0, 12)}</p>
                </div>
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Claim Window:
                  </h3>
                  <p className="text-sm font-medium text-right">
                    {formatTime(event.startTime)} - {formatTime(event.endTime)}{" "}
                    UTC
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-primary/20">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 h-auto py-3"
                  disabled
                >
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-sm">{formatDate(event.startTime)}</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 h-auto py-3"
                  disabled
                >
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm">
                    {formatTime(event.startTime)} - {formatTime(event.endTime)}{" "}
                    UTC
                  </span>
                </Button>
                {event.location && (
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 h-auto py-3"
                    disabled
                  >
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-sm">{event.location}</span>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Right Column - Description and Status */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Description:
              </h3>
              <p className="text-sm">
                {event.description || "No description provided"}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">
                Claim Status:
              </h3>
              <Badge
                className={
                  event.isActive
                    ? "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20"
                    : "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20 border-gray-500/20"
                }
              >
                {event.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">
                Total Claims:
              </h3>
              <p className="text-sm font-medium">{event._count.claims}</p>
            </div>

            {walletAddress && (
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-sm font-medium">Wallet Connected</span>
                </div>
                <p className="text-xs font-mono text-muted-foreground">
                  {getSlicedAddress(walletAddress)}
                </p>
              </div>
            )}

            {!walletAddress && (
              <Button
                onClick={handleConnectWallet}
                className="w-full"
                size="lg"
              >
                Connect Wallet to Claim
              </Button>
            )}
          </div>
        </div>

        {/* Progress Indicator */}
        {(claimStatus === "checking" || claimStatus === "claiming") && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Processing Your Claim</CardTitle>
              <CardDescription>
                {claimStatus === "checking"
                  ? "Verifying your eligibility to claim this badge..."
                  : "Minting your badge on the Stacks blockchain..."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={progress} className="w-full" />
              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  {progress >= 20 ? (
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                  ) : (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Checking eligibility
                </div>
                <div className="flex items-center">
                  {progress >= 70 ? (
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                  ) : progress >= 40 ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <div className="mr-2 h-4 w-4" />
                  )}
                  Processing blockchain transaction
                </div>
                <div className="flex items-center">
                  {progress >= 100 ? (
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                  ) : (
                    <div className="mr-2 h-4 w-4" />
                  )}
                  Confirming on-chain
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Additional Details Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {/* Badge Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Badge Preview</CardTitle>
              <CardDescription>NFT design for this event</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-gradient-to-br from-purple-500 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg mb-4">
                {event.bannerUrl ? (
                  <img
                    src={ipfsToHttp(event.bannerUrl) || event.bannerUrl}
                    alt={event.title}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="text-center text-white p-4">
                    <div className="text-4xl mb-2">🎙️</div>
                    <div className="text-sm font-bold">{event.title}</div>
                  </div>
                )}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Supply:</span>
                  <span className="font-medium">
                    {event.maxAttendees || "Unlimited"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Claimed:</span>
                  <span className="font-medium">{event._count.claims}</span>
                </div>
                {event.maxAttendees && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Remaining:</span>
                    <span className="font-medium text-primary">
                      {event.maxAttendees - event._count.claims}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Transaction Details */}
          {claimStatus === "success" && txId && (
            <Card className="border-green-500/20">
              <CardHeader>
                <CardTitle className="text-base">Transaction Details</CardTitle>
                <CardDescription>Your badge has been minted</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Transaction ID
                  </h4>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-muted px-2 py-1 rounded flex-1 overflow-hidden text-ellipsis">
                      {txId}
                    </code>
                    <Button size="sm" variant="outline" asChild>
                      <a
                        href={`https://explorer.stacks.co/txid/${txId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1" asChild>
                    <Link href="/profile">Profile</Link>
                  </Button>
                  <Button variant="outline" className="flex-1" asChild>
                    <Link href="/badges">Badges</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contract Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contract Info</CardTitle>
              <CardDescription>Blockchain details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  Network
                </h4>
                <p className="text-sm font-medium">Stacks Mainnet</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  Contract
                </h4>
                <code className="text-xs bg-muted px-2 py-1 rounded block break-all">
                  SP2J6ZY48...event-{eventId}
                </code>
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <a
                  href={`https://explorer.stacks.co/txid/SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7.event-${eventId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-3 w-3" />
                  View on Explorer
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Attendees */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Attendees</CardTitle>
              <CardDescription>Latest badge claims</CardDescription>
            </CardHeader>
            <CardContent>
              {event.claims.length > 0 ? (
                <div className="space-y-2">
                  {event.claims.map((claim) => (
                    <Button
                      key={claim.id}
                      asChild
                      variant="ghost"
                      className="w-full justify-between py-2 h-auto px-2 border-b rounded-none hover:bg-muted/50"
                    >
                      <Link href={`/profile/${claim.user.walletAddress}`}>
                        <span className="font-mono text-xs">
                          {claim.user.username ||
                            getSlicedAddress(claim.user.walletAddress)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {getTimeAgo(claim.claimedAt)}
                        </span>
                      </Link>
                    </Button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No claims yet. Be the first!
                </p>
              )}
            </CardContent>
          </Card>

          {/* Share */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Share Event</CardTitle>
              <CardDescription>Spread the word</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  const link = `${window.location.origin}/events/${eventId}`;
                  navigator.clipboard.writeText(link);
                }}
              >
                Copy Link
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="flex-1"
                  asChild
                >
                  <a
                    href={`https://twitter.com/intent/tweet?text=Check out this event!&url=${window.location.origin}/events/${eventId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="sr-only">Twitter</span>𝕏
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="flex-1"
                  asChild
                >
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}/events/${eventId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="sr-only">Facebook</span>f
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="flex-1"
                  asChild
                >
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.origin}/events/${eventId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="sr-only">LinkedIn</span>in
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Help */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Need Help?</CardTitle>
              <CardDescription>Claim troubleshooting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-muted-foreground">Make sure you:</p>
              <ul className="space-y-1 text-muted-foreground ml-4 list-disc text-xs">
                <li>Have a Stacks wallet installed</li>
                <li>Connected to correct network</li>
                <li>Attended the event</li>
                <li>Have STX for fees</li>
              </ul>
              <Button variant="link" className="px-0 h-auto text-sm" asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
