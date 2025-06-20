import React from "react";
import { IPurchase } from "@/@types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type Props = {
  roomId: string;
  purchases: IPurchase[];
  onBack: () => void;
};

export function RoomPurchaseTimeline({ roomId, purchases, onBack }: Props) {
  // Filter and sort purchases for this room
  const roomPurchases = purchases
    .filter((p) => p.contributions.some((c) => c.room._id === roomId))
    .sort(
      (a, b) =>
        new Date(a.date_purchased).getTime() -
        new Date(b.date_purchased).getTime()
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Room Purchase Timeline
          <button className="ml-4 text-xs underline" onClick={onBack}>
            Back
          </button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="relative border-l border-gray-200">
          {roomPurchases.map((p, idx) => {
            const c = p.contributions.find((c) => c.room._id === roomId);
            return (
              <li key={idx} className="mb-6 ml-4">
                <div className="absolute w-3 h-3 bg-blue-200 rounded-full -left-1.5 border border-white" />
                <time className="mb-1 text-xs text-gray-500">
                  {new Date(p.date_purchased).toLocaleDateString()}
                </time>
                <div className="text-sm">
                  Units: {c?.units} | Amount: ₦{c?.amount}
                </div>
                {p.note && (
                  <div className="text-xs text-muted-foreground">
                    Note: {p.note}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}
