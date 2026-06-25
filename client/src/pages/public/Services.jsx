import { useEffect } from "react";
import { Link } from "react-router-dom";
import HeroSplit from "../../components/public/HeroSplit";
import useServiceStore from "../../store/serviceStore";
import { slugify } from "../../utils/slugify";

const ServiceCard = ({ service }) => (
  <Link
    to={`/services/${slugify(service.service_name)}`}
    className="flex flex-col bg-white border border-gray-100 rounded-xl shadow-sm h-full overflow-hidden">
    <div className="h-40 overflow-hidden">
      <img
        src={service.image}
        alt={service.service_name}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover bg-gray-200"
      />
    </div>
    <div className="flex flex-col items-center text-center p-5 flex-1 gap-6">
      <h3 className="text-lg font-extrabold text-gray-900">
        {service.service_name}
      </h3>
      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
        {service.short_description}
      </p>
      <span className="inline-flex items-center rounded-xl bg-red-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-red-500 transition">
        Read More
      </span>
    </div>
  </Link>
);

const Services = () => {
  const { services, loading, fetchServices } = useServiceStore();

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  if (loading)
    return <div className="text-center py-20 text-gray-500">Loading...</div>;

  return (
    <section className="py-12 bg-gray-50">
      <HeroSplit title="Services" subtitle="We offer a wide range of services to meet your needs." />
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <ServiceCard key={s._id} service={s} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
