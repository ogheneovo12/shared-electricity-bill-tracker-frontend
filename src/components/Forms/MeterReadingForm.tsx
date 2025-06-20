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
import { useEffect, useMemo, useState } from "react";
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
import { IMeterReading } from "@/@types";
import { useGetRoomsQuery } from "@/lib/redux/services/rooms.api.service";
import SelectComponent from "../Select";
import { DatePicker } from "../DatePicker";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  roomId: z.string(),
  value: z.number(),
  reading_date: z.date(),
  note: z.string().optional(),
});

export function MeterReadingForm({
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
  initialValues?: IMeterReading | null;
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
  const { data: rooms = [], isLoading: fetchingRooms } = useGetRoomsQuery();
  const user = useSelector((state: RootState) => state.auth.user) as IUser;

  const defaultValues = useMemo(
    () => ({
      roomId: initialValues?.room._id || "",
      value: initialValues?.value || 0,
      reading_date: initialValues?.reading_date
        ? new Date(initialValues.reading_date)
        : new Date(),
      note: initialValues?.note || "",
    }),
    [initialValues]
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [initialValues]);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    } else {
      const timeout = setTimeout(() => {
        setShouldRender(false);
        form.reset(defaultValues);
      }, 300); // match your exit animation duration
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <Sheet open={isOpen} onOpenChange={isLoading ? () => {} : onOpenChange}>
      <SheetContent>
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
                  name="roomId"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Room</FormLabel>
                      <FormControl>
                        <SelectComponent
                          className="w-full"
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                          placeholder={
                            fetchingRooms ? "Fetching Rooms..." : "Select Room"
                          }
                          options={rooms.map((room) => ({
                            value: room._id,
                            label: `${room.name} - ${room.current_occupant?.first_name}`,
                          }))}
                          disabled={isLoading || fetchingRooms || disabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reading Value</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0.0"
                          {...field}
                          disabled={disabled}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          min={0}
                          step={"0.01"}
                          inputMode="decimal"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  disabled={disabled}
                  control={form.control}
                  name="reading_date"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Date Reading Taken</FormLabel>
                      <DatePicker
                        date={field.value}
                        setDate={(val) =>
                          form.setValue("reading_date", val as unknown as Date)
                        }
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                <Button disabled={isLoading || disabled} type="submit">
                  {isLoading ? "Saving..." : "Save changes"}
                </Button>
              )}
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
