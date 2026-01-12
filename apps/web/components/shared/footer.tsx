import Image from "next/image";
import Link from "next/link";
import { Github, Mail, Twitter } from "lucide-react";

const productLinks = [
  { href: "/events", label: "Events" },
  { href: "/badges", label: "Badges" },
  { href: "/create", label: "Create Event" },
];

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const legalLinks = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/PoapHeaderLogo.svg"
                alt="POAP Stacks"
                width={140}
                height={40}
                className="h-8 w-auto"
                priority
              />
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Proof of attendance badges on Stacks — create, distribute, and
              showcase verifiable participation.
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="#"
                aria-label="Twitter"
                className="text-muted-foreground hover:text-foreground"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                aria-label="GitHub"
                className="text-muted-foreground hover:text-foreground"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                aria-label="Email"
                className="text-muted-foreground hover:text-foreground"
              >
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <FooterColumn title="Product" links={productLinks} />
          <FooterColumn title="Company" links={companyLinks} />
          <FooterColumn title="Legal" links={legalLinks} />
        </div>

        <div className="mt-10 border-t border-primary-dark pt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground">
          <p>© {year} POAP on Stacks. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h4 className="text-sm font-semibold mb-4">{title}</h4>
      <nav aria-label={title} className="space-y-2">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="block text-sm text-muted-foreground hover:text-foreground"
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
