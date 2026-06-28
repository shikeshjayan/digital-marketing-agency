import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import HeroSplit from '../../components/public/HeroSplit.jsx'
import Button from '../../components/ui/Button.jsx'
import useCourseStore from '../../store/courseStore.js'
import { coursePrograms } from '../../data/coursePrograms.js'
import imageUrl from '../../utils/imageUrl.js'

function ModuleList({ items }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-3 rounded-xl p-3 transition hover:bg-red-50"
        >
          <span className="mt-0.5 text-red-600 font-bold shrink-0" aria-hidden="true">
            ➜
          </span>
          <span className="text-gray-700 leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  )
}

export default function CourseDetail() {
  const { slug } = useParams()
  const { courseBySlug, loading, error, fetchCourseBySlug } = useCourseStore()

  useEffect(() => {
    fetchCourseBySlug(slug)
  }, [slug, fetchCourseBySlug])

  const program = courseBySlug ? coursePrograms[courseBySlug.slug] : null

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading...</div>
  }

  if (error || !courseBySlug) {
    return (
      <div>
        <HeroSplit
          title="Course"
          titleHighlight="Our"
          subtitle="Course details"
        />
        <section className="py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="bg-white border border-gray-200 rounded-3xl p-8 text-center">
              <p className="text-gray-500">No course found for this URL.</p>
            </div>
            <div className="mt-8">
              <Link
                to="/courses"
                className="inline-flex items-center rounded-full bg-red-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-red-500 transition cursor-pointer"
              >
                Back to Courses
              </Link>
            </div>
          </div>
        </section>
      </div>
    )
  }

  const course = courseBySlug

  return (
    <div>
      <HeroSplit
        title={program?.heroTitle ?? 'Course'}
        titleHighlight={program?.heroHighlight ?? 'Details'}
        subtitle={course.course_name}
      />

      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">{course.course_name}</h2>
            <p className="mt-4 text-gray-700 leading-relaxed text-justify">
              {program?.overview ?? course.description}
            </p>

            {program && (
              <div className="mt-8">
                <h3 className="text-lg font-extrabold text-gray-900">Who Can Join?</h3>
                <p className="mt-3 text-gray-700 leading-relaxed text-justify">{program.whoCanJoin}</p>
              </div>
            )}

            {program && (
              <div className="mt-8 text-center md:text-left">
                <p className="text-sm text-gray-600">Total course fee is</p>
                <p className="mt-1 text-3xl font-extrabold text-red-700">{program.fee}</p>
              </div>
            )}

            <div className="mt-8">
              <Button as="a" href="/contact" variant="primary">
                Enquire Now
              </Button>
            </div>
          </div>

          {program && (
            <section className="mt-10 bg-white border border-gray-200 rounded-3xl p-6 md:p-10">
              <h3 className="text-2xl font-extrabold text-gray-900">What You&apos;ll Learn</h3>
              <p className="mt-2 text-sm text-gray-600">Curriculum Framework</p>
              <div className="mt-6">
                <ModuleList items={program.modules} />
              </div>
            </section>
          )}

          {program && (
            <section className="mt-10 bg-white border border-gray-200 rounded-3xl p-6 md:p-10">
              <h3 className="text-2xl font-extrabold text-gray-900">Practical Training Approach</h3>
              <div className="mt-6 space-y-4 text-gray-700 leading-relaxed text-justify">
                {program.methodology.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </section>
          )}

          {!program && (
            <section className="mt-10 bg-white border border-gray-200 rounded-3xl p-6 md:p-10">
              <h3 className="text-2xl font-extrabold text-gray-900">About This Course</h3>
              <p className="mt-4 text-gray-700 leading-relaxed text-justify">{course.description}</p>
              {course.category && (
                <p className="mt-4 text-sm text-gray-500">Category: {course.category}</p>
              )}
            </section>
          )}

          <div className="mt-8">
            <Link
              to="/courses"
              className="inline-flex items-center rounded-full bg-red-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-red-500 transition cursor-pointer"
            >
              Back to Courses
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
