"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote:
      "Implementing NFT badges was seamless. It instantly increased our event attendance and gave our community a real sense of ownership.",
    author: "Jane S.",
    role: "Event Organizer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
  },
  {
    id: 2,
    quote:
      "As an attendee, it's so satisfying to have a definitive, beautiful record of all the major Bitcoin L2 events I've joined.",
    author: "Evan M. Stokes Hacker",
    role: "Community Member",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=evan",
  },
  {
    id: 3,
    quote:
      "POAP on Stacks has transformed how we track and verify community participation. The technology is solid and user-friendly.",
    author: "Alex R.",
    role: "Community Lead",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
  },
  {
    id: 4,
    quote:
      "The ability to create and distribute badges without any technical hassle has been a game-changer for our organization.",
    author: "Maria L.",
    role: "Event Manager",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria",
  },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const getVisibleTestimonials = () => {
    const items = [];
    for (let i = 0; i < 2; i++) {
      const index = (currentIndex + i) % testimonials.length;
      items.push(testimonials[index]);
    }
    return items;
  };

  return (
    <section className="relative overflow-hidden bg-background py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-foreground">
            Trusted by the <span className="text-primary">Stacks</span>{" "}
            Community
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="mb-10 grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
          {getVisibleTestimonials().map((testimonial) => (
            <Card
              key={testimonial.id}
              className="relative overflow-hidden border border-primary-dark/50 bg-gradient-to-tr from-primary/50 via-background to-background hover:border-primary/80 transition-colors duration-300"
            >
              <CardContent className="p-6 sm:p-8">
                {/* Quote */}
                <p className="text-base sm:text-lg text-foreground/90 font-light leading-relaxed mb-6">
                  "{testimonial.quote}"
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      {testimonial.author}
                    </p>
                    <p className="text-xs text-foreground/60">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={handlePrevious}
            aria-label="Previous testimonial"
            className="h-12 w-12 rounded-xl border border-primary"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to testimonial ${index + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index >= currentIndex && index < currentIndex + 2
                    ? "w-6 bg-primary"
                    : "w-2 bg-primary-dark/40 hover:bg-primary-dark/60"
                }`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="lg"
            onClick={handleNext}
            aria-label="Next testimonial"
            className="h-12 w-12 rounded-xl border border-primary"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
