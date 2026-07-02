import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
} from "@fortawesome/free-solid-svg-icons";
import { slugify } from "../../utils/slugify.js";
import useServiceStore from "../../store/serviceStore";
import imageUrl from "../../utils/imageUrl.js";
import FadeIn from "../../components/ui/FadeIn.jsx";

// TEMP STATIC DATA — replace with service.offerings / service.target_audience / service.clients later
const STATIC_OFFERINGS = [
  "Personalized consultation and planning",
  "End-to-end project execution",
  "Dedicated support team",
  "Regular progress updates and reporting",
];

const STATIC_TARGET_AUDIENCE = [
  "Small Businesses",
  "Startups",
  "Enterprises",
  "Individuals",
];

const STATIC_CLIENTS = [
  {
    name: "Sarah Mitchell",
    position: "Marketing Director",
    company: "Acme Corp",
    quote: "The service exceeded our expectations from start to finish.",
    logo: null,
  },
  {
    name: "James Okafor",
    position: "CEO",
    company: "Nova Industries",
    quote: "Professional, timely, and genuinely invested in our success.",
    logo: null,
  },
  {
    name: "Priya Raman",
    position: "Operations Head",
    company: "BlueWave Ltd",
    quote: "A seamless experience with results that speak for themselves.",
    logo: null,
  },
  {
    name: "Daniel Kim",
    position: "Founder",
    company: "Zenith Group",
    quote: "Their team understood our needs better than we expected.",
    logo: null,
  },
];

// Reusable section heading matching TechnologyStack / Testimonials exactly
function SectionHeading({ eyebrow, title }) {
  return (
    <div className="text-center mb-10">
      <div className="font-cursive text-4xl text-primary">{eyebrow}</div>
      <h2 className="mt-2 text-3xl font-extrabold text-heading">
        {title}
      </h2>
    </div>
  );
}

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
    return (
      <div className="flex items-center justify-center py-24 md:py-32 bg-background min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-4 border-primary-light border-t-primary animate-spin" />
          <p className="text-muted text-sm">Loading service...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="text-center py-24 md:py-32 px-4 bg-background animate-page-fade">
        <p className="text-primary font-medium">{error}</p>
        <Link
          to="/services"
          className="mt-5 inline-flex items-center rounded-lg bg-primary text-white px-5 py-2.5 text-sm font-semibold hover:bg-primary-hover transition cursor-pointer">
          Back to Services
        </Link>
      </div>
    );

  if (!service)
    return (
      <div className="text-center py-24 md:py-32 px-4 bg-background animate-page-fade">
        <h2 className="text-2xl font-bold text-heading">Service Not Found</h2>
        <p className="mt-3 text-text">No service found for this URL.</p>
        <Link
          to="/services"
          className="mt-6 inline-flex items-center rounded-lg bg-primary text-white px-5 py-2.5 text-sm font-semibold hover:bg-primary-hover transition cursor-pointer">
          Back to Services
        </Link>
      </div>
    );

  // Dynamic Localhost Port Resolver for development environment images
  const resolveImagePath = (path) => {
    if (!path) return "";
    if (path.startsWith("http") || path.startsWith("data:")) return path;
    
    const isDev = import.meta.env.DEV;
    const hasApiUrlEnv = !!import.meta.env.VITE_API_URL;
    
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    
    if (isDev && !hasApiUrlEnv) {
      return `http://localhost:5000${cleanPath}`;
    }
    return imageUrl(cleanPath);
  };

  return (
    <div className="bg-background animate-page-fade">
      {/* Hero + Overview Section */}
      <section className="bg-dark text-white relative overflow-hidden py-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-lg rotate-12" />
          <div className="absolute bottom-10 right-16 w-20 h-20 bg-white/10 rounded-lg rotate-12" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4">
          {/* Breadcrumb Section */}
          <nav className="flex items-center gap-2 text-sm text-white/70 mb-8">
            <Link to="/" className="hover:text-primary transition">
              Home
            </Link>
            <span>/</span>
            <Link to="/services" className="hover:text-primary transition">
              Services
            </Link>
            <span>/</span>
            <span className="text-white font-medium truncate max-w-[160px] md:max-w-none">
              {service.service_name}
            </span>
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left Content layout column */}
            <div>
              <div className="text-sm font-bold tracking-widest uppercase inline-block px-3 py-1 rounded bg-white/10">
                FEATURED SERVICE
              </div>

              <h1 className="mt-3 text-3xl md:text-4xl font-extrabold leading-tight">
                {service.service_name.split(" ").slice(0, 2).join(" ")}{" "}
                <span className="text-primary-hover">
                  {service.service_name.split(" ").slice(2).join(" ")}
                </span>
              </h1>

              <div className="mt-4 text-white/90 leading-relaxed space-y-3 max-w-prose">
                {service.description
                  ?.split(".")
                  .map((p) => p.trim())
                  .filter(Boolean)
                  .map((para, i) => (
                    <p key={i} className="text-sm md:text-base">
                      {para}.
                    </p>
                  ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/contact"
                  className="inline-flex items-center rounded-lg bg-primary text-white px-5 py-2.5 text-sm font-semibold hover:bg-primary-hover transition cursor-pointer">
                  Get in Touch
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center rounded-lg bg-white/15 border border-white/20 text-white px-5 py-2.5 text-sm font-semibold transition cursor-pointer">
                  <FontAwesomeIcon icon={faAngleLeft} className="mr-2" />
                  Back to Services
                </Link>
              </div>
            </div>

            {/* Right Side Cover Image column */}
            <div className="w-full max-w-md mx-auto md:mx-0 aspect-4/3 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-white/5 rounded-lg blur-xl pointer-events-none" />
              <img
                src={resolveImagePath(service.image)}
                alt={service.service_name}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover rounded-lg relative border border-white/10 bg-surface"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = "/undraw_mobile-marketing_7x7m.svg";
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* What's Offered Section */}
      <section className="py-14 bg-surface">
        <div className="max-w-6xl mx-auto px-4">
          <FadeIn>
            <SectionHeading eyebrow="Solutions" title="What's Offered" />
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {STATIC_OFFERINGS.map((item, i) => (
              <FadeIn key={i} delay={i * 50}>
                <div className="bg-background border border-border rounded-lg p-6 flex items-start gap-4 hover:scale-[1.01] transition-all duration-300">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary-light text-primary font-extrabold shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-text leading-relaxed pt-1 text-sm md:text-base">
                    {item}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="py-14 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <FadeIn>
            <SectionHeading eyebrow="Audience" title="Who This Service Is For" />
          </FadeIn>
          
          <div className="flex flex-wrap justify-center gap-4">
            {STATIC_TARGET_AUDIENCE.map((aud, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div className="px-6 py-4 bg-surface border border-border rounded-lg text-center flex items-center justify-center min-w-[150px] font-bold text-heading hover:text-primary transition-colors cursor-default select-none">
                  {aud}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-14 bg-surface">
        <div className="max-w-6xl mx-auto px-4">
          <FadeIn>
            <SectionHeading eyebrow="Feedback" title="Clients Who Chose This Service" />
          </FadeIn>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STATIC_CLIENTS.map((client, i) => (
              <FadeIn key={i} delay={i * 60}>
                <div className="flex flex-col bg-background border border-border rounded-lg px-6 py-6 transition-all duration-300">
                  <p className="text-gray-700 leading-relaxed text-sm flex-1 italic">
                    "{client.quote}"
                  </p>

                  <div className="mt-6 flex items-center gap-3 pt-4 border-t border-border">
                    {client.logo ? (
                      <img
                        src={resolveImagePath(client.logo)}
                        alt={client.name}
                        loading="lazy"
                        decoding="async"
                        className="h-10 w-10 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary-light text-primary-hover flex items-center justify-center font-bold text-sm shrink-0">
                        {client.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 text-left">
                      <div className="font-bold text-heading text-sm truncate">
                        {client.name}
                      </div>
                      <div className="text-xs text-muted truncate">
                        {client.position}, {client.company}
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}