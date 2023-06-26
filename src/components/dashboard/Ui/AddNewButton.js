import { GoPlus as Plus } from "react-icons/go";

export default function AddNewButton() {
  return (
    <button className="group flex items-center uppercase border border-red-200 md:border-red-300 rounded md:px-10 px-6 md:py-2 py-1.5 bg-red-200 md:bg-red-300 hover:bg-red-200 hover:border-red-200 text-slate-900 transition-all duration-300 shadow focus:outline-none whitespace-nowrap">
      <Plus className="md:h-[18px] md:w-[18px] mr-2 group-hover:scale-110 transition-all duration-300" />
      Add New
    </button>
  );
}
