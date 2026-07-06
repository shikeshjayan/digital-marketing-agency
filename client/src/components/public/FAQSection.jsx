import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import SectionHeading from "../ui/SectionHeading.jsx";

export default function FAQSection({
  items = [],
  eyebrow = "Questions",
  title = "Frequently Asked Questions",
  subtitle = "Find answers to common questions about our services and process.",
  bg = "bg-background",
}) {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (i) => {
    setActiveIndex(activeIndex === i ? null : i);
  };

  if (!items.length) return null;

  return (
    <section className={`py-12 md:py-16 ${bg}`}>
      <div className="max-w-3xl mx-auto px-4">
        <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />

        <div className="mt-10 space-y-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="bg-background border border-border rounded-lg overflow-hidden">
              <button
                type="button"
                aria-expanded={activeIndex === i}
                aria-controls={`faq-panel-${i}`}
                className="w-full flex items-center justify-between px-6 py-4 text-left cursor-pointer hover:bg-surface transition"
                onClick={() => toggle(i)}>
                <span className="font-semibold text-heading small-text md:body-text pr-4">
                  {item.q}
                </span>
                <FontAwesomeIcon
                  icon={activeIndex === i ? faMinus : faPlus}
                  className="text-primary shrink-0"
                />
              </button>
              {activeIndex === i && (
                <div id={`faq-panel-${i}`} role="region" className="px-6 pb-4">
                  <p className="small-text text-text body-text">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
