export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <article className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Privacy Policy
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Last Updated: January 17, 2026
        </p>

        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              1. Introduction
            </h2>
            <p>
              POAP on Stacks (&quot;we,&quot; &quot;our,&quot; or
              &quot;us&quot;) is committed to protecting your privacy. This
              Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you use our decentralized
              application and services. Please read this policy carefully.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              2. Information We Collect
            </h2>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">
              2.1 Blockchain Data
            </h3>
            <p>
              When you interact with our Service, certain information is
              recorded on the Stacks blockchain, which is publicly accessible.
              This includes:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Your Stacks wallet address</li>
              <li>
                Transaction history related to POAP badge minting and transfers
              </li>
              <li>Smart contract interactions</li>
              <li>Timestamp of transactions</li>
            </ul>
            <p className="mt-3">
              <strong>Note:</strong> Blockchain data is permanent, public, and
              cannot be deleted or modified. This is inherent to blockchain
              technology and not within our control.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">
              2.2 Information You Provide
            </h3>
            <p>When creating events or badges, you may provide:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Event names, descriptions, and dates</li>
              <li>Badge artwork and metadata</li>
              <li>
                Contact information (if voluntarily submitted through forms)
              </li>
              <li>Email addresses (for event organizers, if provided)</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">
              2.3 Automatically Collected Information
            </h3>
            <p>
              We may collect certain technical information automatically,
              including:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Pages visited and features used</li>
              <li>Access times and duration</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              3. How We Use Your Information
            </h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Provide, operate, and maintain the Service</li>
              <li>Process and facilitate blockchain transactions</li>
              <li>Improve and personalize your experience</li>
              <li>
                Communicate with you about the Service, including updates and
                support
              </li>
              <li>Monitor and analyze usage patterns and trends</li>
              <li>
                Detect, prevent, and address technical issues or fraudulent
                activity
              </li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              4. Information Sharing and Disclosure
            </h2>
            <p>
              We do not sell, rent, or trade your personal information. We may
              share information in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>
                <strong className="text-foreground">Blockchain Data:</strong>{" "}
                All transaction data is publicly available on the Stacks
                blockchain
              </li>
              <li>
                <strong className="text-foreground">Service Providers:</strong>{" "}
                With trusted third-party service providers who assist in
                operating the Service
              </li>
              <li>
                <strong className="text-foreground">Legal Requirements:</strong>{" "}
                When required by law or to protect our rights and safety
              </li>
              <li>
                <strong className="text-foreground">Business Transfers:</strong>{" "}
                In connection with mergers, acquisitions, or asset sales
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              5. Data Storage and Security
            </h2>
            <p>
              We implement reasonable security measures to protect your
              information from unauthorized access, alteration, disclosure, or
              destruction. However, no method of transmission over the internet
              or electronic storage is 100% secure.
            </p>
            <p className="mt-3">
              <strong>Important:</strong> You are solely responsible for
              securing your wallet and private keys. We do not have access to
              your private keys and cannot recover them if lost.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              6. Cookies and Tracking Technologies
            </h2>
            <p>
              We may use cookies, web beacons, and similar tracking technologies
              to enhance your experience. You can control cookie settings
              through your browser preferences. Note that disabling cookies may
              limit certain features of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              7. Third-Party Services
            </h2>
            <p>
              Our Service may contain links to third-party websites, wallets, or
              services. We are not responsible for the privacy practices of
              these third parties. We encourage you to review their privacy
              policies.
            </p>
            <p className="mt-3">
              Third-party services we may integrate with include:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Stacks blockchain explorers</li>
              <li>
                Cryptocurrency wallet providers (Hiro Wallet, Leather, etc.)
              </li>
              <li>Analytics services</li>
              <li>Content delivery networks (CDNs)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              8. Your Privacy Rights
            </h2>
            <p>
              Depending on your jurisdiction, you may have the following rights:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>
                <strong className="text-foreground">Access:</strong> Request
                access to the personal information we hold about you
              </li>
              <li>
                <strong className="text-foreground">Correction:</strong> Request
                correction of inaccurate information
              </li>
              <li>
                <strong className="text-foreground">Deletion:</strong> Request
                deletion of your personal information (subject to legal
                obligations)
              </li>
              <li>
                <strong className="text-foreground">Opt-Out:</strong> Opt out of
                marketing communications
              </li>
            </ul>
            <p className="mt-3">
              <strong>Note:</strong> We cannot delete or modify information
              recorded on the blockchain, as this is technically impossible due
              to the immutable nature of blockchain technology.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              9. Children&apos;s Privacy
            </h2>
            <p>
              Our Service is not intended for children under 13 years of age (or
              the applicable age of digital consent in your jurisdiction). We do
              not knowingly collect personal information from children. If you
              believe we have inadvertently collected such information, please
              contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              10. International Data Transfers
            </h2>
            <p>
              Your information may be transferred to and processed in countries
              other than your own. These countries may have different data
              protection laws. By using the Service, you consent to such
              transfers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              11. Data Retention
            </h2>
            <p>
              We retain personal information only for as long as necessary to
              fulfill the purposes outlined in this Privacy Policy, unless a
              longer retention period is required by law. Blockchain data is
              permanent and cannot be deleted.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              12. Changes to This Privacy Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will
              be posted on this page with an updated &quot;Last Updated&quot;
              date. Your continued use of the Service after changes constitutes
              acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              13. Contact Us
            </h2>
            <p>
              If you have questions or concerns about this Privacy Policy or our
              data practices, please contact us through our contact page.
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm">
              By using POAP on Stacks, you acknowledge that you have read and
              understood this Privacy Policy and agree to its terms.
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}
