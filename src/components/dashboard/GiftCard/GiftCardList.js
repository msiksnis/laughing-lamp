// component/dashboard/GiftCardList.js
import { useState } from "react";
import { Reorder } from "framer-motion";
import GiftCardItem from "./GiftCardItem";

export default function GiftCardList({ giftCards, category, categories }) {
  const [orderedGiftCards, setOrderedGiftCards] = useState(giftCards);

  const handleReorder = async (values) => {
    setOrderedGiftCards(values);

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
    <Reorder.Group values={orderedGiftCards} onReorder={handleReorder}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-20">
        {orderedGiftCards.map((giftCard) => (
          <GiftCardItem
            key={giftCard._id}
            giftCard={giftCard}
            category={category}
            categories={categories}
          />
        ))}
      </div>
    </Reorder.Group>
  );
}
