import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faCheckCircle,
  faArrowRight,
  faHeartPulse,
  faCartShopping,
  faGraduationCap,
  faBuilding,
  faMoneyBillTrendUp,
  faMicrochip,
  faConciergeBell,
  faStore,
  faIndustry,
} from "@fortawesome/free-solid-svg-icons";
import useServiceStore from "../../store/serviceStore";
import useFaqStore from "../../store/faqStore";
import FadeIn from "../../components/ui/FadeIn.jsx";
import SectionHeading from "../../components/ui/SectionHeading.jsx";
import OurProcess from "../../components/public/OurProcess.jsx";
import FAQSection from "../../components/public/FAQSection.jsx";
import FinalCTA from "../../components/public/FinalCTA.jsx";
import resolveImagePath from "../../utils/resolveImagePath.js";

const industryIcons = {
  Healthcare: faHeartPulse,
  "E-Commerce": faCartShopping,
  Education: faGraduationCap,
  "Real Estate": faBuilding,
  Finance: faMoneyBillTrendUp,
  Technology: faMicrochip,
  Hospitality: faConciergeBell,
  Retail: faStore,
};

function getIndustryIcon(name) {
  return industryIcons[name] || faIndustry;
}

const processSteps = [
  { icon: " ", title: "Discovery", desc: "We dive deep into your business, audience, and goals to build a strategic foundation." },
  { icon: " ", title: "Strategy", desc: "We craft a tailored roadmap with clear timelines, milestones, and deliverables." },
  { icon: " ", title: "Design", desc: "Our designers create wireframes and visual mockups that align with your brand identity." },
  { icon: " ", title: "Development", desc: "Our engineers build robust, scalable solutions with rigorous quality assurance." },
  { icon: " ", title: "Testing", desc: "Comprehensive testing ensures everything works flawlessly across all devices." },
  { icon: " ", title: "Launch", desc: "We handle the full launch process, ensuring everything runs smoothly from day one." },
];

export default function ServiceDetail() {
  const { slug } = useParams();
  const { selectedService, loading, fetchServiceBySlug, relatedServices, fetchRelatedServices } =
    useServiceStore();
  const { faqs, fetchFAQsByService } = useFaqStore();
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchServiceBySlug(slug).catch((e) => setError(e.message));
  }, [slug, fetchServiceBySlug]);

  const service = selectedService;

  useEffect(() => {
    if (service?._id) {
      fetchRelatedServices(service._id, 3);
      fetchFAQsByService(service._id);
    }
  }, [service?._id, fetchRelatedServices, fetchFAQsByService]);

  useEffect(() => {
    if (service?.seo?.meta_title) {
      document.title = service.seo.meta_title;
    }
    if (service?.seo?.meta_description) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute("content", service.seo.meta_description);
    }
  }, [service?.seo]);

  const projects = useMemo(() => service?.projects ?? [], [service]);

  const uniqueTechnologies = useMemo(() => {
    const map = new Map();
    projects.forEach((p) => {
      (p.technologies ?? []).forEach((t) => {
        const id = typeof t === "object" ? t._id : t;
        const name = typeof t === "object" ? t.name : t;
        if (id && !map.has(id)) map.set(id, name);
      });
    });
    return [...map.entries()].map(([id, name]) => ({ id, name }));
  }, [projects]);

  const uniqueIndustries = useMemo(() => {
    const map = new Map();
    projects.forEach((p) => {
      (p.industries ?? []).forEach((ind) => {
        const id = typeof ind === "object" ? ind._id : ind;
        const name = typeof ind === "object" ? ind.name : ind;
        if (id && !map.has(id)) map.set(id, name);
      });
    });
    return [...map.entries()].map(([id, name]) => ({ id, name }));
  }, [projects]);

  if (loading)
    return (
      <div className="flex items-center justify-center py-24 md:py-32 bg-background min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-4 border-primary-light border-t-primary animate-spin" />
          <p className="text-muted text-sm small-text">Loading service...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="text-center py-24 md:py-32 px-4 bg-background animate-page-fade">
        <p className="text-primary font-medium body-text">{error}</p>
        <Link
          to="/services"
          className="mt-5 inline-flex items-center rounded-lg bg-primary text-white px-5 py-2.5 text-sm font-semibold hover:bg-primary-hover transition cursor-pointer button-text">
          Back to Services
        </Link>
      </div>
    );

  if (!service)
    return (
      <div className="text-center py-24 md:py-32 px-4 bg-background animate-page-fade">
        <h2 className="text-2xl font-bold text-heading section-heading">Service Not Found</h2>
        <p className="mt-3 text-text body-text">No service found for this URL.</p>
        <Link
          to="/services"
          className="mt-6 inline-flex items-center rounded-lg bg-primary text-white px-5 py-2.5 text-sm font-semibold hover:bg-primary-hover transition cursor-pointer button-text">
          Back to Services
        </Link>
      </div>
    );

  return (
    <div className="bg-background animate-page-fade">
      {/* 1. Hero Section   */}
      <section className="bg-secondary text-white relative overflow-hidden py-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-lg rotate-12" />
          <div className="absolute bottom-10 right-16 w-20 h-20 bg-white/10 rounded-lg rotate-12" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-white/70 mb-8 justify-start text-xs">
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
              {service.featured && (
                <div className="w-full flex justify-start mb-3">
                  <div className="text-xs font-bold tracking-widest uppercase inline-block px-3 py-1 rounded bg-white/10 text-xxs">
                    FEATURED SERVICE
                  </div>
                </div>
              )}
              <h1 className="hero-heading text-white">
                {service.service_name}
              </h1>
              <div className="mt-4 text-white/70 leading-relaxed max-w-prose mx-auto md:mx-0 body-text">
                <p className="text-lg text-justify md:text-left">
                  {service.description}
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center rounded-lg bg-primary text-white px-5 py-2.5 text-sm font-semibold hover:bg-primary-hover transition cursor-pointer min-w-[150px] button-text">
                  Get in Touch
                </Link>
                <Link
                  to="/services"
                  className="group inline-flex items-center justify-center rounded-lg bg-white/15 border border-white/20 text-white px-5 py-2.5 text-sm font-semibold transition cursor-pointer min-w-[150px] button-text">
                  <FontAwesomeIcon icon={faAngleLeft} className="mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" />
                  Back to Services
                </Link>
              </div>
            </div>
            <div className="w-full max-w-md mx-auto md:mx-0 aspect-4/3 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-white/5 rounded-lg blur-xl pointer-events-none" />
              <img
                src={resolveImagePath(service.hero_image)}
                alt={service.service_name}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover rounded-sm relative border border-white/10 bg-surface"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/undraw_mobile-marketing_7x7m.svg";
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Service Overview   */}
      <section className="py-14 md:py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4">
          <FadeIn>
            <SectionHeading eyebrow="Overview" title={`About ${service.service_name}`} />
          </FadeIn>
          <FadeIn delay={40}>
            <div className="mt-8 text-text leading-relaxed text-sm md:text-base text-justify body-text">
              {service.description}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 3. What We Deliver   */}
      {service.deliverables?.length > 0 && (
        <section className="py-14 md:py-16 bg-background-section">
          <div className="max-w-6xl mx-auto px-4">
            <FadeIn>
              <SectionHeading eyebrow="Deliverables" title="What We Deliver" subtitle="Everything you get when you choose this service." />
            </FadeIn>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              {service.deliverables.map((item, i) => (
                <FadeIn key={i} delay={i * 30} className="w-full sm:basis-[calc(50%-8px)] lg:basis-[calc(33.33%-11px)] max-w-sm lg:max-w-none">
                  <div className="bg-[#FAFAFA] border border-border rounded-sm p-5 flex items-start gap-3 hover:shadow-sm transition h-full w-full">
                    <div className="flex items-center justify-center h-9 w-9 rounded-sm bg-primary-light text-primary font-extrabold text-sm shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-text leading-relaxed text-sm md:text-base body-text">{item}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Why Choose This Service   */}
      {service.benefits?.length > 0 && (
        <section className="py-14 md:py-16 bg-background">
          <div className="max-w-6xl mx-auto px-4">
            <FadeIn>
              <SectionHeading eyebrow="Benefits" title="Why Choose This Service" subtitle="The advantages of working with us." />
            </FadeIn>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {service.benefits.map((item, i) => (
                <FadeIn key={i} delay={i * 30}>
                  <div className="bg-[#FAFAFA] border border-border rounded-sm p-5 flex items-start gap-3 hover:shadow-sm transition h-full">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-primary mt-0.5 shrink-0" />
                    <p className="text-text leading-relaxed text-sm md:text-base body-text">{item}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Our Process (Static)   */}
      <FadeIn>
        <OurProcess
          steps={processSteps.map((s) => ({
            icon: faArrowRight,
            title: s.title,
            desc: s.desc,
          }))}
          bg="bg-background-section"
        />
      </FadeIn>

      {/* 6. Technologies & Platforms   */}
      {uniqueTechnologies.length > 0 && (
        <section className="py-14 md:py-16 bg-background">
          <div className="max-w-6xl mx-auto px-4">
            <FadeIn>
              <SectionHeading eyebrow="Tech Stack" title="Technologies & Platforms" subtitle="The tools and technologies we use to build your solutions." />
            </FadeIn>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {uniqueTechnologies.map((tech, i) => (
                <FadeIn key={tech.id} delay={i * 30}>
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-background-section border border-border text-heading text-sm font-semibold hover:border-primary/40 transition small-text font-semibold">
                    {tech.name}
                  </span>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. Industries We Serve   */}
      {uniqueIndustries.length > 0 && (
        <section className="py-14 md:py-16 bg-background-section">
          <div className="max-w-6xl mx-auto px-4">
            <FadeIn>
              <SectionHeading eyebrow="Industries" title="Industries We Serve" subtitle="We partner with businesses across a wide range of industries." />
            </FadeIn>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              {uniqueIndustries.map((ind, i) => (
                <FadeIn key={ind.id} delay={i * 30} className="basis-[calc(50%-8px)] sm:basis-[calc(33.33%-11px)] lg:basis-[calc(25%-12px)] min-w-[140px]">
                  <div className="bg-[#FAFAFA] border border-border rounded-sm p-5 flex flex-col items-center text-center hover:shadow-sm transition h-full w-full">
                    <div className="w-12 h-12 rounded-sm bg-primary-light flex items-center justify-center mb-3">
                      <FontAwesomeIcon icon={getIndustryIcon(ind.name)} className="text-primary text-lg" />
                    </div>
                    <h3 className="font-semibold text-heading text-sm subheading text-sm">{ind.name}</h3>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. Projects We've Delivered   */}
      {projects.length > 0 && (
        <section className="py-14 md:py-16 bg-background">
          <div className="max-w-6xl mx-auto px-4">
            <FadeIn>
              <SectionHeading eyebrow="Our Work" title="Projects We've Delivered" subtitle="Real results from real projects." />
            </FadeIn>
            <div className="mt-10 flex flex-wrap justify-center gap-6">
              {projects.map((project, i) => (
                <FadeIn key={project._id} delay={i * 40} className="w-full sm:basis-[calc(50%-12px)] lg:basis-[calc(33.33%-16px)] max-w-sm lg:max-w-none">
                  <div className="flex flex-col bg-[#FAFAFA] border border-border rounded-sm h-full w-full overflow-hidden hover:-translate-y-1 transition-all duration-300">
                    <div className="h-44 overflow-hidden">
                      <img
                        src={resolveImagePath(project.thumbnail)}
                        alt={project.project_name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover bg-background"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/undraw_mobile-marketing_7x7m.svg";
                        }}
                      />
                    </div>
                    
                    <div className="flex flex-col p-5 flex-1">
                      <h3 className="text-lg font-extrabold text-heading subheading text-sm line-clamp-1">{project.project_name}</h3>
                      
                      {/* Fixed: Removed the rigid height restriction 'h-10' and 'overflow-hidden' so your full description shows up seamlessly */}
                      <p className="mt-2 text-sm text-text leading-relaxed small-text">{project.short_description}</p>
                      
                      {/* Fixed: Added 'mt-auto pt-4' here so this structural wrapper anchors ALL tags and badges perfectly at the bottom line together */}
                      <div className="mt-auto pt-4">
                        {project.industries?.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {project.industries.slice(0, 2).map((ind, idx) => (
                              <span key={idx} className="text-xs px-2 py-0.5 rounded-sm bg-primary-light/40 text-primary font-medium text-xxs">
                                {typeof ind === "object" ? ind.name : ind}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {project.technologies?.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {project.technologies.slice(0, 3).map((t, idx) => (
                              <span key={idx} className="text-xs px-2 py-0.5 rounded-sm bg-surface border border-border text-muted text-xxs">
                                {typeof t === "object" ? t.name : t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <Link
                        to={`/projects/${project.slug}`}
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover transition button-text">
                        View Project <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                      </Link>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. Frequently Asked Questions   */}
      <FadeIn>
        <FAQSection
          items={faqs.map((f) => ({ q: f.question, a: f.answer }))}
          eyebrow="Questions"
          title="Frequently Asked Questions"
          subtitle="Find answers to common questions about this service."
          bg="bg-background-section"
        />
      </FadeIn>

      {/* 12. Related Services   */}
      {relatedServices.length > 0 && (
        <section className="py-14 md:py-16 bg-background">
          <div className="max-w-6xl mx-auto px-4">
            <FadeIn>
              <SectionHeading eyebrow="Explore" title="Related Services" subtitle="Other services that might interest you." />
            </FadeIn>
            <div className="mt-10 flex flex-wrap justify-center gap-6">
              {relatedServices.map((rs, i) => (
                <FadeIn key={rs._id} delay={i * 40} className="w-full sm:basis-[calc(50%-12px)] lg:basis-[calc(33.33%-16px)]">
                  <Link
                    to={`/services/${rs.slug}`}
                    className="flex flex-col bg-[#FAFAFA] border border-border rounded-sm h-full overflow-hidden cursor-pointer hover:-translate-y-1 transition-all duration-300">
                    <div className="h-40 overflow-hidden">
                      <img
                        src={resolveImagePath(rs.hero_image)}
                        alt={rs.service_name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover bg-background"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/undraw_mobile-marketing_7x7m.svg";
                        }}
                      />
                    </div>
                    <div className="flex flex-col items-center text-center p-5 flex-1">
                      {rs.icon && (
                        <img
                          src={resolveImagePath(rs.icon)}
                          alt=""
                          className="w-10 h-10 mb-3 object-contain"
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      )}
                      <h3 className="text-lg font-extrabold text-heading subheading text-sm">{rs.service_name}</h3>
                      <p className="mt-3 text-sm text-text leading-relaxed line-clamp-2 small-text">{rs.short_description}</p>
                      <span className="mt-4 mt-auto inline-flex items-center rounded-lg bg-primary text-white px-5 py-2.5 text-sm font-semibold hover:bg-primary-hover transition button-text">
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

      {/* 13. Final CTA   */}
      <FadeIn>
        <FinalCTA
          title="Ready to Grow Your Business?"
          description="Let's discuss how our digital marketing expertise can help you achieve your goals. Get in touch with us today for a free consultation."
          primaryLabel="Start Project"
          primaryTo="/contact"
          secondaryLabel="Contact Us"
          secondaryTo="/contact"
        />
      </FadeIn>
    </div>
  );
}