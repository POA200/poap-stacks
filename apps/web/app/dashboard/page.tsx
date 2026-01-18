"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Eye, Settings, Clock, MoreVertical, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { isConnected, getLocalStorage } from "@stacks/connect";
import { toast } from "sonner";

interface HostedEvent {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  startTime: string;
  endTime: string;
  bannerUrl: string | null;
  maxAttendees: number | null;
  isActive: boolean;
  createdAt: string;
  _count: {
    claims: number;
  };
}

interface UserData {
  id: string;
  walletAddress: string;
  username: string | null;
  hostedEvents: HostedEvent[];
}

export default function DashboardPage() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const checkConnection = () => {
      const isWalletConnected = isConnected();
      setConnected(isWalletConnected);

      if (isWalletConnected) {
        const data = getLocalStorage();
        const stxAddress = data?.addresses?.stx?.[0]?.address;
        setAddress(stxAddress || null);
      } else {
        setLoading(false);
      }
    };

    checkConnection();
  }, []);

  useEffect(() => {
    if (!address) return;

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/user/${address}`);

        if (!response.ok) {
          if (response.status === 404) {
            // User doesn't exist, create one
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
            }
          } else {
            throw new Error("Failed to fetch user data");
          }
        } else {
          const data = await response.json();
          setUserData(data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [address]);

  const getEventStatus = (event: HostedEvent): "live" | "upcoming" | "past" => {
    const now = new Date();
    const startTime = new Date(event.startTime);
    const endTime = new Date(event.endTime);

    if (now >= startTime && now <= endTime && event.isActive) {
      return "live";
    } else if (now < startTime) {
      return "upcoming";
    } else {
      return "past";
    }
  };

  const createdEvents = userData?.hostedEvents || [];

  const stats = {
    totalEvents: createdEvents.length,
    liveEvents: createdEvents.filter((e) => getEventStatus(e) === "live")
      .length,
    totalClaims: createdEvents.reduce((sum, e) => sum + e._count.claims, 0),
    avgClaimRate:
      createdEvents.length > 0
        ? Math.round(
            createdEvents.reduce((sum, e) => {
              const maxAttendees = e.maxAttendees || 100;
              return sum + (e._count.claims / maxAttendees) * 100;
            }, 0) / createdEvents.length,
          )
        : 0,
  };

  const getStatusBadge = (status: "live" | "upcoming" | "past") => {
    switch (status) {
      case "live":
        return (
          <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20 gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            Live
          </Badge>
        );
      case "upcoming":
        return (
          <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20">
            Upcoming
          </Badge>
        );
      case "past":
        return (
          <Badge className="bg-muted text-muted-foreground hover:bg-muted border-muted">
            Completed
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4">Connect Your Wallet</h1>
          <p className="text-muted-foreground mb-6">
            You need to connect your wallet to view your event dashboard.
          </p>
          <Button size="lg" asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="mb-8">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Event Dashboard</h1>
            <p className="text-muted-foreground">
              Manage and track all your created events
            </p>
          </div>
          <Button size="lg" asChild>
            <Link href="/create" className="gap-2">
              <Plus className="h-4 w-4" />
              Create Event
            </Link>
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalEvents}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.liveEvents} live now
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Claims
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalClaims}</div>
              <p className="text-xs text-muted-foreground mt-1">
                across all events
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Attendees
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalClaims}</div>
              <p className="text-xs text-muted-foreground mt-1">
                unique collectors
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg. Claim Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.avgClaimRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                across events
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Events Table */}
        <Card>
          <CardHeader>
            <CardTitle>Your Events</CardTitle>
            <CardDescription>
              View and manage all events you&apos;ve created
            </CardDescription>
          </CardHeader>
          <CardContent>
            {createdEvents.length === 0 ? (
              <EmptyState
                icon={Plus}
                title="No events yet"
                description="Create your first POAP event to start building your community."
                actionLabel="Create Event"
                actionHref="/create"
              />
            ) : (
              <div className="space-y-4">
                {createdEvents.map((event) => {
                  const status = getEventStatus(event);
                  const maxAttendees = event.maxAttendees || 100;

                  return (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-foreground">
                            {event.title}
                          </h3>
                          {getStatusBadge(status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {formatDate(event.startTime)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />
                            {event._count.claims} / {maxAttendees} claims
                          </div>
                          {event.location && (
                            <div className="flex items-center gap-1">
                              <Eye className="h-3.5 w-3.5" />
                              {event.location}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/events/${event.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/events/${event.id}/manage`}>
                            <Settings className="h-4 w-4" />
                          </Link>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/events/${event.id}`}>
                                View Public Page
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/events/${event.id}/manage`}>
                                Manage Event
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Edit Details</DropdownMenuItem>
                            <DropdownMenuItem>Duplicate Event</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Delete Event
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Tips */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Quick Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              💡 <strong>Boost engagement:</strong> Share your event link on
              social media to increase claim rates.
            </p>
            <p>
              📊 <strong>Monitor live:</strong> Visit the manage page to watch
              claims come in real-time.
            </p>
            <p>
              🎯 <strong>Set deadlines:</strong> Close the claim window at the
              right time to create urgency.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
