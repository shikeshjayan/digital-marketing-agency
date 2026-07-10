import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faEnvelope,
  faLocation,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import FadeIn from "../ui/FadeIn.jsx";

export default function HelpCard({
  badge = "How Can I Help You?",
  heading = "Wanna ",
  headingHighlight = "Hear",
  headingRest = " From You",
  description = "Tell us what you need and we'll respond with a clear plan and timeline.",
  contact = {},
}) {
  const items = [
    {
      icon: faPhone,
      href: `tel:${contact.phone || "+91 8891212323"}`,
      label: contact.phone || "+91 8891212323",
    },
    {
      icon: faEnvelope,
      href: `mailto:${contact.email || "crowlcrown@gmail.com"}`,
      label: contact.email || "crowlcrown@gmail.com",
    },
    {
      icon: faLocation,
      href: `https://www.google.com/maps/search/${encodeURIComponent(contact.address || "Ernakulam Kochi Kerala India")}`,
      label: contact.address || "Ernakulam, Kochi, Kerala, India",
    },
    contact.working_hours
      ? {
          icon: faClock,
          href: null,
          label: contact.working_hours,
          noHover: true,
        }
      : null,
  ].filter(Boolean);

  return (
    <div className="bg-secondary text-white rounded-lg p-8">
      <div className="text-sm font-semibold text-primary">{badge}</div>
      <div className="mt-3 section-heading">
        {heading}
        <span className="text-primary">{headingHighlight}</span>
        {headingRest}
      </div>
      <p className="mt-4 text-white/70 body-text">{description}</p>
      <div className="mt-6 space-y-2 small-text text-white/80">
        {items.map((item, idx) => (
          <FadeIn key={idx} delay={(idx + 1) * 80} direction="none">
            <div className={`flex items-center gap-3 ${item.noHover ? "" : "group/item"}`}>
              <span className="w-10 h-8 rounded-lg bg-secondary/10 flex items-center justify-center small-text text-white/70">
                <FontAwesomeIcon icon={item.icon} />
              </span>
              {item.href ? (
                <a
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-primary transition-colors duration-200">
                  {item.label}
                </a>
              ) : (
                <span className="text-white/80">{item.label}</span>
              )}
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
