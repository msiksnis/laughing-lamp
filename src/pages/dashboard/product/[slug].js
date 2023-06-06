import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { fetchServiceBySlug } from "../../../../utils/fetchServiceBySlug";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function SingleProductPage() {
  const [item, setItem] = useState(null);
  const router = useRouter();
  const { slug } = router.query;

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
    return <div>Loading...</div>;
  }

  const product = item.data;

  return (
    <>
      <div>{product.title}</div>
      <div>{product.price}</div>
      <div>{product.description}</div>
    </>
  );
}

SingleProductPage.layout = DashboardLayout;
