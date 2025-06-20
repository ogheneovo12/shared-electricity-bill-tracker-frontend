import {
  ILastReading,
  useGetMeterLastReadingsQuery,
} from "@/lib/redux/services/bills-mgmt.api.service";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { formatDate } from "date-fns";
import RenderIf from "./RenderIf";
import { AppAlert } from "./Alert";
import { getErrorString } from "@/utils/error-utils";
import { formatCurrency } from "@/lib/utils";

const LastReadingCard = ({ reading }: { reading?: ILastReading }) => {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>
          {" "}
          <span>{reading?.room}-</span>
          <span className="lowercase">
            {reading?.currentOccupant?.first_name}
          </span>
        </CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {formatCurrency(reading?.lastReading,false)}{" "}
          <small className="text-sm">units used</small>
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        {reading?.lastReadingDate ? (
          <div className="text-muted-foreground">
            <p className="text-sm">
              Last reading Date:{" "}
              <span className="font-semibold text-primary">
                {formatDate(reading.lastReadingDate, "MM/dd/yyyy")}
              </span>
            </p>
          </div>
        ) : null}
      </CardFooter>
    </Card>
  );
};

export const LastReadingStats = () => {
  const {
    data = [],
    isLoading,
    isError,
    error,
    isSuccess,
  } = useGetMeterLastReadingsQuery();
  const errorString = getErrorString(error);

  return (
    <div className="w-full">
      <h3 className="text-lg font-medium">Last Readings</h3>
      <p className="mb-5">
        The Last Total Reading Recorded From Each Room meter
      </p>
      <RenderIf condition={isSuccess}>
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4  *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs  @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
          {data?.map((reading) => (
            <LastReadingCard key={reading.room} reading={reading} />
          ))}
        </div>
      </RenderIf>
      <RenderIf condition={isError}>
        <AppAlert description={errorString} />
      </RenderIf>
      <RenderIf condition={isLoading}>
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
};

export default LastReadingCard;
