// /pages/dashboard/gift-cards.js
import { GoPlus } from "react-icons/go";
import { useState } from "react";
import { toast } from "react-toastify";
import { fetchCategories } from "../../../utils/fetchCategories";
import useSWR from "swr";
import { Oval } from "react-loader-spinner";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useSidebarContext } from "@/contexts/SidebarContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Reorder } from "framer-motion";
import { fetchGiftCards } from "../../../utils/fetchGiftCards";
import GiftCardModal from "@/components/dashboard/AllModals/GiftCardModal";
import { CldImage } from "next-cloudinary";
import GiftCardItem from "@/components/dashboard/GiftCardItem";

export default function GiftCardsPage({ initialGiftCards, categories }) {
  const [isGiftCardModalOpen, setIsGiftCardModalOpen] = useState(false);

  console.log("initialGiftCards:", initialGiftCards);

  const { isExpanded } = useSidebarContext();
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const router = useRouter();

  // Fetch the gift cards data with useSWR
  const {
    data: { data: giftCards = [] } = {},
    mutate: mutateGiftCards,
    error,
    isValidating,
  } = useSWR("/api/get-giftCard", fetchGiftCards, {
    initialData: initialGiftCards,
    revalidateOnFocus: false,
  });

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        Error loading gift cards
      </div>
    );
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

  const createNewGiftCard = async (giftCard) => {
    try {
      const res = await fetch("/api/create-giftCard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(giftCard),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      // Mutate the services data
      mutateGiftCards();

      toast.success("Gift card created successfully!");
    } catch (error) {
      console.error("Create gift card error:", error);

      toast.error("Failed to create the gift card.");
    }
  };

  return (
    <main
      className={`md:px-10 px-4 transition-all duration-300 ${
        isExpanded ? "ml-[16.5rem]" : "md:ml-20"
      }`}
    >
      <div className="flex justify-between mt-5 sm:mt-10 md:mt-8 items-center">
        <div className="md:text-4xl text-2xl uppercase">Gift Cards</div>
        <button
          className="flex items-center uppercase border border-slate-900 rounded md:px-10 px-6 md:py-2 py-1.5 bg-slate-900 text-white hover:bg-white hover:text-slate-900 transition-all duration-300 shadow focus:outline-none"
          onClick={() => setIsGiftCardModalOpen(true)}
        >
          <GoPlus className="md:h-[18px] md:w-[18px] mr-2" /> Add New
        </button>
      </div>
      {giftCards.length > 0 && (
        <Reorder.Group values={giftCards} onReorder={giftCards}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-20">
            {giftCards.map((giftCard, index) => (
              <GiftCardItem key={giftCard._id} giftCard={giftCard} />
            ))}
          </div>
        </Reorder.Group>
      )}
      <GiftCardModal
        isOpen={isGiftCardModalOpen}
        setIsOpen={setIsGiftCardModalOpen}
        onSubmit={createNewGiftCard}
        categories={categories}
        mode="create"
        initialTreatment={{}}
      />
    </main>
  );
}

export async function getServerSideProps(context) {
  const { data: initialGiftCards } = await fetchGiftCards();
  const { data: categories } = await fetchCategories();

  return {
    props: {
      initialGiftCards,
      categories,
    },
  };
}

GiftCardsPage.layout = DashboardLayout;
