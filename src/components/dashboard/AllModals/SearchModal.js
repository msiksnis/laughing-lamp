import { motion, AnimatePresence } from "framer-motion";
import { Dialog } from "@headlessui/react";
import useDebounce from "../../../../hooks/debounce";
import { useEffect, useState, createRef, useRef, useCallback } from "react";
import { useRouter } from "next/router";

export default function SearchModal({
  isOpen,
  setIsOpen,
  onSearch,
  searchResults,
}) {
  const [search, setSearch] = useState("");
  const [activeResult, setActiveResult] = useState(-1);
  const resultRefs = useRef([]);

  const debouncedSearchTerm = useDebounce(search, 500);

  const router = useRouter();

  useEffect(() => {
    onSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  const handleSearchResultClick = useCallback(
    (slug, index) => {
      // navigate to the service detail page
      router.push(`/dashboard/product/${slug}`);
      // reset the search input, results, and activeResult
      setSearch("");
      setIsOpen(false);
      setActiveResult(0);
    },
    [router]
  );

  useEffect(() => {
    if (isOpen) {
      setActiveResult(-1);
    }
  }, [isOpen]);

  useEffect(() => {
    resultRefs.current = searchResults.map(
      (_, i) => resultRefs.current[i] || createRef()
    );
  }, [searchResults]);

  const handleKeyDown = useCallback(
    (e) => {
      if (searchResults.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setActiveResult((prevActiveResult) => {
            const nextResult = Math.min(
              prevActiveResult + 1,
              searchResults.length - 1
            );
            resultRefs.current[nextResult]?.current?.focus();
            return nextResult;
          });
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setActiveResult((prevActiveResult) => {
            const nextResult = Math.max(prevActiveResult - 1, 0);
            resultRefs.current[nextResult]?.current?.focus();
            return nextResult;
          });
        }
        if (e.key === "Enter") {
          e.preventDefault();
          if (searchResults[activeResult]) {
            handleSearchResultClick(
              searchResults[activeResult].slug,
              activeResult
            );
          }
        }
      }
    },
    [searchResults, activeResult, handleSearchResultClick]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          open={isOpen}
          onClose={() => {
            setIsOpen(false);
            setSearch("");
          }}
          as="div"
          className="fixed top-20 left-0 right-0 z-10 items-center justify-center  overflow-y-auto"
        >
          <Dialog.Overlay />
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div
              className="absolute inset-0 bg-gray-500 opacity-70"
              onClick={() => setIsOpen(false)}
            ></div>
          </div>
          <motion.div
            className="flex justify-center text-center"
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
            <div
              className="mx-4 w-full md:w-2/3 align-bottom bg-white rounded text-left overflow-hidden shadow-xl transform transition-all"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="bg-white px-4 pt-5 pb-4">
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    className="flex-1 focus:outline-none border-b border-gray-300"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>
              {searchResults.length > 0 && (
                <div className="py-3 space-y-0 flex flex-col">
                  {searchResults.map((result, index) => (
                    <button
                      className={`flex w-full border-b justify-between items-center cursor-pointer hover:bg-gray-100 px-4 py-2 ${
                        activeResult === index ? "bg-gray-200" : ""
                      }`}
                      key={result._id}
                      onClick={() =>
                        handleSearchResultClick(result.slug, index)
                      }
                    >
                      <div className="flex justify-start w-4/5 md:w-min space-x-2 items-center">
                        <div className="truncate">{result.title}</div>
                        <div className="hidden md:inline-block">
                          ({result.gender})
                        </div>
                      </div>
                      <div className="">${result.price}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
