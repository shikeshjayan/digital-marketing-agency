// Testimonials page — submit a review and view approved reviews
import { useEffect, useState } from 'react'
import HeroSplit from '../../components/public/HeroSplit.jsx'
import ContactIcon from '../../components/ui/ContactIcon.jsx'
import ImagePlaceholder from '../../components/ui/ImagePlaceholder.jsx'
import { publicGetApprovedReviews, publicSubmitReview } from '../../services/mockApi.js'

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
            className={`text-2xl leading-none ${active ? 'text-yellow-500' : 'text-gray-300'} hover:text-yellow-400`}
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
  const [form, setForm] = useState({
    name: '',
    location: '',
    rating: 5,
    review_text: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    publicGetApprovedReviews().then((res) => setReviews(res.data ?? []))
  }, [])

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!form.name.trim() || !form.location.trim() || !form.review_text.trim()) {
      setError('Please fill the form completely.')
      return
    }
    const res = await publicSubmitReview(form)
    if (!res.success) {
      setError(res.error?.message ?? 'Failed to submit.')
      return
    }
    setSuccess('Thanks! Your review was submitted and is awaiting moderation.')
    setForm({ name: '', location: '', rating: 5, review_text: '' })
    // Approved list stays the same until admin approves; we still refresh to keep UI fresh.
    const latest = await publicGetApprovedReviews()
    setReviews(latest.data ?? [])
  }

  return (
    <div>
      <HeroSplit title="Testimonials" subtitle="Submit feedback and see approved reviews from our learners." leftColor="bg-gray-900" />

      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
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
                  <span className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                    <ContactIcon type="phone" className="text-white" />
                  </span>
                  <a className="hover:text-white" href="tel:+918891212323">
                    +91 8891212323
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                    <ContactIcon type="mail" className="text-white" />
                  </span>
                  <a className="hover:text-white" href="mailto:info@s.com">
                    info@s.com
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white border border-red-100 rounded-3xl p-6">
              <div>
                <div className="text-sm font-semibold text-red-700">Share Your Experience!</div>
                <div className="mt-1 text-2xl font-extrabold text-gray-900">Send Review</div>
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

                {error && <div className="text-sm text-red-600">{error}</div>}
                {success && <div className="text-sm text-green-600">{success}</div>}

                <button
                  type="submit"
                  className="w-full rounded-xl bg-red-600 text-white py-3 font-extrabold hover:bg-orange-500 transition"
                >
                  Send Reviews
                </button>
              </form>
            </div>
          </div>

          <div className="mt-10">
            <div className="text-center">
              <div className="text-sm font-semibold text-red-700">Approved Reviews</div>
              <div className="mt-2 text-2xl font-extrabold text-gray-900">What learners say</div>
            </div>

            <div className="mt-7 grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.length ? (
                reviews.slice(0, 4).map((r) => (
                  <div key={r.review_id} className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
                        <ImagePlaceholder compact />
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
                ))
              ) : (
                <div className="text-center text-gray-600">No approved reviews yet.</div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


