import { IPurchase } from "@/@types";

export function getInitialContributions(
  initialValues: IPurchase | null | undefined,
  rooms: { _id: string }[]
) {
  const existing = initialValues?.contributions || [];
  return rooms.map((room) => {
    const found = existing.find(
      (c) => (typeof c.room === "string" ? c.room : c.room._id) === room._id
    );
    return found
      ? {
          amount: found.amount,
          room: typeof found.room === "string" ? found.room : found.room._id,
          note: found.note || "",
        }
      : { room: room._id, amount: 0, note: "" };
  });
}
