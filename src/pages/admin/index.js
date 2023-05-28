export default function AdminPage() {
  return (
    <div className="mt-72 p-4 flex justify-center items-center">
      <div className="flex flex-col items-center space-y-6">
        <div className="text-2xl text-center md:text-2xl">
          This part is for admin only, please sign in
        </div>
        <button className="flex justify-center tracking-wider items-center uppercase border border-slate-900 rounded md:px-10 py-3 w-full bg-slate-900 text-white hover:bg-white hover:text-slate-900 transition-all duration-300 shadow focus:outline-none">
          Sign In
        </button>
      </div>
    </div>
  );
}
