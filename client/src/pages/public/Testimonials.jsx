import { useEffect, useState } from 'react'
import HeroSplit from '../../components/public/HeroSplit.jsx'
import useReviewStore from '../../store/reviewStore.js'

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
            className="text-2xl leading-none text-gray-300 hover:text-yellow-400 transition cursor-pointer"
            style={{ color: active ? '#f59e0b' : '#d1d5db' }}
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
  const store = useReviewStore()
  
  const reviews = store.reviews ?? []
  const storeError = store.error ?? null
  const storeSuccess = store.success ?? false
  const submitReview = store.submitReview
  
  // Dynamic fetch detector based on your reviewStore configurations
  const fetchMethod = store.fetchApprovedReviews || store.fetchReviews || (() => {})

  // Separate form states from global fetching states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: '',
    location: '',
    rating: 5,
    review_text: '',
  })
  const [localError, setLocalError] = useState('')

  // Clean state when entering or reloading this page view
  useEffect(() => {
    if (store.reset) {
      store.reset()
    } else {
      useReviewStore.setState({ loading: false, error: null, success: false })
    }
    fetchMethod()
  }, [fetchMethod])

  async function onSubmit(e) {
    e.preventDefault()
    setLocalError('')
    setIsSubmitting(true) // Triggers local button state only on form submission click
    if (store.reset) store.reset()

    if (!form.name.trim() || !form.location.trim() || !form.review_text.trim()) {
      setLocalError('Please fill the form completely.')
      setIsSubmitting(false)
      return
    }

    if (submitReview) {
      await submitReview({
        name: form.name.trim(),
        location: form.location.trim(),
        rating: form.rating,
        review_text: form.review_text.trim(),
      })
    }
    setIsSubmitting(false) // Turns off loading text safely right after submission finishes
  }

  // Clear form fields cleanly upon verified store submission success
  useEffect(() => {
    if (storeSuccess) {
      setForm({ name: '', location: '', rating: 5, review_text: '' })
    }
  }, [storeSuccess])

  return (
    <div>
      <HeroSplit title="Testimonials" titleHighlight=" " subtitle="Submit feedback and see approved reviews from our learners." leftColor="bg-gray-900" />

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
                  <span className="w-10 h-8 rounded-xl bg-white/10 flex items-center justify-center text-xs text-gray-300 font-semibold">Ph</span>
                  <span className="text-gray-200">
                    +91 8891212323
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-10 h-8 rounded-xl bg-white/10 flex items-center justify-center text-xs text-gray-300 font-semibold">Mail</span>
                  <span className="text-gray-200">
                    info@s.com
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-red-100 rounded-3xl p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-red-700">Share Your Experience!</div>
                  <div className="mt-1 text-2xl font-extrabold text-gray-900">Send Review</div>
                </div>
              </div>

              <form onSubmit={onSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-800">Your Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100"
                    placeholder="Full Name"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-800">Location</label>
                  <input
                    value={form.location}
                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100"
                    placeholder="City, Country"
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  />
                </div>

                {(localError || storeError) && <div className="text-sm text-red-600">{localError || storeError}</div>}
                {storeSuccess && <div className="text-sm text-green-600">Thanks! Your review has been submitted successfully for approval.</div>}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-red-600 text-white py-3 font-extrabold hover:bg-red-500 transition cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </form>
            </div>
          </div>

          <div className="mt-14">
            <div className="text-center">
              <div className="text-2xl font-extrabold text-gray-900">Reviews</div>
            </div>

            <div className="mt-7 grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.length ? (
                reviews.slice(0, 4).map((r) => {
                  const initial = r.name ? r.name.trim().charAt(0).toUpperCase() : 'U';
                  const safeRating = Math.min(5, Math.max(1, Math.round(r.rating || 5)));
                  
                  return (
                    <div key={r._id || r.review_id} className="group rounded-3xl border border-gray-200 bg-white hover:bg-gray-50 p-6 transition duration-300 shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 text-red-700 font-extrabold flex items-center justify-center text-sm font-mono">
                            {initial}
                          </div>
                          <div>
                            <div className="font-extrabold text-gray-900 tracking-tight">{r.name}</div>
                            <div className="text-xs font-semibold text-gray-400 mt-0.5">{r.location}</div>
                          </div>
                        </div>

                        <p className="mt-4 text-gray-600 text-sm leading-relaxed italic">
                          "{r.review_text}"
                        </p>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
                        <div className="flex items-center text-yellow-500 text-sm">
                          {'★'.repeat(safeRating)}
                          {'☆'.repeat(5 - safeRating)}
                        </div>
                        <span className="text-xs font-bold text-gray-400">({r.rating || 5}.0 / 5)</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-1 md:col-span-2 text-center text-gray-500 py-6 font-medium">
                  No reviews yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}