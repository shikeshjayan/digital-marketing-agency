import { useEffect, useState } from "react";
import { toast } from "sonner";
import HeroSplit from "../../components/public/HeroSplit.jsx";
import FadeIn from "../../components/ui/FadeIn.jsx";
import HelpCard from "../../components/public/HelpCard.jsx";
import StatsSection from "../../components/public/StatsSection.jsx";
import LogoMarquee from "../../components/public/LogoMarquee.jsx";
import FinalCTA from "../../components/public/FinalCTA.jsx";
import TestimonialsSection from "../../components/public/TestimonialsSection.jsx";
import apiService from "../../services/apiService.js";
import { Link } from "react-router-dom";
import useBrandSettingsStore from "../../store/brandSettingsStore.js";
import useSiteContentStore from "../../store/siteContentStore.js";

function StarPicker({ value, onChange }) {
  return (
    <div className="flex items-center gap-1 text-warning">
      {Array.from({ length: 5 }).map((_, i) => {
        const v = i + 1;
        const active = v <= value;
        return (
          <button
            key={v}
            type="button"
            className={`text-2xl leading-none cursor-pointer transition-all duration-200 ${active ? "text-warning" : "text-muted/40"} hover:text-warning/80 hover:scale-110 active:scale-95`}
            onClick={() => onChange(v)}
            aria-label={`Set rating to ${v}`}>
            ★
          </button>
        );
      })}
    </div>
  );
}

export default function Testimonials() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    location: "",
    rating: 5,
    review_text: "",
  });
  const [consent, setConsent] = useState(false);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { content: brandContent, fetchBrandSettings } = useBrandSettingsStore();
  const { content: siteContent, fetchPublicSiteContent } =
    useSiteContentStore();

  const testimonials = siteContent?.testimonials ?? {};
  const companyStats = siteContent?.companyStats ?? [];
  const contact = brandContent?.contact ?? {};
  const trustMarqueeLogos = siteContent?.trustMarqueeLogos ?? [];

  const getStat = (key) => {
    const s = companyStats.find((st) => st.key === key);
    return s ? `${s.target}${s.suffix}` : "";
  };

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    apiService
      .get("/reviews")
      .then((res) => {
        if (isMounted) {
          setReviews(res.data.data ?? []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setLoading(false);
        }
      });
    fetchBrandSettings();
    fetchPublicSiteContent();
    return () => {
      isMounted = false;
    };
  }, [fetchBrandSettings, fetchPublicSiteContent]);

  async function onSubmit(e) {
    e.preventDefault();
    if (isSubmitting) return;
    setFormError("");
    setSuccess("");

    if (
      !form.name.trim() ||
      !form.location.trim() ||
      !form.review_text.trim()
    ) {
      setFormError("Please fill the form completely.");
      return;
    }

    if (!consent) {
      setFormError(
        "Please agree to the privacy policy and terms & conditions before submitting.",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiService.post("/reviews/submit", form);
      if (!res.data.success) {
        setFormError(res.data.error?.message ?? "Failed to submit.");
        setIsSubmitting(false);
        return;
      }
      setSuccess(
        "Thanks! Your review was submitted and is awaiting moderation.",
      );
      toast.success(
        "Thanks! Your review was submitted and is awaiting moderation.",
      );
      setForm({ name: "", location: "", rating: 5, review_text: "" });
      setConsent(false);

      const latest = await apiService.get("/reviews");
      setReviews(latest.data.data ?? []);
    } catch (err) {
      const msg = err.response?.data?.message ?? "Failed to submit.";
      setFormError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-background min-h-screen">
      <HeroSplit
        title={testimonials.heroTitle || "Testimonials"}
        titleHighlight={testimonials.heroTitleHighlight || "Client"}
        subtitle={
          testimonials.heroSubtitle ||
          "Real feedback from businesses we've helped grow. See what our clients say about working with us."
        }
        primaryCTA={{
          label: testimonials.heroPrimaryCTA || "Leave a Review",
          to: "#review-form",
        }}
        secondaryCTA={{
          label: testimonials.heroSecondaryCTA || "View Our Work",
          to: "/projects",
        }}
        imageSrc="/testimonials.webp"
        imageAlt="Client Testimonials"
        trustIndicators={(() => {
          const sat = companyStats.find((s) => s.key === "satisfiedClients");
          const rat = companyStats.find((s) => s.key === "averageRating");
          const exp = companyStats.find((s) => s.key === "yearsExperience");
          return [
            {
              value: getStat("satisfiedClients") || "500+",
              target: sat?.target,
              suffix: sat?.suffix || "+",
              label: "Satisfied\nClients",
            },
            {
              value: getStat("averageRating") || "4.9",
              target: rat?.target,
              suffix: rat?.suffix || "",
              label: "Average\nRating",
            },
            {
              value: getStat("yearsExperience") || "8+",
              target: exp?.target,
              suffix: exp?.suffix || "+",
              label: "Years\nExperience",
            },
          ];
        })()}
      />

      <section id="review-form" className="py-14 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <FadeIn direction="left">
              <HelpCard
                badge={testimonials.leftCardBadge}
                heading={testimonials.leftCardHeading}
                headingHighlight={testimonials.leftCardHeadingHighlight}
                headingRest={testimonials.leftCardHeadingRest}
                description={testimonials.leftCardDescription}
                contact={contact}
              />
            </FadeIn>

            {/* Right Side: Review Form Layout */}
            <FadeIn direction="right">
              <div className="bg-background border border-border rounded-lg p-6">
                <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
                  <div>
                    <div className="text-xs font-bold tracking-wider uppercase text-primary">
                      {testimonials.formSectionTitle ||
                        "SHARE YOUR EXPERIENCE"}
                    </div>
                    <div className="mt-1 section-heading text-heading">
                      {testimonials.formSectionSubtitle || "Send Review"}
                    </div>
                  </div>
                </div>
                <form onSubmit={onSubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-heading">
                      Your Name
                    </label>
                    <input
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      className="mt-2 w-full rounded-lg border border-border px-4 py-2 text-sm text-text outline-none focus:ring-2 focus:ring-primary-light bg-background"
                      placeholder="Full Name"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-heading">
                      Location
                    </label>
                    <input
                      value={form.location}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, location: e.target.value }))
                      }
                      className="mt-2 w-full rounded-lg border border-border px-4 py-2 text-sm text-text outline-none focus:ring-2 focus:ring-primary-light bg-background"
                      placeholder="City, Country"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-heading">
                      Rating
                    </label>
                    <div className="mt-2">
                      <StarPicker
                        value={form.rating}
                        onChange={(v) => setForm((f) => ({ ...f, rating: v }))}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-heading">
                      Share your opinions about us
                    </label>
                    <textarea
                      value={form.review_text}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, review_text: e.target.value }))
                      }
                      rows={4}
                      className="mt-2 w-full rounded-lg border border-border px-4 py-2 text-sm text-text outline-none focus:ring-2 focus:ring-primary-light bg-background resize-none"
                      placeholder="Write your review..."
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Consent Checkbox */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="consent"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      disabled={isSubmitting}
                      className="mt-1 h-4 w-4 rounded border-border accent-primary-hover text-primary focus:ring-primary cursor-pointer"
                    />
                    <label
                      htmlFor="consent"
                      className="text-sm text-text leading-snug cursor-pointer">
                      I agree to the{" "}
                      <a
                        href="/privacy"
                        target="_self"
                        className="text-primary underline hover:text-primary-hover">
                        Privacy Policy
                      </a>{" "}
                      and{" "}
                      <a
                        href="/terms"
                        target="_self"
                        className="text-primary underline hover:text-primary-hover">
                        Terms & Conditions
                      </a>
                      . I consent to the collection and processing of my
                      personal data for enquiry purposes.
                    </label>
                  </div>

                  {formError && (
                    <FadeIn direction="none">
                      <div
                        className="text-sm text-primary text-center"
                        style={{ "font-size": "12.5px" }}>
                        {formError}
                      </div>
                    </FadeIn>
                  )}
                  {success && (
                    <FadeIn direction="none">
                      <div className="text-sm font-semibold text-success">
                        {success}
                      </div>
                    </FadeIn>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-lg bg-primary text-white py-3 font-extrabold hover:bg-primary-hover hover:shadow-md active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50">
                    {isSubmitting ? "Sending..." : "Send Reviews"}
                  </button>
                </form>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <TestimonialsSection
        reviews={reviews}
        loading={loading}
        eyebrow={testimonials.reviewsBadge || "Approved Reviews"}
        title={testimonials.reviewsTitle || "What learners say"}
        bg="bg-background"
      />

      <StatsSection stats={companyStats} bg="bg-background-section" />
      <LogoMarquee logos={trustMarqueeLogos} bg="bg-background" />
      <FinalCTA />
    </div>
  );
}
