import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import HeroSplit from "../../components/public/HeroSplit.jsx";
import FadeIn from "../../components/ui/FadeIn.jsx";
import AnimatedCounter from "../../components/ui/AnimatedCounter.jsx";
import { TestimonialCardSkeleton } from "../../components/ui/Skeleton.jsx";
import LogoMarquee from "../../components/public/LogoMarquee.jsx";
import FinalCTA from "../../components/public/FinalCTA.jsx";
import DetailModal from "../../components/ui/DetailModal.jsx";
import apiService from "../../services/apiService.js";
import { Link } from "react-router-dom";

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
            className={`text-2xl leading-none cursor-pointer transition-colors duration-150 ${active ? 'text-warning' : 'text-muted/40'} hover:text-warning/80`}
            onClick={() => onChange(v)}
            aria-label={`Set rating to ${v}`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}

function TrustStatistics() {
  const stats = [
    { target: 8, suffix: "+", label: "Years of Experience" },
    { target: 500, suffix: "+", label: "Projects Completed" },
    { target: 500, suffix: "+", label: "Satisfied Clients" },
  ];

  return (
    <section className="bg-background-section py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <FadeIn direction="left">
            <div className="flex flex-col items-center lg:items-start">
              <div className="w-full max-w-md">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-background border border-border">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-sm font-semibold text-heading">
                    Innovation meets execution
                  </span>
                </div>
                <h3 className="mt-4 section-heading text-heading">
                  Why teams trust us
                </h3>
                <p className="mt-3 text-text body-text">
                  We combine design, engineering, and marketing strategy to
                  deliver websites and campaigns that perform.
                </p>
                <div className="mt-8">
                  <Link
                    to="/about"
                    className="inline-flex rounded-lg bg-primary text-white px-5 py-2.5 text-sm font-semibold hover:bg-primary-hover transition cursor-pointer">
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map((s, i) => (
              <FadeIn key={s.label} delay={(i + 1) * 100}>
                <div className="bg-background border border-border rounded-lg p-6 text-center shadow-sm flex flex-col items-center justify-center min-h-[120px]">
                  <div className="text-4xl font-extrabold text-heading">
                    <AnimatedCounter target={s.target} suffix={s.suffix} />
                  </div>
                  <div className="mt-2 text-sm font-semibold text-text">
                    {s.label}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Testimonials() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    location: '',
    rating: 5,
    review_text: '',
  });
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');
  const [detail, setDetail] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    apiService.get('/reviews')
      .then((res) => {
        if (isMounted) {
          setReviews(res.data.data ?? []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.response?.data?.message ?? 'Failed to load reviews.');
          setLoading(false);
        }
      });
    return () => { isMounted = false; };
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    if (isSubmitting) return;
    setFormError('');
    setSuccess('');

    if (!form.name.trim() || !form.location.trim() || !form.review_text.trim()) {
      setFormError('Please fill the form completely.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiService.post('/reviews/submit', form);
      if (!res.data.success) {
        setFormError(res.data.error?.message ?? 'Failed to submit.');
        setIsSubmitting(false);
        return;
      }
      setSuccess('Thanks! Your review was submitted and is awaiting moderation.');
      toast.success('Thanks! Your review was submitted and is awaiting moderation.');
      setForm({ name: '', location: '', rating: 5, review_text: '' });
      
      const latest = await apiService.get('/reviews');
      setReviews(latest.data.data ?? []);
    } catch (err) {
      const msg = err.response?.data?.message ?? 'Failed to submit.';
      setFormError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  const modalTags = detail && detail.location ? [{ label: detail.location, variant: "default" }] : [];

  return (
    <div className="bg-background min-h-screen">
      <HeroSplit
        title="Testimonials"
        titleHighlight="Client"
        subtitle="Real feedback from businesses we've helped grow. See what our clients say about working with us."
        primaryCTA={{ label: "Leave a Review", to: "#review-form" }}
        secondaryCTA={{ label: "View Our Work", to: "/projects" }}
        imageSrc="/testimonials.webp"
        imageAlt="Client Testimonials"
        trustIndicators={[
          { value: "500+", label: "Satisfied\nClients" },
          { value: "4.9", label: "Average\nRating" },
          { value: "8+", label: "Years\nExperience" },
        ]}
      />

      <section id="review-form" className="py-14 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <FadeIn direction="left">
              <div className="bg-secondary text-white rounded-lg p-8 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/5 rounded-lg rotate-12" />
                </div>
                <div className="text-sm font-semibold text-primary rounded uppercase tracking-wider">
                  How Can I Help You?
                </div>
                <div className="mt-3 text-3xl font-extrabold leading-tight">
                  Wanna <span className="text-primary pr-1">Hear</span> From You
                </div>
                <p className="mt-4 text-white/80 text-sm leading-relaxed max-w-prose">
                  Tell us about your experience. Your review helps future learners make confident decisions.
                </p>

                <div className="mt-6 space-y-2 small-text text-white/80 border-t border-white/10 pt-6">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-8 rounded-lg bg-secondary/10 flex items-center justify-center small-text text-white/70">
                      <FontAwesomeIcon icon={faPhone} />
                    </span>
                    <a href="tel:+91 8891212323" className="text-white/80 hover:text-primary transition-colors">
                      +91 8891212323
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-8 rounded-lg bg-secondary/10 flex items-center justify-center small-text text-white/70">
                      <FontAwesomeIcon icon={faEnvelope} />
                    </span>
                    <a href="mailto:crowlcrown@gmail.com" className="text-white/80 hover:text-primary transition-colors">
                      crowlcrown@gmail.com
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-8 rounded-lg bg-secondary/10 flex items-center justify-center small-text text-white/70">
                      <FontAwesomeIcon icon={faEnvelope} />
                    </span>
                    <a href="https://www.google.com/maps/search/Ernakulam+Kochi+Kerala+India" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-primary transition-colors">
                      Ernakulam, Kochi, Kerala, India
                    </a>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="right">
              <div className="bg-background border border-border rounded-lg p-6">
                <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
                  <div>
                    <div className="text-xs font-bold tracking-wider uppercase text-primary">SHARE YOUR EXPERIENCE!</div>
                    <div className="mt-1 section-heading text-heading">Send Review</div>
                  </div>
                </div>

                <form onSubmit={onSubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-heading">Your Name</label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      className="mt-2 w-full rounded-lg border border-border px-4 py-2 text-sm text-text outline-none focus:ring-2 focus:ring-primary-light bg-background"
                      placeholder="Full Name"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-heading">Location</label>
                    <input
                      value={form.location}
                      onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                      className="mt-2 w-full rounded-lg border border-border px-4 py-2 text-sm text-text outline-none focus:ring-2 focus:ring-primary-light bg-background"
                      placeholder="City, Country"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-heading">Rating</label>
                    <div className="mt-2">
                      <StarPicker value={form.rating} onChange={(v) => setForm((f) => ({ ...f, rating: v }))} />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-heading">Share your opinions about us</label>
                    <textarea
                      value={form.review_text}
                      onChange={(e) => setForm((f) => ({ ...f, review_text: e.target.value }))}
                      rows={4}
                      className="mt-2 w-full rounded-lg border border-border px-4 py-2 text-sm text-text outline-none focus:ring-2 focus:ring-primary-light bg-background resize-none"
                      placeholder="Write your review..."
                      disabled={isSubmitting}
                    />
                  </div>

                  {formError && <div className="text-sm font-semibold text-primary">{formError}</div>}
                  {success && <div className="text-sm font-semibold text-success">{success}</div>}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-lg bg-primary text-white py-3 font-extrabold hover:bg-primary-hover transition cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? "Sending..." : "Send Reviews"}
                  </button>
                </form>
              </div>
            </FadeIn>
          </div>

          <div className="mt-14 pt-6 border-t border-border">
            <FadeIn>
              <div className="text-center">
                <div className="font-headings text-sm text-primary">Approved Reviews</div>
                <div className="mt-2 section-heading text-heading">What learners say</div>
              </div>
            </FadeIn>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              {loading ? (
                <>
                  <TestimonialCardSkeleton />
                  <TestimonialCardSkeleton />
                </>
              ) : error ? (
                <div className="col-span-full text-center py-10">
                  <div className="text-primary font-medium mb-4">{error}</div>
                  <button
                    type="button"
                    onClick={() => {
                      setError('');
                      setLoading(true);
                      apiService.get('/reviews')
                        .then((res) => { setReviews(res.data.data ?? []); setLoading(false); })
                        .catch((err) => { setError(err.response?.data?.message ?? 'Failed to load.'); setLoading(false); });
                    }}
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-hover transition cursor-pointer">
                    Retry
                  </button>
                </div>
              ) : reviews.length ? (
                reviews.slice(0, 4).map((r, i) => {
                  const isLongText = r.review_text && r.review_text.length > 100;
                  const initials = r.name ? r.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '?';
                  const shortText = isLongText ? r.review_text.slice(0, 100).trim() : r.review_text;

                  return (
                    <FadeIn key={i} delay={i * 100}>
                      <div className="bg-background border border-border rounded-lg p-6 flex flex-col justify-between w-full min-w-0 h-full">
                        <div>
                          <div className="flex items-center gap-3 w-full min-w-0">
                            {/* Visual circle matching design criteria exactly */}
                            <div className="w-12 h-12 rounded-full bg-primary-light/40 border border-primary/20 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                              <span className="text-sm font-extrabold text-primary select-none tracking-wider">
                                {initials}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-bold text-heading truncate">{r.name}</div>
                              <div className="text-xs text-muted truncate">{r.location}</div>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex items-center gap-1.5 text-warning">
                            {Array.from({ length: 5 }).map((_, starIndex) => (
                              <span key={starIndex} aria-hidden="true" className="text-lg leading-none select-none">
                                {starIndex < Math.round(r.rating) ? '★' : '☆'}
                              </span>
                            ))}
                          </div>
                          
                          <div className="mt-4 text-text small-text body-text break-words w-full italic">
                            <span className="inline">
                              &ldquo;{shortText}
                            </span>
                            {isLongText ? (
                              <span className="inline">
                                ...{" "}
                                <button
                                  type="button"
                                  onClick={() => setDetail(r)}
                                  className="inline text-xs font-bold text-primary hover:text-primary-hover hover:underline transition cursor-pointer not-italic select-none p-0 bg-transparent border-none outline-none">
                                  Read more
                                </button>
                                &rdquo;
                              </span>
                            ) : (
                              <span className="inline">&rdquo;</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </FadeIn>
                  );
                })
              ) : (
                <div className="col-span-full text-center text-muted py-10 font-medium">
                  No approved reviews yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <TrustStatistics />
      <LogoMarquee bg="bg-background" />
      <FinalCTA />

      <DetailModal
        open={!!detail}
        onClose={() => setDetail(null)}
        image=""
        imageVariant="avatar"
        title={detail?.name || ""}
        initials={
          detail?.name
            ? detail.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
            : "?"
        }
        tags={modalTags}
        rating={detail?.rating}
        description={detail?.review_text || ""}
      />
    </div>
  );
}