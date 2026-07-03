import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhone, faEnvelope, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'
import HeroSplit from '../../components/public/HeroSplit.jsx'
import FadeIn from '../../components/ui/FadeIn.jsx'
import AnimatedCounter from '../../components/ui/AnimatedCounter.jsx'
import { TestimonialCardSkeleton } from '../../components/ui/Skeleton.jsx'
import apiService from '../../services/apiService.js'

function StarPicker({ value, onChange }) {
  return (
    <div className="flex items-center gap-1 text-amber-500">
      {Array.from({ length: 5 }).map((_, i) => {
        const v = i + 1
        const active = v <= value
        return (
          <button
            key={v}
            type="button"
            className={`text-2xl leading-none cursor-pointer transition-colors duration-150 ${active ? 'text-amber-500' : 'text-gray-300'} hover:text-amber-400`}
            onClick={() => onChange(v)}
            aria-label={`Set rating to ${v}`}
          >
            ★
          </button>
        )
      })}
    </div>
  )
}

/* ─── Section: Trust Statistics ────────────────────────────── */
function TrustStatistics() {
  const stats = [
    { target: 8, suffix: "+", label: "Years of Experience" },
    { target: 500, suffix: "+", label: "Projects Completed" },
    { target: 500, suffix: "+", label: "Satisfied Clients" },
  ];

  return (
    <section className="bg-surface py-12">
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
                <h3 className="mt-4 text-3xl font-extrabold text-heading">
                  Why teams trust us
                </h3>
                <p className="mt-3 text-text leading-relaxed">
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

/* ─── Section: Success Stories (Carousel) ─────────────────── */
function SuccessStories({ reviews, loading }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reviews.length === 0 || paused) return;
    const t = setInterval(
      () => setIndex((v) => (v + 1) % reviews.length),
      3000,
    );
    return () => clearInterval(t);
  }, [reviews.length, paused]);

  if (loading) {
    return (
      <section className="py-12 bg-background">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center">
            <div className="h-8 w-48 bg-gray-200 rounded mx-auto animate-pulse" />
          </div>
          <div className="mt-8 flex justify-center">
            <div className="w-full max-w-xl border border-border rounded-lg px-6 py-8 bg-surface text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-gray-200 animate-pulse ring-2 ring-gray-300 ring-offset-2" />
              <div className="mt-4 h-4 w-24 bg-gray-200 rounded mx-auto animate-pulse" />
              <div className="mt-2 h-3 w-16 bg-surface rounded mx-auto animate-pulse" />
              <div className="mt-4 space-y-2">
                <div className="h-3 w-full bg-surface rounded animate-pulse" />
                <div className="h-3 w-3/4 bg-surface rounded mx-auto animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!reviews.length) return null;
  const current = reviews[index];

  return (
    <section
      className="py-12 bg-background"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}>
      <div className="max-w-5xl mx-auto px-4">
        <FadeIn>
          <div className="text-center">
            <div className="font-cursive text-4xl text-primary">Success</div>
            <h2 className="mt-2 text-3xl font-extrabold text-heading">
              Stories That Inspire
            </h2>
          </div>
        </FadeIn>

        <div className="mt-8 flex justify-center">
          <div className="w-full max-w-6xl border border-border rounded-lg px-6 py-8 bg-surface text-center">
            <div className="mx-auto w-16 h-16 rounded-full overflow-hidden ring-2 ring-primary ring-offset-2 flex items-center justify-center shadow-md">
              <div className="w-full h-full items-center justify-center text-lg font-bold text-primary-hover flex">
                {current.name
                  ?.split(" ")
                  .map((w) => w[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2) || "?"}
              </div>
            </div>
            <div className="mt-4 font-bold text-heading">{current.name}</div>
            <div className="text-sm text-muted">{current.location}</div>
            <p className="mt-4 text-gray-700 leading-relaxed">
              "{current.review_text}"
            </p>
            <div className="mt-4 flex items-center justify-center gap-1 text-amber-500">
              {Array.from({ length: 5 }).map((_, starIndex) => (
                <span key={starIndex} aria-hidden="true" className="text-lg leading-none select-none">
                  {starIndex < Math.round(current.rating) ? '★' : '☆'}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-5">
          {reviews.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`w-2.5 h-2.5 rounded-full transition cursor-pointer ${
                i === index ? "bg-primary" : "bg-primary-light hover:bg-primary-hover"
              }`}
              onClick={() => setIndex(i)}
              aria-label={`Go to story ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Section: Client Logos ───────────────────────────────── */
function ClientLogos() {
  const logos = [
    "HR Consultancy",
    "Selfy LinguaTrainer",
    "Rising Moon",
    "StepUp",
    "Tymos",
    "BrightPath",
    "NovaTech",
    "Zenith Solutions",
    "CloudBridge",
    "PixelCraft",
    "SwiftWave",
    "BlueVista",
    "IronPeak",
    "GreenLeaf",
    "SkyPulse",
  ];

  return (
    <section className="bg-surface py-10">
      <div className="text-center py-6 px-6">
        <FadeIn>
          <h2 className="font-bold text-heading text-3xl">
            Trusted by teams who value quality
          </h2>
          <p className="mt-2 text-sm text-text">
            We deliver measurable results with transparent workflows.
          </p>
        </FadeIn>
      </div>

      <div className="overflow-hidden py-6">
        <div className="logo-marquee">
          {[...logos, ...logos].map((logo, index) => (
            <span
              key={index}
              className="inline-flex items-center px-8 whitespace-font tracking-wider font-extrabold text-muted hover:text-primary transition-colors duration-300 text-sm md:text-xl uppercase cursor-default select-none">
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Section: Final CTA ──────────────────────────────────── */
function FinalCTA() {
  const navigate = useNavigate();

  return (
    <section className="bg-dark py-16">
      <FadeIn>
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-extrabold">
            Ready to Grow Your Business?
          </h2>
          <p className="mt-4 text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Let's discuss how our digital marketing expertise can help you
            achieve your goals. Get in touch with us today for a free
            consultation.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              className="inline-flex items-center rounded-lg bg-primary text-white px-6 py-3 text-sm font-semibold hover:bg-primary-hover transition cursor-pointer"
              onClick={() => navigate("/contact")}>
              Contact Us
            </button>
            <Link
              to="/services"
              className="inline-flex items-center rounded-lg border border-white text-white px-6 py-3 text-sm font-semibold hover:bg-white/10 transition">
              View Services
            </Link>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}

export default function Testimonials() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    location: '',
    rating: 5,
    review_text: '',
  })
  const [formError, setFormError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    setLoading(true)
    apiService.get('/reviews')
      .then((res) => {
        setReviews(res.data.data ?? [])
        setLoading(false)
      })
      .catch((err) => {
        setError(err.response?.data?.message ?? 'Failed to load reviews.')
        setLoading(false)
      })
  }, [])

  async function onSubmit(e) {
    e.preventDefault()
    setFormError('')
    setSuccess('')

    if (!form.name.trim() || !form.location.trim() || !form.review_text.trim()) {
      setFormError('Please fill the form completely.')
      return
    }
    try {
      const res = await apiService.post('/reviews/submit', form)
      if (!res.data.success) {
        setFormError(res.data.error?.message ?? 'Failed to submit.')
        return
      }
      setSuccess('Thanks! Your review was submitted and is awaiting moderation.')
      toast.success('Thanks! Your review was submitted and is awaiting moderation.')
      setForm({ name: '', location: '', rating: 5, review_text: '' })
      const latest = await apiService.get('/reviews')
      setReviews(latest.data.data ?? [])
    } catch (err) {
      const msg = err.response?.data?.message ?? 'Failed to submit.'
      setFormError(msg)
      toast.error(msg)
    }
  }

  return (
    <div className="bg-background min-h-screen">
      <HeroSplit title="Testimonials" titleHighlight=" " subtitle="Submit feedback and see approved reviews from our learners." leftColor="bg-dark" />

      <section className="py-14 bg-surface">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            
            {/* Sidebar Branding Meta Banner Block */}
            <FadeIn direction="left">
              <div className="bg-dark text-white rounded-lg p-8 relative overflow-hidden">
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

                {/* Synced directly with requested FontAwesome icons and metadata definitions */}
                <div className="mt-6 space-y-2 text-sm text-gray-200 border-t border-white/10 pt-6">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-8 rounded-lg bg-dark/10 flex items-center justify-center text-xs text-gray-300">
                      <FontAwesomeIcon icon={faPhone} />
                    </span>
                    <a href="tel:+91 8891212323" className="text-gray-200 hover:text-primary transition-colors">
                      +91 8891212323
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-8 rounded-lg bg-dark/10 flex items-center justify-center text-xs text-gray-300">
                      <FontAwesomeIcon icon={faEnvelope} />
                    </span>
                    <a href="mailto:crowlcrown@gmail.com" className="text-gray-200 hover:text-primary transition-colors">
                      crowlcrown@gmail.com
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-8 rounded-lg bg-dark/10 flex items-center justify-center text-xs text-gray-300">
                      <FontAwesomeIcon icon={faMapMarkerAlt} />
                    </span>
                    <a href="http://map.google.com" target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-primary transition-colors">
                      Ernakulam, Kochi, Kerala, India
                    </a>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Review Submission Content Interactive Form Frame Block */}
            <FadeIn direction="right">
              <div className="bg-background border border-border rounded-lg p-6">
                <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
                  <div>
                    <div className="text-xs font-bold tracking-wider uppercase text-primary">SHARE YOUR EXPERIENCE!</div>
                    <div className="mt-1 text-2xl font-extrabold text-heading">Send Review</div>
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
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-heading">Location</label>
                    <input
                      value={form.location}
                      onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                      className="mt-2 w-full rounded-lg border border-border px-4 py-2 text-sm text-text outline-none focus:ring-2 focus:ring-primary-light bg-background"
                      placeholder="City, Country"
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
                    />
                  </div>

                  {formError && <div className="text-sm font-semibold text-primary">{formError}</div>}
                  {success && <div className="text-sm font-semibold text-success">{success}</div>}

                  <button
                    type="submit"
                    className="w-full rounded-lg bg-primary text-white py-3 font-extrabold hover:bg-primary-hover transition cursor-pointer"
                  >
                    Send Reviews
                  </button>
                </form>
              </div>
            </FadeIn>
          </div>

          {/* Render Feed Display Grid Panels */}
          <div className="mt-14 pt-6 border-t border-border">
            <FadeIn>
              <div className="text-center">
                <div className="font-cursive text-4xl text-primary">Approved Reviews</div>
                <div className="mt-2 text-3xl font-extrabold text-heading">What learners say</div>
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
                      setError('')
                      setLoading(true)
                      apiService.get('/reviews')
                        .then((res) => { setReviews(res.data.data ?? []); setLoading(false) })
                        .catch((err) => { setError(err.response?.data?.message ?? 'Failed to load.'); setLoading(false) })
                    }}
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-hover transition cursor-pointer">
                    Retry
                  </button>
                </div>
              ) : reviews.length ? (
                reviews.slice(0, 4).map((r, i) => (
                  <FadeIn key={i} delay={i * 100}>
                    <div className="bg-background border border-border rounded-lg p-6 flex flex-col w-full min-w-0">
                      <div className="flex items-center gap-3 w-full min-w-0">
                        <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center shrink-0">
                          <span className="text-sm font-bold text-muted select-none">
                            {r.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?'}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-heading truncate">{r.name}</div>
                          <div className="text-xs text-muted truncate">{r.location}</div>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex items-center gap-1.5 text-amber-500">
                        {Array.from({ length: 5 }).map((_, starIndex) => (
                          <span key={starIndex} aria-hidden="true" className="text-lg leading-none select-none">
                            {starIndex < Math.round(r.rating) ? '★' : '☆'}
                          </span>
                        ))}
                      </div>
                      
                      <p className="mt-4 text-text text-sm leading-relaxed break-words w-full italic">
                        "{r.review_text}"
                      </p>
                    </div>
                  </FadeIn>
                ))
              ) : (
                <div className="col-span-full text-center text-muted py-10 font-medium">
                  No approved reviews yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <SuccessStories reviews={reviews} loading={loading} />

      <TrustStatistics />

      <ClientLogos />

      <FinalCTA />
    </div>
  )
}