import { useEffect, useState } from 'react'
import HeroSplit from '../../components/public/HeroSplit.jsx'
import FadeIn from '../../components/ui/FadeIn.jsx'
import { TestimonialCardSkeleton } from '../../components/ui/Skeleton.jsx'
import apiService from '../../services/apiService.js'

function StarPicker({ value, onChange }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const v = i + 1
        const active = v <= value
        return (
          <button
            key={v}
            type="button"
            className={`text-2xl leading-none cursor-pointer ${active ? 'text-yellow-500' : 'text-gray-300'} hover:text-yellow-400`}
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
      setForm({ name: '', location: '', rating: 5, review_text: '' })
      const latest = await apiService.get('/reviews')
      setReviews(latest.data.data ?? [])
    } catch (err) {
      setFormError(err.response?.data?.message ?? 'Failed to submit.')
    }
  }

  const approvedCount = reviews.length

  return (
    <div>
      <HeroSplit title="Testimonials" titleHighlight=" " subtitle="Submit feedback and see approved reviews from our learners." leftColor="bg-gray-900" />

      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <FadeIn direction="left">
              <div className="bg-black text-white rounded-3xl p-8">
                <div className="text-sm font-semibold text-red-400">We value your feedback?</div>
                <div className="mt-3 text-3xl font-extrabold">
                  <span className="text-red-500">Review</span> That Inspires
                </div>
                <p className="mt-4 text-gray-300 leading-relaxed">
                  Tell us about your experience. Your review helps future learners make confident decisions.
                </p>

                <div className="mt-6 space-y-2 text-sm text-gray-200">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">☎</span>
                    <a className="hover:text-white cursor-pointer" href="tel:+91 8891212323">
                      +91 8891212323
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">✉</span>
                    <a className="hover:text-white cursor-pointer" href="mailto:info@s.com">
                      info@s.com
                    </a>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="right">
              <div className="bg-white border border-red-100 rounded-3xl p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-red-700">Share Your Experience!</div>
                    <div className="mt-1 text-2xl font-extrabold text-gray-900">Send Review</div>
                  </div>
                  <div className="text-xs text-gray-500">Approved: {approvedCount}</div>
                </div>

                <form onSubmit={onSubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-800">Your Name</label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100"
                      placeholder="Full Name"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-800">Location</label>
                    <input
                      value={form.location}
                      onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                      className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100"
                      placeholder="City, Country"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-800">Rating</label>
                    <div className="mt-2">
                      <StarPicker value={form.rating} onChange={(v) => setForm((f) => ({ ...f, rating: v }))} />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-800">Share your opinions about us</label>
                    <textarea
                      value={form.review_text}
                      onChange={(e) => setForm((f) => ({ ...f, review_text: e.target.value }))}
                      rows={4}
                      className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100 resize-none"
                      placeholder="Write your review..."
                    />
                  </div>

                  {formError && <div className="text-sm text-red-600">{formError}</div>}
                  {success && <div className="text-sm text-green-600">{success}</div>}

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-red-600 text-white py-3 font-extrabold hover:bg-red-500 transition cursor-pointer"
                  >
                    Send Reviews
                  </button>
                </form>
              </div>
            </FadeIn>
          </div>

          <div className="mt-10">
            <FadeIn>
              <div className="text-center">
                <div className="text-sm font-semibold text-red-700">Approved Reviews</div>
                <div className="mt-2 text-2xl font-extrabold text-gray-900">What learners say</div>
              </div>
            </FadeIn>

            <div className="mt-7 grid grid-cols-1 md:grid-cols-2 gap-6">
              {loading ? (
                <>
                  <TestimonialCardSkeleton />
                  <TestimonialCardSkeleton />
                </>
              ) : error ? (
                <div className="col-span-full text-center">
                  <div className="text-red-500 mb-4">{error}</div>
                  <button
                    type="button"
                    onClick={() => {
                      setError('')
                      setLoading(true)
                      apiService.get('/reviews')
                        .then((res) => { setReviews(res.data.data ?? []); setLoading(false) })
                        .catch((err) => { setError(err.response?.data?.message ?? 'Failed to load.'); setLoading(false) })
                    }}
                    className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition cursor-pointer">
                    Retry
                  </button>
                </div>
              ) : reviews.length ? (
                reviews.slice(0, 4).map((r, i) => (
                  <FadeIn key={i} delay={i * 100}>
                    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-gray-600">
                          {r.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?'}
                        </span>
                      </div>
                      <div>
                        <div className="font-extrabold text-gray-900">{r.name}</div>
                        <div className="text-sm text-gray-500">{r.location}</div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center gap-2 text-yellow-500">
                        <span className="font-extrabold">{r.rating}.0</span>
                        <span aria-hidden="true">{'★'.repeat(Math.round(r.rating))}</span>
                      </div>
                    </div>
                    <p className="mt-4 text-gray-700 leading-relaxed">"{r.review_text}"</p>
                  </div>
                  </FadeIn>
                ))
              ) : (
                <div className="col-span-full text-center text-gray-600">No approved reviews yet.</div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
