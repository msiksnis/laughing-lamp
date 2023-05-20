import { GoPlus } from "react-icons/go";
import { useState } from "react";
import { toast } from "react-toastify";
import TreatmentItem from "@/components/dashboard/TreatmentItem";
import { fetchSkinCare } from "../../../utils/fetchSkinCare";
import { fetchCategories } from "../../../utils/fetchCategories";
import CreateNewTreatmentModal from "@/components/dashboard/modals/CreateNewTreatmentModal";
import useSWR from "swr";

export default function SkinCarePage({ initialServices, categories }) {
  const [isCreateNewTreatmentModalOpen, setIsCreateNewTreatmentModalOpen] =
    useState(false);

  // Fetch the services data with useSWR
  const {
    data: { data: services = [] } = {},
    mutate: mutateServices,
    error,
    isValidating,
  } = useSWR("/api/get-skinCare", fetchSkinCare, {
    initialData: initialServices,
  });

  if (error) {
    // Handle the error...
  }

  if (isValidating) {
    // Show a loading spinner, or some other indication that the data is being fetched...
  }

  const createNewTreatment = async (treatment) => {
    try {
      const res = await fetch("/api/create-service", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(treatment),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const updatedServices = await fetchSkinCare();

      // Mutate the services data
      mutateServices(updatedServices, false);

      toast.success("Treatment created successfully!");
    } catch (error) {
      console.error("Create treatment error:", error);

      toast.error("Failed to create the treatment.");
    }
  };

  return (
    <main className="p-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl my-10 uppercase">Skin Care</h1>
        <button
          className="flex items-center uppercase border border-slate-900 rounded px-10 py-2 bg-slate-900 text-white hover:bg-white hover:text-slate-900 transition-all duration-300 shadow focus:outline-none"
          onClick={() => setIsCreateNewTreatmentModalOpen(true)}
        >
          <GoPlus className="h-[18px] w-[18px] mr-2" /> Add New
        </button>
        <CreateNewTreatmentModal
          isOpen={isCreateNewTreatmentModalOpen}
          setIsOpen={setIsCreateNewTreatmentModalOpen}
          onSubmit={createNewTreatment}
          categories={categories}
        />
      </div>
      {services.map((service) => (
        <TreatmentItem key={service._id} service={service} />
      ))}
    </main>
  );
}

export async function getStaticProps() {
  const { data: initialServices } = await fetchSkinCare();
  const { data: categories } = await fetchCategories();

  return {
    props: {
      initialServices,
      categories,
    },
    revalidate: 10,
  };
}
