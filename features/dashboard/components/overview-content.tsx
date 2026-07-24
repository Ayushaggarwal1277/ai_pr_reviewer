/**
 * Dashboard overview body — stat cards plus a recent pull requests list.
 *
 * All data is fetched server-side by `page.tsx` via `getDashboardOverview`
 * and passed down as props.
 */

"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowSquareOut,
  GitBranch,
  GitPullRequest,
  GithubLogo,
  Sparkle,
} from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";
import { PLAN_DETAILS } from "@/features/settings/lib/plan-details";
import { statusBadge, type statusBadgeClass } from "@/features/dashboard/lib/status-style";
import type { DashboardOverview, RecentPullRequest } from "@/features/dashboard/server/overview";

type OverviewContentProps = {
  overview: DashboardOverview;
};

type StatCard = {
  label: string;
  value: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
};

const PR_STATUS_TONE: Record<string, keyof typeof statusBadgeClass> = {
  pending: "neutral",
  processing: "info",
  reviewed: "success",
  rate_limited: "warning",
};

function getPrStatusTone(status: string): keyof typeof statusBadgeClass {
  return PR_STATUS_TONE[status] ?? "neutral";
}

function getUsageHint(usage: DashboardOverview["usage"]) {
  if (usage.limit === null) {
    return "Unlimited on your current plan";
  }

  return `${Math.max(usage.limit - usage.used, 0)} remaining this month`;
}

function buildStatCards(overview: DashboardOverview): StatCard[] {
  const { installation, usage, reposSynced, subscription } = overview;
  const planLabel = PLAN_DETAILS[subscription.plan].label;

  return [
    {
      label: "GitHub App",
      value: installation.connected ? "Connected" : "Not connected",
      hint: installation.connected
        ? `Installed for @${installation.accountLogin}`
        : "Install the app to get started",
      icon: GithubLogo,
    },
    {
      label: "Repositories synced",
      value: String(reposSynced),
      hint: "Indexed and ready for review",
      icon: GitBranch,
    },
    {
      label: "Reviews this month",
      value:
        usage.limit === null ? `${usage.used}` : `${usage.used} / ${usage.limit}`,
      hint: getUsageHint(usage),
      icon: GitPullRequest,
    },
    {
      label: "Plan",
      value: planLabel,
      hint: subscription.status === "active" ? "Active" : subscription.status,
      icon: Sparkle,
    },
  ];
}

function StatCards({ overview }: { overview: DashboardOverview }) {
  const cards = buildStatCards(overview);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.label}
            </CardTitle>
            <card.icon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{card.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{card.hint}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function PullRequestRow({ pullRequest }: { pullRequest: RecentPullRequest }) {
  const prUrl = `https://github.com/${pullRequest.repoFullName}/pull/${pullRequest.prNumber}`;

  return (
    <li className="flex items-center justify-between gap-4 border-b border-border px-4 py-3 last:border-b-0">
      <div className="flex min-w-0 flex-col">
        <a
          href={prUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 truncate text-sm font-medium hover:underline"
        >
          {pullRequest.title}
          <ArrowSquareOut className="size-3 shrink-0 opacity-60" />
        </a>
        <p className="truncate text-xs text-muted-foreground">
          {pullRequest.repoFullName} #{pullRequest.prNumber}
          {pullRequest.authorLogin ? ` · @${pullRequest.authorLogin}` : ""}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span className={statusBadge(getPrStatusTone(pullRequest.status))}>
          {pullRequest.status.replace("_", " ")}
        </span>
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(pullRequest.updatedAt), { addSuffix: true })}
        </span>
      </div>
    </li>
  );
}

function RecentPullRequests({ overview }: { overview: DashboardOverview }) {
  const { installation, recentPullRequests } = overview;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent pull requests</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        {!installation.connected ? (
          <div className="flex flex-col items-center gap-3 px-4 py-8 text-center">
            <p className="text-sm text-muted-foreground">
              Connect the GitHub App to start reviewing pull requests.
            </p>
            <Button asChild size="sm">
              <Link href={DASHBOARD_ROUTES.github}>Go to GitHub App</Link>
            </Button>
          </div>
        ) : recentPullRequests.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            No pull requests reviewed yet. Open a PR on a synced repository to see it here.
          </p>
        ) : (
          <ul>
            {recentPullRequests.map((pullRequest) => (
              <PullRequestRow key={pullRequest.id} pullRequest={pullRequest} />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export function OverviewContent({ overview }: OverviewContentProps) {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <StatCards overview={overview} />
      <RecentPullRequests overview={overview} />
    </div>
  );
}
