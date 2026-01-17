export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <article className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-bold tracking-tight mb-6">
          About POAP on Stacks
        </h1>

        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <p className="text-lg">
            Welcome to the future of digital memory — where every moment
            matters, every gathering counts, and every experience lives forever
            on Bitcoin.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
            What is POAP?
          </h2>
          <p>
            POAP (Proof of Attendance Protocol) represents a revolutionary way
            to bookmark life's moments. These aren't just NFTs — they're digital
            mementos that prove "I was there." Whether it's a conference,
            concert, community meetup, or virtual workshop, POAPs serve as your
            personal time capsule of experiences.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
            Why Stacks? Why Bitcoin?
          </h2>
          <p>
            By building on Stacks, we bring POAPs to the most secure and
            decentralized network in existence: Bitcoin. Stacks enables smart
            contracts on Bitcoin without compromising the base layer's security
            or requiring changes to Bitcoin itself.
          </p>
          <p>
            This means your attendance badges benefit from Bitcoin's
            unparalleled security while leveraging Clarity smart contracts for
            predictable, safe transactions. Your memories aren't just stored —
            they're <em>secured by Bitcoin</em>.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
            Our Vision
          </h2>
          <p>
            We believe that proof of participation matters. The events you
            attend, the communities you join, and the moments you share shape
            who you are. In Web3, your participation history should be portable,
            verifiable, and truly yours.
          </p>
          <p>
            POAP on Stacks empowers event organizers to create meaningful
            digital artifacts that attendees can collect, showcase, and
            treasure. It's not about speculation — it's about celebration.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
            The Bitcoin Standard for Memories
          </h2>
          <p>
            Just as Bitcoin represents sound money, we're building sound
            memories. Each POAP badge is:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>
              <strong className="text-foreground">Immutable</strong> — Your
              attendance record can't be altered or erased
            </li>
            <li>
              <strong className="text-foreground">Provable</strong> —
              Cryptographically verified on the blockchain
            </li>
            <li>
              <strong className="text-foreground">Owned</strong> — Truly yours,
              stored in your wallet
            </li>
            <li>
              <strong className="text-foreground">Secured</strong> — Protected
              by Bitcoin's hash power
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
            Join the Movement
          </h2>
          <p>
            Whether you're an event organizer looking to reward your community
            or an attendee eager to collect proof of your journey, POAP on
            Stacks is your gateway to Web3 reputation and verifiable
            participation.
          </p>
          <p>
            Let's build a world where experiences matter, communities thrive,
            and every moment is preserved on the strongest foundation in crypto
            — Bitcoin.
          </p>

          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm italic">
              Built with ❤️ on Stacks. Secured by Bitcoin. Powered by community.
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}
