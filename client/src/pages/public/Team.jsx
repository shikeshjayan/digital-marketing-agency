import { useEffect, useMemo } from 'react'
import HeroSplit from '../../components/public/HeroSplit.jsx'
import FadeIn from '../../components/ui/FadeIn.jsx'
import SectionHeading from '../../components/ui/SectionHeading.jsx'
import FinalCTA from '../../components/public/FinalCTA.jsx'
import TeamCard from '../../components/public/TeamCard.jsx'
import { TeamCardSkeleton } from '../../components/ui/Skeleton.jsx'
import useTeamStore from '../../store/teamStore.js'
import useSiteContentStore from '../../store/siteContentStore.js'

const departments = [
  {
    name: "Strategy",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    description: "Data-driven strategies that align with your business goals and market landscape.",
  },
  {
    name: "SEO",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    description: "Organic search optimization to boost visibility and drive qualified traffic.",
  },
  {
    name: "Paid Ads",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    description: "Targeted campaigns across Google, Meta, and LinkedIn for maximum ROI.",
  },
  {
    name: "Social Media",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
      </svg>
    ),
    description: "Engaging content and community management across all major platforms.",
  },
  {
    name: "Design & Development",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    description: "Beautiful, high-performing websites and digital experiences.",
  },
  {
    name: "Content",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    description: "Compelling copy, blogs, and creative assets that tell your brand story.",
  },
  {
    name: "Client Success",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    description: "Dedicated support ensuring every client achieves their desired outcomes.",
  },
];

const cultureValues = [
  {
    title: "Collaboration",
    description: "We believe the best work happens when diverse minds come together to solve complex problems.",
  },
  {
    title: "Innovation",
    description: "We stay ahead of digital trends, constantly experimenting with new tools and methodologies.",
  },
  {
    title: "Transparency",
    description: "Open communication with clients and team members builds trust and drives results.",
  },
  {
    title: "Growth Mindset",
    description: "Every challenge is a learning opportunity. We invest in continuous skill development.",
  },
];

const certifications = [
  "Google Ads Certified",
  "Google Analytics Certified",
  "Meta Blueprint Certified",
  "HubSpot Inbound Certified",
  "HubSpot Content Marketing",
  "SEMrush SEO Toolkit",
  "Hootsuite Social Marketing",
  "AWS Cloud Practitioner",
  "Google UX Design",
  "Meta Front-End Developer",
];

/* ─── Section: Departments ────────────────────────────────── */
function Departments() {
  return (
    <section className="py-12 md:py-16 bg-background-section">
      <FadeIn>
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeading
            eyebrow="What We Do"
            title="Our Departments"
            subtitle="Specialized teams working together to deliver end-to-end digital marketing solutions."
          />
          <div className="mt-10 flex flex-wrap justify-center gap-6">
            {departments.map((dept, i) => (
              <FadeIn key={dept.name} delay={i * 40} className="w-full sm:basis-[calc(50%-12px)] lg:basis-[calc(33.33%-16px)] xl:basis-[calc(25%-18px)] max-w-sm">
                <div className="bg-surface border border-border rounded-lg p-6 h-full hover:shadow-sm transition group">
                  <div className="w-12 h-12 rounded-lg bg-primary-light flex items-center justify-center group-hover:bg-primary group-hover:text-white transition text-primary">
                    {dept.icon}
                  </div>
                  <h3 className="mt-4 subheading text-heading">{dept.name}</h3>
                  <p className="mt-2 mt-auto small-text text-text body-text">{dept.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </FadeIn>
    </section>
  );
}

/* ─── Section: Team Statistics ────────────────────────────── */
function TeamStatistics({ stats = [] }) {
  const displayStats = stats.slice(0, 4);
  if (!displayStats.length) return null;
  return (
    <section className="py-12 md:py-16 bg-background">
      <FadeIn>
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeading
            eyebrow="By the Numbers"
            title="Team Statistics"
            subtitle="Our collective expertise speaks through the results we deliver."
          />
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
            {displayStats.map((stat, i) => (
              <FadeIn key={stat.key || i} delay={i * 40}>
                <div className="bg-background border border-border rounded-lg p-6 text-center hover:shadow-sm transition">
                  <div className="text-3xl md:text-4xl font-extrabold text-primary">{stat.target}{stat.suffix}</div>
                  <div className="mt-2 text-sm text-text">{stat.label}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </FadeIn>
    </section>
  );
}

/* ─── Section: Our Culture ────────────────────────────────── */
function OurCulture() {
  return (
    <section className="py-12 md:py-16 bg-background-section">
      <FadeIn>
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeading
            eyebrow="Who We Are"
            title="Our Culture"
            subtitle="The values that define how we work, collaborate, and grow together."
          />
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {cultureValues.map((item, i) => (
              <FadeIn key={item.title} delay={i * 40}>
                <div className="bg-surface border border-border rounded-lg p-6 h-full hover:shadow-sm transition group">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0" />
                    <h3 className="subheading text-heading">{item.title}</h3>
                  </div>
                  <p className="mt-3 small-text text-text body-text pl-5">{item.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </FadeIn>
    </section>
  );
}

/* ─── Section: Certifications & Skills ────────────────────── */
function Certifications() {
  return (
    <section className="py-12 md:py-16 bg-background">
      <FadeIn>
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeading
            eyebrow="Expertise"
            title="Certifications & Skills"
            subtitle="Our team holds industry-recognized certifications across leading digital platforms."
          />
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {certifications.map((cert, i) => (
              <FadeIn key={cert} delay={i * 30}>
                <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-background border border-border rounded-lg hover:shadow-sm transition">
                  <svg className="w-4 h-4 text-primary shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-semibold text-heading small-text font-bold">{cert}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </FadeIn>
    </section>
  );
}

/* ─── Page Component ──────────────────────────────────────── */
export default function Team() {
  const { team, loading, error, fetchTeam } = useTeamStore()
  const { content, fetchPublicSiteContent } = useSiteContentStore()
  const companyStats = content?.companyStats ?? [];

  const getStat = (key) => {
    const s = companyStats.find((st) => st.key === key);
    return s ? `${s.target}${s.suffix}` : "";
  };

  useEffect(() => {
    fetchTeam()
    fetchPublicSiteContent()
  }, [fetchTeam, fetchPublicSiteContent])

  const sorted = useMemo(() => {
    return [...team].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
  }, [team])

  return (
    <div className="bg-background min-h-screen animate-page-fade">
      <HeroSplit
        title="Our Team"
        titleHighlight="Meet"
        subtitle="The talented designers, developers, and strategists who bring your vision to life with passion, expertise, and dedication."
        primaryCTA={{ label: "Join Our Team", to: "/contact" }}
        secondaryCTA={{ label: "View Services", to: "/services" }}
        imageSrc="/team.webp"
        imageAlt="Our Team"
        trustIndicators={[
          { value: getStat("teamMembers") || "25+", label: "Team Members" },
          { value: getStat("projectsCompleted") || "500+", label: "Projects Delivered" },
          { value: getStat("clientRetention") || "98%", label: "Client Retention" },
        ]}
      />

      {/* Team Cards */}
      <section className="py-14 bg-background">
        <FadeIn>
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10">
              <div className="text-primary font-semibold text-sm small-text">Our People</div>
              <h2 className="mt-2 section-heading text-heading">
                <span className="font-headings text-primary pr-2">Leadership</span> Team
              </h2>
              <p className="mt-3 text-text max-w-2xl mx-auto small-text md:body-text">
                The driving force behind our mission to deliver exceptional digital marketing results.
              </p>
            </div>
            {loading ? (
              <div className="flex flex-wrap justify-center gap-6">
                {[...Array(4)].map((_, i) => (
                  <TeamCardSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-10">
                <div className="text-primary font-medium mb-4">{error}</div>
                <button
                  type="button"
                  onClick={() => fetchTeam()}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-hover transition cursor-pointer button-text">
                  Retry
                </button>
              </div>
            ) : sorted.length === 0 ? (
              <div className="text-center py-10">
                <svg
                  className="w-16 h-16 mx-auto text-muted opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <div className="mt-4 text-lg font-semibold text-heading subheading">
                  No team members found
                </div>
                <div className="mt-2 text-sm text-text small-text">
                  Check back later for updates.
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-6">
                {sorted.map((m, i) => (
                  <FadeIn key={m._id || m.member_id} delay={i * 40}>
                    <TeamCard member={m} />
                  </FadeIn>
                ))}
              </div>
            )}
          </div>
        </FadeIn>
      </section>

      <Departments />
      <TeamStatistics stats={companyStats} />
      <OurCulture />
      <Certifications />
      
      <FadeIn>
        <FinalCTA
          title="Join Our Team"
          description="We're always looking for talented people who are passionate about digital marketing. Explore open positions and grow with us."
          primaryLabel="Contact Us"
          secondaryLabel="View Services"
          secondaryTo="/services"
        />
      </FadeIn>
    </div>
  )
}