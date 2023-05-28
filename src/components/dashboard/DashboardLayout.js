import DashboardHeader from "./header/DashboardHeader";

function DashboardLayout({ children }) {
  return (
    <>
      <DashboardHeader />
      {children}
    </>
  );
}

export default DashboardLayout;
