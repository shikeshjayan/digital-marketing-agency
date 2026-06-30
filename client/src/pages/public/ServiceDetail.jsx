import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { slugify } from "../../utils/slugify.js";
import { DetailSkeleton } from "../../components/ui/Skeleton.jsx";
import useServiceStore from "../../store/serviceStore";
import imageUrl from "../../utils/imageUrl.js";

export default function ServiceDetail() {
  const { slug } = useParams();
  const { services, loading, fetchServices } = useServiceStore();
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchServices().catch((e) => setError(e.message));
  }, [slug, fetchServices]);

  const service =
    (services ?? []).find((s) => slugify(s.service_name) === slug) ?? null;

  if (loading)
    return <DetailSkeleton />;

  if (error)
    return (
      <div className="text-center py-32">
        <p className="text-red-500">{error}</p>
        <button
          type="button"
          onClick={() => {
            setError(null);
            fetchServices();
          }}
          className="mt-4 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition cursor-pointer">
          Retry
        </button>
        <div className="mt-4">
          <Link
            to="/services"
            className="inline-flex items-center rounded-full bg-gray-100 text-gray-700 px-5 py-2.5 text-sm font-semibold hover:bg-gray-200 transition cursor-pointer">
            Back to Services
          </Link>
        </div>
      </div>
    );

  if (!service)
    return (
      <div className="text-center py-32">
        <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">Service Not Found</h2>
        <p className="mt-3 text-gray-500">No service found for this URL.</p>
        <Link
          to="/services"
          className="mt-6 inline-flex items-center rounded-full bg-red-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-red-500 transition cursor-pointer">
          Back to Services
        </Link>
      </div>
    );

  return (
    <div>
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
            {service.service_name}
          </h1>
          <div className="mt-10 flex justify-center">
            <img
              src={imageUrl(service.image)}
              alt={service.service_name}
              loading="lazy"
              decoding="async"
              className="w-full max-w-2xl h-64 md:h-80 object-cover rounded-2xl shadow-md bg-gray-100"
              onError={(e) => { e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='320' viewBox='0 0 800 320'%3E%3Crect fill='%23e5e7eb' width='800' height='320'/%3E%3Ctext x='400' y='165' text-anchor='middle' fill='%239ca3af' font-size='20' font-family='sans-serif'%3ENo Image%3C/text%3E%3C/svg%3E"; }}
            />
          </div>
          <div className="mt-10 max-w-3xl mx-auto text-gray-700 leading-relaxed space-y-4">
            {service.description
              .split(".")
              .map((p) => p.trim())
              .filter(Boolean)
              .map((para, i) => (
                <p key={i} className="text-justify text-base md:text-lg leading-8">
                  {para}.
                </p>
              ))}
          </div>
          <div className="mt-12">
            <Link
              to="/services"
              className="inline-flex items-center rounded-full bg-red-600 text-white px-6 py-3 text-sm font-semibold hover:bg-red-500 transition shadow-md cursor-pointer">
              Back to Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
