// AllProviders.js
import { ToastProvider } from "./ToastContext";
// other providers...

const AllProviders = ({ children }) => {
  return <ToastProvider>{children}</ToastProvider>;
};

export default AllProviders;
