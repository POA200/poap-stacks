"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Eye,
  Settings,
  TrendingUp,
  Clock,
  MoreVertical,
  Users,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CreatedEvent {
  id: string;
  title: string;
  date: string;
  status: "live" | "upcoming" | "past";
  totalClaims: number;
  totalSupply: number;
  claimRate: number;
  uniqueVisitors: number;
  createdAt: string;
}

export default function DashboardPage() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const stacksConnect = await import("@stacks/connect").catch(() => null);
        if (!stacksConnect) return;

        const { isConnected } = stacksConnect;
        const isWalletConnected = isConnected();

        if (isWalletConnected) {
          setConnected(true);
        }
      } catch {
        // Silently fail
      }
    };

    checkConnection();
  }, []);

  // Mock data - events created by the user
  const createdEvents: CreatedEvent[] = [
    {
      id: "featured-1",
      title: "Stacks Defi Show #80",
      date: "Jan 12, 2026",
      status: "live",
      totalClaims: 45,
      totalSupply: 100,
      claimRate: 45,
      uniqueVisitors: 234,
      createdAt: "Jan 10, 2026",
    },
    {
      id: "upcoming-1",
      title: "Bitcoin L2 Conference",
      date: "Jan 20, 2026",
      status: "upcoming",
      totalClaims: 0,
      totalSupply: 150,
      claimRate: 0,
      uniqueVisitors: 412,
      createdAt: "Jan 8, 2026",
    },
    {
      id: "upcoming-2",
      title: "DeFi Summit 2026",
      date: "Feb 15, 2026",
      status: "upcoming",
      totalClaims: 0,
      totalSupply: 200,
      claimRate: 0,
      uniqueVisitors: 1230,
      createdAt: "Jan 5, 2026",
    },
    {
      id: "past-1",
      title: "Stacks Defi Show #79",
      date: "Jan 5, 2026",
      status: "past",
      totalClaims: 87,
      totalSupply: 100,
      claimRate: 87,
      uniqueVisitors: 156,
      createdAt: "Jan 3, 2026",
    },
  ];

  const stats = {
    totalEvents: createdEvents.length,
    liveEvents: createdEvents.filter((e) => e.status === "live").length,
    totalClaims: createdEvents.reduce((sum, e) => sum + e.totalClaims, 0),
    totalVisitors: createdEvents.reduce((sum, e) => sum + e.uniqueVisitors, 0),
  };

  const getStatusBadge = (status: string) => {
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
      default:
        return null;
    }
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
            <Link href="/events">Return to Events</Link>
          </Button>
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
                Unique Visitors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalVisitors}</div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <p className="text-xs text-green-500">+28% this week</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg. Claim Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {Math.round(
                  createdEvents.reduce((sum, e) => sum + e.claimRate, 0) /
                    createdEvents.length
                )}
                %
              </div>
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
            <div className="space-y-4">
              {createdEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground">
                        {event.title}
                      </h3>
                      {getStatusBadge(event.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {event.totalClaims} / {event.totalSupply} claims
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        {event.uniqueVisitors} visitors
                      </div>
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
              ))}
            </div>
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
