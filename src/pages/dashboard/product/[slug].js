import { useRouter } from "next/router";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import PackageItem from "@/components/dashboard/PackageItem";
import GiftCardItem from "@/components/dashboard/GiftCardItem";
import SingleTreatmentItem from "@/components/dashboard/SingleTreatmentItem";
import { useSidebarContext } from "@/contexts/SidebarContext";
import { fetchCategories } from "../../../../utils/fetchCategories";
import useSWR from "swr";

export default function SingleProductPage({ categories }) {
  const router = useRouter();
  const { slug } = router.query;
  const { isExpanded } = useSidebarContext();

  const fetcher = async (url) => {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error("An error occurred while fetching the data.");
    }

    return res.json();
  };

  const { data: item, error } = useSWR(
    slug ? `/api/get-service-by-slug?slug=${slug}` : null,
    fetcher
  );

  if (error)
    return (
      <div className="flex justify-center w-full mt-20">Failed to load</div>
    );
  if (!item)
    return <div className="flex justify-center w-full mt-20">Loading...</div>;

  const service = item.data;

  let ComponentToRender;

  switch (service.categoryName) {
    case "packages":
      ComponentToRender = <PackageItem service={service} />;
      break;
    case "gift-cards":
      ComponentToRender = <GiftCardItem service={service} />;
      break;
    default:
      ComponentToRender = (
        <SingleTreatmentItem
          service={service}
          category={service.categoryName}
          categories={categories}
        />
      );
  }

  return (
    <main
      className={`mt-14 md:mt-8 md:px-20 px-4 transition-all duration-300 ${
        isExpanded ? "ml-[16.5rem]" : "md:ml-20"
      }`}
    >
      {ComponentToRender}
    </main>
  );
}

export async function getServerSideProps() {
  const { data: categories } = await fetchCategories();

  return { props: { categories } };
}

SingleProductPage.layout = DashboardLayout;
