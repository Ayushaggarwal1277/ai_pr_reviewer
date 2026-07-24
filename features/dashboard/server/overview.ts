import { getUserInstallationId, getInstallationStatus } from "@/features/github/server/installation";
import { getUserSubscription } from "@/features/billing/server/subscription";
import { getUsageSummary, type UsageSummary } from "@/features/billing/server/usage";
import type { GithubInstallationStatus, UserSubscription } from "@/features/dashboard/lib/types";
import { prisma } from "@/lib/db";

export type RecentPullRequest = {
  id: string;
  repoFullName: string;
  prNumber: number;
  title: string;
  authorLogin: string | null;
  status: string;
  updatedAt: string;
};

export type DashboardOverview = {
  installation: GithubInstallationStatus;
  subscription: UserSubscription;
  usage: UsageSummary;
  reposSynced: number;
  recentPullRequests: RecentPullRequest[];
};

function buildEmptyOverview(
  installation: GithubInstallationStatus,
  subscription: UserSubscription,
  usage: UsageSummary
): DashboardOverview {
  return { installation, subscription, usage, reposSynced: 0, recentPullRequests: [] };
}

export async function getDashboardOverview(userId: string): Promise<DashboardOverview> {
  const [installation, subscription, usage, installationId] = await Promise.all([
    getInstallationStatus(userId),
    getUserSubscription(userId),
    getUsageSummary(userId),
    getUserInstallationId(userId),
  ]);

  if (!installationId) {
    return buildEmptyOverview(installation, subscription, usage);
  }

  const [reposSynced, pullRequests] = await Promise.all([
    prisma.repoSync.count({ where: { installationId, status: "synced" } }),
    prisma.pullRequest.findMany({
      where: { installationId },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
  ]);

  return {
    installation,
    subscription,
    usage,
    reposSynced,
    recentPullRequests: pullRequests.map((pr) => ({
      id: pr.id,
      repoFullName: pr.repoFullName,
      prNumber: pr.prNumber,
      title: pr.title,
      authorLogin: pr.authorLogin,
      status: pr.status,
      updatedAt: pr.updatedAt.toISOString(),
    })),
  };
}
