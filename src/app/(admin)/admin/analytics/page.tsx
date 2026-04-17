import { getTeamAnalytics } from "@/actions/admin";
import { PageHeader } from "@/components/shared/page-header";
import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard";

export const metadata = { title: "Analysen – Admin – brillen.de Academy" };

export default async function AdminAnalyticsPage() {
  const { data, error } = await getTeamAnalytics();

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Team-Analysen"
        description="Leistungsüberblick über alle Lernenden."
      />
      {error ? (
        <p className="text-destructive">{error}</p>
      ) : data ? (
        <AnalyticsDashboard analytics={data} />
      ) : null}
    </div>
  );
}
