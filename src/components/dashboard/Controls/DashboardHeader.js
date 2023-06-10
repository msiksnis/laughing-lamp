import { useState } from "react";
import { GoSearch } from "react-icons/go";
import Link from "next/link";
import { toast } from "react-toastify";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import MobileMenu from "./MobileMenu";
import SearchModal from "../AllModals/SearchModal";

export default function DashboardHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { data: session } = useSession();

  const handleSearch = async (searchTerm) => {
    try {
      const response = await fetch(
        `/api/get-services?search=${encodeURIComponent(searchTerm)}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (data.success) {
        setSearchResults(data.data);
      }
    } catch (error) {
      if (error.name === "TypeError" && error.message === "Failed to fetch") {
        console.error("Fetch error due to network suspension:", error);
        // An adittional logic to retry the request when network is available might be implemented or simply ignore the error.
      } else {
        console.error("Fetch error:", error);
        toast.error("Oops! Something went wrong.");
      }
    }
  };

  return (
    <>
      <div className="z-50 flex justify-between items-center px-4 md:px-10  py-4 bg-slate-900 text-gray-300 sticky top-0 shadow">
        <Link href="/dashboard" className="text-2xl tracking-wide italic">
          Dashboard
        </Link>
        <div className="flex justify-between items-center">
          <div className="p-2 rounded-full cursor-pointer group">
            <GoSearch
              className="text-gray-400 h-5 w-5 group-hover:text-gray-100 group-hover:-translate-y-[0.5px] transition-all duration-300"
              onClick={() => setIsSearchOpen(true)}
            />
          </div>
          <div className="text-sm md:border-l md:pl-10 md:ml-10 ml-4">
            {session?.user?.image && (
              <Image
                src={session.user.image}
                alt="user profile image"
                width={40}
                height={40}
                className="rounded-full cursor-pointer border border-gray-600 hover:border-gray-600/50 transition-all duration-200"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              />
            )}
            {isDropdownOpen && (
              <div className="absolute mt-2 right-3 top-[70px] rounded-md item-shadow bg-white text-black uppercase">
                <>
                  <button
                    className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-all duration-200"
                    onClick={() => {
                      signOut({ callbackUrl: "/admin" });
                      setIsDropdownOpen(false);
                    }}
                  >
                    Sign Out
                  </button>
                </>
              </div>
            )}
          </div>
        </div>
        <SearchModal
          isOpen={isSearchOpen}
          setIsOpen={setIsSearchOpen}
          onSearch={handleSearch}
          searchResults={searchResults}
        />
      </div>
      <div className="md:hidden">
        <MobileMenu />
      </div>
    </>
  );
}
