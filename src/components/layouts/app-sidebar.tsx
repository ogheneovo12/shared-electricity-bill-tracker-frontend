import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  IconCreditCardFilled,
  IconDashboard,
  IconInnerShadowTop,
  IconRadar,
  IconSettings,
  IconSpeakerphone,
  IconTent,
} from "@tabler/icons-react";

import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Menu items.
  const items = [
    {
      title: "Home",
      url: "/app",
      icon: IconDashboard,
    },
    {
      title: "Purchases",
      url: "/app/purchases",
      icon: IconCreditCardFilled,
    },
    {
      title: "Readings",
      url: "/app/readings",
      icon: IconRadar,
    },
    {
      title: "Neighbours",
      url: "/app/neighbours",
      icon: IconTent,
    },

    {
      title: "Announcements",
      url: "/app/announcements",
      icon: IconSpeakerphone,
    },
  ];

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Xorb Power Mgmt</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={items} />

        <NavSecondary
          items={[
            {
              title: "Settings",
              url: "/app/settings",
              icon: IconSettings,
            },
          ]}
          className="mt-auto"
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
