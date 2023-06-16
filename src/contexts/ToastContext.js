import { createContext, useState, useCallback, useEffect } from "react";
import * as toastify from "react-toastify";

export const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = useCallback((message, type) => {
    console.log(
      "showToast function called with message:",
      message,
      "and type:",
      type
    );
    setToastMessage({ message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  useEffect(() => {
    if (toastMessage) {
      const { message, type } = toastMessage;

      switch (type) {
        case "success":
          toastify.toast.success(message);
          break;
        case "error":
          toastify.toast.error(message);
          break;
        default:
          break;
      }
    }
  }, [toastMessage]);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
    </ToastContext.Provider>
  );
}
