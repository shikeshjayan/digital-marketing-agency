// Page hero used on About, Services, Contact, etc. — image on left, title on right
import ImagePlaceholder from '../ui/ImagePlaceholder.jsx'

export default function HeroSplit({ leftColor = 'bg-gray-900', title, titleHighlight = '', subtitle }) {
  const highlight = titleHighlight?.trim()

  return (
    <section className="bg-white">
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left side — colored background with placeholder image */}
          <div className={`${leftColor} relative min-h-[220px] md:min-h-[320px]`}>
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,white,transparent_60%)]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-72 max-w-[80%] h-56 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
                <ImagePlaceholder label="Image" className="text-white/70 [&_div]:border-white/30 [&_div]:bg-white/10" />
              </div>
            </div>
          </div>

          {/* Right side — page title and subtitle */}
          <div className="flex items-center justify-center p-8 md:p-12 bg-white">
            <div className="text-center md:text-left max-w-xl">
              <div className="text-3xl md:text-5xl font-extrabold text-gray-900">
                {highlight ? (
                  <>
                    <span className="text-red-700">{highlight}</span>{' '}
                  </>
                ) : null}
                {title}
              </div>
              {subtitle && <p className="mt-4 text-gray-600 leading-relaxed">{subtitle}</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
