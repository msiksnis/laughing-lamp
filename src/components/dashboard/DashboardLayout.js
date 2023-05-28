import { SidebarProvider } from "@/contexts/SidebarContext";
import DashboardHeader from "./Controls/DashboardHeader";
import SidebarMenu from "./Controls/SidebarMenu";

function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <DashboardHeader />
      <SidebarMenu />
      {children}
    </SidebarProvider>
  );
}

export default DashboardLayout;
