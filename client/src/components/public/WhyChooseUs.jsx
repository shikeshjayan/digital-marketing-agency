import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faComments,
  faChartLine,
  faHeadset,
  faClock,
  faHandshake,
} from "@fortawesome/free-solid-svg-icons";
import FadeIn from "../ui/FadeIn.jsx";
import SectionHeading from "../ui/SectionHeading.jsx";

const defaultStats = [
  { value: "98%", label: "Client Retention" },
  { value: "24/7", label: "Support Available" },
  { value: "3x", label: "Average ROI" },
  { value: "100%", label: "Satisfaction Goal" },
];

const defaultReasons = [
  {
    icon: faUsers,
    title: "Experienced Team",
    desc: "Seasoned professionals with deep expertise across industries and technologies.",
  },
  {
    icon: faComments,
    title: "Transparent Communication",
    desc: "Clear, consistent updates at every stage so you're never left guessing.",
  },
  {
    icon: faChartLine,
    title: "ROI-Focused Strategies",
    desc: "Data-driven decisions designed to maximize your return on investment.",
  },
  {
    icon: faHeadset,
    title: "Dedicated Support",
    desc: "A dedicated account manager ensures your needs are always prioritized.",
  },
  {
    icon: faClock,
    title: "On-Time Delivery",
    desc: "We respect deadlines and deliver quality work within the agreed timeline.",
  },
  {
    icon: faHandshake,
    title: "Long-Term Partnership",
    desc: "We build lasting relationships focused on your sustained growth and success.",
  },
];

export default function WhyChooseUs({
  stats = defaultStats,
  reasons = defaultReasons,
}) {
  return (
    <section className="py-16 md:py-20 bg-surface">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
          <FadeIn direction="left">
            <div>
              <SectionHeading
                eyebrow="Our Edge"
                title="Why Choose Us"
                subtitle="We combine expertise, transparency, and a results-driven approach to help your business thrive."
              />
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {reasons.map((r, i) => (
                  <FadeIn key={i} delay={i * 80} direction="up">
                    <div className="bg-background border border-border rounded-lg p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
                      <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
                        <FontAwesomeIcon
                          icon={r.icon}
                          className="text-primary group-hover:text-white transition-colors"
                        />
                      </div>
                      <h3 className="mt-3 text-sm font-bold text-heading">{r.title}</h3>
                      <p className="mt-1.5 text-xs text-text leading-relaxed">{r.desc}</p>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="right">
            <div className="bg-background border border-border rounded-lg p-8">
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center p-4">
                    <div className="text-4xl font-extrabold text-primary">
                      {stat.value}
                    </div>
                    <div className="mt-1 text-xs text-muted">{stat.label}</div>
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
