import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
  <span className="absolute text-[14rem] font-black text-surface select-none">
    404
  </span>

  <div className="relative z-10 text-center px-6">
    <h2 className="text-4xl font-bold text-heading">
      Page Not Found
    </h2>

    <p className="mt-3 text-muted max-w-md">
      The page you're looking for doesn't exist or has been moved.
    </p>

    <Link
      to="/"
      className="mt-8 inline-block rounded-full bg-primary px-6 py-3 text-white hover:bg-primary-hover transition"
    >
      Go Home
    </Link>
  </div>
</div>
  );
}