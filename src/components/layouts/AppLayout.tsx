import { AppSidebar } from "@/components/layouts/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { IUser } from "@/lib/redux/slices/auth.slice";
import { RootState } from "@/lib/redux/store";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { SiteHeader } from "./site-header";
import { getTimeOfDay } from "@/utils/get-time-of-day";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const user = useSelector((store: RootState) => store.auth.user) as IUser;
  const [cookies] = useCookies(["sidebar_state"]);

  const timeOfDay = getTimeOfDay();

  return (
    <SidebarProvider
      defaultOpen={cookies.sidebar_state}
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />

        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col px-4  lg:px-6 my-6">
            <div>
              <h3 className="heading-3 mb-3 capitalize">
                Good {timeOfDay} {user.first_name} 🫡
              </h3>
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
