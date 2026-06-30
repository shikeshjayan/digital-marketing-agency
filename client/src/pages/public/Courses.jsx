import { useEffect } from "react";
import { Link } from "react-router-dom";
import HeroSplit from "../../components/public/HeroSplit";
import FadeIn from "../../components/ui/FadeIn.jsx";
import { CourseCardSkeleton } from "../../components/ui/Skeleton.jsx";
import useCourseStore from "../../store/courseStore";
import { slugify } from "../../utils/slugify";
import imageUrl from "../../utils/imageUrl";

const CourseCard = ({ course }) => (
  <Link
    to={`/courses/${slugify(course.course_name)}`}
    className="flex flex-col bg-white border border-gray-100 rounded-xl shadow-sm h-full overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-300">
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
  const { courses, loading, error, fetchCourses } = useCourseStore();

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  if (loading) {
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
              {[...Array(6)].map((_, i) => (
                <CourseCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <HeroSplit
          title="Courses"
          titleHighlight="Our"
          subtitle="Job-ready training programs with mentor support and practical execution."
        />
        <section className="py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center py-20">
              <div className="text-red-500 mb-4">{error}</div>
              <button
                type="button"
                onClick={() => fetchCourses()}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition cursor-pointer">
                Retry
              </button>
            </div>
          </div>
        </section>
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
          {courses.length === 0 ? (
            <div className="text-center py-20">
              <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <div className="mt-4 text-lg font-semibold text-gray-600">No courses available</div>
              <div className="mt-2 text-sm text-gray-400">Check back later for our courses.</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
              {courses.map((course, i) => (
                <FadeIn key={course._id} delay={i * 100}>
                  <CourseCard course={course} />
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
