// /pages/dashboard/skin-care.js
import { useState } from "react";
import { toast } from "react-toastify";
import { fetchSkinCare } from "../../../utils/fetchSkinCare";
import { fetchCategories } from "../../../utils/fetchCategories";
import TreatmentModal from "@/components/dashboard/AllModals/TreatmentModal";
import useSWR from "swr";
import { Oval } from "react-loader-spinner";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import TreatmentList from "@/components/dashboard/TreatmentList";
import { useSidebarContext } from "@/contexts/SidebarContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import AddNewButton from "@/components/dashboard/Ui/AddNewButton";

export default function SkinCarePage({ initialSkinCareServices, categories }) {
  const [isTreatmentModalOpen, setIsTreatmentModalOpen] = useState(false);

  const { isExpanded } = useSidebarContext();
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const router = useRouter();

  // Fetch the services data with useSWR
  const {
    data: { data: services = [] } = {},
    mutate: mutateServices,
    error,
    isValidating,
  } = useSWR("/api/get-skinCare", fetchSkinCare, {
    initialData: initialSkinCareServices,
    revalidateOnFocus: false,
  });

  if (error) {
    return <div>Error loading treatments</div>;
  }

  if (isValidating) {
    return (
      <div className="flex justify-center mb-[20%] w-full">
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

      // Mutate the services data
      mutateServices();

      toast.success("Treatment created successfully!");
    } catch (error) {
      console.error("Create treatment error:", error);

      toast.error("Failed to create the treatment.");
    }
  };

  return (
    <main
      className={`md:px-10 px-4 transition-all duration-300 ${
        isExpanded ? "ml-[16.5rem]" : "md:ml-20"
      }`}
    >
      <div className="flex justify-between mt-5 sm:mt-10 md:mt-8 items-center">
        <div className="md:text-4xl text-2xl uppercase">Skin Care</div>
        <div onClick={() => setIsTreatmentModalOpen(true)}>
          <AddNewButton />
        </div>
      </div>
      {femaleServices.length > 0 && (
        <>
          <h2 className="uppercase mt-14 mb-5 text-lg md:text-xl">
            Female Skin Care Treatments
          </h2>
          <TreatmentList
            services={femaleServices}
            category="skin-care"
            categories={categories}
          />
        </>
      )}
      {maleServices.length > 0 && (
        <>
          <h2 className="uppercase mt-14 mb-5 text-lg md:text-xl">
            Male Skin Care Treatments
          </h2>
          <TreatmentList
            services={maleServices}
            category="skin-care"
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

SkinCarePage.layout = DashboardLayout;

export async function getStaticProps() {
  const { data: initialSkinCareServices } = await fetchSkinCare();
  const { data: categories } = await fetchCategories();

  return {
    props: {
      initialSkinCareServices,
      categories,
    },
    revalidate: 10,
  };
}
