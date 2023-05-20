import { GoPlus } from "react-icons/go";
import { useState } from "react";
import TreatmentItem from "@/components/dashboard/TreatmentItem";
import { fetchSkinCare } from "../../../utils/fetchSkinCare";
import { fetchCategories } from "../../../utils/fetchCategories";
import CreateNewTreatmentModal from "@/components/dashboard/modals/CreateNewTreatmentModal";

export default function SkinCarePage({ services, categories }) {
  const [isCreateNewTreatmentModalOpen, setIsCreateNewTreatmentModalOpen] =
    useState(false);

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
  const { data: services } = await fetchSkinCare();
  const { data: categories } = await fetchCategories();

  return {
    props: {
      services,
      categories,
    },
    revalidate: 10,
  };
}
