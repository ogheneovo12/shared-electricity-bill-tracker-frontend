import { AppAlert } from "@/components/Alert";
import BillingSummary from "@/components/BillingSummary";
import { PurchaseCards } from "@/components/PurchaseCards";
import RoomPurchaseStats from "@/components/PurchaseStatsCards";
import RenderIf from "@/components/RenderIf";
import {
  useGetBillingSummaryQuery,
  useGetPurchasesQuery,
} from "@/lib/redux/services/bills-mgmt.api.service";
import { getErrorString } from "@/utils/error-utils";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/app/_app/purchases")({
  component: PurchasesPage,
});

export default function PurchasesPage() {
  const {
    data: purchases = [],
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetPurchasesQuery();
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const errorString = getErrorString(error);
  return (
    <div>
      <BillingSummary hideAllocation />
      <RenderIf condition={isSuccess}>
        <PurchaseCards
          purchases={purchases}
          sort={sort}
          onSortChange={setSort}
        />
      </RenderIf>
      <RenderIf condition={isError}>
        <AppAlert description={errorString} />
      </RenderIf>
      <RenderIf condition={isLoading}>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div>
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
        </div>
      </RenderIf>
    </div>
  );
}
