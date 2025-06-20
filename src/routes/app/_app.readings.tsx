import { AppAlert } from "@/components/Alert";
import { LastReadingStats } from "@/components/LastReadingCard";
import { MeterReadingsTable } from "@/components/ReadingsTable";
import RenderIf from "@/components/RenderIf";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ILastReading,
  useGetMeterLastReadingsQuery,
} from "@/lib/redux/services/bills-mgmt.api.service";
import { getErrorString } from "@/utils/error-utils";
import { createFileRoute } from "@tanstack/react-router";
import { formatDate } from "date-fns";

export const Route = createFileRoute("/app/_app/readings")({
  component: RouteComponent,
});


function RouteComponent() {




  return (
    <div className="space-y-6">
      <LastReadingStats />
      <MeterReadingsTable />
    </div>
  );
}
