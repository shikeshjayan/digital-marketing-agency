import HeroSplit from "../../components/public/HeroSplit.jsx";
import FadeIn from "../../components/ui/FadeIn.jsx";

export default function TermsConditions() {
  return (
    <div className="bg-background min-h-screen">
      <HeroSplit
        title="Conditions"
        titleHighlight="Terms &"
        subtitle="Please read our terms of service agreement carefully before accessing our website."
      />

      <section className="py-14 bg-surface animate-page-fade">
        <div className="max-w-4xl mx-auto px-4">
          <FadeIn>
            <div className="bg-background border border-border rounded-lg p-6 md:p-10 space-y-8 text-text">
              
              <div>
                <h2 className="text-xl font-extrabold text-heading mb-3">1. Agreement to Terms</h2>
                <p className="text-sm leading-relaxed">
                  By accessing or using CrawlCrown's platforms and services, you agree to bound yourself by these comprehensive Terms and Conditions. If you do not accept any specific section of this document, you are restricted from navigating our pages.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-heading mb-3">2. Intellectual Property Rights</h2>
                <p className="text-sm leading-relaxed">
                  All foundational layout code, visual user assets, site graphics, cursive custom elements, and proprietary marketing copy running on this interface remain the exclusive intellectual workspace of CrawlCrown and are fully protected under global asset registries.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-heading mb-3">3. User Conduct Restrictions</h2>
                <p className="text-sm leading-relaxed">
                  Users are strictly prohibited from utilizing form configurations to transmit malicious software scripts, execute scraping routines against active database layers, or submit fraudulent communication details.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-heading mb-3">4. Limitation of Liability</h2>
                <p className="text-sm leading-relaxed">
                  CrawlCrown provides high-velocity digital marketing frameworks "as-is". We assume no direct liability for structural system downtime or conversion pipeline deviations resulting from outside data infrastructure errors.
                </p>
              </div>

              <div className="border-t border-border pt-6 text-xs text-muted text-center">
                Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}