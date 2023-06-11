import { MdDragIndicator as DragDropIcon } from "react-icons/md";
import { HiOutlineTrash as Delete } from "react-icons/hi";
import { FiEdit as Edit } from "react-icons/fi";
import WarningModal from "./AllModals/WarningModal";
import { useState } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";
import TreatmentModal from "./AllModals/TreatmentModal";
import { Reorder, useDragControls } from "framer-motion";
import { useMotionValue } from "framer-motion";
import { useRaisedShadow } from "../../../hooks/useRaisedShadow";
import { motion } from "framer-motion";
import { endpointForCategory } from "./textConversion";

export default function TreatmentItem({ service, category, categories }) {
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [treatmentToDelete, setTreatmentToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const dragControls = useDragControls();

  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);

  const { mutate } = useSWR(`/api/get-${endpointForCategory(category)}`);

  const onDelete = async (treatment) => {
    try {
      const res = await fetch(`/api/delete-treatment/${treatment._id}`, {
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

  const updateTreatment = async (updatedTreatment, updatedValues) => {
    try {
      const res = await fetch(`/api/edit-treatment/${updatedTreatment}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedValues),
      });

      if (res.ok) {
        // Refetch the data after update
        mutate();
        toast.success("Treatment updated successfully!");
      } else {
        toast.error("Error updating treatment!");
      }
    } catch (error) {
      console.error("Update treatment error:", error);
      toast.error("Error updating treatment!");
    }
  };

  const handlePointerDown = (e) => {
    e.preventDefault();
    dragControls.start(e);
  };

  dragControls.subscribe({
    start() {
      setIsDragging(true);
    },
    end() {
      setIsDragging(false);
    },
  });

  return (
    <>
      <Reorder.Item
        value={service}
        id={service._id}
        style={{ boxShadow, y, touchAction: "none" }}
        className="hidden md:block"
      >
        <motion.div
          className="flex justify-center items-center h-full mb-4 cursor-pointer"
          whileTap={{
            cursor: "grabbing",
            scale: 1.01,
            transition: { duration: 0.2 },
          }}
        >
          <div className="bg-white group w-full item-shadow hover:bg-[#f3f3f2] transition-colors duration-300 py-1 select-none">
            <div className="grid grid-cols-[1fr,auto,auto] md:grid-cols-[auto,1fr,auto,auto] items-center gap-x-4 pl-4 pr-1">
              <DragDropIcon className="hidden md:block h-8 w-8 opacity-0 group-hover:opacity-80 transition-opacity duration-300 cursor-pointer" />
              <div className="grid grid-rows-[auto,auto] gap-0">
                <div className="truncate">{service.title}</div>
                <p className="truncate text-sm opacity-60">
                  {service.description}
                </p>
              </div>
              <h3 className="whitespace-nowrap font-normal">
                ${service.price}
              </h3>
              <div className="grid grid-rows-2 border-l border-gray-400 ">
                <Edit
                  data-drag-disabled
                  onClick={() => setIsEditModalOpen(true)}
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
          <TreatmentModal
            isOpen={isEditModalOpen}
            setIsOpen={setIsEditModalOpen}
            onSubmit={updateTreatment}
            categories={categories}
            mode="edit"
            initialTreatment={service}
          />
        </motion.div>
      </Reorder.Item>
      <div
        style={{
          touchAction: isDragging ? "none" : "",
          pointerEvents: isDragging ? "none" : "auto",
        }}
        onTouchMove={(e) => {
          if (isDragging) e.preventDefault();
        }}
      >
        <Reorder.Item
          value={service}
          id={service._id}
          drag
          dragControls={dragControls}
          dragListener={false}
          style={{ boxShadow, y }}
          className="md:hidden"
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
        >
          <motion.div className="flex justify-center items-center h-full mb-3">
            <div className="bg-white w-full item-shadow select-none">
              <div className="grid grid-cols-[auto,1fr,auto,auto] items-center gap-x-2">
                <div
                  className="bg-slate-50 h-full p-1 flex items-center"
                  onPointerDown={handlePointerDown}
                  onTouchStart={() => setIsDragging(true)}
                  onTouchEnd={() => setIsDragging(false)}
                >
                  <DragDropIcon className="h-7 w-7 opacity-80" />
                </div>
                <div className="grid grid-rows-[auto,auto] gap-0">
                  <div className="truncate">{service.title}</div>
                  <div className="truncate text-sm opacity-60">
                    {service.description}
                  </div>
                </div>
                <h3 className="whitespace-nowrap font-normal">
                  ${service.price}
                </h3>
                <div className="flex flex-col items-center justify-center border-l border-gray-400 ">
                  <Edit
                    data-drag-disabled
                    onClick={() => setIsEditModalOpen(true)}
                    className="h-8 w-8 px-1.5"
                  />
                  <Delete
                    data-drag-disabled
                    onClick={() => {
                      setIsWarningModalOpen(true);
                      setTreatmentToDelete(service);
                    }}
                    className="h-8 w-8 px-1.5"
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
            <TreatmentModal
              isOpen={isEditModalOpen}
              setIsOpen={setIsEditModalOpen}
              onSubmit={updateTreatment}
              categories={categories}
              mode="edit"
              initialTreatment={service}
            />
          </motion.div>
        </Reorder.Item>
      </div>
    </>
  );
}
