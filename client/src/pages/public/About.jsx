import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBullseye,
  faEye,
  faHeart,
  faHandshake,
  faChartLine,
  faUsers,
  faRocket,
  faLightbulb,
} from "@fortawesome/free-solid-svg-icons";
import HeroSplit from "../../components/public/HeroSplit.jsx";
import FadeIn from "../../components/ui/FadeIn.jsx";
import AnimatedCounter from "../../components/ui/AnimatedCounter.jsx";
import SectionHeading from "../../components/ui/SectionHeading.jsx";
import OurProcess from "../../components/public/OurProcess.jsx";
import WhyChooseUs from "../../components/public/WhyChooseUs.jsx";
import LogoMarquee from "../../components/public/LogoMarquee.jsx";
import TestimonialsSection from "../../components/public/TestimonialsSection.jsx";
import FinalCTA from "../../components/public/FinalCTA.jsx";
import usePageStore from "../../store/pageStore.js";

/* ─── Section: Who We Are ─────────────────────────────────── */
function WhoWeAre({ stats = [] }) {
  const icons = [faUsers, faChartLine, faRocket, faHandshake];
  const displayStats = stats.slice(0, 4);
  if (!displayStats.length) return null;

  return (
    <section className="py-12 md:py-16 bg-background-section">
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
            {({ isInView, ref }) => (
              <div ref={ref} className="grid grid-cols-2 gap-4">
                {displayStats.map((stat, i) => (
                  <div
                    key={stat.key || i}
                    className={`rounded-lg p-6 text-center transition-colors duration-700 ease-out ${isInView ? "bg-[#FAFAFA]" : "bg-transparent"}`}>
                    <FontAwesomeIcon
                      icon={icons[i] || faChartLine}
                      className="text-3xl text-primary"
                    />
                    <div className="mt-3 text-2xl font-extrabold text-heading">
                      <AnimatedCounter
                        key={stat.key}
                        target={Number(stat.target)}
                        suffix={stat.suffix || ""}
                        isInView={isInView}
                      />
                    </div>
                    <div
                      className="text-muted mt-1"
                      style={{ fontSize: "12px" }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ─── Section: Mission | Vision ───────────────────────────── */
function MissionVision() {
  return (
    <section className="py-12 md:py-16 bg-background">
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
              <h3 className="mt-6 subheading text-heading">Our Mission</h3>
              <p className="mt-3 small-text text-text body-text">
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
              <h3 className="mt-6 subheading text-heading">Our Vision</h3>
              <p className="mt-3 small-text text-text body-text">
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
    <section className="py-12 md:py-16 bg-background-section">
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
                <h3 className="mt-4 subheading text-heading">{v.title}</h3>
                <p className="mt-2 small-text text-text body-text">{v.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Section: Meet Our Team (CTA) ───────────────────────── */
function MeetOurTeam() {
  const navigate = useNavigate();

  return (
    <section className="bg-secondary py-16 text-white">
      <FadeIn>
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="text-4xl md:text-5xl font-extrabold">
            <span className="font-headings text-primary pr-2">Meet</span> Our
            Team
          </div>
          <p className="mt-4 text-white/70 max-w-2xl mx-auto leading-relaxed">
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

/* ─── Main About Page ─────────────────────────────────────── */
export default function About() {
  const { aboutPage, loading, error, fetchPageAbout } = usePageStore();

  const reviews = aboutPage?.reviews ?? [];
  const content = aboutPage?.siteContent ?? null;
  const companyStats = content?.companyStats ?? [];
  const trustMarqueeLogos = content?.trustMarqueeLogos ?? [];

  useEffect(() => {
    fetchPageAbout();
  }, [fetchPageAbout]);

  const getStat = (key) => {
    const s = companyStats.find((st) => st.key === key);
    return s ? `${s.target}${s.suffix}` : "";
  };

  const aboutStats = [
    "teamMembers",
    "yearsExperience",
    "projectsCompleted",
    "satisfactionGoal",
  ]
    .map((key) => companyStats.find((s) => s.key === key))
    .filter(Boolean);

  const whyChooseUsStats = [
    "clientRetention",
    "support247",
    "averageRoi",
    "satisfactionGoal",
  ]
    .map((key) => companyStats.find((s) => s.key === key))
    .filter(Boolean)
    .map((s) => ({ target: s.target, suffix: s.suffix || "", label: s.label }));

  if (error)
    return (
      <div>
        <HeroSplit
          title="Us"
          titleHighlight="About"
          subtitle="We are a team of designers, developers, and strategists dedicated to helping businesses grow through innovative digital solutions and measurable results."
          primaryCTA={{ label: "Meet Our Team", to: "/team" }}
          secondaryCTA={{ label: "Our Services", to: "/services" }}
          imageSrc="/aboutus.webp"
          imageAlt="About Us"
        />
        <section className="py-14 bg-surface">
          <div className="max-w-6xl mx-auto px-4 text-center py-20">
            <div className="text-primary font-medium mb-4">{error}</div>
            <button
              type="button"
              onClick={() => fetchPageAbout()}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-hover transition cursor-pointer button-text">
              Retry
            </button>
          </div>
        </section>
      </div>
    );

  return (
    <div>
      {/* 1. Hero */}
      <HeroSplit
        title="Us"
        titleHighlight="About"
        subtitle="We are a team of designers, developers, and strategists dedicated to helping businesses grow through innovative digital solutions and measurable results."
        primaryCTA={{ label: "Meet Our Team", to: "/team" }}
        secondaryCTA={{ label: "Our Services", to: "/services" }}
        imageSrc="/aboutus.webp"
        imageAlt="About Us"
        trustIndicators={[
          { value: getStat("teamMembers") || "25+", label: "Team\nMembers" },
          {
            value: getStat("projectsCompleted") || "500+",
            label: "Projects\nDelivered",
          },
          {
            value: getStat("clientRetention") || "98%",
            label: "Client\nRetention",
          },
        ]}
      />

      {/* 2. Welcome Banner */}
      <section className="py-12 md:py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4 space-y-12 md:space-y-16">
          <FadeIn>
            <div className="p-4 md:p-10 text-center select-none">
              <h2 className="section-heading text-heading tracking-tight">
                Hello, <span className="text-primary">Welcome</span> to Digital
                Marketing
              </h2>
              <div className="mt-4 small-text text-text leading-relaxed max-w-3xl mx-auto md:text-center space-y-3">
                <p className="small-text text-text body-text">
                  We help brands navigate and scale modern digital landscapes by
                  executing high-performance web engineering alongside robust
                  marketing strategy. Our engineering principles cut out
                  unnecessary layers to zero in on real results: identifying
                  exact business goals, transforming concepts into scalable
                  customer pipelines, building platforms with structural
                  cleanliness, and monitoring active engagement behaviours.
                </p>
                <p className="small-text text-text body-text">
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
      {loading ? (
        <section className="py-12 md:py-16 bg-background-section">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
              <div className="space-y-4 animate-pulse">
                <div className="h-4 w-20 bg-surface-border rounded" />
                <div className="h-8 w-3/4 bg-surface-border rounded" />
                <div className="h-4 w-full bg-surface-border rounded" />
                <div className="h-4 w-5/6 bg-surface-border rounded" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="rounded-lg p-6 bg-surface-border animate-pulse">
                    <div className="w-8 h-8 bg-surface rounded mx-auto" />
                    <div className="mt-3 h-6 w-12 bg-surface rounded mx-auto" />
                    <div className="mt-1 h-3 w-16 bg-surface rounded mx-auto" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <WhoWeAre stats={aboutStats} />
      )}

      {/* 4. Mission | Vision */}
      <MissionVision />

      {/* 5. Our Values */}
      <OurValues />

      {/* 6. Why Choose Us */}
      <WhyChooseUs stats={whyChooseUsStats} bg="bg-background" />

      {/* 7. Our Process (Timeline) */}
      <OurProcess bg="bg-background-section" />

      {/* 8. Meet Our Team */}
      <MeetOurTeam />

      {/* 9. Client Testimonials */}
      <TestimonialsSection
        reviews={reviews}
        loading={loading}
        bg="bg-background"
      />

      {/* 10. Trusted By */}
      {loading ? (
        <section className="py-12 md:py-16 bg-background-section">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-[calc(20%-12px)] min-w-[140px] h-16 bg-surface border border-border rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <LogoMarquee logos={trustMarqueeLogos} bg="bg-background-section" />
      )}

      {/* 11. Final CTA */}
      <FinalCTA />
    </div>
  );
}
