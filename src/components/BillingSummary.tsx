import { AppAlert } from "@/components/Alert";
import RoomPurchaseStats from "@/components/PurchaseStatsCards";
import RenderIf from "@/components/RenderIf";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IRoomSummaryReport,
  useGetBillingSummaryQuery,
} from "@/lib/redux/services/bills-mgmt.api.service";
import { formatCurrency } from "@/lib/utils";
import { getErrorString } from "@/utils/error-utils";
import clsx from "clsx";
import { formatDate } from "date-fns";
import { TrendingDown, TrendingUp } from "lucide-react";

export const RoomSummaryCard = ({
  summary,
}: {
  summary?: IRoomSummaryReport;
}) => {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>
          {" "}
          <span>{summary?.room}-</span>
          <span className="lowercase">
            {summary?.currentOccupant?.first_name}
          </span>
        </CardDescription>
        <CardTitle
          className={clsx(
            "text-2xl font-semibold tabular-nums @[250px]/card:text-3xl",
            summary?.is_owing ? "text-destructive animate-pulse" : ""
          )}
        >
          {formatCurrency(summary?.balance, false)}{" "}
          <small className="text-sm">units</small>
        </CardTitle>
        <CardAction>
          <Badge variant={summary?.is_owing ? "destructive" : "outline"}>
            {summary?.is_owing ? <TrendingDown /> : <TrendingUp />}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <p>Unit used: {formatCurrency(summary?.unitsConsumed, false)}</p>
        {summary?.is_owing ? (
          <p>amount owed: {formatCurrency(summary.amountOwed)}</p>
        ) : null}
      </CardFooter>
    </Card>
  );
};

function BillingSummary({
  hideAllocation = false,
}: {
  hideAllocation?: boolean;
}) {
  const {
    isSuccess: isSummarySuccess,
    data = [],
    isError: isSummaryError,
    error: summaryError,
    isLoading: isLoadingSummary,
  } = useGetBillingSummaryQuery();

  const summaryErrorString = getErrorString(summaryError);
  return (
    <div className="w-full">
      <RenderIf condition={isSummarySuccess}>
        {!hideAllocation && (
          <div>
            <h3 className="text-lg font-medium">Unit Allocations</h3>
            <p className="mb-5">
              Units Allocations for each rooms based on last readings
            </p>
            <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4  *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs  @xl/main:grid-cols-2 @5xl/main:grid-cols-4 mb-5">
              {data?.map((summary) => (
                <RoomSummaryCard
                  key={`p_alloc_${summary.room}`}
                  summary={summary}
                />
              ))}
            </div>
          </div>
        )}
        <h3 className="text-lg font-medium">Money Spent</h3>
        <p className="mb-5">Amount Spent on units</p>
        <RenderIf condition={isSummarySuccess}>
          <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4  *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs  @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            {data?.map((summary) => (
              <RoomPurchaseStats
                key={`p_stats_${summary.room}`}
                report={summary}
              />
            ))}
          </div>
        </RenderIf>
      </RenderIf>
      <RenderIf condition={isSummaryError}>
        <AppAlert description={summaryErrorString} />
      </RenderIf>
      <RenderIf condition={isLoadingSummary}>
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 animate-pulse">
          <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              <div className="bg-muted/50 aspect-video rounded-xl" />
              <div className="bg-muted/50 aspect-video rounded-xl" />
              <div className="bg-muted/50 aspect-video rounded-xl" />
            </div>
          </div>
        </div>
      </RenderIf>
    </div>
  );
}

BillingSummary.propTypes = {};

export default BillingSummary;
