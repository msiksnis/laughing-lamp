import { useRouter } from "next/router";
import { menuItems } from "./menuItems";
import Image from "next/image";
import { useState } from "react";

export default function MobileMenu() {
  const [activeMenuItem, setActiveMenuItem] = useState("");
  const router = useRouter();

  const onMenuItemClick = (text, route) => {
    setActiveMenuItem(text);
    router.push(route);
  };

  return (
    <div className="relative flex justify-center w-full overflow-x-scroll mt-2 px-2 z-10">
      {menuItems.map(({ text, icon, route }) => (
        <div
          key={text}
          onClick={() => onMenuItemClick(text, route)}
          className={`flex items-center cursor-pointer ${
            router.asPath === route ? "bg-slate-100 rounded" : ""
          }`}
        >
          <div className="relative flex items-center m-1">
            <Image
              src={icon}
              alt={text}
              width={60}
              height={60}
              className="bg-slate-100 rounded-full p-[2px] sm:p-[4px]"
            />
            {/* <div className="absolute left-10 w-40 overflow-hidden">{text}</div> */}
          </div>
        </div>
      ))}
    </div>
  );
}
