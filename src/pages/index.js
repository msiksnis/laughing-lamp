import Link from "next/link";

export default function HomePage() {
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center">
      <div className="text-4xl font-bold text-gray-800 py-10">Home Page</div>
      <Link href="/dashboard" className="text-xl">
        Go to Dashboard
      </Link>
    </div>
  );
}
