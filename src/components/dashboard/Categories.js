import { GoPlus as Add } from "react-icons/go";
import {
  convertCategoryTitle,
  convertToCorrectCategory,
} from "./textConversion";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { toast } from "react-toastify";
import { fetchCategories } from "../../../utils/fetchCategories";

export default function Categories({ initialCategories }) {
  const [newCategoryField, setNewCategoryField] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryError, setNewCategoryError] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const inputRef = useRef();

  useEffect(() => {
    if (newCategoryField && inputRef.current) {
      inputRef.current.focus();
    }
  }, [newCategoryField]);

  const {
    data: { data: categories = [] } = {},
    mutate: mutateCategories,
    error,
    isValidating,
  } = useSWR("/api/get-skinCare", fetchCategories, {
    initialData: initialCategories,
    revalidateOnFocus: false,
  });

  if (error) {
    return <div>Error loading treatments</div>;
  }

  if (isValidating) {
    return <p>Loading...</p>;
  }

  const handleValueChange = (e) => {
    e.preventDefault();
    setNewCategory(e.target.value);

    // If a value is entered, remove error state
    if (e.target.value && e.target.value.length >= 4) {
      setNewCategoryError(false);
      setFormSubmitted(false);
    } else {
      if (formSubmitted) {
        // only set error state if form has been submitted
        setNewCategoryError(true);
      }
    }
  };

  const resetField = () => {
    setNewCategory("");
  };

  const createNewCategory = async (category) => {
    try {
      const res = await fetch("/api/create-category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(category),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      // Mutate the categories data
      mutateCategories();

      toast.success("Category created successfully!");
    } catch (error) {
      console.error("Create category error:", error);

      toast.error("Failed to create the category.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    let formIsValid = true;

    if (!newCategory || newCategory.length < 4) {
      setNewCategoryError(true);
      return; // exit the function early
    }

    if (formIsValid) {
      const categoryName = {
        categoryName: convertToCorrectCategory(newCategory),
      };

      createNewCategory(categoryName);
      resetField();
      setNewCategoryField(false);
    }
  };

  return (
    <div>
      <div className="text-2xl inline-table item-shadow rounded">
        <div className="flex items-center py-4 space-x-8 border-b border-slate-400 px-10 pb-4">
          <p className="uppercase">Categories</p>
          <div
            className="group p-2 rounded-full item-shadow cursor-pointer hover:scale-105 transition-all"
            onClick={() => setNewCategoryField(!newCategoryField)}
          >
            <Add
              className={`w-5 h-5 group-hover:scale-105
            ${
              newCategoryField
                ? "rotate-45 transition-transform duration-200"
                : "transition-transform duration-200"
            }
            `}
            />
          </div>
        </div>
        <>
          {categories.map((category) => (
            <div
              key={category._id}
              className="text-xl text-slate-900 odd:bg-slate-50 even:bg-white p-2"
            >
              <div className="px-10">
                {convertCategoryTitle(category.categoryName)}
              </div>
            </div>
          ))}
        </>
        {newCategoryField && (
          <form
            onSubmit={handleSubmit}
            className="relative text-base py-2 mx-10 transition-all duration-300"
          >
            <input
              type="text"
              placeholder="New Catrgory"
              ref={inputRef}
              className={`pt-1 border-b border-slate-400 w-full focus:outline-none focus:border-slate-900 ${
                newCategoryError
                  ? "border-red-500 focus:border-red-500"
                  : "focus:border-slate-900"
              }`}
              value={newCategory}
              onChange={handleValueChange}
            />
            <button
              type="submit"
              className={`absolute right-0 top-1/2 -translate-y-1/2 bg-white p-1 
              ${
                !newCategory || newCategory.length < 4
                  ? "text-gray-400"
                  : "text-your-color"
              }
              `}
            >
              <Add className="w-4 h-4" />
            </button>
          </form>
        )}

        {newCategoryError && formSubmitted && (
          <div className="text-red-500 text-xs ml-10 pb-1">
            Must be at least 4 characters long
          </div>
        )}
      </div>
    </div>
  );
}
