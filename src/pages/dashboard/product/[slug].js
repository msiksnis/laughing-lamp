import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { fetchServiceBySlug } from "../../../../utils/fetchServiceBySlug";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import PackageItem from "@/components/dashboard/PackageItem";
import GiftCardItem from "@/components/dashboard/GiftCardItem";
import SingleTreatmentItem from "@/components/dashboard/SingleTreatmentItem";
import { useSidebarContext } from "@/contexts/SidebarContext";
import { fetchCategories } from "../../../../utils/fetchCategories";
import useSWR from "swr";
import { fetchServices } from "../../../../utils/fetchServices";

export default function SingleProductPage({ categories }) {
  const [item, setItem] = useState(null);
  const router = useRouter();
  const { slug } = router.query;
  const { isExpanded } = useSidebarContext();

  useEffect(() => {
    if (slug) {
      async function fetchItem() {
        const item = await fetchServiceBySlug(slug);
        setItem(item);
      }
      fetchItem();
    }
  }, [slug]);

  if (!item) {
    return <div className="flex justify-center w-full mt-20">Loading...</div>;
  }

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
