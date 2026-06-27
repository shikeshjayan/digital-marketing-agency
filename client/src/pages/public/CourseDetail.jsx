import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useCourseStore from "../../store/courseStore";
import { slugify } from "../../utils/slugify";

export default function CourseDetail() {
  const { slug } = useParams();
  const { courses, loading, fetchCourses } = useCourseStore();
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses().catch((e) => setError(e.message));
  }, [slug, fetchCourses]);

  const program =
    (courses ?? []).find(
      (course) => slugify(course.course_name) === slug
    ) ?? null;

  if (loading)
    return (
      <div className="text-center py-32 text-gray-400">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="text-center py-32">
        <p className="text-red-500">{error}</p>

        <Link
          to="/courses"
          className="mt-4 inline-flex items-center rounded-full bg-red-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-red-500 transition"
        >
          Back to Courses
        </Link>
      </div>
    );

  if (!program)
    return (
      <div className="text-center py-32">
        <h2 className="text-2xl font-bold text-gray-900">
          Course Not Found
        </h2>

        <p className="mt-3 text-gray-500">
          No course found for this URL.
        </p>

        <Link
          to="/courses"
          className="mt-6 inline-flex items-center rounded-full bg-red-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-red-500 transition"
        >
          Back to Courses
        </Link>
      </div>
    );

  return (
    <div>
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
            {program.course_name}
          </h1>
          <div className="mt-10 flex justify-center">
            <img
              src={program.image}
              alt={program.course_name}
              loading="lazy"
              decoding="async"
              className="w-full max-w-2xl h-64 md:h-80 object-cover rounded-2xl shadow-md bg-gray-100"
            />
          </div>
          <div className="mt-10 max-w-3xl mx-auto text-gray-700 leading-relaxed space-y-4">
            {program.description
              .split(".")
              .map((p) => p.trim())
              .filter(Boolean)
              .map((para, i) => (
                <p key={i} className="text-justify text-base md:text-lg leading-8">
                  {para}.
                </p>
              ))}
          </div>
          <div className="mt-12 flex justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center rounded-full bg-red-600 text-white px-6 py-3 text-sm font-semibold hover:bg-red-500 transition shadow-md"
            >
              Enquire Now
            </Link>
            <Link
              to="/courses"
              className="inline-flex items-center rounded-full bg-red-600 text-white px-6 py-3 text-sm font-semibold hover:bg-red-500 transition shadow-md"
            >
              Back to Courses
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}