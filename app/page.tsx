import { getServerSession } from "@/features/auth/actions";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  GitPullRequest,
  Zap,
  ShieldCheck,
  ArrowRight,
  GitBranch,
  Code2,
  MessageSquareCode,
} from "lucide-react";

export default async function Home() {
  const session = await getServerSession();
  const ctaHref = session ? "/dashboard" : "/sign-in?callbackUrl=/dashboard";

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-black text-white">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 h-[400px] w-[600px] rounded-full bg-blue-600/10 blur-[100px]" />
        <div className="absolute right-0 top-1/3 h-[300px] w-[400px] rounded-full bg-indigo-600/10 blur-[80px]" />
      </div>

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Navbar */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10 lg:px-16">
        <div className="flex items-center gap-3">
          <Image
            src="/logoipsum-327.svg"
            alt="AI PR Reviewer"
            width={32}
            height={32}
            className="opacity-90"
          />
          <span className="text-sm font-semibold tracking-wide text-white/80">
            AI PR Reviewer
          </span>
        </div>
        <nav className="flex items-center gap-3">
          {session ? (
            <Link href="/dashboard">
              <Button size="sm" variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                Dashboard
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          ) : (
            <Link href="/sign-in">
              <Button size="sm" variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                <GitBranch className="mr-1.5 h-3.5 w-3.5" />
                Sign in
              </Button>
            </Link>
          )}
        </nav>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-20 text-center sm:px-10">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-medium text-violet-300">
          <Zap className="h-3 w-3 fill-violet-300" />
          AI-powered code review, instantly
        </div>

        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-2xl shadow-violet-500/20 backdrop-blur-sm">
            <Image
              src="/logoipsum-327.svg"
              alt="AI PR Reviewer"
              width={52}
              height={52}
            />
          </div>
        </div>

        {/* Headline */}
        <h1 className="mb-5 max-w-3xl text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
          Smarter{" "}
          <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            pull request
          </span>{" "}
          reviews with AI
        </h1>

        {/* Subtitle */}
        <p className="mb-10 max-w-xl text-lg leading-relaxed text-white/50 sm:text-xl">
          Connect your GitHub repositories and get instant, intelligent feedback
          on every pull request — so your team ships better code, faster.
        </p>

        {/* CTA */}
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Link href={ctaHref}>
            <Button
              size="lg"
              className="group h-12 gap-2 bg-gradient-to-r from-violet-600 to-blue-600 px-8 text-base font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:from-violet-500 hover:to-blue-500 hover:shadow-violet-500/40"
            >
              Go to Dashboard
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
          <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              variant="outline"
              className="h-12 gap-2 border-white/10 bg-white/5 px-8 text-base text-white/70 hover:bg-white/10 hover:text-white"
            >
              <GitBranch className="h-4 w-4" />
              View on GitHub
            </Button>
          </Link>
        </div>

        {session && (
          <p className="mt-4 text-sm text-white/30">
            Signed in as{" "}
            <span className="text-white/50">{session.user.email}</span>
          </p>
        )}

        {/* Feature cards */}
        <div className="mt-24 grid w-full max-w-4xl gap-4 sm:grid-cols-3">
          <FeatureCard
            icon={<GitPullRequest className="h-5 w-5 text-violet-400" />}
            title="Automated reviews"
            description="Every PR gets a thorough AI review the moment it opens — no waiting, no manual triaging."
          />
          <FeatureCard
            icon={<Code2 className="h-5 w-5 text-blue-400" />}
            title="Deep code analysis"
            description="Catches bugs, security issues, and style violations before they reach production."
          />
          <FeatureCard
            icon={<MessageSquareCode className="h-5 w-5 text-cyan-400" />}
            title="Actionable feedback"
            description="Inline comments with clear explanations and suggestions your team can act on immediately."
          />
        </div>

        {/* Security note */}
        <div className="mt-16 flex items-center gap-2 text-xs text-white/25">
          <ShieldCheck className="h-3.5 w-3.5" />
          GitHub OAuth — we only request the permissions needed to read your pull requests.
        </div>
      </main>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 text-left backdrop-blur-sm transition-colors hover:border-white/10 hover:bg-white/[0.05]">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5">
        {icon}
      </div>
      <h3 className="mb-1.5 text-sm font-semibold text-white/90">{title}</h3>
      <p className="text-sm leading-relaxed text-white/40">{description}</p>
    </div>
  );
}
