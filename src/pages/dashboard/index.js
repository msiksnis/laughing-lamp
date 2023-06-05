import DashboardHeader from "@/components/dashboard/Controls/DashboardHeader";
import MobileMenu from "@/components/dashboard/Controls/MobileMenu";
import SidebarMenu from "@/components/dashboard/Controls/SidebarMenu";
import { SidebarProvider, useSidebarContext } from "@/contexts/SidebarContext";
import { getSession } from "next-auth/react";

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
        <p className="text-2xl mt-40 md:mt-72 flex justify-center">Dashboard</p>
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

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
