// /pages/dashboard/pedicure.js
import { GoPlus } from "react-icons/go";
import { useState } from "react";
import { toast } from "react-toastify";
import { fetchCategories } from "../../../utils/fetchCategories";
import TreatmentModal from "@/components/dashboard/Modals/TreatmentModal";
import useSWR from "swr";
import { Oval } from "react-loader-spinner";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import TreatmentList from "@/components/dashboard/TreatmentList";
import { useSidebarContext } from "@/contexts/SidebarContext";
import { fetchLashes } from "../../../utils/fetchLashes";
import { fetchBrows } from "../../../utils/fetchBrows";
import { getSession } from "next-auth/react";

export default function LashesAndBrowsPage({
  initialLashesServices,
  initialBrowsServices,
  categories,
}) {
  const [isTreatmentModalOpen, setIsTreatmentModalOpen] = useState(false);
  const { isExpanded } = useSidebarContext();

  // Fetch the Lashes services data with useSWR
  const {
    data: { data: lashesServices = [] } = {},
    mutate: mutateLashesServices,
    error: lashesError,
    isValidating: lashesValidating,
  } = useSWR("/api/get-lashes", fetchLashes, {
    initialData: initialLashesServices,
    revalidateOnFocus: false,
  });

  // Fetch the Brows services data with useSWR
  const {
    data: { data: browsServices = [] } = {},
    mutate: mutateBrowsServices,
    error: browsError,
    isValidating: browsValidating,
  } = useSWR("/api/get-brows", fetchBrows, {
    initialData: initialBrowsServices,
    revalidateOnFocus: false,
  });

  if (lashesError || browsError) {
    return <div>Error loading treatments</div>;
  }

  if (lashesValidating || browsValidating) {
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

      // Mutate the services data
      mutateLashesServices();
      mutateBrowsServices();

      toast.success("Treatment created successfully!");
    } catch (error) {
      console.error("Create treatment error:", error);

      toast.error("Failed to create the treatment.");
    }
  };

  return (
    <main
      className={`md:px-10 px-4 pb-20 transition-all duration-300 ${
        isExpanded ? "ml-[16.5rem]" : "md:ml-20"
      }`}
    >
      <div className="flex justify-between mt-5 sm:mt-10 md:mt-8 items-start md:items-center">
        <div className="md:text-4xl text-2xl uppercase">Lashes and Brows</div>
        <button
          className="flex items-center uppercase border border-slate-900 rounded md:px-10 px-6 md:py-2 py-1.5 bg-slate-900 text-white hover:bg-white hover:text-slate-900 transition-all duration-300 shadow focus:outline-none whitespace-nowrap"
          onClick={() => setIsTreatmentModalOpen(true)}
        >
          <GoPlus className="md:h-[18px] md:w-[18px] mr-2" />
          Add New
        </button>
      </div>
      {lashesServices.length > 0 && (
        <>
          <h2 className="uppercase mt-14 mb-5 text-lg md:text-xl">
            Lash Treatments
          </h2>
          <TreatmentList
            services={lashesServices}
            category="lashes"
            categories={categories}
          />
        </>
      )}
      {browsServices.length > 0 && (
        <>
          <h2 className="uppercase mt-14 mb-5 text-lg md:text-xl">
            Brow Treatments
          </h2>
          <TreatmentList
            services={browsServices}
            category="brows"
            categories={categories}
          />
        </>
      )}
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

LashesAndBrowsPage.layout = DashboardLayout;

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }

  const { data: initialLashesServices } = await fetchLashes();
  const { data: initialBrowsServices } = await fetchBrows();
  const { data: categories } = await fetchCategories();

  return {
    props: {
      initialLashesServices,
      initialBrowsServices,
      categories,
    },
  };
}
