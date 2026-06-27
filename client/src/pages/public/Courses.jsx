import { useEffect } from "react";
import { Link } from "react-router-dom";
import HeroSplit from "../../components/public/HeroSplit";
import useCourseStore from "../../store/courseStore";
import { slugify } from "../../utils/slugify";

function CourseCard({ course, index }) {
  const gradients = [
    "from-red-600/20 to-red-600/5",
    "from-orange-500/20 to-orange-500/5",
    "from-rose-500/20 to-rose-500/5",
  ];

  return (
    <Link
      to={`/courses/${slugify(course.course_name)}`}
      className="group flex flex-col h-full bg-white border border-gray-100 rounded-3xl p-5 shadow-sm hover:shadow-md hover:border-red-100 transition"
    >
      <div
        className={`h-40 rounded-2xl border border-gray-100 bg-gradient-to-br ${
          gradients[index % gradients.length]
        } overflow-hidden`}
      >
        <img
          src="https://placehold.co/600x400?text=Course+Image"
          alt={course.course_name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover bg-gray-200"
        />
      </div>

      <div className="flex flex-col flex-1">
        <h3 className="mt-4 text-lg font-extrabold text-gray-900 group-hover:text-red-700 transition">
          {course.course_name}
        </h3>

        <p className="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-3 flex-1">
          {course.description}
        </p>

        <div className="mt-6">
          <span className="inline-flex items-center rounded-full bg-red-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-red-500 transition">
            Read More
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function Courses() {
  const { courses, loading, fetchCourses } = useCourseStore();

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div>
      <HeroSplit
        title="Courses"
        titleHighlight="Our"
        subtitle="Job-ready training programs with mentor support and practical execution."
      />

      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {courses.map((course, index) => (
              <CourseCard
                key={course._id}
                course={course}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}