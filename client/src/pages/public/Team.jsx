import { useEffect, useMemo } from 'react'
import HeroSplit from '../../components/public/HeroSplit.jsx'
import useTeamStore from '../../store/teamStore.js'

function TeamCard({ member }) {
  return (
    <div className="group rounded-3xl border border-gray-200 bg-white hover:bg-gray-50 p-6 transition duration-300 shadow-sm hover:shadow-md cursor-pointer">
      <div className="flex flex-col gap-4">
        {/* Image Container matching card proportions */}
        <div className="w-full aspect-[4/3] rounded-2xl bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
          <img 
            src={member.photo || 'https://placehold.co/600x400?text=Team+Member'} 
            alt={member.name} 
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = 'https://placehold.co/600x400?text=Team+Member'
            }}
          />
        </div>
        
        {/* Profile Details matching uniform text styling */}
        <div className="text-center mt-1">
          <div className="text-base font-extrabold text-gray-900 tracking-tight">
            {member.name}
          </div>
          <div className="text-xs font-semibold text-red-700 uppercase tracking-wider mt-1">
            {member.designation}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Team() {
  const { team, fetchTeam } = useTeamStore()

  useEffect(() => {
    fetchTeam()
  }, [fetchTeam])

  const sorted = useMemo(() => {
    return [...team].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
  }, [team])

  return (
    <div>
      <HeroSplit title="Our Team" titleHighlight="Meet" subtitle="A team of creative builders and marketers." leftColor="bg-gray-900" />

      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sorted.map((m) => (
              <TeamCard key={m._id || m.member_id} member={m} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}