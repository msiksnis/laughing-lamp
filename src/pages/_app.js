import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { Poppins } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--main-font",
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const Layout = Component.layout || (({ children }) => <>{children}</>);

  return (
    <main className={`${poppins.variable} font-poppins`}>
      <SessionProvider session={session}>
        <Layout>
          <Component {...pageProps} />
          <ToastContainer />
        </Layout>
      </SessionProvider>
    </main>
  );
}
