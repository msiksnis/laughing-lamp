import { MdDragIndicator as DragDropIcon } from "react-icons/md";
import { HiOutlineTrash as Delete } from "react-icons/hi";
import { FiEdit as Edit } from "react-icons/fi";
import WarningModal from "./AllModals/WarningModal";
import { useState } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";
import GiftCardModal from "./AllModals/GiftCardModal";
import { Reorder, useDragControls } from "framer-motion";
import { useMotionValue } from "framer-motion";
import { useRaisedShadow } from "../../../hooks/useRaisedShadow";
import { motion } from "framer-motion";
import { endpointForCategory } from "./textConversion";
import { CldImage } from "next-cloudinary";

export default function GiftCardItem({ giftCard, category, categories }) {
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [giftCardToDelete, setGiftCardToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const dragControls = useDragControls();

  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);

  const { mutate } = useSWR(`/api/get-${endpointForCategory(category)}`);

  const onDelete = async (giftCard) => {
    try {
      const res = await fetch(`/api/delete-giftCard/${giftCard._id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Refetch the data after delete
        mutate();
        toast.success("Gift card deleted successfully!");
      } else {
        toast.error("Error deleting gift card!");
      }
    } catch (error) {
      console.error("Delete gift card error:", error);
      toast.error("Error deleting gift card!");
    }
  };

  const updateGiftCard = async (updatedGiftCard, updatedValues) => {
    try {
      const res = await fetch(`/api/edit-giftCard/${updatedGiftCard}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedValues),
      });

      if (res.ok) {
        // Refetch the data after update
        mutate();
        toast.success("Gift card updated successfully!");
      } else {
        toast.error("Error updating gift card!");
      }
    } catch (error) {
      console.error("Update gift card error:", error);
      toast.error("Error updating gift card!");
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
        value={giftCard}
        id={giftCard._id}
        style={{ boxShadow, y }}
        className="hidden md:block"
      >
        <motion.div
          className=""
          whileTap={{
            cursor: "grabbing",
            scale: 1.01,
            transition: { duration: 0.2 },
          }}
        >
          <div
            className="flex border border-slate-900 rounded p-2 space-x-2"
            key={giftCard._id}
          >
            {/* {giftCard.imageUrl && ( */}
            <div className="w-1/2 ">
              <CldImage
                width="200"
                height="200"
                src={giftCard.imageUrl}
                alt={giftCard.title}
                className="rounded"
              />
            </div>
            {/* )} */}
            <div className="w-1/2 h-full">
              <div className="">{giftCard.title}</div>
              <div className="">{giftCard.price}</div>
              <div className="">
                <button className="flex justify-center items-center border border-slate-900 w-full rounded py-1 text-sm bg-slate-900 text-white">
                  Buy
                </button>
              </div>
            </div>
          </div>
          {/* <div className="grid grid-rows-2 border-l border-gray-400 ">
              <Edit
                data-drag-disabled
                onClick={() => setIsEditModalOpen(true)}
                className="h-9 w-9 p-1.5 ml-1 scale-[0.9] hover:scale-[1.2] transition-all duration-300 hover:text-yellow-500 cursor-pointer"
              />
              <Delete
                data-drag-disabled
                onClick={() => {
                  setIsWarningModalOpen(true);
                  setGiftCardToDelete(giftCard);
                }}
                className="h-9 w-9 p-1.5 ml-1 hover:scale-[1.3] transition-all duration-300 hover:text-red-600 cursor-pointer"
              />
            </div> */}
          <WarningModal
            isOpen={isWarningModalOpen}
            setIsOpen={setIsWarningModalOpen}
            onDelete={() => {
              onDelete(giftCardToDelete);
              setIsWarningModalOpen(false);
            }}
          />
          <GiftCardModal
            isOpen={isEditModalOpen}
            setIsOpen={setIsEditModalOpen}
            onSubmit={updateGiftCard}
            categories={categories}
            mode="edit"
            initialGiftCard={giftCard}
          />
        </motion.div>
      </Reorder.Item>
      <Reorder.Item
        value={giftCard}
        id={giftCard._id}
        drag="y"
        dragControls={dragControls}
        dragListener={false}
        style={{
          y,
          scale: isDragging ? 1.05 : 1,
        }}
        className="md:hidden"
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
      >
        <motion.div className="flex justify-center items-center h-full mb-3">
          <div
            className="flex border border-slate-900 rounded p-2 space-x-2"
            key={giftCard._id}
          >
            {/* {giftCard.imageUrl && ( */}
            <div className="w-1/2 ">
              <CldImage
                width="200"
                height="200"
                src={giftCard.imageUrl}
                alt={giftCard.title}
                className="rounded"
              />
            </div>
            {/* )} */}
            <div className="w-1/2 h-full">
              <div className="">{giftCard.title}</div>
              <div className="">{giftCard.price}</div>
              <div className="">
                <button className="flex justify-center items-center border border-slate-900 w-full rounded py-1 text-sm bg-slate-900 text-white">
                  Buy
                </button>
              </div>
            </div>
          </div>
          <WarningModal
            isOpen={isWarningModalOpen}
            setIsOpen={setIsWarningModalOpen}
            onDelete={() => {
              onDelete(giftCardToDelete);
              setIsWarningModalOpen(false);
            }}
          />
          <GiftCardModal
            isOpen={isEditModalOpen}
            setIsOpen={setIsEditModalOpen}
            onSubmit={updateGiftCard}
            categories={categories}
            mode="edit"
            initialGiftCard={giftCard}
          />
        </motion.div>
      </Reorder.Item>
    </>
  );
}
