import { TbDragDrop2 as DragDropIcon } from "react-icons/tb";
import { HiOutlineTrash as Delete } from "react-icons/hi";
import { FiEdit as Edit } from "react-icons/fi";
import WarningModal from "./modals/WarningModal";
import { useState } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";

export default function TreatmentItem({ service }) {
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [treatmentToDelete, setTreatmentToDelete] = useState(null);

  const { mutate } = useSWR("/api/get-skinCare");

  const onDelete = async (treatment) => {
    try {
      const res = await fetch(`/api/delete-item/${treatment._id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Refetch the data after delete
        mutate();
        toast.success("Treatment deleted successfully!");
      } else {
        toast.error("Error deleting treatment!");
      }
    } catch (error) {
      console.error("Delete treatment error:", error);
      toast.error("Error deleting treatment!");
    }
  };

  return (
    <div className="flex justify-center items-center h-full mb-4">
      <div className="bg-white group w-full item-shadow hover:bg-[#f3f3f2] transition-colors duration-300 py-1 select-none">
        <div className="grid grid-cols-[auto,1fr,auto,auto] items-center gap-x-4 pl-4 pr-1">
          <DragDropIcon className="h-6 w-6 opacity-0 group-hover:opacity-80 transition-opacity duration-300" />
          <div className="grid grid-rows-[auto,auto] gap-0">
            <div className="truncate">{service.title}</div>
            <p className="truncate text-sm opacity-60">{service.description}</p>
          </div>
          <h3 className="whitespace-nowrap font-normal">${service.price}</h3>
          <div className="grid grid-rows-2 border-l border-gray-400 ">
            <Edit
              data-drag-disabled
              className="h-9 w-9 p-1.5 ml-1 scale-[0.9] hover:scale-[1.2] transition-all duration-300 hover:text-yellow-500 cursor-pointer"
            />
            <Delete
              data-drag-disabled
              onClick={() => {
                setIsWarningModalOpen(true);
                setTreatmentToDelete(service);
              }}
              className="h-9 w-9 p-1.5 ml-1 hover:scale-[1.3] transition-all duration-300 hover:text-red-600 cursor-pointer"
            />
          </div>
        </div>
      </div>
      <WarningModal
        isOpen={isWarningModalOpen}
        setIsOpen={setIsWarningModalOpen}
        onDelete={() => {
          onDelete(treatmentToDelete);
          setIsWarningModalOpen(false);
        }}
      />
    </div>
  );
}
