import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faLightbulb,
  faPalette,
  faCode,
  faRocket,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";
import FadeIn from "../ui/FadeIn.jsx";
import SectionHeading from "../ui/SectionHeading.jsx";

const defaultSteps = [
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

export default function OurProcess({ steps = defaultSteps, bg = "bg-background-section" }) {
  return (
    <section className={`py-16 md:py-20 ${bg}`}>
      <div className="max-w-6xl mx-auto px-4">
        <FadeIn>
          <SectionHeading
            eyebrow="How We Work"
            title="Our Process"
            subtitle="A proven methodology that delivers results every time."
          />
          <p className="text-center mt-4 text-sm text-text max-w-2xl mx-auto">
            From initial discovery to ongoing optimization, our structured workflow ensures
            every project is delivered on time, within scope, and with measurable impact.
          </p>
        </FadeIn>

        <div className="mt-10 relative">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2" />

          <div className="space-y-8 md:space-y-0">
            {steps.map((step, i) => {
              const isLeft = i % 2 === 0; // Alternates box side of the center line
              return (
                <FadeIn
                  key={step.title}
                  delay={i * 100}
                  direction={isLeft ? "left" : "right"}>
                  <div
                    className={`relative md:grid md:grid-cols-2 md:gap-12 md:items-center ${i > 0 ? "md:mt-8" : ""}`}>
                    <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                      <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shadow-lg">
                        {i + 1}
                      </div>
                    </div>

                    {/* Cleaned layout: Removed "md:text-right md:pr-12" for left-side boxes so text stays left-aligned internally */}
                    <div
                      className={`text-left ${isLeft ? "md:pr-12" : "md:col-start-2 md:pl-12"}`}>
                      <div className="bg-surface border border-border rounded-lg p-6 hover: transition card-shadow">
                        
                        {/* Cleaned wrapper: Removed "md:justify-end" condition so icon and title are always cleanly on the left side of the card */}
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center shrink-0">
                            <FontAwesomeIcon
                              icon={step.icon}
                              className="text-primary"
                            />
                          </div>
                          <div className="text-left">
                            <div className="text-xs font-semibold text-primary uppercase tracking-wider">
                              Step {i + 1}
                            </div>
                            <h3 className="subheading text-heading">
                              {step.title}
                            </h3>
                          </div>
                        </div>
                        
                        <p className="mt-3 small-text text-text body-text text-left">
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