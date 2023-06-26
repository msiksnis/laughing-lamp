import { useRouter } from "next/router";

export default function ErrorPage() {
  const router = useRouter();
  const { error } = router.query;

  return (
    <div className="-mt-20 md:mt-0 md:pb-20 h-screen p-4 flex flex-col justify-center items-center">
      <h1 className="text-2xl text-center">An error occurred: {error}</h1>
      <p className="text-sm text-red-500 text-center mt-2">
        Look like this Google account has no admin rights
      </p>
      <button
        className="mt-10 uppercase border border-slate-900 md:px-10 py-3 w-full max-w-xs bg-slate-900 text-white hover:bg-white hover:text-slate-900 transition-all duration-300 shadow focus:outline-none rounded tracking-wide cursor-pointer"
        onClick={() => router.push("/admin")}
      >
        Back to Sign In
      </button>
    </div>
  );
}
