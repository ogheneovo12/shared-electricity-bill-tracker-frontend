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

const formSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email({ message: "Valid Email" }),
  track: z.string(),
  title: z.string(),
});

export function UserProfileForm({
  initialValues,
  title,
  description,
  onSubmit,
  disabled,
  disable_email,
  isOpen,
  onOpenChange,
  hideAction = false,
  isLoading,
  disable_title,
}: {
  initialValues?: IUser | null;
  title: string;
  description: string;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  disabled?: boolean;
  disable_email?: boolean;
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  hideAction?: boolean;
  isLoading?: boolean;
  disable_title?: boolean;
}) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const user = useSelector((state: RootState) => state.auth.user) as IUser;

  const defaultValues = useMemo(
    () => ({
      email: initialValues?.email || "",
      first_name: initialValues?.first_name || "",
      last_name: initialValues?.last_name || "",
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
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="john"
                          {...field}
                          disabled={disabled}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="doe"
                          {...field}
                          disabled={disabled}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  disabled={disabled || disable_email}
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="jondoe@gmail.com"
                          {...field}
                          disabled={disable_email || disabled}
                        />
                      </FormControl>
                      <FormDescription>
                        Your Email Attached to your althub slack profile
                      </FormDescription>
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
