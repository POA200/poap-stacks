"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  MapPin,
  Users,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Hero } from "@/components/landing/hero";
import { Attendees } from "@/components/landing/features/attendees";
import { Hosts } from "@/components/landing/features/hosts";
import { Testimonials } from "@/components/landing/testimonials";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";

interface Event {
  id: string;
  title: string;
  description?: string | null;
  location?: string | null;
  startTime: string;
  endTime: string;
  bannerUrl?: string | null;
  maxAttendees?: number | null;
  isActive: boolean;
  host: {
    walletAddress: string;
    username: string | null;
    avatarUrl: string | null;
  };
  _count: {
    claims: number;
  };
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events", { cache: "no-store" });
        if (!response.ok) throw new Error("Failed to fetch events");
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error loading events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const featuredEvents = useMemo(() => {
    const sorted = [...events].sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
    return sorted.slice(0, 3);
  }, [events]);

  const formatDate = (value: string) => {
    return new Date(value).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (value: string) => {
    return new Date(value).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div>
      <Hero />

      <section className="bg-background py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
            <div>
              <div className="flex items-center gap-2 text-sm text-primary font-semibold">
                <Sparkles className="h-4 w-4" />
                Live on Stacks
              </div>
              <h2 className="text-3xl font-semibold text-foreground mt-1">
                Featured events
              </h2>
              <p className="text-muted-foreground mt-2">
                Join upcoming drops or catch live POAP claims happening now.
              </p>
            </div>

            <Button asChild variant="outline" className="rounded-lg">
              <Link href="/events" className="flex items-center gap-2">
                View all events
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, idx) => (
                <Skeleton key={idx} className="h-64 rounded-2xl" />
              ))}
            </div>
          ) : featuredEvents.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title="No events yet"
              description="Create the first Stacks POAP event and start rewarding your community."
              actionLabel="Create Event"
              actionHref="/create"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredEvents.map((event) => (
                <Card
                  key={event.id}
                  className="overflow-hidden border border-primary-dark/50 bg-gradient-to-br from-primary/5 via-background to-background"
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
                  </div>

                  <CardContent className="space-y-4 p-5">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-lg font-semibold text-foreground line-clamp-2">
                        {event.title}
                      </h3>
                      <Badge variant="secondary" className="gap-1">
                        <Users className="h-3 w-3" />
                        {event._count?.claims ?? 0}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {event.description ||
                        "Claim your on-chain proof of attendance."}
                    </p>

                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="h-4 w-4" />
                        {formatDate(event.startTime)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatTime(event.startTime)}
                      </span>
                      {event.location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        Host: {event.host.username || event.host.walletAddress}
                      </div>
                      <Button asChild size="sm" className="gap-2">
                        <Link href={`/events/${event.id}`}>
                          Claim badge
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Attendees />
      <Hosts />
      <Testimonials />
    </div>
  );
}
