// Static course content for the public courses pages
export const coursePrograms = {
  'digital-marketing': {
    slug: 'digital-marketing',
    navLabel: 'Digital Marketing Training',
    title: 'Digital Marketing Job Training',
    short_description:
      'Learn campaign planning, content strategy, and performance marketing through guided, hands-on training.',
    heroHighlight: 'Digital Marketing',
    heroTitle: 'Job Training',
    fee: '₹15,000 + GST',
    overview:
      'A guided path from fundamentals to execution. Learn campaign planning, content strategy, and performance optimization with hands-on tasks that mirror real agency workflows.',
    whoCanJoin:
      'Students, working professionals, and creators who want to build practical skills in digital marketing and launch real campaigns with confidence.',
    modules: [
      'Marketing Fundamentals',
      'Branding & PR for Growth',
      'Content Marketing & SEO Basics',
      'Performance Marketing & Analytics',
      'Influencer Marketing Playbooks',
      'Live Campaign Execution',
    ],
    methodology: [
      'Hands-on execution tasks each week with guided briefs and review checkpoints.',
      'Professional mentor support and structured feedback cycles throughout the program.',
      'Experience Certificate distribution after successful completion of all modules.',
    ],
  },
  laravel: {
    slug: 'laravel',
    navLabel: 'Laravel Development Training',
    title: 'Laravel development Job Training',
    short_description:
      'Build real Laravel applications with routing, databases, authentication, and deployment-ready project skills.',
    heroHighlight: 'Laravel',
    heroTitle: 'development Job Training',
    fee: '₹15,000 + GST',
    overview:
      'Build real web applications with Laravel through practical modules covering routing, data modeling, authentication, and deployment-ready patterns used in production teams.',
    whoCanJoin:
      'Beginner to intermediate developers who want structured, mentor-led training to strengthen full-stack skills and ship portfolio-ready projects.',
    modules: [
      'Laravel Basics & Routing',
      'Database Design & Eloquent ORM',
      'Authentication & Authorization',
      'API Development Patterns',
      'Validation and Error Handling',
      'Capstone Project & Deployment Prep',
    ],
    methodology: [
      'Practical training focused on building, debugging, and shipping working features.',
      'Mentor-led code walkthroughs and live troubleshooting during project sprints.',
      'Experience Certificate distribution after completing the capstone deliverable.',
    ],
  },
}

// Links for navbar and course cards
export const courseNavLinks = Object.values(coursePrograms).map((program) => ({
  label: program.navLabel,
  to: `/courses/${program.slug}`,
}))

export function resolveCourseProgram(key) {
  return coursePrograms[key] ? key : null
}

export function courseDetailPath(slug) {
  return `/courses/${slug}`
}

export const courseList = Object.values(coursePrograms)
