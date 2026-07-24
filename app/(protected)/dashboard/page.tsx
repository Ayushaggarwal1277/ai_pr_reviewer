import type { Metadata } from "next";

import { requireAuth } from "@/features/auth/actions";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { OverviewContent } from "@/features/dashboard/components/overview-content";
import { getDashboardOverview } from "@/features/dashboard/server/overview";

export const metadata: Metadata = {
  title: "Overview · Dashboard",
};

const Dashboard = async () => {
  const session = await requireAuth();
  const overview = await getDashboardOverview(session.user.id);

  return (
    <>
      <DashboardHeader
        title="Overview"
        description="A snapshot of your GitHub App connection, usage, and recent reviews."
      />
      <OverviewContent overview={overview} />
    </>
  );
};

export default Dashboard;