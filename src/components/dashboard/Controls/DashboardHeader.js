import { GoSearch } from "react-icons/go";

export default function DashboardHeader() {
  return (
    <div className="flex justify-between items-center px-4 md:px-10  py-4 bg-slate-900 text-gray-300 sticky top-0 shadow">
      <div className="text-2xl">
        {/* Logo */}
        Logo
      </div>
      <div className="flex justify-between items-center">
        <div>
          {/* Search */}
          <GoSearch className="text-gray-400 h-5 w-5" />
        </div>
        <div className="text-sm md:border-l md:pl-10 md:ml-10 ml-4">
          <div className="hidden md:inline-block">Welcome, Marty</div>
          <div className="flex justify-end">Sign Out</div>
        </div>
      </div>
    </div>
  );
}
