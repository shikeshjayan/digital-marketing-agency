import { useEffect } from "react";
import { Link } from "react-router-dom";
import HeroSplit from "../../components/public/HeroSplit";
import useCourseStore from "../../store/courseStore";
import { slugify } from "../../utils/slugify";
import imageUrl from "../../utils/imageUrl";

const CourseCard = ({ course }) => (
  <Link
    to={`/courses/${slugify(course.course_name)}`}
    className="flex flex-col bg-white border border-gray-100 rounded-xl shadow-sm h-full overflow-hidden cursor-pointer">
    <div className="h-40 overflow-hidden">
      <img
        src={imageUrl(course.image)}
        alt={course.course_name}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover bg-gray-200"
        onError={(e) => { e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect fill='%23e5e7eb' width='400' height='200'/%3E%3Ctext x='200' y='105' text-anchor='middle' fill='%239ca3af' font-size='16' font-family='sans-serif'%3ENo Image%3C/text%3E%3C/svg%3E"; }}
      />
    </div>
    <div className="flex flex-col items-center text-center p-5 flex-1 gap-4">
      <h3 className="text-lg font-extrabold text-gray-900">
        {course.course_name}
      </h3>
      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
        {course.description}
      </p>
      <span className="mt-auto inline-flex items-center rounded-xl bg-red-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-red-500 transition">
        Read More
      </span>
    </div>
  </Link>
);

export default function Courses() {
  const { courses, loading, fetchCourses } = useCourseStore();

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading...</div>;
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
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
