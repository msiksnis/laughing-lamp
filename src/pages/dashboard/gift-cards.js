// /pages/dashboard/gift-cards.js
import DashboardLayout from "@/components/dashboard/DashboardLayout";
// import { useState } from "react";
// import { toast } from "react-toastify";
// import { fetchCategories } from "../../../utils/fetchCategories";
// import useSWR from "swr";
// import { Oval } from "react-loader-spinner";
// import { useSidebarContext } from "@/contexts/SidebarContext";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/router";
// import { fetchGiftCards } from "../../../utils/fetchGiftCards";
// import GiftCardModal from "@/components/dashboard/AllModals/GiftCardModal";
// import GiftCardList from "@/components/dashboard/GiftCard/GiftCardList";
// import AddNewButton from "@/components/dashboard/Ui/AddNewButton";

// export default function GiftCardsPage({ initialGiftCards, categories }) {
//   const [isGiftCardModalOpen, setIsGiftCardModalOpen] = useState(false);

//   const { isExpanded } = useSidebarContext();
//   const { data: session, status } = useSession();
//   const isLoading = status === "loading";
//   const router = useRouter();

//   // Fetch the gift cards data with useSWR
//   const {
//     data: { data: giftCards = [] } = {},
//     mutate: mutateGiftCards,
//     error,
//     isValidating,
//   } = useSWR("/api/get-giftCard", fetchGiftCards, {
//     initialData: initialGiftCards,
//     revalidateOnFocus: false,
//   });

//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-screen w-full">
//         Error loading gift cards
//       </div>
//     );
//   }

//   if (isValidating) {
//     return (
//       <div className="flex justify-center items-center h-screen w-full">
//         <Oval
//           ariaLabel="loading-indicator"
//           height={80}
//           width={80}
//           strokeWidth={3}
//           strokeWidthSecondary={3}
//           color="#d9d9d9"
//           secondaryColor="#e6e6e6"
//         />
//       </div>
//     );
//   }

//   if (isLoading) {
//     return (
//       <div className="h-screen w-full flex justify-center mt-40">
//         Loading...
//       </div>
//     );
//   }

//   if (!session) {
//     router.push("/admin");
//     return;
//   }

//   const createNewGiftCard = async (giftCard) => {
//     try {
//       const res = await fetch("/api/create-giftCard", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(giftCard),
//       });

//       if (!res.ok) {
//         throw new Error(await res.text());
//       }

//       // Mutate the services data
//       mutateGiftCards();

//       toast.success("Gift card created successfully!");
//     } catch (error) {
//       console.error("Create gift card error:", error);

//       toast.error("Failed to create the gift card.");
//     }
//   };

//   return (
//     <main
//       className={`md:px-10 px-4 transition-all duration-300 md:mr-20 ${
//         isExpanded ? "ml-[16.5rem] md:ml-[21.5rem]" : "md:ml-40"
//       }`}
//     >
//       <div className="flex justify-between mt-5 sm:mt-10 md:mt-8 items-center">
//         <div className="md:text-4xl text-2xl uppercase">Gift Cards</div>
//         <div onClick={() => setIsTreatmentModalOpen(true)}>
//           <AddNewButton />
//         </div>
//       </div>
//       {giftCards.length > 0 && <GiftCardList giftCards={giftCards} />}
//       <GiftCardModal
//         isOpen={isGiftCardModalOpen}
//         setIsOpen={setIsGiftCardModalOpen}
//         onSubmit={createNewGiftCard}
//         categories={categories}
//         mode="create"
//         initialTreatment={{}}
//       />
//     </main>
//   );
// }

// export async function getServerSideProps(context) {
//   const { data: initialGiftCards } = await fetchGiftCards();
//   const { data: categories } = await fetchCategories();

//   return {
//     props: {
//       initialGiftCards,
//       categories,
//     },
//   };
// }
export default function GiftCardsPage() {
  return (
    <div className="flex justify-center mt-52 h-screen">
      <h1 className="text-xl">Coming Soon</h1>
    </div>
  );
}

GiftCardsPage.layout = DashboardLayout;
