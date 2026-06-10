import { Scale } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The ground rules for using Coffee'n me.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20">
      <header className="mb-16 animate-fade-in">
        <div className="flex items-center gap-2 text-sm font-heading font-medium text-primary mb-4">
          <Scale className="w-4 h-4" />
          <span className="tracking-widest uppercase">The Ground Rules</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-6">
          Terms of Service
        </h1>
        <div className="warm-divider mb-8" />
        <p className="text-sm text-muted-foreground font-heading">
          Last updated: June 2026
        </p>
      </header>

      <div className="prose prose-neutral dark:prose-invert max-w-none font-serif text-lg leading-relaxed animate-fade-in-up space-y-8">
        <p className="text-xl text-muted-foreground italic leading-relaxed">
          Coffee&apos;n me is a calm place to read and write. These terms exist to keep
          it that way.
        </p>

        <section className="space-y-3">
          <h2 className="text-2xl font-heading font-bold tracking-tight">Your account</h2>
          <p>
            You sign in through GitHub or Google and are responsible for activity under
            your account. You must be old enough to hold an account with those providers
            to use ours.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-heading font-bold tracking-tight">Your writing</h2>
          <p>
            You own everything you publish here. By posting, you grant Coffee&apos;n me a
            license to display and distribute your work on the platform — nothing more.
            Delete a post and that license ends with it.
          </p>
          <p>
            Don&apos;t publish content you don&apos;t have the right to share, and
            don&apos;t use the platform for spam, harassment, or anything illegal. We
            reserve the right to remove content or accounts that break these rules.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-heading font-bold tracking-tight">The service</h2>
          <p>
            We work hard to keep the site available and your work safe, but the service
            is provided &quot;as is&quot; without warranties. We may update features over
            time; if we ever make a change that meaningfully affects your content,
            we&apos;ll say so.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-heading font-bold tracking-tight">Questions</h2>
          <p>
            Anything unclear? Reach out via our{" "}
            <a href="/contact" className="text-primary underline-offset-4 hover:underline">contact page</a> —
            we&apos;re happy to talk it through over a virtual coffee.
          </p>
        </section>
      </div>
    </div>
  );
}
