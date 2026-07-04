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
    <section className="bg-dark py-16 md:py-20">
      <FadeIn>
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-extrabold">{title}</h2>
          <p className="mt-4 text-gray-300 max-w-2xl mx-auto leading-relaxed">
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
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-green-600 text-white px-6 py-3 text-sm font-semibold hover:bg-green-700 transition">
                <FontAwesomeIcon icon={faPhone} />
                WhatsApp Us
              </a>
            )}
          </div>
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-400">
            <span className="flex items-center gap-1.5">
              <FontAwesomeIcon icon={faEnvelope} className="text-primary" />
              info@agency.com
            </span>
            <span className="flex items-center gap-1.5">
              <FontAwesomeIcon icon={faPhone} className="text-primary" />
              +1 (555) 123-4567
            </span>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
