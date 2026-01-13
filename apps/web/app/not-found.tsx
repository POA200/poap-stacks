import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6 py-16">
      <div className="relative overflow-hidden w-full max-w-3xl rounded-3xl border border-[#5546FF]/30 bg-gradient-to-br from-[#5546FF]/15 via-background to-background shadow-[0_20px_60px_-30px_rgba(85,70,255,0.6)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(85,70,255,0.22),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(85,70,255,0.18),transparent_35%)]" />

        <div className="relative px-8 sm:px-12 py-14 sm:py-16 flex flex-col items-center text-center gap-6">
          <div className="relative">
            <div className="h-28 w-28 rounded-2xl bg-gradient-to-br from-[#6D5FFF] via-[#5546FF] to-[#2C1EE8] shadow-[0_18px_40px_-18px_rgba(0,0,0,0.55),0_12px_32px_rgba(85,70,255,0.35)] flex items-center justify-center">
              <div className="h-20 w-20 rounded-2xl bg-background/60 backdrop-blur-sm border border-white/10 shadow-[inset_0_6px_12px_rgba(255,255,255,0.08),0_10px_18px_rgba(0,0,0,0.25)] flex items-center justify-center">
                <AlertTriangle className="h-10 w-10 text-white drop-shadow-[0_6px_12px_rgba(0,0,0,0.25)]" />
              </div>
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-3 w-24 rounded-full bg-[#2C1EE8]/30 blur-xl" />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold tracking-[0.2em] text-[#5546FF]">
              404
            </p>
            <h1 className="text-3xl sm:text-4xl font-semibold text-foreground">
              Page not found
            </h1>
            <p className="text-muted-foreground max-w-xl">
              The page you are looking for has moved or does not exist.
              Let&apos;s take you back to home base.
            </p>
          </div>

          <Button
            asChild
            size="lg"
            className="px-6 bg-[#5546FF] hover:bg-[#4638d8]"
          >
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
