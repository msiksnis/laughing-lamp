import { Dialog } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function GiftCardModal({
  isOpen,
  setIsOpen,
  onSubmit,
  mode, // create or edit
  initialGiftCard,
}) {
  const [title, setTitle] = useState(
    mode === "edit" ? initialGiftCard.title : ""
  );
  const [slug, setSlug] = useState(mode === "edit" ? initialGiftCard.slug : "");
  const [order, setOrder] = useState(
    mode === "edit" ? initialGiftCard.order : ""
  );
  const [price, setPrice] = useState(
    mode === "edit" ? initialGiftCard.price : ""
  );
  const [description, setDescription] = useState(
    mode === "edit" ? initialGiftCard.description : ""
  );
  const [selectedFile, setSelectedFile] = useState(
    mode === "edit" ? initialGiftCard.imageUrl : "null"
  );

  const [titleError, setTitleError] = useState(false);
  const [priceError, setPriceError] = useState(false);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  useEffect(() => {
    const newSlug = title
      .toLowerCase()
      .replace(/[^\w ]+|[()]/g, "")
      .replace(/ +/g, "-");
    setSlug(newSlug);
  }, [title]);

  useEffect(() => {
    // If title has a value, remove error state
    if (title) {
      setTitleError(false);
    }
  }, [title]);

  useEffect(() => {
    // If price has a value, remove error state
    if (price) {
      setPriceError(false);
    }
  }, [price]);

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setOrder("");
    setPrice("");
    setDescription("");
    setSelectedFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Set form valid status
    let formIsValid = true;

    if (!title) {
      setTitleError(true);
      formIsValid = false; // set form invalid
    }

    if (!price) {
      setPriceError(true);
      formIsValid = false; // set form invalid
    }

    // Only proceed if form is valid
    if (formIsValid) {
      // Using FormData to create a new form containing only the image
      let imageFormData = new FormData();
      imageFormData.append("file", selectedFile);
      imageFormData.append("upload_preset", "tti1vzqp"); // Replace with upload preset

      // Sends a request to Cloudinary
      let imageRes = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: imageFormData,
        }
      );

      // Parse the JSON response from Cloudinary
      let imageJson = await imageRes.json();
      // The URL of the uploaded image is available in imageJson.secure_url

      const giftCard = {
        title,
        slug,
        order,
        price,
        description,
        category: "6474ddbfc91ec8f68b4f3ef8", // directly sets category as 'gift-cards' using ObjectId
        imageUrl: imageJson.secure_url, // Adds the Cloudinary URL as the image field
      };

      if (mode === "create") {
        onSubmit(giftCard);
      } else {
        onSubmit(initialGiftCard._id, giftCard); // Pass the ID of the giftCard to be edited
      }
      resetForm();
      setIsOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          open={isOpen}
          onClose={setIsOpen}
          as="div"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
        >
          <Dialog.Overlay />
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div
              className="absolute inset-0 bg-gray-500 opacity-75"
              onClick={() => setIsOpen(false)}
            ></div>
          </div>

          <motion.div
            className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
            initial={{
              opacity: 0,
              scale: 0.75,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: {
                ease: "easeOut",
                duration: 0.15,
              },
            }}
            exit={{
              opacity: 0,
              scale: 0.75,
              transition: {
                ease: "easeIn",
                duration: 0.15,
              },
            }}
          >
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div
              className="inline-block align-bottom bg-white text-left rounded overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-slate-900"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <Dialog.Title
                as="h3"
                className="md:text-lg leading-6 font-medium text-gray-900 pt-4 text-center uppercase"
                id="modal-headline"
              >
                {mode === "create" ? "Add new Gift Card" : "Edit Gift Card"}
              </Dialog.Title>

              <form onSubmit={handleSubmit}>
                <div className="modal-content p-4 md:pt-6">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Title"
                      className={`w-full p-1.5 md:p-2 border border-gray-300 rounded mb-4 md:mb-6 pl-2.5 peer placeholder-transparent focus:outline-none focus:border-slate-900 ${
                        titleError ? "border border-red-500" : ""
                      }`}
                      value={title}
                      onChange={handleTitleChange}
                    />
                    <label
                      htmlFor="title"
                      className="absolute left-1.5 -top-3 text-sm bg-white px-1 text-gray-400 transition-all peer-placeholder-shown:text-gray-400 focus:text-gray-400 peer-placeholder-shown:top-2 peer-focus:text-base peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-slate-700"
                    >
                      Title
                    </label>
                  </div>
                  <div className="flex space-x-2">
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="Price"
                        className={`w-full p-1.5 md:p-2 border border-gray-300 rounded mb-4 pl-2.5 peer placeholder-transparent focus:outline-none focus:border-slate-900 ${
                          priceError ? "border border-red-500" : ""
                        }`}
                        value={price}
                        onChange={handlePriceChange}
                      />
                      <label
                        htmlFor="price"
                        className="absolute left-1.5 -top-3 text-sm bg-white px-1 text-gray-400 transition-all peer-placeholder-shown:text-gray-400 focus:text-gray-400 peer-placeholder-shown:top-2 peer-focus:text-base peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-slate-700"
                      >
                        Price
                      </label>
                    </div>
                  </div>
                  <div className="relative">
                    <textarea
                      placeholder="Description"
                      className="w-full p-1.5 md:p-2 border border-gray-300 rounded mb-3 pl-2.5 peer placeholder-transparent focus:outline-none focus:border-slate-900"
                      value={description || ""}
                      onChange={handleDescriptionChange}
                    />
                    <label
                      htmlFor="description"
                      className="absolute left-1.5 -top-3 text-sm bg-white px-1 text-gray-400 transition-all peer-placeholder-shown:text-gray-400 focus:text-gray-400 peer-placeholder-shown:top-2 peer-focus:text-base peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-slate-700"
                    >
                      Description
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <label>Upload Image</label>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 space-x-2 flex">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="py-1.5 md:py-2 w-1/2 border bg-white hover:bg-gray-50 border-gray-300 rounded mr-2 transition-all duration-300 focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-1.5 md:py-2 w-1/2 bg-slate-900 text-white border border-slate-900 rounded hover:bg-white hover:text-slate-900 transition-all duration-300 focus:outline-none"
                  >
                    {mode === "create" ? "Add" : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
