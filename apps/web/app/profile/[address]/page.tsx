"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Calendar,
  Users,
  Award,
  MapPin,
  Clock,
  Trophy,
  Copy,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import BadgeDetailsModal from "@/components/badges/badge-details-modal";
import { toast } from "sonner";

interface UserData {
  id: string;
  walletAddress: string;
  username: string | null;
  bio: string | null;
  avatarUrl: string | null;
  email: string | null;
  createdAt: string;
  claims: Array<{
    id: string;
    tokenId: string | null;
    claimedAt: string;
    event: {
      id: string;
      title: string;
      description: string | null;
      location: string | null;
      startTime: string;
      endTime: string;
      bannerUrl: string | null;
      isActive: boolean;
    };
  }>;
  hostedEvents: Array<{
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
  }>;
}

interface PageProps {
  params: Promise<{
    address: string;
  }>;
}

interface BadgeWithMetadata {
  id: string;
  tokenId: string | null;
  claimedAt: string;
  sequenceNumber: number;
  rarity: string;
  event: {
    id: string;
    title: string;
    description: string | null;
    location: string | null;
    startTime: string;
    endTime: string;
    bannerUrl: string | null;
    isActive: boolean;
  };
}

export default function PublicProfilePage({ params }: PageProps) {
  const router = useRouter();
  const [address, setAddress] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<BadgeWithMetadata | null>(
    null,
  );

  useEffect(() => {
    params.then((p) => {
      const decodedAddress = decodeURIComponent(p.address);
      setAddress(decodedAddress);
    });
  }, [params]);

  useEffect(() => {
    if (!address) return;

    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/user/${address}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError("User not found");
            return;
          }
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUserData(data);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [address]);

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success("Address copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const truncateAddress = (addr: string): string => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getDefaultUsername = (addr: string): string => {
    return `User-${addr.slice(-4)}`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getRarityTier = (index: number, total: number): string => {
    if (total === 1) return "legendary";
    if (index === 0) return "legendary";
    if (index === 1 && total === 2) return "epic";
    if (index <= Math.floor(total * 0.25)) return "epic";
    if (index <= Math.floor(total * 0.5)) return "rare";
    return "common";
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20";
      case "epic":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
      case "rare":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20";
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "⭐";
      case "epic":
        return "✨";
      case "rare":
        return "💎";
      default:
        return "🏅";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          {/* Header Skeleton */}
          <div className="bg-gradient-to-b from-primary/10 to-background p-8 rounded-xl border border-primary/20 mb-8">
            <div className="flex items-start gap-6">
              <Skeleton className="w-24 h-24 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-64 mb-4" />
                <Skeleton className="h-4 w-96" />
              </div>
            </div>
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>

          {/* Content Skeleton */}
          <Skeleton className="h-96 rounded-lg" />
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <EmptyState
            icon={Award}
            title="Profile Not Found"
            description={
              error ||
              "This user profile does not exist or could not be loaded."
            }
            actionLabel="Browse Events"
            actionHref="/events"
          />
        </div>
      </div>
    );
  }

  const displayName =
    userData.username || getDefaultUsername(userData.walletAddress);
  const totalBadges = userData.claims.length;
  const eventsHosted = userData.hostedEvents.length;
  const totalAttendees = userData.hostedEvents.reduce(
    (sum, event) => sum + event._count.claims,
    0,
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="mb-8 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {/* Profile Header */}
        <div className="bg-gradient-to-b from-primary/10 via-primary/5 to-background p-8 rounded-xl border border-primary/20 mb-8">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {userData.avatarUrl ? (
                <img
                  src={userData.avatarUrl}
                  alt={displayName}
                  className="w-24 h-24 rounded-full object-cover border-2 border-primary"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-white text-3xl font-bold border-2 border-primary">
                  {displayName.slice(0, 1).toUpperCase()}
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {displayName}
              </h1>

              {userData.bio && (
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {userData.bio}
                </p>
              )}

              <div className="flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-2">
                  <code className="text-xs font-mono bg-muted px-3 py-1.5 rounded border border-primary/20">
                    {truncateAddress(userData.walletAddress)}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyAddress}
                    className="h-auto p-1"
                    title={copied ? "Copied!" : "Copy address"}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>

                {userData.email && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {userData.email}
                  </div>
                )}

                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Joined {formatDate(userData.createdAt)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalBadges}</p>
                  <p className="text-xs text-muted-foreground">
                    Badges Claimed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{eventsHosted}</p>
                  <p className="text-xs text-muted-foreground">Events Hosted</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalAttendees}</p>
                  <p className="text-xs text-muted-foreground">
                    Total Attendees
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {userData.hostedEvents.filter((e) => e.isActive).length}
                  </p>
                  <p className="text-xs text-muted-foreground">Active Events</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Claimed Badges Section */}
        {totalBadges > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Badges Claimed</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userData.claims.map((claim, index) => {
                const rarity = getRarityTier(index, userData.claims.length);
                const badgeWithMeta: BadgeWithMetadata = {
                  ...claim,
                  sequenceNumber: index + 1,
                  rarity,
                };

                return (
                  <Card
                    key={claim.id}
                    className="border border-primary-dark/40 bg-gradient-to-br from-primary/5 via-background to-background hover:shadow-lg transition-all cursor-pointer group"
                    onClick={() => setSelectedBadge(badgeWithMeta)}
                  >
                    {claim.event.bannerUrl && (
                      <div className="relative w-full h-40 overflow-hidden">
                        <img
                          src={claim.event.bannerUrl}
                          alt={claim.event.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className={`${getRarityColor(rarity)} border`}>
                            {getRarityIcon(rarity)}{" "}
                            {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    )}

                    <CardHeader className="space-y-1 pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="line-clamp-1 text-base group-hover:text-primary transition-colors">
                          {claim.event.title}
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className="text-xs flex-shrink-0"
                        >
                          #{index + 1}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {claim.event.description ||
                          "On-chain proof of attendance"}
                      </p>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      {/* Metadata */}
                      <div className="space-y-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>Claimed: {formatDate(claim.claimedAt)}</span>
                        </div>
                        {claim.event.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5" />
                            <span className="line-clamp-1">
                              {claim.event.location}
                            </span>
                          </div>
                        )}
                        {claim.tokenId && (
                          <div className="flex items-center gap-2">
                            <Trophy className="h-3.5 w-3.5" />
                            <span className="font-mono text-xs truncate">
                              Token: {claim.tokenId}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 h-8 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBadge(badgeWithMeta);
                          }}
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          Details
                        </Button>
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="flex-1 h-8 text-xs"
                        >
                          <Link href={`/events/${claim.event.id}`}>
                            View Event
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Hosted Events Section */}
        {eventsHosted > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Events Hosted</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userData.hostedEvents.map((event) => (
                <Card
                  key={event.id}
                  className="border border-primary-dark/40 bg-gradient-to-br from-primary/5 via-background to-background hover:shadow-lg transition-shadow overflow-hidden group"
                >
                  {event.bannerUrl && (
                    <div className="relative w-full h-32 overflow-hidden">
                      <img
                        src={event.bannerUrl}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                  )}

                  <CardHeader className="space-y-1 pb-3">
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="line-clamp-1 text-base group-hover:text-primary transition-colors">
                        {event.title}
                      </CardTitle>
                      {event.isActive && (
                        <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20 text-xs flex-shrink-0">
                          Active
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {event.description || "Event details"}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                      {event.startTime && (
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(event.startTime)}
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
                      <Link href={`/events/${event.id}`}>View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {totalBadges === 0 && eventsHosted === 0 && (
          <EmptyState
            icon={Award}
            title="No Activity Yet"
            description="This user hasn't claimed any badges or hosted any events."
            actionLabel="Browse Events"
            actionHref="/events"
          />
        )}
      </div>

      {/* Badge Details Modal */}
      {selectedBadge && (
        <BadgeDetailsModal
          badge={selectedBadge}
          userAddress={userData?.walletAddress || address || ""}
          onClose={() => setSelectedBadge(null)}
        />
      )}
    </div>
  );
}
