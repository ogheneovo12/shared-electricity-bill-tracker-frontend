import { IRoomSummaryReport } from "@/lib/redux/services/bills-mgmt.api.service";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { formatCurrency } from "@/lib/utils";

const RoomPurchaseStats = ({ report }: { report?: IRoomSummaryReport }) => {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>
          {" "}
          <span>{report?.room}-</span>
          <span className="lowercase">
            {report?.currentOccupant?.first_name}
          </span>
        </CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {formatCurrency(report?.amountContributed)}{" "}
          <small className="text-sm">spent</small>
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="text-muted-foreground">
          <p className="text-sm">
            Total Unit Bought:{" "}
            <span className="font-semibold text-primary">
              {formatCurrency(report?.unitsPurchased, false)}
            </span>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RoomPurchaseStats;
