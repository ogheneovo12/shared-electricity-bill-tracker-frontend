import LoginForm from "@/components/Forms/LoginForm";
import MoneyBg from "@/components/Money.svg";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent } from "@/components/ui/card";
import { RootState } from "@/lib/redux/store";
import { getTimeOfDay } from "@/utils/get-time-of-day";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useSelector } from "react-redux";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});


function HomeComponent() {
  const refreshToken = useSelector(
    (state: RootState) => state.auth.refreshToken
  );

  if (refreshToken) {
    return <Navigate to="/app" />;
  }
  const timeOfDay = getTimeOfDay();
  return (
    <div className="flex flex-col justify-center items-center bg-black/5 min-h-screen">
      <ThemeToggle />
      <div className="w-full max-w-sm md:max-w-3xl">
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <div className="bg-[var(--background)] shadow-xl w-full max-w-[800px] p-8 min-h-[500px] rounded-2xl">
              <h2 className="heading-3 mb-12 text-center">
                Good <span className=" text-primary">{timeOfDay}</span> <br />
                my neighbour 🫡
              </h2>

              <LoginForm />
            </div>
            <div className="bg-muted relative hidden md:block">
              <MoneyBg className="text-[#232328] dark:text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
