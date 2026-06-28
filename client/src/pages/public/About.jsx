import { useEffect, useMemo } from 'react'
import HeroSplit from '../../components/public/HeroSplit.jsx'
import useTeamStore from '../../store/teamStore.js'
import imageUrl from '../../utils/imageUrl.js'

function ProfileRow({ name, title, description, placeholderInitials, photoUrl, reverse }) {
  const imageSrc = photoUrl ? imageUrl(photoUrl) : null;

  return (
    <div className={`group mt-10 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center ${reverse ? 'md:flex-row-reverse' : ''} bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md transition duration-300 cursor-pointer select-none`}>
      
      {/* Visual Asset Block - Centers elements natively without a bounding background block */}
      <div className="flex justify-center items-center cursor-pointer">
        <div className="w-full max-w-[240px] aspect-square flex items-center justify-center overflow-hidden cursor-pointer">
          {imageSrc ? (
            <img 
              src={imageSrc} 
              alt={name || "Executive Team"} 
              loading="lazy"
              className="w-full h-full object-cover rounded-full border-2 border-red-100 group-hover:scale-105 transition-transform duration-500 cursor-pointer"
              onError={(e) => {
                e.target.style.display = 'none';
                const fallbackElement = e.target.nextSibling;
                if (fallbackElement) fallbackElement.style.display = 'flex';
              }}
            />
          ) : null}
          
          {/* Centered raw fallback initials text with no box/square container underneath */}
          <span 
            className="w-full text-6xl font-black font-mono tracking-widest text-red-700 uppercase py-2 flex items-center justify-center text-center cursor-pointer select-none group-hover:scale-110 transition-transform duration-500"
            style={{ display: imageSrc ? 'none' : 'flex' }}
          >
            {placeholderInitials}
          </span>
        </div>
      </div>

      {/* Profile Details Block */}
      <div className="text-gray-800 cursor-pointer text-center md:text-left">
        <div className="text-2xl font-extrabold text-gray-900 cursor-pointer hover:text-red-700 transition-colors duration-300">
          {name}
        </div>
        <div className="mt-1 text-sm font-semibold text-red-700 uppercase tracking-wider cursor-pointer">
          {title}
        </div>
        <p className="mt-4 leading-relaxed text-justify text-gray-600 text-sm cursor-pointer">
          {description}
        </p>
      </div>

    </div>
  )
}

export default function About() {
  const store = useTeamStore()
  const team = store.team ?? []
  const fetchTeam = store.fetchTeam || (() => {})

  // Automatically fetch team records upon component mounting
  useEffect(() => {
    fetchTeam()
  }, [fetchTeam])

  // Filters for active team profiles and sorts them by display_order rank dynamically
  const activeExecutives = useMemo(() => {
    return [...team]
      .filter(m => m.status === 'Active')
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
  }, [team])

  return (
    <div>
      <HeroSplit
        title="Us"
        titleHighlight="About"
        subtitle="Welcome to a team that blends creative design, reliable development, and performance marketing."
        leftColor="bg-gray-900"
      />

      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 space-y-12 md:space-y-16">
          
          {/* Welcome Banner Card */}
          <div className="bg-white border border-gray-200 rounded-3xl p-7 md:p-10 text-center shadow-sm cursor-pointer select-none">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight cursor-pointer">
              Hello, <span className="text-red-700">Welcome</span> to Digital Marketing
            </h2>
            <div className="mt-4 text-sm text-gray-700 leading-relaxed max-w-3xl mx-auto text-justify md:text-center space-y-3 cursor-pointer">
              <p className="cursor-pointer">
                We help brands navigate and scale modern digital landscapes by executing high-performance web engineering alongside robust marketing strategy. Our engineering principles cut out unnecessary layers to zero in on real results: identifying exact business goals, transforming concepts into scalable customer pipelines, building platforms with structural cleanliness, and monitoring active engagement behaviors.
              </p>
              <p className="cursor-pointer">
                By linking functional data capture analytics directly with human-centric interfaces, we transform your digital channels from static online bookmarks into high-velocity engines that attract attention, build lasting consumer confidence, and reliably optimize monetization cycles.
              </p>
            </div>
          </div>

          {/* Profile Rows Wrapper */}
          {activeExecutives.length > 0 && (
            <div className="space-y-16 md:space-y-24">
              {activeExecutives.map((member, index) => {
                // Dynamically build clean text initials fallback from database entry name string
                const initialsFallback = member.name
                  ? member.name.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                  : '??';

                return (
                  <ProfileRow
                    key={member._id}
                    name={member.name}
                    title={member.designation}
                    placeholderInitials={initialsFallback}
                    photoUrl={member.photo}
                    description={member.description}
                    reverse={index % 2 !== 0} // Automatically alternates rows seamlessly
                  />
                )
              })}
            </div>
          )}

        </div>
      </section>
    </div>
  )
}