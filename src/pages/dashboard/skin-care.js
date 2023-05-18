import TreatmentItem from "@/components/dashboard/TreatmentItem";
import { fetchSkinCare } from "../../../utils/fetchSkinCare";

export default function SkinCarePage({ services }) {
  return (
    <main className="p-10">
      <h1 className="text-xl my-10">Our Skin Care Services</h1>
      {services.map((service) => (
        <TreatmentItem key={service._id} service={service} />
      ))}
    </main>
  );
}

export async function getStaticProps() {
  const { data: services } = await fetchSkinCare();

  return {
    props: {
      services,
    },
    revalidate: 10,
  };
}
