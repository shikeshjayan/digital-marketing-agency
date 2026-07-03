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

export default function OurProcess({ steps = defaultSteps }) {
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
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2" />

          <div className="space-y-8 md:space-y-0">
            {steps.map((step, i) => {
              const isLeft = i % 2 === 0;
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
