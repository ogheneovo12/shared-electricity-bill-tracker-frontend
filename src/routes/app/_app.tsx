import AppLayout from "@/components/layouts/AppLayout";
import ProtectedPage from "@/components/ProtectedPage";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { CookiesProvider } from "react-cookie";

export const Route = createFileRoute("/app/_app")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProtectedPage>
      <CookiesProvider>
        <AppLayout>
          <Outlet />
        </AppLayout>
      </CookiesProvider>
    </ProtectedPage>
  );
}
