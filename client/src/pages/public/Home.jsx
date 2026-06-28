import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight, faStar } from '@fortawesome/free-solid-svg-icons'
import { serviceDetailPath } from '../../data/serviceLinks.js'
import AnimatedCounter from '../../components/ui/AnimatedCounter.jsx'
import useServiceStore from '../../store/serviceStore.js'
import useReviewStore from '../../store/reviewStore.js'

function StarRow({ rating }) {
  const full = Math.floor(rating)
  return (
    <div className="flex items-center gap-1 text-yellow-500">
      {Array.from({ length: 5 }).map((_, i) => (
        <FontAwesomeIcon key={i} icon={faStar} className={i < full ? 'text-yellow-500' : 'text-gray-300'} aria-hidden="true" />
      ))}
    </div>
  )
}

function HeroCarousel() {
  const slides = useMemo(
    () => [
      {
        subheading: 'Your brand, built to convert.',
        description:
          'Web development, marketing, and content designed to help you grow with measurable results.',
      },
      {
        subheading: 'Digital experiences that feel premium.',
        description:
          'From landing pages to full sites, we craft responsive UI and performance-first solutions.',
      },
    ],
    [],
  )

  const [index, setIndex] = useState(0)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((v) => (v + 1) % slides.length)
    }, 5000)
    return () => clearInterval(t)
  }, [slides.length])

  function go(next) {
    if (animating) return
    setAnimating(true)
    setIndex(next)
    window.setTimeout(() => setAnimating(false), 450)
  }

  return (
    <section className="bg-red-600 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-lg rotate-12" />
        <div className="absolute top-24 left-24 w-24 h-24 bg-white/10 rounded-lg rotate-12" />
        <div className="absolute bottom-10 right-16 w-20 h-20 bg-white/10 rounded-lg rotate-12" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {slides.map((s, i) => (
                <div key={i} className="min-w-full p-8 md:p-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="relative">
                      <div className="w-full max-w-sm mx-auto md:mx-0 aspect-4/3 flex items-center justify-center">
                        <div className="text-white/90 text-center">
                         <img src="/undraw_mobile-marketing_7x7m.svg" alt="" />
                        </div>
                      </div>
                    </div>
                    <div className="text-white">
                      <div className="text-sm font-semibold tracking-wide">DIGITAL MARKETING AGENCY</div>
                      <h2 className="mt-3 text-3xl md:text-4xl font-extrabold leading-tight">
                        {s.subheading}
                      </h2>
                      <p className="mt-4 text-white/90 leading-relaxed max-w-prose">{s.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-3 md:px-6 pointer-events-none">
            <button
              type="button"
              className="pointer-events-auto w-10 h-10 rounded-full bg-white/15 border border-white/20 hover:bg-white/25 text-white flex items-center justify-center cursor-pointer"
              onClick={() => go((index - 1 + slides.length) % slides.length)}
              aria-label="Previous slide"
            >
              <FontAwesomeIcon icon={faAngleLeft} />
            </button>
            <button
              type="button"
              className="pointer-events-auto w-10 h-10 rounded-full bg-white/15 border border-white/20 hover:bg-white/25 text-white flex items-center justify-center cursor-pointer"
              onClick={() => go((index + 1) % slides.length)}
              aria-label="Next slide"
            >
              <FontAwesomeIcon icon={faAngleRight} />
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 mt-4">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`w-2.5 h-2.5 rounded-full transition cursor-pointer ${
                  i === index ? 'bg-white' : 'bg-white/40 hover:bg-white/70'
                }`}
                onClick={() => go(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesCarousel({ services }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchRef = useRef(null)

  useEffect(() => {
    if (services.length === 0 || paused) return
    const t = setInterval(() => {
      setIndex((v) => (v + 1) % services.length)
    }, 3500)
    return () => clearInterval(t)
  }, [services.length, paused])

  function go(next) {
    setIndex(next)
  }

  const handleTouchStart = useCallback((e) => {
    touchRef.current = e.touches[0].clientX
  }, [])

  const handleTouchEnd = useCallback(
    (e) => {
      if (touchRef.current === null) return
      const diff = touchRef.current - e.changedTouches[0].clientX
      const threshold = 50
      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          go((index + 1) % services.length)
        } else {
          go((index - 1 + services.length) % services.length)
        }
      }
      touchRef.current = null
    },
    [index, services.length],
  )

  if (services.length === 0) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-10 md:px-10">
              <div className="animate-pulse space-y-4">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-6 w-64 bg-gray-200 rounded" />
                <div className="h-16 w-full max-w-xl bg-gray-200 rounded" />
                <div className="h-10 w-28 bg-gray-200 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const current = services[index];

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="relative">
          <div className="relative">
            <div
              className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden touch-pan-y"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}>
              <div className="px-6 py-10 md:px-10">
                <div className="flex items-stretch gap-6">
                  <div className="hidden md:flex items-center justify-center">
                    <div className="w-24 h-24 rounded-3xl flex items-center justify-center">
                      <div className="text-8xl font-extrabold text-gray-300">
                        {index + 1}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <div className="text-sm text-gray-500">Featured Service</div>
                    <h3 className="mt-2 text-2xl font-extrabold text-gray-900">
                      {current.service_name.split(" ").slice(0, 2).join(" ")}{" "}
                      <span className="text-red-700">
                        {current.service_name.split(" ").slice(2).join(" ")}
                      </span>
                    </h3>
                    <p className="mt-3 text-gray-600 leading-relaxed max-w-xl line-clamp-3 mx-auto md:mx-0">
                      {current.description}
                    </p>
                    <div className="mt-6 flex items-center justify-center md:justify-start gap-3">
                      <button
                        type="button"
                        className="md:hidden w-10 h-10 rounded-full bg-gray-100 border border-gray-200 hover:bg-gray-200 flex items-center justify-center cursor-pointer"
                        onClick={() =>
                          go((index - 1 + services.length) % services.length)
                        }
                        aria-label="Previous service">
                        <FontAwesomeIcon icon={faAngleLeft} className="text-sm" />
                      </button>
                      <Link
                        to={serviceDetailPath(current.service_name)}
                        className="inline-flex items-center rounded-full bg-red-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-red-500 transition cursor-pointer">
                        Read More
                      </Link>
                      <button
                        type="button"
                        className="md:hidden w-10 h-10 rounded-full bg-gray-100 border border-gray-200 hover:bg-gray-200 flex items-center justify-center cursor-pointer"
                        onClick={() => go((index + 1) % services.length)}
                        aria-label="Next service">
                        <FontAwesomeIcon icon={faAngleRight} className="text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden md:block absolute left-0 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10">
              <button
                type="button"
                className="w-12 h-12 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 flex items-center justify-center cursor-pointer"
                onClick={() =>
                  go((index - 1 + services.length) % services.length)
                }
                aria-label="Previous service">
                <FontAwesomeIcon icon={faAngleLeft} />
              </button>
            </div>
            <div className="hidden md:block absolute right-0 translate-x-1/2 top-1/2 -translate-y-1/2 z-10">
              <button
                type="button"
                className="w-12 h-12 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 flex items-center justify-center cursor-pointer"
                onClick={() => go((index + 1) % services.length)}
                aria-label="Next service">
                <FontAwesomeIcon icon={faAngleRight} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mt-6">
            {services.map((s, i) => (
              <button
                key={s._id}
                type="button"
                className={`w-2.5 h-2.5 rounded-full transition cursor-pointer ${
                  i === index ? "bg-red-700" : "bg-red-200 hover:bg-red-400"
                }`}
                onClick={() => go(i)}
                aria-label={`Go to service ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const techItems = [
  { name: 'WordPress', code: 'WP' },
  { name: 'Angular', code: 'AG' },
  { name: 'HTML5', code: 'H5' },
  { name: 'CSS3', code: 'C3' },
  { name: 'Bootstrap', code: 'BS' },
  { name: 'jQuery', code: 'JQ' },
  { name: 'PHP', code: 'PH' },
]

function TechnologyStack() {
  return (
    <section className="bg-red-600 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center text-white">
          <div className="font-cursive text-4xl">Our</div>
          <h2 className="mt-2 text-4xl font-extrabold">Technology Stack</h2>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-6">
          {techItems.map((it) => (
            <div
              key={it.name}
              className="w-28 h-28 flex flex-col items-center justify-center text-white bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 hover:scale-110 transition-all duration-300 cursor-default"
              style={{ clipPath: 'polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)' }}
            >
              <div className="text-lg font-extrabold">{it.code}</div>
              <div className="mt-1 text-xs text-white/90 text-center max-w-[80px]">{it.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function LogoMarquee() {
  const logos = ['HR Consultancy', 'Selfy LinguaTrainer', 'Rising Moon', 'StepUp', 'Tymos']
  const loop = [...logos, ...logos, ...logos, ...logos]
  return (
    <section className="bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center border border-gray-200 rounded-3xl py-6 px-6 bg-white">
          <div className="font-bold text-gray-900">Trusted by teams who value quality</div>
          <div className="mt-2 text-sm text-gray-600">We deliver measurable results with transparent workflows.</div>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white py-6">
          <div className="logo-marquee">
            {loop.map((l, i) => (
              <a
                key={`${l}-${i}`}
                href="#"
                className="whitespace-nowrap text-gray-700 font-semibold hover:text-red-700 transition px-5 cursor-pointer"
                onClick={(e) => e.preventDefault()}
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function TestimonialsCarousel({ reviews }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reviews.length === 0) return
    const t = setInterval(() => setIndex((v) => (v + 1) % reviews.length), 3000)
    return () => clearInterval(t)
  }, [reviews.length])

  if (!reviews.length) return null
  const current = reviews[index]

  return (
    <section className="py-12 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            <span className="font-cursive text-red-700 pr-2">Feedback</span> That Speaks
          </h2>
        </div>

        <div className="mt-8 flex justify-center">
          <div className="w-full max-w-xl border border-gray-200 rounded-3xl px-6 py-8 bg-gray-50 text-center">
            <div className="mx-auto w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              <div className="text-2xl">
                <img src={current.profile_image} alt={current.name} />
              </div>
            </div>
            <div className="mt-4 font-bold text-gray-900">{current.name}</div>
            <div className="text-sm text-gray-500">{current.location}</div>
            <p className="mt-4 text-gray-700 leading-relaxed">"{current.review_text}"</p>
            <div className="mt-4">
              <StarRow rating={current.rating} />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-5">
          {reviews.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`w-2.5 h-2.5 rounded-full transition cursor-pointer ${
                i === index ? 'bg-red-700' : 'bg-red-200 hover:bg-red-400'
              }`}
              onClick={() => setIndex(i)}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function StatsSection() {
  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="flex flex-col items-center lg:items-start">
            <div className="w-full max-w-md">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-gray-200">
                <div className="w-2.5 h-2.5 rounded-full bg-red-600" />
                <span className="text-sm font-semibold text-gray-800">Innovation meets execution</span>
              </div>
              <h3 className="mt-4 text-3xl font-extrabold text-gray-900">Why teams trust us</h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                We combine design, engineering, and marketing strategy to deliver websites and campaigns that perform.
              </p>
              <div className="mt-6">
                <Link to="/about" className="inline-flex rounded-full bg-red-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-red-500 transition cursor-pointer">
                  Read More
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-3xl p-6 text-center shadow-sm">
              <div className="text-4xl font-extrabold text-gray-900">
                <AnimatedCounter target={8} suffix="+" />
              </div>
              <div className="mt-2 text-sm font-semibold text-gray-600">Years of Experience</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-3xl p-6 text-center shadow-sm">
              <div className="text-4xl font-extrabold text-gray-900">
                <AnimatedCounter target={500} suffix="+" />
              </div>
              <div className="mt-2 text-sm font-semibold text-gray-600">Projects Completed</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-3xl p-6 text-center shadow-sm">
              <div className="text-4xl font-extrabold text-gray-900">
                <AnimatedCounter target={500} suffix="+" />
              </div>
              <div className="mt-2 text-sm font-semibold text-gray-600">Satisfied Clients</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const { services, fetchServices } = useServiceStore()
  const { reviews, fetchReviews } = useReviewStore()
  const navigate = useNavigate()

  useEffect(() => {
    fetchServices()
    fetchReviews()
  }, [fetchServices, fetchReviews])

  return (
    <div>
      <HeroCarousel />
      <StatsSection />
      <ServicesCarousel services={services} />
      <TechnologyStack />
      <LogoMarquee />

      {/* Team teaser */}
      <section className="bg-black py-16 text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="text-4xl md:text-5xl font-extrabold">
            <span className="font-cursive text-red-500 pr-2">Meet</span> Our Team
          </div>
          <p className="mt-4 text-gray-300 max-w-2xl mx-auto leading-relaxed">
            A creative and technical team focused on delivering premium digital experiences.
          </p>
          <div className="mt-8">
            <button
              type="button"
              className="inline-flex items-center rounded-full bg-red-600 px-6 py-3 text-sm font-semibold hover:bg-red-500 transition cursor-pointer"
              onClick={() => navigate('/team')}
            >
              Read More
            </button>
          </div>
        </div>
      </section>

      <TestimonialsCarousel reviews={reviews} />
    </div>
  )
}

