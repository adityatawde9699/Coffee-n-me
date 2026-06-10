import { Shield } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Coffee'n me handles your data.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20">
      <header className="mb-16 animate-fade-in">
        <div className="flex items-center gap-2 text-sm font-heading font-medium text-primary mb-4">
          <Shield className="w-4 h-4" />
          <span className="tracking-widest uppercase">Your Data</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-6">
          Privacy Policy
        </h1>
        <div className="warm-divider mb-8" />
        <p className="text-sm text-muted-foreground font-heading">
          Last updated: June 2026
        </p>
      </header>

      <div className="prose prose-neutral dark:prose-invert max-w-none font-serif text-lg leading-relaxed animate-fade-in-up space-y-8">
        <p className="text-xl text-muted-foreground italic leading-relaxed">
          We collect as little as possible and never sell what we do collect.
          Here&apos;s the plain-language version.
        </p>

        <section className="space-y-3">
          <h2 className="text-2xl font-heading font-bold tracking-tight">What we collect</h2>
          <p>
            <strong>Account data.</strong> When you sign in with GitHub or Google, we
            receive your name, email address, and avatar from that provider. We use it
            to create your account and attribute your writing.
          </p>
          <p>
            <strong>Newsletter.</strong> If you subscribe, we store your email address
            for the sole purpose of sending you new stories. Unsubscribe any time by
            contacting us.
          </p>
          <p>
            <strong>Analytics.</strong> We use PostHog to understand how readers use the
            site — page views and general usage patterns, not the contents of your drafts.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-heading font-bold tracking-tight">What we don&apos;t do</h2>
          <p>
            We don&apos;t sell your data, run third-party ad trackers, or share your email
            with anyone. Your drafts are yours; unpublished posts are visible only to you.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-heading font-bold tracking-tight">Where it lives</h2>
          <p>
            Data is stored in a PostgreSQL database hosted on Neon, and images you upload
            are stored on Cloudinary. Both are accessed over encrypted connections.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-heading font-bold tracking-tight">Your choices</h2>
          <p>
            You can request deletion of your account and all associated data by reaching
            out via our <a href="/contact" className="text-primary underline-offset-4 hover:underline">contact page</a>.
            We&apos;ll handle it promptly, no questions asked.
          </p>
        </section>
      </div>
    </div>
  );
}
