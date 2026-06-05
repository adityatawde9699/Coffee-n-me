"use client";

import { signIn } from "next-auth/react";
import { Coffee, GitBranch } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SignInContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Background decorative blobs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse-soft pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/5 rounded-full blur-3xl animate-pulse-soft pointer-events-none" style={{ animationDelay: "1.5s" }} />

      <div className="relative z-10 w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2.5 group mb-6">
            <Coffee className="w-7 h-7 text-primary transition-transform duration-300 group-hover:rotate-12" />
            <span className="text-2xl font-heading font-semibold tracking-tight">
              Coffee&apos;n me
            </span>
          </Link>
          <h1 className="text-3xl font-heading font-bold tracking-tight mt-4 mb-2">
            Welcome back
          </h1>
          <p className="text-muted-foreground font-serif italic">
            Sign in to continue reading and writing
          </p>
        </div>

        {/* Sign-in card */}
        <div className="glass-card rounded-2xl p-8 flex flex-col gap-4">
          {/* GitHub */}
          <button
            onClick={() => signIn("github", { callbackUrl })}
            className="flex items-center justify-center gap-3 w-full px-6 py-3.5 rounded-full bg-foreground text-background font-heading font-medium text-sm hover:opacity-90 transition-all duration-300"
          >
            <GitBranch className="w-4 h-4" />
            Continue with GitHub
          </button>

          {/* Google */}
          <button
            onClick={() => signIn("google", { callbackUrl })}
            className="flex items-center justify-center gap-3 w-full px-6 py-3.5 rounded-full border border-border/60 font-heading font-medium text-sm hover:border-primary/30 hover:text-primary transition-all duration-300"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/30" />
            </div>
            <div className="relative flex justify-center text-xs text-muted-foreground">
              <span className="bg-card px-3">or</span>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            By signing in, you agree to our{" "}
            <Link href="/terms" className="text-primary hover:underline">Terms</Link>
            {" "}and{" "}
            <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
          </p>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          <Link href="/" className="hover:text-primary transition-colors duration-300">
            ← Back to homepage
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Coffee className="w-8 h-8 text-primary/40 animate-pulse" />
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}
