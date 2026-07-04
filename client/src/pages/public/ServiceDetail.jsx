import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { slugify } from "../../utils/slugify.js";
import useServiceStore from "../../store/serviceStore";
import FadeIn from "../../components/ui/FadeIn.jsx";
import AnimatedCounter from "../../components/ui/AnimatedCounter.jsx";
import OurProcess from "../../components/public/OurProcess.jsx";
import WhyChooseUs from "../../components/public/WhyChooseUs.jsx";
import FAQSection from "../../components/public/FAQSection.jsx";
import FinalCTA from "../../components/public/FinalCTA.jsx";
import resolveImagePath from "../../utils/resolveImagePath.js";

function SectionHeading({ eyebrow, title }) {
  return (
    <div className="text-center mb-10">
      <div className="font-cursive text-4xl text-primary">{eyebrow}</div>
      <h2 className="mt-2 text-3xl font-extrabold text-heading">{title}</h2>
    </div>
  );
}

export default function ServiceDetail() {
  const { slug } = useParams();
  const { services, loading, fetchServices, relatedServices, fetchRelatedServices } =
    useServiceStore();
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchServices().catch((e) => setError(e.message));
  }, [slug, fetchServices]);

  const service =
    (services ?? []).find((s) => slugify(s.service_name) === slug) ?? null;

  useEffect(() => {
    if (service?._id) {
      fetchRelatedServices(service._id, 3);
    }
  }, [service?._id, fetchRelatedServices]);

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

  const hasCaseStudy =
    service.case_study &&
    (service.case_study.title || service.case_study.description || (service.case_study.stats && service.case_study.stats.length > 0));

  return (
    <div className="bg-background animate-page-fade">
      {/* Hero + Overview Section */}
      <section className="bg-dark text-white relative overflow-hidden py-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-lg rotate-12" />
          <div className="absolute bottom-10 right-16 w-20 h-20 bg-white/10 rounded-lg rotate-12" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-white/70 mb-8 justify-start">
            <Link to="/" className="hover:text-primary transition">Home</Link>
            <span>/</span>
            <Link to="/services" className="hover:text-primary transition">Services</Link>
            <span>/</span>
            <span className="text-white font-medium truncate max-w-[160px] md:max-w-none">
              {service.service_name}
            </span>
          </nav>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left">
              <div className="w-full flex justify-start mb-3">
                <div className="text-sm font-bold tracking-widest uppercase inline-block px-3 py-1 rounded bg-white/10">
                  FEATURED SERVICE
                </div>
              </div>
              <h1 className="mt-3 text-3xl md:text-4xl font-extrabold leading-tight">
                {service.service_name.split(" ").slice(0, 2).join(" ")}{" "}
                <span className="text-primary-hover">
                  {service.service_name.split(" ").slice(2).join(" ")}
                </span>
              </h1>
              <div className="mt-4 text-white/90 leading-relaxed max-w-prose mx-auto md:mx-0">
                <p className="text-sm md:text-base text-justify md:text-left">
                  {service.description}
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center rounded-lg bg-primary text-white px-5 py-2.5 text-sm font-semibold hover:bg-primary-hover transition cursor-pointer min-w-[150px]">
                  Get in Touch
                </Link>
                <Link
                  to="/services"
                  className="group inline-flex items-center justify-center rounded-lg bg-white/15 border border-white/20 text-white px-5 py-2.5 text-sm font-semibold transition cursor-pointer min-w-[150px]">
                  <FontAwesomeIcon icon={faAngleLeft} className="mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" />
                  Back to Services
                </Link>
              </div>
            </div>
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

      {/* Benefits Section */}
      {service.benefits && service.benefits.length > 0 && (
        <section className="py-14 bg-surface">
          <div className="max-w-6xl mx-auto px-4">
            <FadeIn>
              <SectionHeading eyebrow="Benefits" title="Why This Service Matters" />
            </FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {service.benefits.map((item, i) => (
                <FadeIn key={i} delay={i * 50}>
                  <div className="bg-background border border-border rounded-lg p-5 flex items-start gap-3 hover:shadow-sm transition">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-primary mt-0.5 shrink-0" />
                    <p className="text-text leading-relaxed text-sm md:text-base">{item}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* What's Included Section */}
      {service.offerings && service.offerings.length > 0 && (
        <section className="py-14 bg-background">
          <div className="max-w-6xl mx-auto px-4">
            <FadeIn>
              <SectionHeading eyebrow="Solutions" title="What's Included" />
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {service.offerings.map((item, i) => (
                <FadeIn key={i} delay={i * 50}>
                  <div className="bg-surface border border-border rounded-lg p-6 flex items-start gap-4 hover:scale-[1.01] transition-all duration-300">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary-light text-primary font-extrabold shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-text leading-relaxed pt-1 text-sm md:text-base">{item}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Our Process Section (Static) */}
      <OurProcess />

      {/* Why Choose Us Section (Static) */}
      <WhyChooseUs />

      {/* Case Study Section */}
      {hasCaseStudy && (
        <section className="py-14 bg-surface">
          <div className="max-w-6xl mx-auto px-4">
            <FadeIn>
              <SectionHeading eyebrow="Results" title="Case Study" />
            </FadeIn>
            <div className="mt-2 max-w-3xl mx-auto">
              {service.case_study.title && (
                <FadeIn>
                  <h3 className="text-xl font-extrabold text-heading text-center">{service.case_study.title}</h3>
                </FadeIn>
              )}
              {service.case_study.description && (
                <FadeIn delay={50}>
                  <p className="mt-4 text-text leading-relaxed text-center text-sm md:text-base">{service.case_study.description}</p>
                </FadeIn>
              )}
              {service.case_study.stats && service.case_study.stats.length > 0 && (
                <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {service.case_study.stats.map((stat, i) => (
                    <FadeIn key={i} delay={i * 100}>
                      <div className="bg-background border border-border rounded-lg p-5 text-center hover:shadow-sm transition">
                        <div className="text-3xl font-extrabold text-primary">
                          <AnimatedCounter target={parseInt(stat.value) || 0} suffix={stat.suffix} />
                        </div>
                        <div className="mt-2 text-xs font-semibold text-muted">{stat.label}</div>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {service.faq && service.faq.length > 0 && (
        <FAQSection
          items={service.faq}
          eyebrow="Questions"
          title="Frequently Asked Questions"
          subtitle={`Common questions about our ${service.service_name} service.`}
        />
      )}

      {/* Target Audience Section */}
      {service.target_audience && service.target_audience.length > 0 && (
        <section className="py-14 bg-background">
          <div className="max-w-6xl mx-auto px-4">
            <FadeIn>
              <SectionHeading eyebrow="Audience" title="Who This Service Is For" />
            </FadeIn>
            <div className="flex flex-wrap justify-center gap-4">
              {service.target_audience.map((aud, i) => (
                <FadeIn key={i} delay={i * 80}>
                  <div className="px-6 py-4 bg-surface border border-border rounded-lg text-center flex items-center justify-center min-w-[150px] font-bold text-heading hover:text-primary transition-colors cursor-default select-none">
                    {aud}
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Client Testimonials Section */}
      {service.clients && service.clients.length > 0 && (
        <section className="py-14 bg-surface">
          <div className="max-w-6xl mx-auto px-4">
            <FadeIn>
              <SectionHeading eyebrow="Feedback" title="Clients Who Chose This Service" />
            </FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {service.clients.map((client, i) => (
                <FadeIn key={client._id || i} delay={i * 60}>
                  <div className="flex flex-col bg-background border border-border rounded-lg px-6 py-6 transition-all duration-300 h-full">
                    <p className="text-gray-700 leading-relaxed text-sm flex-1 italic break-words">
                      &ldquo;{client.quote}&rdquo;
                    </p>
                    <div className="mt-6 flex items-center gap-3 pt-4 border-t border-border">
                      {client.avatar ? (
                        <img
                          src={resolveImagePath(client.avatar)}
                          alt={client.name}
                          loading="lazy"
                          decoding="async"
                          className="h-10 w-10 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-primary-light text-primary-hover flex items-center justify-center font-bold text-sm shrink-0 select-none">
                          {client.name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "?"}
                        </div>
                      )}
                      <div className="min-w-0 text-left flex-1">
                        <div className="font-bold text-heading text-sm truncate">{client.name}</div>
                        <div className="text-xs text-muted truncate">
                          {client.position}{client.company ? `, ${client.company}` : ""}
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Services Section */}
      {relatedServices.length > 0 && (
        <section className="py-14 bg-background">
          <div className="max-w-6xl mx-auto px-4">
            <FadeIn>
              <SectionHeading eyebrow="Explore" title="Related Services" />
            </FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedServices.map((rs) => (
                <FadeIn key={rs._id}>
                  <Link
                    to={`/services/${slugify(rs.service_name)}`}
                    className="flex flex-col bg-surface border border-border rounded-lg h-full overflow-hidden cursor-pointer hover:-translate-y-1 transition-all duration-300">
                    <div className="h-40 overflow-hidden">
                      <img
                        src={resolveImagePath(rs.image)}
                        alt={rs.service_name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover bg-surface"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/undraw_mobile-marketing_7x7m.svg";
                        }}
                      />
                    </div>
                    <div className="flex flex-col items-center text-center p-5 flex-1">
                      <h3 className="text-lg font-extrabold text-heading">{rs.service_name}</h3>
                      <p className="mt-3 text-sm text-text leading-relaxed line-clamp-2">{rs.short_description}</p>
                      <span className="mt-4 mt-auto inline-flex items-center rounded-lg bg-primary text-white px-5 py-2.5 text-sm font-semibold hover:bg-primary-hover transition">
                        Read More
                      </span>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <FinalCTA
        title={`Ready to Get Started with ${service.service_name}?`}
        description="Let's discuss how we can help you achieve your goals. Contact us today for a free consultation."
        primaryLabel="Contact Us"
        primaryTo="/contact"
        secondaryLabel="View All Services"
        secondaryTo="/services"
      />
    </div>
  );
}
