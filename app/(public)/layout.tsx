import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicNav } from "@/components/layout/PublicNav";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <div className="ambient-orb -top-24 left-[-8rem] h-72 w-72 bg-primary/10" />
        <div
          className="ambient-orb bottom-24 right-[-6rem] h-80 w-80 bg-accent/10"
          style={{ animationDelay: "2.5s" }}
        />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <PublicNav />
        <main id="main-content" className="flex-1">{children}</main>
        <PublicFooter />
      </div>
    </div>
  );
}
