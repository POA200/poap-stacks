import { Hero } from "@/components/landing/hero";
import { Attendees } from "@/components/landing/features/attendees";
import { Hosts } from "@/components/landing/features/hosts";
import { Testimonials } from "@/components/landing/testimonials";

export default function Home() {
  return (
    <div>
      <Hero />
      <Attendees />
      <Hosts />
      <Testimonials />
    </div>
  );
}
