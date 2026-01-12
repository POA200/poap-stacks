"use client";

import { Calendar, Clock, Star, ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Event {
  id: string;
  title: string;
  host: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "upcoming" | "past";
  claimable: boolean;
  bannerGradient: string;
}

// Mock event data
const FEATURED_EVENT: Event = {
  id: "featured-1",
  title: "Stacks Defi show #80",
  host: "Stacks Foundation",
  date: "Sep 30, 2025",
  startTime: "6PM",
  endTime: "7PM",
  status: "upcoming",
  claimable: true,
  bannerGradient: "from-blue-600 via-purple-600 to-purple-800",
};

const UPCOMING_EVENTS: Event[] = Array.from({ length: 4 }, (_, i) => ({
  id: `upcoming-${i + 1}`,
  title: "Stacks Defi show #80",
  host: "Join our weekly show",
  date: "Sep 30, 2025",
  startTime: "6PM",
  endTime: "7PM",
  status: "upcoming",
  claimable: true,
  bannerGradient: "from-blue-600 via-purple-600 to-purple-800",
}));

const PAST_EVENTS: Event[] = Array.from({ length: 4 }, (_, i) => ({
  id: `past-${i + 1}`,
  title: "Stacks Defi show #80",
  host: "Join our weekly show",
  date: "Sep 30, 2025",
  startTime: "6PM",
  endTime: "7PM",
  status: "past",
  claimable: false,
  bannerGradient: "from-blue-600 via-purple-600 to-purple-800",
}));

interface EventCardProps {
  event: Event;
  featured?: boolean;
}

function EventCard({ event, featured = false }: EventCardProps) {
  return (
    <div
      className={`group relative rounded-2xl border border-primary bg-background overflow-hidden transition-all hover:shadow-lg ${
        featured ? "" : ""
      }`}
    >
      {/* Event Banner */}
      <div
        className={`relative ${
          featured ? "h-48" : "h-32"
        } bg-gradient-to-br ${event.bannerGradient} overflow-hidden`}
      >
        <div className="absolute inset-0 opacity-20 mix-blend-overlay" />
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
              }`}
            >
              {event.title}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <User className="h-3 w-3" />
            <span>{event.host}</span>
          </div>
        </div>

        {/* Date and Time */}
        <div className="flex items-center gap-2 text-xs">
          <Badge
            variant="secondary"
            className="gap-1.5 bg-primary/10 text-primary hover:bg-primary/20"
          >
            <Calendar className="h-3 w-3" />
            {event.date}
          </Badge>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>
              {event.startTime}-{event.endTime} UTC
            </span>
          </div>
        </div>

        {/* Action Button */}
        {event.claimable ? (
          <Button className="w-full gap-2 bg-primary hover:bg-primary/90">
            CLAIM BADGE
            <ArrowRight className="h-4 w-4" />
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
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Featured Event Banner */}
        <div className="mb-12">
          <div
            className={`relative h-56 rounded-3xl bg-gradient-to-br ${FEATURED_EVENT.bannerGradient} overflow-hidden shadow-xl`}
          >
            <div className="absolute inset-0 opacity-30 mix-blend-overlay" />
            {/* Optional: Add featured event details overlay here */}
          </div>
        </div>

        {/* Upcoming Events Section */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Star className="h-5 w-5 text-foreground" />
            <h2 className="text-2xl font-bold text-foreground">
              Upcoming Events
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {UPCOMING_EVENTS.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>

        {/* Past Events Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Clock className="h-5 w-5 text-foreground" />
            <h2 className="text-2xl font-bold text-foreground">Past Events</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PAST_EVENTS.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
