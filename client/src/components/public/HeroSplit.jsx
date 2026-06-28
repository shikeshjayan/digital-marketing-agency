export default function HeroSplit({
  title,
  titleHighlight = "Our",
  subtitle,
  imageSrc,
  imageAlt = "Hero image",
  gradientFrom = "from-gray-900",
  gradientVia = "via-gray-800",
  gradientTo = "to-black",
}) {
  return (
    <section
      className={`relative overflow-hidden bg-gradient-to-br ${gradientFrom} ${gradientVia} ${gradientTo}`}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Background Glow */}
      <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-red-600/20 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-red-500/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className="relative">
            {/* Image */}
            <div className="relative">
              <img
                src={imageSrc || "/the-creative-idea-Nz3ztzCRE9g-unsplash.png"}
                alt={imageAlt}
                className="w-full rounded-3xl object-cover transition-transform duration-700 hover:scale-105"
              />

              <div className="absolute -bottom-8 -right-8 -z-10 h-36 w-36 rounded-full bg-red-600/20 blur-3xl" />
            </div>

            {/* Decorative Glow */}
            <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-red-600/30 blur-3xl -z-10" />
          </div>

          {/* Text */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-black leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
              <span className="text-red-500">{titleHighlight}</span> {title}
            </h1>

            {subtitle && (
              <p className="mt-6 max-w-xl text-lg leading-8 text-gray-300 mx-auto lg:mx-0">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
