import { GoPlus } from "react-icons/go";
import { useState } from "react";
import { toast } from "react-toastify";
import TreatmentItem from "@/components/dashboard/TreatmentItem";
import { fetchSkinCare } from "../../../utils/fetchSkinCare";
import { fetchCategories } from "../../../utils/fetchCategories";
import TreatmentModal from "@/components/dashboard/modals/TreatmentModal";
import useSWR from "swr";
import { Oval } from "react-loader-spinner";
import DashboardHeader from "@/components/dashboard/header/DashboardHeader";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function SkinCarePage({ initialServices, categories }) {
  const [isTreatmentModalOpen, setIsTreatmentModalOpen] = useState(false);

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
    return <div>Error loading treatments</div>;
  }

  if (isValidating) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <Oval
          ariaLabel="loading-indicator"
          height={80}
          width={80}
          strokeWidth={3}
          strokeWidthSecondary={3}
          color="#d9d9d9"
          secondaryColor="#e6e6e6"
        />
      </div>
    );
  }

  const maleServices = services.filter((service) => service.gender === "male");
  const femaleServices = services.filter(
    (service) => service.gender === "female"
  );

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
    <main className="md:px-10 p-4">
      <div className="flex justify-between items-center">
        <h1 className="md:text-3xl text-2xl my-10 uppercase">Skin Care</h1>
        <button
          className="flex items-center uppercase border border-slate-900 rounded md:px-10 px-6 md:py-2 py-1.5 bg-slate-900 text-white hover:bg-white hover:text-slate-900 transition-all duration-300 shadow focus:outline-none"
          onClick={() => setIsTreatmentModalOpen(true)}
        >
          <GoPlus className="md:h-[18px] md:w-[18px] mr-2" /> Add New
        </button>
      </div>
      {femaleServices.length > 0 && (
        <h2 className="uppercase mt-14 mb-5 text-lg md:text-xl">
          Female Skin Care Treatments
        </h2>
      )}
      {femaleServices.map((service) => (
        <TreatmentItem
          key={service._id}
          service={service}
          categories={categories}
        />
      ))}

      {maleServices.length > 0 && (
        <h2 className="uppercase mt-14 mb-5 text-lg md:text-xl">
          Male Skin Care Treatments
        </h2>
      )}
      {maleServices.map((service) => (
        <TreatmentItem
          key={service._id}
          service={service}
          categories={categories}
        />
      ))}

      <div className="flex justify-center my-10 items-center">
        <button className="flex items-center uppercase border border-slate-900 rounded md:px-10 px-6 md:py-2 py-1.5 bg-slate-900 text-white hover:bg-white hover:text-slate-900 transition-all duration-300 shadow focus:outline-none">
          Save Order Changes
        </button>
      </div>

      <TreatmentModal
        isOpen={isTreatmentModalOpen}
        setIsOpen={setIsTreatmentModalOpen}
        onSubmit={createNewTreatment}
        categories={categories}
        mode="create"
        initialTreatment={{}}
      />
    </main>
  );
}

SkinCarePage.layout = DashboardLayout;

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
