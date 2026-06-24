// Single course detail page — modules, fee, and enquiry button
import { Link, useParams } from 'react-router-dom'
import HeroSplit from '../../components/public/HeroSplit.jsx'
import Button from '../../components/ui/Button.jsx'
import { coursePrograms, resolveCourseProgram } from '../../data/coursePrograms.js'

function ModuleList({ items }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-3 rounded-xl p-3 transition hover:bg-red-50"
        >
          <span className="mt-0.5 text-red-600 font-bold shrink-0" aria-hidden="true">
            &gt;
          </span>
          <span className="text-gray-700 leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  )
}

export default function CourseDetail() {
  const { slug } = useParams()
  const programKey = resolveCourseProgram(slug)
  const program = programKey ? coursePrograms[programKey] : null

  return (
    <div>
      <HeroSplit
        title={program?.heroTitle ?? 'Courses'}
        titleHighlight={program?.heroHighlight ?? 'Our'}
        subtitle={program?.title ?? 'Course details'}
      />

      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          {program ? (
            <>
              <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-10">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">{program.title}</h2>
                <p className="mt-4 text-gray-700 leading-relaxed text-justify">{program.overview}</p>

                <div className="mt-8">
                  <h3 className="text-lg font-extrabold text-gray-900">Who Can Join?</h3>
                  <p className="mt-3 text-gray-700 leading-relaxed text-justify">{program.whoCanJoin}</p>
                </div>

                <div className="mt-8 text-center md:text-left">
                  <p className="text-sm text-gray-600">Total course fee is</p>
                  <p className="mt-1 text-3xl font-extrabold text-red-700">{program.fee}</p>
                </div>

                <div className="mt-8">
                  <Button as={Link} to="/contact" variant="primary">
                    Enquire Now
                  </Button>
                </div>
              </div>

              <section className="mt-10 bg-white border border-gray-200 rounded-3xl p-6 md:p-10">
                <h3 className="text-2xl font-extrabold text-gray-900">What You&apos;ll Learn</h3>
                <p className="mt-2 text-sm text-gray-600">Curriculum Framework</p>
                <div className="mt-6">
                  <ModuleList items={program.modules} />
                </div>
              </section>

              <section className="mt-10 bg-white border border-gray-200 rounded-3xl p-6 md:p-10">
                <h3 className="text-2xl font-extrabold text-gray-900">Practical Training Approach</h3>
                <div className="mt-6 space-y-4 text-gray-700 leading-relaxed text-justify">
                  {program.methodology.map((item) => (
                    <p key={item}>{item}</p>
                  ))}
                </div>
              </section>
            </>
          ) : (
            <div className="bg-white border border-gray-200 rounded-3xl p-8 text-center">
              <p className="text-gray-500">No course found for this URL.</p>
            </div>
          )}

          <div className="mt-8">
            <Link
              to="/courses"
              className="inline-flex items-center rounded-full bg-red-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-orange-500 transition"
            >
              Back to Courses
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
