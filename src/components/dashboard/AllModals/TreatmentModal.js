import { Dialog } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { convertCategoryTitle } from "../textConversion";

export default function TreatmentModal({
  isOpen,
  setIsOpen,
  onSubmit,
  categories,
  mode, // create or edit
  initialTreatment,
}) {
  const [title, setTitle] = useState(
    mode === "edit" ? initialTreatment.title : ""
  );
  const [slug, setSlug] = useState(
    mode === "edit" ? initialTreatment.slug : ""
  );
  const [order, setOrder] = useState(
    mode === "edit" ? initialTreatment.order : ""
  );
  const [price, setPrice] = useState(
    mode === "edit" ? initialTreatment.price : ""
  );
  const [duration, setDuration] = useState(
    mode === "edit" ? initialTreatment.duration : ""
  );
  const [description, setDescription] = useState(
    mode === "edit" ? initialTreatment.description : ""
  );
  const [gender, setGender] = useState(
    mode === "edit" ? initialTreatment.gender : ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    mode === "edit" ? initialTreatment.category : ""
  );
  const [titleError, setTitleError] = useState(false);
  const [priceError, setPriceError] = useState(false);
  const [durationError, setDurationError] = useState(false);
  const [genderError, setGenderError] = useState(false);
  const [categoryError, setCategoryError] = useState(false);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };

  const handleDurationChange = (e) => {
    setDuration(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  useEffect(() => {
    // Only generate slug if both title and gender have been set
    if (title && gender) {
      const newSlug = title
        .toLowerCase()
        .replace(/[^\w ]+|[()]/g, "")
        .replace(/ +/g, "-");

      const genderSlug = `${newSlug}-${gender}`;

      setSlug(genderSlug);
    }
  }, [title, gender]);

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

  useEffect(() => {
    // If duration has a value, remove error state
    if (duration) {
      setDurationError(false);
    }
  }, [duration]);

  useEffect(() => {
    // If gender has a value, remove error state
    if (gender) {
      setGenderError(false);
    }
  }, [gender]);

  useEffect(() => {
    // If selectedCategory has a value, remove error state
    if (selectedCategory) {
      setCategoryError(false);
    }
  }, [selectedCategory]);

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setOrder("");
    setPrice("");
    setDuration("");
    setDescription("");
    setGender("");
    setSelectedCategory("");
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

    if (!duration) {
      setDurationError(true);
      formIsValid = false; // set form invalid
    }

    if (!gender) {
      setGenderError(true);
      formIsValid = false; // set form invalid
    }

    if (!selectedCategory) {
      setCategoryError(true);
      formIsValid = false; // set form invalid
    }

    // Only proceed if form is valid
    if (formIsValid) {
      const treatment = {
        title,
        slug,
        order,
        price,
        duration,
        description,
        gender,
        category: selectedCategory,
      };

      if (mode === "create") {
        onSubmit(treatment);
      } else {
        onSubmit(initialTreatment._id, treatment); // Pass the ID of the treatment to be edited
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
              className="inline-block align-bottom bg-white text-left rounded overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <Dialog.Title
                as="h3"
                className="md:text-lg leading-6 font-medium text-gray-900 pt-4 text-center uppercase"
                id="modal-headline"
              >
                {mode === "create" ? "Add a new treatment" : "Edit treatment"}
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
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="Duration"
                        className={`w-full p-1.5 md:p-2 border border-gray-300 rounded mb-4 pl-2.5 peer placeholder-transparent focus:outline-none focus:border-slate-900 ${
                          durationError ? "border border-red-500" : ""
                        }`}
                        value={duration}
                        onChange={handleDurationChange}
                      />
                      <label
                        htmlFor="duration"
                        className="absolute left-1.5 -top-3 text-sm bg-white px-1 text-gray-400 transition-all peer-placeholder-shown:text-gray-400 focus:text-gray-400 peer-placeholder-shown:top-2 peer-focus:text-base peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-slate-700"
                      >
                        Duration
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
                  <div
                    className={`border p-2.5 md:p-4 rounded mb-4 md:mb-6 ${
                      genderError ? "border border-red-500" : ""
                    }`}
                  >
                    <p className="mb-1 md:mb-2 text-gray-800">Select gender</p>
                    <div className="flex space-x-5">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="radio"
                          value="female"
                          checked={gender === "female"}
                          onChange={handleGenderChange}
                          className="cursor-pointer accent-slate-900"
                        />
                        <span className="ml-2">Female</span>
                      </label>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="radio"
                          value="male"
                          checked={gender === "male"}
                          onChange={handleGenderChange}
                          className="cursor-pointer accent-slate-900"
                        />
                        <span className="ml-2">Male</span>
                      </label>
                    </div>
                  </div>
                  <div
                    className={`border p-2.5 md:p-4 rounded ${
                      categoryError ? "border border-red-500" : ""
                    }`}
                  >
                    <p className="mb-1 md:mb-2 text-gray-800">
                      Select category
                    </p>
                    <div className="flex flex-col">
                      {categories &&
                        categories.map((category) => (
                          <label
                            key={category._id}
                            className="inline-flex items-center cursor-pointer"
                          >
                            <input
                              type="radio"
                              value={category._id}
                              checked={category._id === selectedCategory}
                              onChange={handleCategoryChange}
                              className="cursor-pointer accent-slate-900"
                            />

                            <span className="ml-2">
                              {convertCategoryTitle(category.categoryName)}
                            </span>
                          </label>
                        ))}
                    </div>
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
