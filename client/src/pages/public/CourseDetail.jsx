import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import HeroSplit from '../../components/public/HeroSplit.jsx'
import Button from '../../components/ui/Button.jsx'
import useCourseStore from '../../store/courseStore.js'

export default function CourseDetail() {
  const { slug } = useParams()
  const { courseBySlug, loading, error, fetchCourseBySlug } = useCourseStore()

  useEffect(() => {
    fetchCourseBySlug(slug)
  }, [slug, fetchCourseBySlug])

  const course = courseBySlug

  if (loading) {
    return (
      <div>
        <HeroSplit
          title="Course"
          titleHighlight="Our"
          subtitle="Course details"
        />
        <section className="py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-10">
              <div className="animate-pulse space-y-4">
                <div className="h-8 w-64 bg-gray-200 rounded" />
                <div className="h-4 w-full bg-gray-100 rounded" />
                <div className="h-4 w-3/4 bg-gray-100 rounded" />
                <div className="h-4 w-1/2 bg-gray-100 rounded" />
              </div>
            </div>
          </div>
        </section>
      </div>
    )
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
              {error && <p className="text-red-500 mb-4">{error}</p>}
              <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-4 text-gray-500">No course found for this URL.</p>
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

  return (
    <div>
      <HeroSplit
        title="Course"
        titleHighlight="Details"
        subtitle={course.course_name}
      />

      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">{course.course_name}</h2>
            <p className="mt-4 text-gray-700 leading-relaxed text-justify">
              {course.description}
            </p>
            {course.category && (
              <p className="mt-4 text-sm text-gray-500">Category: {course.category}</p>
            )}

            <div className="mt-8">
              <Button as="a" href="/contact" variant="primary">
                Enquire Now
              </Button>
            </div>
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
