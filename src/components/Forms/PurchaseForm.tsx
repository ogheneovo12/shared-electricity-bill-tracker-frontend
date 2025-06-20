import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { IUser } from "@/lib/redux/slices/auth.slice";
import { RootState } from "@/lib/redux/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { IPurchase } from "@/@types";
import { useGetRoomsQuery } from "@/lib/redux/services/rooms.api.service";
import { DatePicker } from "../DatePicker";
import { Textarea } from "../ui/textarea";
import { Loader2 } from "lucide-react";
import { getInitialContributions } from "@/utils/merge-purchase-initialvalues";

// Enhanced form schema with sum validation
const formSchema = z
  .object({
    date_purchased: z.date(),
    total_amount: z.number().min(0.01, "Total amount must be positive"),
    total_units: z.number().min(0.01, "Units must be positive"),
    contributions: z.array(
      z.object({
        room: z.string(),
        amount: z.number().min(0, "Amount cannot be negative"),
        note: z.string(),
      })
    ),
    note: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const contributionsSum = data.contributions.reduce(
      (sum, c) => sum + c.amount,
      0
    );
    const tolerance = 0.01; // For floating-point precision

    if (Math.abs(contributionsSum - data.total_amount) > tolerance) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Sum of room contributions (${contributionsSum.toFixed(2)}) must equal total amount (${data.total_amount.toFixed(2)})`,
        path: ["contributions"],
      });
    }
  });

export function PurchaseForm({
  initialValues,
  title,
  description,
  onSubmit,
  disabled,
  isOpen,
  onOpenChange,
  hideAction = false,
  isLoading,
  disable_title,
}: {
  initialValues?: IPurchase | null;
  title: string;
  description: string;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  disabled?: boolean;
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  hideAction?: boolean;
  isLoading?: boolean;
  disable_title?: boolean;
}) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isInitializing, setIsInitializing] = useState(true);
  const [localContributions, setLocalContributions] = useState<
    { room: string; amount: number; note: string }[]
  >([]);
  const initialFormStateRef = useRef<z.infer<typeof formSchema> | null>(null);

  const { data: rooms = [], isLoading: fetchingRooms } = useGetRoomsQuery();
  const user = useSelector((state: RootState) => state.auth.user) as IUser;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date_purchased: new Date(),
      total_amount: 0,
      total_units: 0,
      contributions: [],
      note: "",
    },
  });

  // Initialize form after rooms load
  useEffect(() => {
    if (!fetchingRooms && rooms.length > 0) {
      const contributions = getInitialContributions(initialValues, rooms);
      const defaultValues = {
        date_purchased: initialValues?.date_purchased
          ? new Date(initialValues.date_purchased)
          : new Date(),
        total_amount: initialValues?.total_amount || 0,
        total_units: initialValues?.total_units || 0,
        contributions,
        note: initialValues?.note || "",
      };

      initialFormStateRef.current = defaultValues;
      form.reset(defaultValues);
      setLocalContributions(contributions);
      setIsInitializing(false);
    }
  }, [fetchingRooms, rooms, initialValues]);

  // Handle sheet open/close transitions
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    } else {
      if (initialFormStateRef.current) {
        form.reset(initialFormStateRef.current);
        setLocalContributions(initialFormStateRef.current.contributions);
      }

      const timeout = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  // Update contribution fields without re-rendering entire form
  const updateContribution = (
    index: number,
    field: "amount" | "note",
    value: any
  ) => {
    const updated = [...localContributions];
    updated[index] = { ...updated[index], [field]: value };
    setLocalContributions(updated);
    form.setValue(`contributions.${index}.${field}`, value, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  if (!shouldRender) return null;

  return (
    <Sheet open={isOpen} onOpenChange={isLoading ? () => {} : onOpenChange}>
      <SheetContent>
        {fetchingRooms || isInitializing ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="animate-spin h-12 w-12" />
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex h-full w-full flex-col"
            >
              <SheetHeader className="flex-none border-b p-6 text-left">
                <SheetTitle>{title}</SheetTitle>
                <SheetDescription>{description}</SheetDescription>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto">
                <div className="space-y-8 p-6">
                  <FormField
                    disabled={disabled}
                    control={form.control}
                    name="date_purchased"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Date Purchased</FormLabel>
                        <DatePicker
                          date={field.value}
                          setDate={(val) => field.onChange(val)}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="total_amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Amount</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0.0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            disabled={disabled}
                            min={0.01}
                            step="0.01"
                            inputMode="decimal"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="total_units"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Units Purchased</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0.0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            disabled={disabled}
                            min={0.01}
                            step="0.01"
                            inputMode="decimal"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <div className="mb-4">
                      <FormLabel className="font-medium">
                        Room Contributions
                      </FormLabel>
                      {form.formState.errors.contributions && (
                        <span className="text-sm text-destructive">
                          {form.formState.errors.contributions.message}
                        </span>
                      )}
                    </div>

                    {localContributions.map((contribution, idx) => {
                      const room = rooms.find(
                        (r) => r._id === contribution.room
                      );
                      return (
                        <div
                          key={`${contribution.room}-${idx}`}
                          className="gap-4 mb-4"
                        >
                          <div className=" text-sm mb-2 font-medium">
                            {room?.name} -{room?.current_occupant?.first_name}
                          </div>
                          <div className="h-1 w-full my-4 bg-accent"></div>
                          <FormItem className="w-full mb-4">
                            <FormLabel className="font-normal">
                              Amount
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                value={contribution.amount}
                                onChange={(e) =>
                                  updateContribution(
                                    idx,
                                    "amount",
                                    Number(e.target.value)
                                  )
                                }
                                disabled={disabled}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                          <FormItem className="w-full mb-4">
                            <FormLabel className="font-normal">Note</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="Optional note"
                                value={contribution.note}
                                onChange={(e) =>
                                  updateContribution(
                                    idx,
                                    "note",
                                    e.target.value
                                  )
                                }
                                disabled={disabled}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        </div>
                      );
                    })}
                  </div>

                  <FormField
                    control={form.control}
                    name="note"
                    render={({ field }) => (
                      <FormItem className="my-4">
                        <FormLabel>Note</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter Reason"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Any Extra Note</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <SheetFooter>
                {!hideAction && (
                  <Button
                    disabled={isLoading || disabled || fetchingRooms}
                    type="submit"
                    className="mt-4"
                  >
                    {isLoading ? "Saving..." : "Save changes"}
                  </Button>
                )}
              </SheetFooter>
            </form>
          </Form>
        )}
      </SheetContent>
    </Sheet>
  );
}
