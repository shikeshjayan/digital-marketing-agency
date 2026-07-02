import { useEffect, useMemo } from 'react'
import HeroSplit from '../../components/public/HeroSplit.jsx'
import FadeIn from '../../components/ui/FadeIn.jsx'
import useTeamStore from '../../store/teamStore.js'
import imageUrl from '../../utils/imageUrl.js'

// Port Resolver helper ensuring images render cleanly during local development workflows
const resolveImagePath = (path) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  
  const isDev = import.meta.env.DEV;
  const hasApiUrlEnv = !!import.meta.env.VITE_API_URL;
  
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  
  if (isDev && !hasApiUrlEnv) {
    return `http://localhost:5000${cleanPath}`;
  }
  return imageUrl(cleanPath);
};

function TeamCard({ member }) {
  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || "??";
  };

  const hasPhoto = member.photo && member.photo.trim() !== '';

  return (
    <div className="flex flex-col bg-background border border-border rounded-lg h-full overflow-hidden w-full min-w-0">
      <div className="aspect-square overflow-hidden flex items-center justify-center bg-surface">
        {hasPhoto ? (
          <img
            src={resolveImagePath(member.photo)}
            alt={member.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-top"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              const fallbackElement = e.target.nextSibling;
              if (fallbackElement) fallbackElement.style.display = 'flex';
            }}
          />
        ) : null}
        
        <div 
          className="w-20 h-20 items-center justify-center text-primary text-4xl font-bold select-none font-sans"
          style={{ display: hasPhoto ? 'none' : 'flex' }}
        >
          {getInitials(member.name)}
        </div>
      </div>
      
      <div className="flex flex-col items-center text-center p-5 flex-1 w-full min-w-0">
        <h3 className="text-lg font-extrabold text-heading w-full break-words">
          {member.name}
        </h3>
        <p className="mt-2 text-sm text-text leading-relaxed line-clamp-3 w-full break-words">
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
    <div className="bg-background min-h-screen">
      <HeroSplit 
        title="Our Team" 
        titleHighlight="Meet" 
        subtitle="A team of creative builders and marketers." 
        leftColor="bg-dark" 
      />

      <section className="py-14 bg-surface">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {sorted.map((m, i) => (
              <FadeIn key={m._id || m.member_id} delay={i * 100}>
                <TeamCard member={m} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}