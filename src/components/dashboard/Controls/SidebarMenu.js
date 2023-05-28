import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSidebarContext } from "@/contexts/SidebarContext";
import { HiOutlineArrowLeft as Collapse } from "react-icons/hi";
import { menuItems } from "./menuItems";

export default function SidebarMenu() {
  const router = useRouter();
  const [activeMenuItem, setActiveMenuItem] = useState("");
  const { isExpanded, toggleSidebar } = useSidebarContext();

  const onMenuItemClick = (text, route) => {
    setActiveMenuItem(text);
    router.push(route);
  };

  return (
    <div
      className={`fixed m-6 z-10 mt-[6.5rem] px-2 py-4 left-0 top-0 bottom-0 bg-white rounded-md text-slate-900 item-shadow transition-width duration-300 h-[calc(100vh-8rem)] overflow-y-scroll overflow-x-hidden hide-scrollbar ${
        isExpanded ? "w-64" : "w-[4.5rem]"
      }`}
    >
      <div className="flex justify-between">
        {!isExpanded && (
          <Image
            src="/icons/grid_dots.svg"
            alt="menu icon"
            width={20}
            height={20}
            onClick={toggleSidebar}
            className="flex justify-center w-full h-9 cursor-pointer transition-opacity duration-300"
          />
        )}
        {isExpanded && (
          <>
            <Image
              src="/icons/grid_dots.svg"
              alt="menu icon"
              width={20}
              height={20}
              onClick={toggleSidebar}
              className="opacity-0 flex justify-center w-full h-9 cursor-pointer transition-opacity duration-300"
            />
            <Collapse
              onClick={toggleSidebar}
              className="h-8 w-8 cursor-pointer"
            />
          </>
        )}
      </div>
      <div className="flex flex-col mt-20 space-y-4 text-lg whitespace-nowrap uppercase">
        {menuItems.map(({ text, icon, route }) => (
          <div
            key={text}
            onClick={() => onMenuItemClick(text, route)}
            className={`flex items-center cursor-pointer hover:bg-slate-100 rounded transition-all duration-300 ${
              router.asPath === route ? "bg-slate-100 rounded" : ""
            }`}
          >
            <div className="relative flex items-center space-x-4 ml-1">
              <Image
                src={icon}
                alt={text}
                width={50}
                height={50}
                className="bg-slate-100 rounded-full p-1.5"
              />
              <div className="absolute left-12 w-48 overflow-hidden">
                {text}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
