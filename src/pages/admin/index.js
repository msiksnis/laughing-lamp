import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

export default function AdminPage() {
  const { data: session } = useSession();

  const handleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  const handleSignInCredentials = (e) => {
    e.preventDefault();
    signIn("credentials", {
      callbackUrl: "/dashboard",
      redirect: true,
      username: "demo", // replace with actual form values
      password: "demo", // replace with actual form values
    });
  };

  return (
    <div className="mt-40 md:mt-0 md:pb-20 h-screen p-4 flex justify-center items-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="mb-2 text-xl text-center">
          This part is for admin only <br /> please sign in
        </div>
        {!session && (
          <>
            <button
              onClick={handleSignIn}
              className="flex items-center justify-center border border-slate-900 py-3 w-64 rounded bg-slate-900 text-gray-100 hover:bg-white hover:text-slate-900 transition-all duration-300 shadow-md focus:outline-none"
            >
              <Image
                src="/icons/google.png"
                alt="google"
                width={25}
                height={25}
                className="mr-4"
              />
              Sign In with Google
            </button>
            <div className="text-center">Or</div>
            <button
              className="flex items-center justify-center border border-slate-900 py-3 w-64 rounded bg-slate-900 text-gray-100 hover:bg-white hover:text-slate-900 transition-all duration-300 shadow-md focus:outline-none"
              onClick={handleSignInCredentials}
            >
              Sign In with demo account
            </button>
          </>
        )}
        {session && (
          <>
            Signed in as {session.user.name} <br />
            <button
              onClick={signOut}
              className="flex justify-center tracking-wider items-center uppercase border border-slate-900 rounded md:px-10 py-3 w-full bg-slate-900 text-white hover:bg-white hover:text-slate-900 transition-all duration-300 shadow focus:outline-none"
            >
              Sign Out
            </button>
          </>
        )}
      </div>
    </div>
  );
}
