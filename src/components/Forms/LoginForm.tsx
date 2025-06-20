import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  useInitiateLoginMutation,
  useVerifyTokenMutation,
} from "@/lib/redux/services/auth.api.service";
import { getErrorString } from "@/utils/error-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email({ message: "Valid Email" }),
});

// 5 minutes in seconds
const RESEND_TIMEOUT = 300;

function LoginForm() {
  const [otp, setOtp] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState(RESEND_TIMEOUT);
  const [storedEmail, setStoredEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [initiateLogin, { isSuccess, isLoading: isInitiateLoading }] =
    useInitiateLoginMutation();
  const [verifyToken, { isLoading: isVerifyLoading }] =
    useVerifyTokenMutation();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // Handle timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isSuccess && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isSuccess, timeLeft]);

  // Auto-submit when OTP is complete
  useEffect(() => {
    if (otp.length === 6) {
      handleTokenSubmit(otp);
    }
  }, [otp]);

  const handleTokenSubmit = async (token: string) => {
    try {
      setIsSubmitting(true);
      await verifyToken({ token }).unwrap();
      // Reset state after successful verification
      setOtp("");
      setTimeLeft(RESEND_TIMEOUT);
      navigate({ to: "/app" });
    } catch (err) {
      const error = getErrorString(err);
      toast.error(error);
      setOtp(""); // Clear OTP on error
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    try {
      await initiateLogin({ email: storedEmail }).unwrap();
      setTimeLeft(RESEND_TIMEOUT);
      toast.success("New code sent to your email");
    } catch (err) {
      const error = getErrorString(err);
      toast.error(error);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setStoredEmail(values.email);
      await initiateLogin({ email: values.email }).unwrap();
    } catch (err) {
      const error = getErrorString(err);
      toast.error(error);
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (isSuccess) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Enter verification code sent to {storedEmail}
          </p>
        </div>
        <div className="flex items-center justify-center">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
            disabled={isSubmitting || isVerifyLoading}
          >
            <InputOTPGroup>
              {[...Array(6)].map((_, index) => (
                <InputOTPSlot key={index} index={index} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        <div className="text-center text-sm">
          {timeLeft > 0 ? (
            <span>Resend code in {formatTime(timeLeft)}</span>
          ) : (
            <Button
              variant="link"
              onClick={handleResend}
              disabled={isInitiateLoading}
              className="p-0 text-sm"
            >
              Resend verification code
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="jondoe@gmail.com"
                  {...field}
                  disabled={isInitiateLoading}
                />
              </FormControl>
              <FormDescription>Provide Your Registered Email</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit" disabled={isInitiateLoading}>
          {isInitiateLoading ? "Sending code..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}

export default LoginForm;
