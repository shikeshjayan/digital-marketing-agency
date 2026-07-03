import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import FadeIn from "../ui/FadeIn.jsx";
import SectionHeading from "../ui/SectionHeading.jsx";

const defaultStats = [
  { value: "98%", label: "Client Retention" },
  { value: "24/7", label: "Support Available" },
  { value: "3x", label: "Average ROI" },
  { value: "100%", label: "Satisfaction Goal" },
];

const defaultReasons = [
  "Custom strategies tailored to your unique business goals",
  "Transparent communication and dedicated project management",
  "Data-driven approach with measurable KPIs and reporting",
  "End-to-end solutions from design to deployment and marketing",
  "Agile development process with fast turnaround times",
  "Long-term partnership focus with ongoing support",
];

export default function WhyChooseUs({
  stats = defaultStats,
  reasons = defaultReasons,
}) {
  return (
    <section className="py-12 md:py-16 bg-surface">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <FadeIn direction="left">
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
