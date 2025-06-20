import BillingSummary from "@/components/BillingSummary";
import { LastReadingStats } from "@/components/LastReadingCard";
import { MeterReadingsTable } from "@/components/ReadingsTable";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/_app/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-full space-y-6">
      <BillingSummary />
      <LastReadingStats />
      <MeterReadingsTable />
    </div>
  );
}
