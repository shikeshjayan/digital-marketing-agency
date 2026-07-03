import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBullseye,
  faEye,
  faHeart,
  faLightbulb,
  faHandshake,
  faChartLine,
  faUsers,
  faRocket,
  faStar,
  faCheckCircle,
  faSearch,
  faPalette,
  faCode,
} from "@fortawesome/free-solid-svg-icons";
import HeroSplit from "../../components/public/HeroSplit.jsx";
import FadeIn from "../../components/ui/FadeIn.jsx";
import SectionHeading from "../../components/ui/SectionHeading.jsx";
import useReviewStore from "../../store/reviewStore.js";
import imageUrl from "../../utils/imageUrl.js";

/* ─── StarRow ─────────────────────────────────────────────── */
function StarRow({ rating }) {
  const full = Math.floor(rating);
  return (
    <div className="flex items-center gap-1 text-amber-500">
      {Array.from({ length: 5 }).map((_, i) => (
        <FontAwesomeIcon
          key={i}
          icon={faStar}
          className={i < full ? "text-amber-500" : "text-gray-300"}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

/* ─── Section: Who We Are ─────────────────────────────────── */
function WhoWeAre() {
  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <FadeIn direction="left">
            <div>
              <SectionHeading
                eyebrow="Who We Are"
                title="A Team Built on Passion & Purpose"
                subtitle=""
              />
              <div className="mt-4 space-y-4 text-sm text-text leading-relaxed text-justify md:text-left">
                <p>
                  We are a collective of designers, developers, and digital
                  strategists who believe that great digital experiences are
                  born at the intersection of creativity and technology. Since
                  our inception, we have been committed to helping businesses
                  transform their online presence into powerful growth engines.
                </p>
                <p>
                  Our team brings together diverse expertise across web
                  development, UI/UX design, SEO, content marketing, and
                  performance advertising. We don't just build websites — we
                  craft digital ecosystems that drive measurable results and
                  lasting brand value.
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="right">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary-light rounded-lg p-6 text-center">
                <FontAwesomeIcon
                  icon={faUsers}
                  className="text-3xl text-primary"
                />
                <div className="mt-3 text-2xl font-extrabold text-heading">
                  25+
                </div>
                <div className="text-xs text-muted mt-1">Team Members</div>
              </div>
              <div className="bg-primary-light rounded-lg p-6 text-center">
                <FontAwesomeIcon
                  icon={faChartLine}
                  className="text-3xl text-primary"
                />
                <div className="mt-3 text-2xl font-extrabold text-heading">
                  8+
                </div>
                <div className="text-xs text-muted mt-1">Years Experience</div>
              </div>
              <div className="bg-primary-light rounded-lg p-6 text-center">
                <FontAwesomeIcon
                  icon={faRocket}
                  className="text-3xl text-primary"
                />
                <div className="mt-3 text-2xl font-extrabold text-heading">
                  500+
                </div>
                <div className="text-xs text-muted mt-1">
                  Projects Delivered
                </div>
              </div>
              <div className="bg-primary-light rounded-lg p-6 text-center">
                <FontAwesomeIcon
                  icon={faHandshake}
                  className="text-3xl text-primary"
                />
                <div className="mt-3 text-2xl font-extrabold text-heading">
                  100%
                </div>
                <div className="text-xs text-muted mt-1">Client Focus</div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ─── Section: Mission | Vision ───────────────────────────── */
function MissionVision() {
  return (
    <section className="py-12 md:py-16 bg-surface">
      <div className="max-w-6xl mx-auto px-4">
        <FadeIn>
          <SectionHeading
            eyebrow="Our Purpose"
            title="Mission & Vision"
            subtitle="Guided by purpose, driven by results."
          />
        </FadeIn>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          <FadeIn direction="left">
            <div className="bg-background border border-border rounded-lg p-8 h-full hover:shadow-sm transition">
              <div className="w-14 h-14 rounded-lg bg-primary-light flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faBullseye}
                  className="text-2xl text-primary"
                />
              </div>
              <h3 className="mt-6 text-xl font-extrabold text-heading">
                Our Mission
              </h3>
              <p className="mt-3 text-sm text-text leading-relaxed">
                To empower businesses of all sizes with innovative digital
                solutions that drive growth, enhance brand visibility, and
                create meaningful connections with their audiences. We are
                dedicated to delivering excellence through creativity,
                technology, and data-driven strategies.
              </p>
            </div>
          </FadeIn>

          <FadeIn direction="right">
            <div className="bg-background border border-border rounded-lg p-8 h-full hover:shadow-sm transition">
              <div className="w-14 h-14 rounded-lg bg-primary-light flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faEye}
                  className="text-2xl text-primary"
                />
              </div>
              <h3 className="mt-6 text-xl font-extrabold text-heading">
                Our Vision
              </h3>
              <p className="mt-3 text-sm text-text leading-relaxed">
                To be the most trusted digital partner for businesses worldwide,
                recognized for our commitment to quality, innovation, and
                measurable results. We envision a future where every brand has
                the tools and strategies to thrive in the digital landscape.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ─── Section: Our Values ─────────────────────────────────── */
const valuesData = [
  {
    icon: faLightbulb,
    title: "Innovation",
    desc: "We stay ahead of the curve, embracing new technologies and creative approaches to deliver cutting-edge solutions.",
  },
  {
    icon: faHeart,
    title: "Passion",
    desc: "Every project is a canvas. We pour our hearts into crafting digital experiences that inspire and engage.",
  },
  {
    icon: faHandshake,
    title: "Integrity",
    desc: "Transparency and honesty form the foundation of every client relationship. We do what's right, always.",
  },
  {
    icon: faChartLine,
    title: "Excellence",
    desc: "We hold ourselves to the highest standards, ensuring every deliverable exceeds expectations.",
  },
];

function OurValues() {
  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <FadeIn>
          <SectionHeading
            eyebrow="What Drives Us"
            title="Our Core Values"
            subtitle="The principles that guide every decision we make."
          />
        </FadeIn>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {valuesData.map((v, i) => (
            <FadeIn key={v.title} delay={i * 100}>
              <div className="bg-surface border border-border rounded-lg p-6 h-full hover:shadow-sm transition group">
                <div className="w-12 h-12 rounded-lg bg-primary-light flex items-center justify-center group-hover:bg-primary group-hover:text-white transition">
                  <FontAwesomeIcon
                    icon={v.icon}
                    className="text-xl text-primary group-hover:text-white transition"
                  />
                </div>
                <h3 className="mt-4 text-lg font-extrabold text-heading">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm text-text leading-relaxed">
                  {v.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Section: Why Choose Us ──────────────────────────────── */
const reasons = [
  "Custom strategies tailored to your unique business goals",
  "Transparent communication and dedicated project management",
  "Data-driven approach with measurable KPIs and reporting",
  "End-to-end solutions from design to deployment and marketing",
  "Agile development process with fast turnaround times",
  "Long-term partnership focus with ongoing support",
];

function WhyChooseUs() {
  return (
    <section className="py-12 md:py-16 bg-surface">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <FadeIn direction="left">
            <div className="bg-background border border-border rounded-lg p-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4">
                  <div className="text-4xl font-extrabold text-primary">
                    98%
                  </div>
                  <div className="mt-1 text-xs text-muted">
                    Client Retention
                  </div>
                </div>
                <div className="text-center p-4">
                  <div className="text-4xl font-extrabold text-primary">
                    24/7
                  </div>
                  <div className="mt-1 text-xs text-muted">
                    Support Available
                  </div>
                </div>
                <div className="text-center p-4">
                  <div className="text-4xl font-extrabold text-primary">3x</div>
                  <div className="mt-1 text-xs text-muted">Average ROI</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-4xl font-extrabold text-primary">
                    100%
                  </div>
                  <div className="mt-1 text-xs text-muted">
                    Satisfaction Goal
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="right">
            <div>
              <SectionHeading
                eyebrow="Our Edge"
                title="Why Choose Us"
                subtitle=""
              />
              <div className="mt-4 space-y-3">
                {reasons.map((r, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-primary mt-0.5 shrink-0"
                    />
                    <span className="text-sm text-text leading-relaxed">
                      {r}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ─── Section: Meet Our Team (CTA) ───────────────────────── */
function MeetOurTeam() {
  const navigate = useNavigate();

  return (
    <section className="bg-dark py-16 text-white">
      <FadeIn>
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="text-4xl md:text-5xl font-extrabold">
            <span className="font-cursive text-primary pr-2">Meet</span> Our
            Team
          </div>
          <p className="mt-4 text-gray-300 max-w-2xl mx-auto leading-relaxed">
            The talented people behind our success. Meet the designers,
            developers, and strategists who bring your vision to life.
          </p>
          <div className="mt-8">
            <button
              type="button"
              className="inline-flex items-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold hover:bg-primary-hover transition cursor-pointer"
              onClick={() => navigate("/team")}>
              View Full Team
            </button>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}

/* ─── Section: Our Process (Timeline) ─────────────────────── */
const processSteps = [
  {
    icon: faSearch,
    title: "Discovery & Research",
    desc: "We dive deep into your business, audience, and goals to build a strategic foundation.",
  },
  {
    icon: faLightbulb,
    title: "Strategy & Planning",
    desc: "We craft a tailored roadmap with clear timelines, milestones, and deliverables.",
  },
  {
    icon: faPalette,
    title: "Design & Prototyping",
    desc: "Our designers create wireframes and visual mockups that align with your brand identity.",
  },
  {
    icon: faCode,
    title: "Development & Testing",
    desc: "Our engineers build robust, scalable solutions with rigorous quality assurance.",
  },
  {
    icon: faRocket,
    title: "Launch & Deployment",
    desc: "We handle the full launch process, ensuring everything runs smoothly from day one.",
  },
  {
    icon: faChartLine,
    title: "Optimization & Growth",
    desc: "Post-launch, we monitor performance and optimize for continuous improvement.",
  },
];

function OurProcess() {
  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <FadeIn>
          <SectionHeading
            eyebrow="How We Work"
            title="Our Process"
            subtitle="A proven methodology that delivers results every time."
          />
        </FadeIn>

        <div className="mt-10 relative">
          {/* Vertical line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2" />

          <div className="space-y-8 md:space-y-0">
            {processSteps.map((step, i) => {
              const isLeft = i % 2 === 0;
              return (
                <FadeIn
                  key={step.title}
                  delay={i * 100}
                  direction={isLeft ? "left" : "right"}>
                  <div
                    className={`relative md:grid md:grid-cols-2 md:gap-12 md:items-center ${i > 0 ? "md:mt-8" : ""}`}>
                    {/* Timeline dot */}
                    <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                      <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shadow-lg">
                        {i + 1}
                      </div>
                    </div>

                    {/* Content card */}
                    <div
                      className={`${isLeft ? "md:text-right md:pr-12" : "md:col-start-2 md:pl-12"}`}>
                      <div className="bg-surface border border-border rounded-lg p-6 hover:shadow-sm transition">
                        <div
                          className={`flex items-center gap-3 ${isLeft ? "md:justify-end" : ""}`}>
                          <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center shrink-0">
                            <FontAwesomeIcon
                              icon={step.icon}
                              className="text-primary"
                            />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-primary uppercase tracking-wider">
                              Step {i + 1}
                            </div>
                            <h3 className="text-lg font-extrabold text-heading">
                              {step.title}
                            </h3>
                          </div>
                        </div>
                        <p className="mt-3 text-sm text-text leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Section: Client Testimonials ────────────────────────── */
function TestimonialsSection({ reviews, loading }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reviews.length === 0 || paused) return;
    const t = setInterval(
      () => setIndex((v) => (v + 1) % reviews.length),
      3000,
    );
    return () => clearInterval(t);
  }, [reviews.length, paused]);

  if (loading) {
    return (
      <section className="py-12 bg-surface">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center">
            <div className="h-8 w-48 bg-gray-200 rounded mx-auto animate-pulse" />
          </div>
          <div className="mt-8 flex justify-center">
            <div className="w-full max-w-xl border border-border rounded-lg px-6 py-8 bg-background text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-gray-200 animate-pulse ring-2 ring-gray-300 ring-offset-2" />
              <div className="mt-4 h-4 w-24 bg-gray-200 rounded mx-auto animate-pulse" />
              <div className="mt-2 h-3 w-16 bg-gray-200 rounded mx-auto animate-pulse" />
              <div className="mt-4 space-y-2">
                <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-3/4 bg-gray-200 rounded mx-auto animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!reviews.length) return null;
  const current = reviews[index];

  return (
    <section
      className="py-12 bg-surface"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}>
      <div className="max-w-5xl mx-auto px-4">
        <FadeIn>
          <SectionHeading
            eyebrow="Testimonials"
            title="What Our Clients Say"
            subtitle="Real feedback from businesses we've helped grow."
          />
        </FadeIn>

        <div className="mt-8 flex justify-center">
          <div className="w-full max-w-6xl border border-border rounded-lg px-6 py-8 bg-background text-center">
            <div className="mx-auto w-16 h-16 rounded-full overflow-hidden ring-2 ring-primary ring-offset-2 flex items-center justify-center shadow-md">
              {current.user_avatar ? (
                <img
                  src={imageUrl(current.user_avatar)}
                  alt={current.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className={`w-full h-full items-center justify-center text-lg font-bold text-primary-hover ${current.user_avatar ? "hidden" : "flex"}`}>
                {current.name
                  ?.split(" ")
                  .map((w) => w[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2) || "?"}
              </div>
            </div>
            <div className="mt-4 font-bold text-heading">{current.name}</div>
            <div className="text-sm text-muted">{current.location}</div>
            <p className="mt-4 text-gray-700 leading-relaxed max-w-2xl mx-auto">
              &ldquo;{current.review_text}&rdquo;
            </p>
            <div className="mt-4">
              <StarRow rating={current.rating} />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-5">
          {reviews.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`w-2.5 h-2.5 rounded-full transition cursor-pointer ${
                i === index
                  ? "bg-primary"
                  : "bg-primary-light hover:bg-primary-hover"
              }`}
              onClick={() => setIndex(i)}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Section: Trusted By (Client Logos) ──────────────────── */
function TrustedBy() {
  const logos = [
    "HR Consultancy",
    "Selfy LinguaTrainer",
    "Rising Moon",
    "StepUp",
    "Tymos",
    "BrightPath",
    "NovaTech",
    "Zenith Solutions",
    "CloudBridge",
    "PixelCraft",
    "SwiftWave",
    "BlueVista",
    "IronPeak",
    "GreenLeaf",
    "SkyPulse",
  ];

  return (
    <section className="bg-background py-10">
      <div className="text-center py-6 px-6">
        <FadeIn>
          <h2 className="font-bold text-heading text-3xl">
            Trusted by teams who value quality
          </h2>
          <p className="mt-2 text-sm text-text">
            We deliver measurable results with transparent workflows.
          </p>
        </FadeIn>
      </div>

      <div className="overflow-hidden py-6">
        <div className="logo-marquee">
          {[...logos, ...logos].map((logo, index) => (
            <span
              key={index}
              className="inline-flex items-center px-8 whitespace-font tracking-wider font-extrabold text-muted hover:text-primary transition-colors duration-300 text-sm md:text-xl uppercase cursor-default select-none">
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Section: Final CTA ──────────────────────────────────── */
function FinalCTA() {
  const navigate = useNavigate();

  return (
    <section className="bg-dark py-16">
      <FadeIn>
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-extrabold">
            Ready to Grow Your Business?
          </h2>
          <p className="mt-4 text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Let's discuss how our digital marketing expertise can help you
            achieve your goals. Get in touch with us today for a free
            consultation.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              className="inline-flex items-center rounded-lg bg-primary text-white px-6 py-3 text-sm font-semibold hover:bg-primary-hover transition cursor-pointer"
              onClick={() => navigate("/contact")}>
              Contact Us
            </button>
            <Link
              to="/services"
              className="inline-flex items-center rounded-lg border border-white text-white px-6 py-3 text-sm font-semibold hover:bg-white/10 transition">
              View Services
            </Link>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}

/* ─── Main About Page ─────────────────────────────────────── */
export default function About() {
  const { reviews, loading: reviewsLoading, fetchReviews } = useReviewStore();

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return (
    <div>
      {/* 1. Hero */}
      <HeroSplit
        title="Us"
        titleHighlight="About"
        subtitle="Welcome to a team that blends creative design, reliable development, and performance marketing."
        leftColor="bg-gray-900"
      />

      {/* 2. Welcome Banner (existing 2nd section) */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 space-y-12 md:space-y-16">
          <FadeIn>
            <div className="p-4 md:p-10 text-center select-none">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                Hello, <span className="text-primary">Welcome</span> to Digital
                Marketing
              </h2>
              <div className="mt-4 text-sm text-gray-700 leading-relaxed max-w-3xl mx-auto text-justify md:text-center space-y-3">
                <p className="text-sm text-text leading-relaxed">
                  We help brands navigate and scale modern digital landscapes by
                  executing high-performance web engineering alongside robust
                  marketing strategy. Our engineering principles cut out
                  unnecessary layers to zero in on real results: identifying
                  exact business goals, transforming concepts into scalable
                  customer pipelines, building platforms with structural
                  cleanliness, and monitoring active engagement behaviors.
                </p>
                <p className="text-sm text-text leading-relaxed">
                  By linking functional data capture analytics directly with
                  human-centric interfaces, we transform your digital channels
                  from static online bookmarks into high-velocity engines that
                  attract attention, build lasting consumer confidence, and
                  reliably optimize monetization cycles.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 3. Who We Are */}
      <WhoWeAre />

      {/* 4. Mission | Vision */}
      <MissionVision />

      {/* 5. Our Values */}
      <OurValues />

      {/* 6. Why Choose Us */}
      <WhyChooseUs />

      {/* 7. Our Process (Timeline) */}
      <OurProcess />

      {/* 8. Meet Our Team */}
      <MeetOurTeam />

      {/* 9. Client Testimonials */}
      <TestimonialsSection reviews={reviews} loading={reviewsLoading} />

      {/* 10. Trusted By */}
      <TrustedBy />

      {/* 11. Final CTA */}
      <FinalCTA />
    </div>
  );
}
