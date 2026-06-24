import HeroSplit from '../../components/public/HeroSplit.jsx'

function ProfileRow({ name, title, description, imageEmoji, reverse }) {
  return (
    <div className={`mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${reverse ? 'md:flex-row-reverse' : ''}`}>
      <div className="flex justify-center">
        <div className="w-full max-w-md rounded-3xl bg-gray-100 border border-gray-200 aspect-[16/10] flex items-center justify-center">
          <div className="text-6xl">{imageEmoji}</div>
        </div>
      </div>
      <div className="text-gray-800">
        <div className="text-2xl font-extrabold text-gray-900">{name}</div>
        <div className="mt-1 text-sm font-semibold text-red-700">{title}</div>
        <p className="mt-4 leading-relaxed text-justify">
          {description}
        </p>
      </div>
    </div>
  )
}

export default function About() {
  return (
    <div>
      <HeroSplit
        title="About Us"
        titleHighlight="About"
        subtitle="Welcome to a team that blends creative design, reliable development, and performance marketing."
        leftColor="bg-gray-900"
      />

      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white border border-gray-200 rounded-3xl p-7 md:p-10 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              Hello, <span className="text-red-700">Welcome</span> to Digital Marketing
            </h2>
            <p className="mt-4 text-gray-700 leading-relaxed max-w-3xl mx-auto">
              We help businesses launch and grow through thoughtful website experiences and data-driven campaigns.
              Our approach stays simple: understand your goals, design the right path, build with quality, and optimize for results.
            </p>
          </div>

          <ProfileRow
            name="Niyas Noushad"
            title="Chief Executive Officer (CEO)"
            imageEmoji="🧠"
            description="As CEO, Niyas focuses on strategy, delivery quality, and building strong partnerships. He leads the team to turn ideas into scalable digital solutions—always with measurable outcomes and clear communication."
          />

          <ProfileRow
            name="Mubeena Nasif"
            title="Chief Operating Officer (COO)"
            reverse
            imageEmoji="⚙️"
            description="Mubeena oversees operations, workflows, and delivery timelines. She ensures each project stays organized, transparent, and client-friendly—from planning through execution and post-launch improvements."
          />
        </div>
      </section>
    </div>
  )
}


