import { HiOutlineTrash as Delete } from "react-icons/hi";
import WarningModal from "./AllModals/WarningModal";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { mutate as globalMutate } from "swr";
import TreatmentModal from "./AllModals/TreatmentModal";
import { convertCategoryTitle } from "./textConversion";
import { useRouter } from "next/router";
import { ToastContext } from "@/contexts/ToastContext";

export default function SingleTreatmentItem({ service, category, categories }) {
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [treatmentToDelete, setTreatmentToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const router = useRouter();
  const { showToast, hideToast } = useContext(ToastContext);
  if (typeof showToast !== "function") {
    throw new Error("showToast must be used within a ToastProvider");
  }

  const onDelete = async (treatment) => {
    try {
      const res = await fetch(`/api/delete-treatment/${treatment._id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Redirect to the dashboard after successful deletion
        router.push("/dashboard");
      } else {
        showToast("Error deleting treatment!", "error");
      }
    } catch (error) {
      console.error("Delete treatment error:", error);
      showToast("Error deleting treatment!", "error");
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
        const updatedService = await res.json();
        // Navigate to the updated page
        router.push(`/dashboard/product/${updatedService.data.slug}`);

        await globalMutate(
          `/api/get-service-by-slug?slug=${updatedService.data.slug}`
        );
        showToast("Treatment updated successfully!", "success");
      } else {
        showToast("Error updating treatment!", "error");
      }
    } catch (error) {
      console.error("Update treatment error:", error);
      showToast("Error updating treatment!", "error");
    }
  };

  return (
    <>
      <div className="bg-white w-full item-shadow select-none border rounded-md">
        <div className="items-center">
          <div className="grid grid-rows-[auto] p-4">
            <>
              <div className="text-sm text-gray-500">Title</div>
              <div className="truncate">{service.title}</div>
            </>
            <div className="mt-6">
              <div className="text-sm text-gray-500">Price</div>
              <div className="">${service.price}</div>
            </div>
            {service.description && (
              <div className="mt-6 truncate-text">
                <div className="text-sm text-gray-500">Description</div>
                <div className="">{service.description}</div>
              </div>
            )}
            {service.duration && (
              <div className="mt-6 truncate-text">
                <div className="text-sm text-gray-500">Duration</div>
                <p className="">{service.duration} min</p>
              </div>
            )}
            <div className="mt-6">
              <div className="text-sm text-gray-500">Gender</div>
              <div className="capitalize">{service.gender}</div>
            </div>
            <div className="mt-6">
              <div className="text-sm text-gray-500">Category</div>
              <div className="capitalize">
                {convertCategoryTitle(service.category.categoryName)}
              </div>
            </div>
          </div>
          <div className="flex justify-center space-x-2 bg-gray-50 mt-6 p-4 rounded-b-md">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="edit bg-gray-50 rounded-md text-slate-900 cursor-pointer flex h-10 items-center justify-center w-1/2 max-w-xs outline-none border border-gray-600 hover:bg-gray-100 transition-colors duration-300"
            >
              <span className="edit-icon h-10 w-10"></span>
              <span className="pl-1 tracking-wider">Edit</span>
            </button>

            <button
              className="group bg-red-400 rounded-md text-slate-900 cursor-pointer flex h-10 items-center justify-center w-1/2 max-w-xs outline-none border border-red-400 hover:bg-red-500 hover:border-red-500 transition-colors duration-300"
              onClick={() => {
                setIsWarningModalOpen(true);
                setTreatmentToDelete(service);
              }}
            >
              <Delete className="h-9 w-9 p-1.5 ml-1 group-hover:scale-[1.1] transition-all duration-300 cursor-pointer" />
              <span className="pl-1 tracking-wider">Delete</span>
            </button>
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
        key={`${service._id}-${service.updatedAt}`}
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
        onSubmit={updateTreatment}
        categories={categories}
        mode="edit"
        initialTreatment={service}
      />
    </>
  );
}
