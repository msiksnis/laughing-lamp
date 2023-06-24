import { useState } from "react";
import Image from "next/image";

export default function GiftCardComponent() {
  const [giftCardValue, setGiftCardValue] = useState("100");
  const [giftCardImage, setGiftCardImage] = useState({
    url: "/images/giftcards/gift_card_white.jpg",
    alt: "White Card",
  });
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [personalizedMessage, setPersonalizedMessage] = useState("");
  const [showPersonalizedMessageField, setShowPersonalizedMessageField] =
    useState(false);

  const giftCardImages = [
    { url: "/images/giftcards/gift_card_white.jpg", alt: "White Card" },
    { url: "/images/giftcards/gift_card_black.jpg", alt: "Black Card" },
  ];

  const handleValueChange = (value) => {
    setGiftCardValue(value);
  };

  const handleImageChange = (image) => {
    setGiftCardImage(image);
  };

  const togglePersonalizedMessageField = () => {
    setShowPersonalizedMessageField(!showPersonalizedMessageField);
  };

  return (
    <div className="flex justify-center space-x-6 md:space-x-10 mt-20 lg:mx-20 md:mx-10">
      <div className="flex justify-center px-4 md:px-0 items-start w-1/2">
        <Image
          src={giftCardImage.url}
          alt={giftCardImage.alt}
          width={500}
          height={500}
        />
      </div>

      <div className="w-1/2">
        <h2 className="text-2xl mb-10">Buy Apple Gift Card</h2>

        <h3 className="text-lg mb-2">Choose a design</h3>
        <div className="flex space-x-4 mb-10">
          {giftCardImages.map((image) => (
            <button
              key={image.url}
              onClick={() => handleImageChange(image)}
              className={`p-1 border ${
                giftCardImage.url === image.url ? "border-slate-900" : ""
              }`}
            >
              <Image src={image.url} alt={image.alt} width={100} height={100} />
            </button>
          ))}
        </div>

        <h3 className="text-lg mb-2">Choose a value</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {["100", "250", "500", "1000"].map((value) => (
            <button
              key={value}
              onClick={() => handleValueChange(value)}
              className={`w-40 py-2 max-w-[10rem] border ${
                giftCardValue === value ? "border-slate-900" : ""
              }`}
            >
              ${value}
            </button>
          ))}
        </div>

        <h3 className="text-lg mb-2">Delivery Details</h3>
        <label className="block mb-2">
          Recipient Name
          <input
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            placeholder="Recipient Name"
            className="block mt-1 mb-2"
          />
        </label>
        <label className="block mb-2">
          Recipient Email
          <input
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            placeholder="Recipient Email"
            className="block mt-1 mb-4"
          />
        </label>

        <label className="block mb-2">
          Sender Name
          <input
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            placeholder="Sender Name"
            className="block mt-1 mb-2"
          />
        </label>
        <label className="block mb-2">
          Sender Email
          <input
            value={senderEmail}
            onChange={(e) => setSenderEmail(e.target.value)}
            placeholder="Sender Email"
            className="block mt-1 mb-4"
          />
        </label>

        <div className="mb-4">
          <button onClick={togglePersonalizedMessageField}>
            Want to add a personalized message?
          </button>
          {showPersonalizedMessageField && (
            <textarea
              value={personalizedMessage}
              onChange={(e) => setPersonalizedMessage(e.target.value)}
              placeholder="Your message"
              className="block mt-2"
            />
          )}
        </div>

        <button className="bg-sla90border-slate-900 text-white px-4 py-2">
          Buy
        </button>
      </div>
    </div>
  );
}
