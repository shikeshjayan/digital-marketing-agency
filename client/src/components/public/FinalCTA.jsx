import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone, faComments } from "@fortawesome/free-solid-svg-icons";
import FadeIn from "../ui/FadeIn.jsx";

export default function FinalCTA({
  title = "Ready to Grow Your Business?",
  description = "Let's discuss how our digital marketing expertise can help you achieve your goals. Get in touch with us today for a free consultation.",
  primaryLabel = "Get a Free Quote",
  primaryTo = "/contact",
  secondaryLabel = "Schedule a Consultation",
  secondaryTo = "/contact",
  showWhatsApp = false,
}) {
  const navigate = useNavigate();

  return (
    <section className="bg-secondary py-16 md:py-20">
      <FadeIn>
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="section-heading text-white">{title}</h2>
          <p className="mt-4 text-white/70 max-w-2xl mx-auto body-text">
            {description}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg bg-primary text-white px-6 py-3 text-sm font-semibold hover:bg-primary-hover transition cursor-pointer"
              onClick={() => navigate(primaryTo)}>
              <FontAwesomeIcon icon={faEnvelope} />
              {primaryLabel}
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-white text-white px-6 py-3 text-sm font-semibold hover:bg-white/10 transition cursor-pointer"
              onClick={() => navigate(secondaryTo)}>
              <FontAwesomeIcon icon={faComments} />
              {secondaryLabel}
            </button>
            {showWhatsApp && (
              <a
                href="https://wa.me/918891212323"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-success text-white px-6 py-3 small-text font-semibold hover:opacity-90 transition">
                <FontAwesomeIcon icon={faComments} />
                WhatsApp Us
              </a>
            )}
          </div>

        </div>
      </FadeIn>
    </section>
  );
}
