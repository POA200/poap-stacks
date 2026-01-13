"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Award,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  User,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type TimeFilter = "all" | "week" | "month";
type SortOption = "newest" | "oldest" | "alphabetical";

interface Claim {
  id: string;
  tokenId: string | null;
  txId: string | null;
  claimedAt: string;
  event: {
    id: string;
    title: string;
    description: string | null;
    location?: string | null;
    startTime: string;
    endTime: string;
    bannerUrl: string | null;
    host: {
      id: string;
      walletAddress: string;
      username: string | null;
    };
  };
}

const BADGES_PER_PAGE = 6;

export default function BadgesPage() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get user's wallet address on mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        const { isConnected, getLocalStorage } =
          await import("@stacks/connect");
        if (isConnected()) {
          const data = getLocalStorage();
          const stxAddress = data?.addresses?.stx?.[0]?.address;
          setUserAddress(stxAddress || null);
        }
      } catch (error) {
        console.error("Failed to check wallet connection:", error);
      }
    };

    checkWalletConnection();
  }, []);

  // Fetch user's claimed badges
  useEffect(() => {
    const fetchClaims = async () => {
      if (!userAddress) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/user/${userAddress}`);
        if (!response.ok) throw new Error("Failed to fetch user data");
        const userData = await response.json();
        setClaims(userData.claims || []);
      } catch (error) {
        console.error("Error fetching claims:", error);
        setError("Unable to load badges right now. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, [userAddress]);

  // Filter badges based on time filter
  const filterByTime = (claims: Claim[], filter: TimeFilter): Claim[] => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    switch (filter) {
      case "week":
        return claims.filter((c) => new Date(c.claimedAt) >= oneWeekAgo);
      case "month":
        return claims.filter((c) => new Date(c.claimedAt) >= oneMonthAgo);
      case "all":
      default:
        return claims;
    }
  };

  // Sort badges
  const sortBadges = (claims: Claim[], option: SortOption): Claim[] => {
    const sorted = [...claims];
    switch (option) {
      case "newest":
        return sorted.sort(
          (a, b) =>
            new Date(b.claimedAt).getTime() - new Date(a.claimedAt).getTime()
        );
      case "oldest":
        return sorted.sort(
          (a, b) =>
            new Date(a.claimedAt).getTime() - new Date(b.claimedAt).getTime()
        );
      case "alphabetical":
        return sorted.sort((a, b) =>
          a.event.title.localeCompare(b.event.title)
        );
      default:
        return sorted;
    }
  };

  const filteredBadges = useMemo(() => {
    return sortBadges(filterByTime(claims, timeFilter), sortBy);
  }, [claims, sortBy, timeFilter]);

  const totalPages = Math.ceil(filteredBadges.length / BADGES_PER_PAGE);
  const startIdx = (currentPage - 1) * BADGES_PER_PAGE;
  const displayedBadges = filteredBadges.slice(
    startIdx,
    startIdx + BADGES_PER_PAGE
  );

  const handleTimeFilterClick = (filter: TimeFilter) => {
    setTimeFilter(filter);
    setCurrentPage(1);
  };

  const formatDateTime = (value: string) => {
    const date = new Date(value);
    return `${date.toLocaleDateString()} • ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-xl bg-primary/10">
              <Award className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-medium text-foreground mb-2">
            My Badge Collection
          </h1>
          <p className="text-muted-foreground">
            Track your on-chain achievements and history.
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleTimeFilterClick("all")}
              className={`px-3 py-1.5 text-sm rounded-full font-medium transition-colors ${
                timeFilter === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleTimeFilterClick("week")}
              className={`px-3 py-1.5 text-sm rounded-full font-medium transition-colors ${
                timeFilter === "week"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => handleTimeFilterClick("month")}
              className={`px-3 py-1.5 text-sm rounded-full font-medium transition-colors ${
                timeFilter === "month"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              This Month
            </button>

            <div className="h-5 w-px bg-border mx-1" />

            <label className="text-xs font-medium text-muted-foreground">
              Sort:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-2.5 py-1.5 text-sm rounded-full border border-input bg-muted text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>
        </div>

        <div className="mb-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <Skeleton key={idx} className="h-56 rounded-2xl" />
              ))}
            </div>
          ) : !userAddress ? (
            <EmptyState
              icon={Award}
              title="Connect your wallet"
              description="Link your Stacks wallet to see all badges you have claimed across events."
              actionLabel="Go to Home"
              actionHref="/"
            />
          ) : error ? (
            <EmptyState
              icon={Award}
              title="Could not load badges"
              description={error}
              actionLabel="Try Events"
              actionHref="/events"
            />
          ) : displayedBadges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedBadges.map((claim) => (
                <Card
                  key={claim.id}
                  className="border border-primary-dark/40 bg-gradient-to-br from-primary/5 via-background to-background"
                >
                  <CardHeader className="space-y-1 pb-3">
                    <CardTitle className="flex items-center justify-between text-lg">
                      <span className="line-clamp-1">{claim.event.title}</span>
                      <Badge variant="secondary" className="gap-1">
                        <Award className="h-3 w-3" />
                        Claimed
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {claim.event.description ||
                        "On-chain proof of attendance."}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="h-4 w-4" />
                        {formatDateTime(claim.event.startTime)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Claimed {formatDateTime(claim.claimedAt)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {claim.event.host.username ||
                          claim.event.host.walletAddress}
                      </span>
                    </div>

                    {claim.event.bannerUrl && (
                      <div className="overflow-hidden rounded-xl">
                        <img
                          src={claim.event.bannerUrl}
                          alt={claim.event.title}
                          className="h-32 w-full object-cover"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {claim.event.location ||
                          claim.event.host.username ||
                          "Stacks Event"}
                      </span>
                      <Button
                        asChild
                        size="sm"
                        variant="ghost"
                        className="gap-1"
                      >
                        <Link href={`/events/${claim.event.id}`}>
                          View event
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Award}
              title="No badges yet"
              description="Claim your first POAP by joining an event and your badges will show up here."
              actionLabel="Browse Events"
              actionHref="/events"
            />
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-full hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-5 w-5 text-muted-foreground" />
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`h-9 w-9 rounded-full font-medium transition-colors ${
                      currentPage === page
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-full hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
