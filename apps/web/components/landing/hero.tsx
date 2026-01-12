import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden py-20 sm:py-28 lg:py-32"
      style={{
        backgroundImage: "url('/hero-gradient.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay for depth */}
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-foreground mb-6">
            Proof of Attendance Pass
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-gray-200 leading-relaxed mb-12">
            Issue secure, on-chain NFT badges to your community using Stacks
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="cursor-pointer rounded-md"
            >
              <Link href="/events" className="flex items-center gap-2">
                Explore Events
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>

            <Button asChild size="lg" className="cursor-pointer rounded-md">
              <Link href="/create" className="flex items-center gap-2">
                Start Hosting
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
