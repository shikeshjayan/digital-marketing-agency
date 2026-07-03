import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function CTASection({
  title = "Ready to Grow Your Business?",
  description = "Let's discuss how our digital marketing expertise can help you achieve your goals. Get in touch with us today for a free consultation.",
  primaryLabel = "Contact Us",
  primaryTo = "/contact",
  secondaryLabel = "Learn More About Us",
  secondaryTo = "/about",
}) {
  const navigate = useNavigate();

  return (
    <section className="bg-dark py-16">
      <div className="max-w-4xl mx-auto px-4 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-extrabold">{title}</h2>
        <p className="mt-4 text-gray-300 max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            className="inline-flex items-center rounded-lg bg-primary text-white px-6 py-3 text-sm font-semibold hover:bg-primary-hover transition cursor-pointer"
            onClick={() => navigate(primaryTo)}>
            {primaryLabel}
          </button>
          <Link
            to={secondaryTo}
            className="inline-flex items-center rounded-lg border border-white text-white px-6 py-3 text-sm font-semibold hover:bg-white/10 transition">
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
