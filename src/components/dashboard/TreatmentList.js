// component/dashboard/TreatmentList.js
import { useState } from "react";
import TreatmentItem from "./TreatmentItem";
import { Reorder } from "framer-motion";

export default function TreatmentList({ services, category, categories }) {
  const [orderedServices, setOrderedServices] = useState(services);

  const handleReorder = async (values) => {
    setOrderedServices(values);

    // Send the new order to the server
    try {
      const response = await fetch("/api/update-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderedItems: values }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Reorder.Group values={orderedServices} onReorder={handleReorder}>
      {orderedServices.map((service) => (
        <TreatmentItem
          key={service._id}
          service={service}
          category={category}
          categories={categories}
        />
      ))}
    </Reorder.Group>
  );
}
