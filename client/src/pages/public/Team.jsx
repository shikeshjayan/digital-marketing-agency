// Team page — grid of team members from the API
import { useEffect, useMemo, useState } from 'react'
import HeroSplit from '../../components/public/HeroSplit.jsx'
import ImagePlaceholder from '../../components/ui/ImagePlaceholder.jsx'
import { publicGetTeam } from '../../services/mockApi.js'

function TeamCard({ member }) {
  const [imgError, setImgError] = useState(false)
  const showPhoto = member.photo && !imgError

  return (
    <div className="group relative rounded-3xl overflow-hidden border border-gray-100 bg-white hover:shadow-md transition">
      <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-gray-100" aria-hidden="true" />
      <div className="relative p-5">
        <div className="aspect-[4/3] rounded-2xl bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center group-hover:scale-[1.04] transition-transform">
          {showPhoto ? (
            <img
              src={member.photo}
              alt=""
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <ImagePlaceholder label="Photo" />
          )}
        </div>
        <div className="mt-4 bg-gray-100 rounded-2xl border border-gray-200 p-4 text-center">
          <div className="font-bold text-gray-900">{member.name}</div>
          <div className="mt-1 text-sm text-gray-600">{member.designation}</div>
        </div>
      </div>
    </div>
  )
}

export default function Team() {
  const [team, setTeam] = useState([])

  useEffect(() => {
    publicGetTeam()
      .then((res) => setTeam(res.data ?? []))
      .catch(() => setTeam([]))
  }, [])

  const sorted = useMemo(() => {
    return [...team].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
  }, [team])

  return (
    <div>
      <HeroSplit title="Our Team" titleHighlight="Meet" subtitle="A team of creative builders and marketers." leftColor="bg-black" />

      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sorted.map((m) => (
              <TeamCard key={m.member_id} member={m} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}


