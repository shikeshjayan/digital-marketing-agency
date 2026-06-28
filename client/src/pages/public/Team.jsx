import { useEffect, useMemo } from 'react'
import HeroSplit from '../../components/public/HeroSplit.jsx'
import useTeamStore from '../../store/teamStore.js'
import imageUrl from '../../utils/imageUrl.js'

function TeamCard({ member }) {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const hasPhoto = member.photo && member.photo.trim() !== '';

  return (
    <div className="flex flex-col bg-white border border-gray-100 rounded-xl shadow-sm h-full overflow-hidden">
      <div className="aspect-square overflow-hidden flex items-center justify-center bg-gray-100">
        {hasPhoto ? (
          <img
            src={imageUrl(member.photo)}
            alt={member.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-top"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-20 h-20 flex items-center justify-center text-red-600 text-4xl font-bold">
            {getInitials(member.name)}
          </div>
        )}
      </div>
      <div className="flex flex-col items-center text-center p-5 flex-1 gap-6">
        <h3 className="text-lg font-extrabold text-gray-900">
          {member.name}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
          {member.designation}
        </p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {sorted.map((m) => (
              <TeamCard key={m._id || m.member_id} member={m} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}