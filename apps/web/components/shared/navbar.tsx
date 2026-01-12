"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import WalletConnect from "./wallet-connect";

const links = [
  { href: "/events", label: "Events" },
  { href: "/badges", label: "Badges" },
  { href: "/create", label: "Create Event" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

  // Prevent body scroll when the mobile menu is open
  useEffect(() => {
    const body = document.body;
    if (open) {
      body.classList.add("overflow-hidden");
    } else {
      body.classList.remove("overflow-hidden");
    }
    return () => body.classList.remove("overflow-hidden");
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-primary-dark bg-background/20 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-lg"
          >
            <Image
              src="/PoapHeaderLogo.svg"
              alt="POAP Stacks"
              width={120}
              height={40}
              priority
              className="h-8 w-auto"
            />
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative transition-colors ${
                  isActive(link.href)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute inset-x-0 -bottom-2 mx-auto h-0.5 w-full bg-primary" />
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            <WalletConnect />
          </div>

          {/* Mobile toggle */}
          <button
            aria-label="Toggle menu"
            aria-expanded={open}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border/80 text-foreground md:hidden"
            onClick={() => setOpen((prev) => !prev)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile full-screen sidebar overlay */}
      <div
        className={`md:hidden fixed inset-0 z-[999] transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setOpen(false)}
        />

        {/* Sidebar panel */}
        <div
          role="dialog"
          aria-modal="true"
          className={`absolute right-0 top-0 h-full w-[80%] max-w-sm bg-background border-l border-primary-dark shadow-2xl transition-transform duration-300 ease-out ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
        >
          <div className="flex h-16 items-center justify-between px-4">
            <Link
              href="/"
              className="inline-flex items-center"
              onClick={() => setOpen(false)}
            >
              <Image
                src="/PoapHeaderLogo.svg"
                alt="POAP Stacks"
                width={120}
                height={32}
                className="h-8 w-auto"
                priority
              />
            </Link>
            <button
              aria-label="Close menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border/80"
              onClick={() => setOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          <div className="px-4 py-4">
            <nav className="flex flex-col gap-1 text-base font-medium">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between rounded-lg px-3 py-3 transition-colors ${
                    isActive(link.href)
                      ? "bg-primary/10 text-foreground"
                      : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="mt-4">
                <WalletConnect />
              </div>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
