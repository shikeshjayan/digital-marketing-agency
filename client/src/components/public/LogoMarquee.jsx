import FadeIn from "../ui/FadeIn.jsx";

const defaultLogos = [
  "HR Consultancy",
  "Selfy LinguaTrainer",
  "Rising Moon",
  "StepUp",
  "Tymos",
  "BrightPath",
  "NovaTech",
  "Zenith Solutions",
  "CloudBridge",
  "PixelCraft",
  "SwiftWave",
  "BlueVista",
  "IronPeak",
  "GreenLeaf",
  "SkyPulse",
];

export default function LogoMarquee({
  logos = defaultLogos,
  heading = "Trusted by teams who value quality",
  subheading = "We deliver measurable results with transparent workflows.",
  bg = "bg-surface",
}) {
  return (
    <section className={`${bg} py-10`}>
      <div className="text-center py-6 px-6">
        <FadeIn>
          <h2 className="section-heading text-heading">{heading}</h2>
          {subheading && (
            <p className="mt-2 text-sm text-text">{subheading}</p>
          )}
        </FadeIn>
      </div>

      <div className="overflow-hidden py-6">
        <div className="logo-marquee">
          {[...logos, ...logos].map((logo, index) => (
            <span
              key={index}
              className="inline-flex items-center px-8 whitespace-nowrap tracking-wider font-extrabold text-muted hover:text-primary transition-colors duration-300 text-sm md:text-xl uppercase cursor-default select-none">
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
