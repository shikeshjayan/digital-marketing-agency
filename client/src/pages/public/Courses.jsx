// Courses listing page — links to training program details
import { Link } from 'react-router-dom'
import HeroSplit from '../../components/public/HeroSplit.jsx'
import ImagePlaceholder from '../../components/ui/ImagePlaceholder.jsx'
import { courseDetailPath, courseList } from '../../data/coursePrograms.js'

function CourseCard({ course, index }) {
  const gradients = [
    'from-red-600/20 to-red-600/5',
    'from-orange-500/20 to-orange-500/5',
    'from-rose-500/20 to-rose-500/5',
  ]

  return (
    <Link
      to={courseDetailPath(course.slug)}
      className="group block bg-white border border-gray-100 rounded-3xl p-5 shadow-sm hover:shadow-md hover:border-red-100 transition"
    >
      <div
        className={`h-28 rounded-2xl border border-gray-100 bg-gradient-to-br ${gradients[index % gradients.length]} flex items-center justify-center`}
      >
        <ImagePlaceholder label="Image" />
      </div>
      <h3 className="mt-4 text-lg font-extrabold text-gray-900 group-hover:text-red-700 transition">{course.title}</h3>
      <p className="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-3">{course.short_description}</p>
      <div className="mt-4">
        <span className="inline-flex items-center rounded-full bg-red-600 text-white px-5 py-2.5 text-sm font-semibold group-hover:bg-orange-500 transition">
          Read More
        </span>
      </div>
    </Link>
  )
}

export default function Courses() {
  return (
    <div>
      <HeroSplit
        title="Courses"
        titleHighlight="Our"
        subtitle="Job-ready training programs with mentor support and practical execution."
      />

      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseList.map((course, index) => (
              <CourseCard key={course.slug} course={course} index={index} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
