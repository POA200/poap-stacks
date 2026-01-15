import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";

const attendeeHighlights = [
  {
    title: "On-Chain, Forever",
    description:
      "Badges are non-fungible tokens minted directly on Stacks, providing immutable, verifiable proof of attendance.",
    image: "/chain-link-icon.svg",
    alt: "On-chain badge security icon",
  },
  {
    title: "One Place for All Achievements",
    description:
      "Easily view, filter, and share your entire collection from your personal badge dashboard.",
    image: "/dashboard-icon.svg",
    alt: "Badge dashboard icon",
  },
];

export function Attendees() {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [isVisible, setIsVisible] = useState<boolean[]>([false, false]);

  useEffect(() => {
    const observers = cardsRef.current.map((card, index) => {
      if (!card) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsVisible((prev) => {
            const newState = [...prev];
            newState[index] = entry.isIntersecting;
            return newState;
          });
        },
        {
          threshold: 0.1,
        }
      );

      observer.observe(card);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, []);
  return (
    <section
      id="attendees"
      className="relative overflow-hidden bg-background py-16 sm:py-20 lg:py-24"
    >
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mt-3 text-3xl sm:text-4xl font-medium text-foreground">
            Collect Your Digital Legacy
          </h2>
          <p className="mt-4 text-base sm:text-lg text-foreground font-light leading-relaxed">
            Never lose proof of your participation. Your badges are held
            securely in your Stacks wallet.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:gap-10 md:grid-cols-2 max-w-6xl mx-auto">
          {attendeeHighlights.map((item, index) => (
            <Card
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              key={item.title}
              className={`relative overflow-hidden border border-primary-dark bg-gradient-to-br from-primary-dark via-background to-background rounded-4xl transition-opacity duration-700 ${
                isVisible[index] ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="pointer-events-none absolute inset-0" />
              <CardContent className="relative px-8 py-10">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-6 flex items-center justify-center p-4">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      width={120}
                      height={120}
                      className="h-48 w-auto object-contain"
                      priority
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm sm:text-md text-foreground/80 font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mx-auto mt-10 flex max-w-3xl justify-center">
          <Button
            asChild
            size="lg"
            className="cursor-pointer w-full rounded-lg"
          >
            <Link href="/badges" className="flex items-center gap-2">
              View My Badges
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
