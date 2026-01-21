"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, Star, ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ipfsToHttp } from "@/lib/utils";
import Link from "next/link";

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
  hostId: string;
  host: {
    id: string;
    walletAddress: string;
    username: string | null;
    avatarUrl: string | null;
  };
  _count: {
    claims: number;
  };
}

interface EventCardProps {
  event: Event;
  featured?: boolean;
}

function EventCard({ event, featured = false }: EventCardProps) {
  const now = new Date();
  const startTime = new Date(event.startTime);
  const endTime = new Date(event.endTime);

  const isLive = now >= startTime && now <= endTime && event.isActive;
  const isPast = now > endTime || !event.isActive;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getBannerGradient = () => {
    if (isLive) return "from-red-500 via-orange-500 to-pink-600";
    if (isPast) return "from-gray-500 via-gray-600 to-gray-700";
    return "from-blue-600 via-purple-600 to-purple-800";
  };

  return (
    <div
      className={`group relative rounded-2xl border ${
        isLive ? "border-red-500/50" : "border-primary"
      } bg-background overflow-hidden transition-all hover:shadow-lg ${
        featured ? "" : ""
      }`}
    >
      {/* Live Indicator */}
      {isLive && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-red-500 text-white px-2.5 py-1 rounded-full text-xs font-semibold shadow-lg">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          LIVE
        </div>
      )}

      {/* Event Banner */}
      <div
        className={`relative ${
          featured ? "h-48" : "h-32"
        } bg-gradient-to-br ${getBannerGradient()} overflow-hidden`}
      >
        {event.bannerUrl ? (
          <img
            src={ipfsToHttp(event.bannerUrl) || event.bannerUrl}
            alt={event.title}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="absolute inset-0 opacity-20 mix-blend-overlay" />
        )}
      </div>

      {/* Event Details */}
      <div className="p-4 space-y-3">
        {/* Title and Host */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <h3
              className={`font-medium text-foreground ${
                featured ? "text-lg" : "text-base"
              } truncate`}
            >
              {event.title}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <User className="h-3 w-3" />
            <span className="truncate">
              {event.host.username ||
                event.host.walletAddress.slice(0, 8) + "..."}
            </span>
          </div>
        </div>

        {/* Date and Time */}
        <div className="flex items-center gap-2 text-xs">
          <Badge
            variant="secondary"
            className={`gap-1.5 ${
              isLive
                ? "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                : "bg-primary/10 text-primary hover:bg-primary/20"
            }`}
          >
            <Calendar className="h-3 w-3" />
            {formatDate(startTime)}
          </Badge>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>
              {formatTime(startTime)}-{formatTime(endTime)}
            </span>
          </div>
        </div>

        {/* Live Stats */}
        {isLive && event.maxAttendees && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Claims:</span>
            <span className="font-semibold">
              {event._count.claims} / {event.maxAttendees}
            </span>
          </div>
        )}

        {/* Action Button */}
        {!isPast ? (
          <Button
            className={`w-full gap-2 ${
              isLive
                ? "bg-red-500 hover:bg-red-600 animate-pulse"
                : "bg-primary hover:bg-primary/90"
            }`}
            asChild
          >
            <Link href={`/events/${event.id}`}>
              {isLive ? "CLAIM NOW" : "CLAIM BADGE"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <Button
            variant="secondary"
            className="w-full cursor-not-allowed"
            disabled
          >
            Event Ended
          </Button>
        )}
      </div>
    </div>
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events");
        if (!response.ok) throw new Error("Failed to fetch events");
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Categorize events
  const now = new Date();
  const liveEvents = events.filter((event) => {
    const startTime = new Date(event.startTime);
    const endTime = new Date(event.endTime);
    return now >= startTime && now <= endTime && event.isActive;
  });

  const upcomingEvents = events.filter((event) => {
    const startTime = new Date(event.startTime);
    return now < startTime;
  });

  const pastEvents = events.filter((event) => {
    const endTime = new Date(event.endTime);
    return now > endTime || !event.isActive;
  });

  const featuredEvent = upcomingEvents[0] || liveEvents[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <Skeleton className="h-56 rounded-3xl mb-12" />
          <div className="space-y-12">
            <div>
              <Skeleton className="h-8 w-48 mb-6" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-80 rounded-2xl" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <EmptyState
            icon={Calendar}
            title="No Events Yet"
            description="Be the first to create a POAP event and start building your community's on-chain legacy."
            actionLabel="Create Event"
            actionHref="/create"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Featured Event Banner */}
        {featuredEvent && (
          <div className="mb-12">
            <div
              className={`relative h-56 rounded-3xl bg-gradient-to-br ${
                new Date() >= new Date(featuredEvent.startTime) &&
                new Date() <= new Date(featuredEvent.endTime)
                  ? "from-red-500 via-orange-500 to-pink-600"
                  : "from-blue-600 via-purple-600 to-purple-800"
              } overflow-hidden shadow-xl`}
            >
              {featuredEvent.bannerUrl ? (
                <img
                  src={
                    ipfsToHttp(featuredEvent.bannerUrl) ||
                    featuredEvent.bannerUrl
                  }
                  alt={featuredEvent.title}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="absolute inset-0 opacity-30 mix-blend-overlay" />
              )}
            </div>
          </div>
        )}

        {/* Live Events Section */}
        {liveEvents.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <div className="relative flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <h2 className="text-2xl font-bold text-foreground">
                  Live Events
                </h2>
              </div>
              <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20">
                {liveEvents.length} Active
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {liveEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}

        {/* Upcoming Events Section */}
        {upcomingEvents.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Star className="h-5 w-5 text-foreground" />
              <h2 className="text-2xl font-bold text-foreground">
                Upcoming Events
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}

        {/* Past Events Section */}
        {pastEvents.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Clock className="h-5 w-5 text-foreground" />
              <h2 className="text-2xl font-bold text-foreground">
                Past Events
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
