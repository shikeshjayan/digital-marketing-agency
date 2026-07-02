import { useEffect } from "react";
import { Link } from "react-router-dom";
import HeroSplit from "../../components/public/HeroSplit";
import FadeIn from "../../components/ui/FadeIn.jsx";
import { ServiceCardSkeleton } from "../../components/ui/Skeleton.jsx";
import useServiceStore from "../../store/serviceStore";
import { slugify } from "../../utils/slugify";
import imageUrl from "../../utils/imageUrl";

const ServiceCard = ({ service }) => (
  <Link
    to={`/services/${slugify(service.service_name)}`}
    className="flex flex-col bg-white border border-gray-100 rounded-lg shadow-sm h-full overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-300">
    <div className="h-40 overflow-hidden">
      <img
        src={imageUrl(service.image)}
        alt={service.service_name}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover bg-gray-200"
        onError={(e) => { e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect fill='%23e5e7eb' width='400' height='200'/%3E%3Ctext x='200' y='105' text-anchor='middle' fill='%239ca3af' font-size='16' font-family='sans-serif'%3ENo Image%3C/text%3E%3C/svg%3E"; }}
      />
    </div>
    <div className="flex flex-col items-center text-center p-5 flex-1 gap-6">
      <h3 className="text-lg font-extrabold text-gray-900">
        {service.service_name}
      </h3>
      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
        {service.short_description}
      </p>
      <span className="inline-flex items-center rounded-lg bg-primary text-white px-5 py-2.5 text-sm font-semibold hover:bg-primary-hover transition">
        Read More
      </span>
    </div>
  </Link>
);

const Services = () => {
  const { services, loading, error, fetchServices } = useServiceStore();

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  if (loading)
    return (
      <section className="py-12 bg-gray-50">
        <HeroSplit title="Services" subtitle="We offer a wide range of services to meet your needs." />
        <div className="max-w-6xl mx-auto px-4 mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <ServiceCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );

  if (error)
    return (
      <section className="py-12 bg-gray-50">
        <HeroSplit title="Services" subtitle="We offer a wide range of services to meet your needs." />
        <div className="max-w-6xl mx-auto px-4 mt-10">
          <div className="text-center py-20">
            <div className="text-red-500 mb-4">{error}</div>
            <button
              type="button"
              onClick={() => fetchServices()}
              className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-hover transition cursor-pointer">
              Retry
            </button>
          </div>
        </div>
      </section>
    );

  return (
    <section className="py-12 bg-gray-50">
      <HeroSplit title="Services" subtitle="We offer a wide range of services to meet your needs." />
      <div className="max-w-6xl mx-auto px-4 mt-10">
        {services.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <div className="mt-4 text-lg font-semibold text-gray-600">No services available</div>
            <div className="mt-2 text-sm text-gray-400">Check back later for our services.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <FadeIn key={s._id} delay={i * 100}>
                <ServiceCard service={s} />
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Services;
