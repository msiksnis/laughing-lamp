// /pages/dashboard/pedicure.js
import { useState } from "react";
import { toast } from "react-toastify";
import { fetchCategories } from "../../../utils/fetchCategories";
import TreatmentModal from "@/components/dashboard/AllModals/TreatmentModal";
import useSWR from "swr";
import { Oval } from "react-loader-spinner";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import TreatmentList from "@/components/dashboard/TreatmentList";
import { useSidebarContext } from "@/contexts/SidebarContext";
import { fetchLashes } from "../../../utils/fetchLashes";
import { fetchBrows } from "../../../utils/fetchBrows";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import AddNewButton from "@/components/dashboard/Ui/AddNewButton";

export default function LashesAndBrowsPage({
  initialLashesServices,
  initialBrowsServices,
  categories,
}) {
  const [isTreatmentModalOpen, setIsTreatmentModalOpen] = useState(false);
  const { isExpanded } = useSidebarContext();
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const router = useRouter();

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
      <div className="flex justify-center translate-y-1/4 h-screen w-full">
        <Oval
          ariaLabel="loading-indicator"
          height={80}
          width={80}
          strokeWidth={3}
          strokeWidthSecondary={3}
          color="#FFCBCA"
          secondaryColor="#FEF1F2"
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-screen w-full flex justify-center mt-40">
        Loading...
      </div>
    );
  }

  if (!session) {
    router.push("/admin");
    return;
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
        <div onClick={() => setIsTreatmentModalOpen(true)}>
          <AddNewButton />
        </div>
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

export async function getStaticProps() {
  const { data: initialLashesServices } = await fetchLashes();
  const { data: initialBrowsServices } = await fetchBrows();
  const { data: categories } = await fetchCategories();

  return {
    props: {
      initialLashesServices,
      initialBrowsServices,
      categories,
    },
    revalidate: 10,
  };
}
