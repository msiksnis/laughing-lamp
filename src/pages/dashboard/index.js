import DashboardHeader from "@/components/dashboard/Controls/DashboardHeader";
import SidebarMenu from "@/components/dashboard/Controls/SidebarMenu";
import { SidebarProvider, useSidebarContext } from "@/contexts/SidebarContext";

function DashboardContent() {
  const { isExpanded } = useSidebarContext();

  return (
    <>
      <DashboardHeader />
      <SidebarMenu />
      <div
        className={`md:px-10 px-4 pb-20 transition-all duration-300 ${
          isExpanded ? "ml-[16.5rem]" : ""
        }`}
      >
        <p className="text-2xl mt-72 flex justify-center">Dashboard</p>
      </div>
    </>
  );
}

export default function DashboardPage() {
  return (
    <SidebarProvider>
      <DashboardContent />
    </SidebarProvider>
  );
}
