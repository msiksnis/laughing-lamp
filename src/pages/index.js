import { useState } from "react";
import TreatmentItem from "@/components/dashboard/TreatmentItem";
import { fetchServices } from "../../utils/fetchServices";
import { Reorder } from "framer-motion";

export default function HomePage({ services: initialServices }) {
  const [services, setServices] = useState(initialServices);

  return (
    <main className="m-10">
      <h1 className="text-xl mb-10">All Services</h1>
      <Reorder.Group axis="y" onReorder={setServices} values={services}>
        {services.map((service) => (
          <TreatmentItem key={service._id} service={service} />
        ))}
      </Reorder.Group>
    </main>
  );
}

export async function getStaticProps() {
  const { data: services } = await fetchServices();

  return {
    props: {
      services,
    },
    revalidate: 10,
  };
}
