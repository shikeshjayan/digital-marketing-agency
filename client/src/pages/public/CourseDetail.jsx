import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import HeroSplit from "../../components/public/HeroSplit";
import Button from "../../components/ui/Button";
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
      <HeroSplit
        title="Courses"
        titleHighlight="Our"
        subtitle={program.course_name}
      />

      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              {program.course_name}
            </h2>

            <div className="mt-6 h-64 rounded-2xl overflow-hidden border border-gray-200">
              <img
                src="https://placehold.co/1200x600?text=Course+Image"
                alt={program.course_name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-extrabold text-gray-900">
                Description
              </h3>

              <p className="mt-3 text-gray-700 leading-relaxed text-justify">
                {program.description}
              </p>
            </div>

            {program.category && (
              <div className="mt-8">
                <h3 className="text-lg font-extrabold text-gray-900">
                  Category
                </h3>

                <p className="mt-3 text-gray-700">
                  {program.category}
                </p>
              </div>
            )}

            <div className="mt-8">
              <Button
                as="a"
                href="/contact"
                className="inline-flex items-center rounded-full bg-red-600 text-white px-6 py-3 text-sm font-semibold hover:bg-red-500 transition"
              >
                Enquire Now
              </Button>
            </div>
          </div>

          <div className="mt-8">
            <Link
              to="/courses"
              className="inline-flex items-center rounded-full bg-red-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-red-500 transition"
            >
              Back to Courses
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}