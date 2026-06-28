import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
  <span className="absolute text-[14rem] font-black text-gray-100 select-none">
    404
  </span>

  <div className="relative z-10 text-center px-6">
    <h2 className="text-4xl font-bold text-gray-900">
      Page Not Found
    </h2>

    <p className="mt-3 text-gray-600 max-w-md">
      The page you're looking for doesn't exist or has been moved.
    </p>

    <Link
      to="/"
      className="mt-8 inline-block rounded-full bg-red-600 px-6 py-3 text-white hover:bg-red-700 transition"
    >
      Go Home
    </Link>
  </div>
</div>
  );
}