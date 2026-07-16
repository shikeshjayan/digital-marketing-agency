import HeroSplit from "../../components/public/HeroSplit.jsx";
import FadeIn from "../../components/ui/FadeIn.jsx";

export default function PrivacyPolicy() {
  return (
    <div className="bg-background min-h-screen">
      <HeroSplit
        title="Policy"
        titleHighlight="Privacy"
        subtitle="Your data protection and operational confidentiality are core to our execution systems."
        imageSrc="/privacy-policy.webp"
        imageAlt="Privacy Policy"
      />

      <section className="py-14 bg-surface animate-page-fade">
        <div className="max-w-4xl mx-auto px-4">
          <FadeIn>
            <div className="bg-background border border-border rounded-lg p-6 md:p-10 space-y-8 text-text card-shadow">
              
              <div>
                <h2 className="text-xl font-extrabold text-heading mb-3">1. Information We Collect</h2>
                <p className="text-sm leading-relaxed">
                  We collect communication variables explicitly filled through our forms (such as names, verified phone vectors, and text contents) solely to execute response routing and scheduling flows.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-heading mb-3">2. How We Protect Your Data</h2>
                <p className="text-sm leading-relaxed">
                  All submitted metrics pass through secure transfer layers. Operational files, account session parameters, and dashboard system items are isolated behind secure backends away from public endpoints.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-heading mb-3">3. Third-Party Sharing Rules</h2>
                <p className="text-sm leading-relaxed">
                  We enforce zero-monetization rules concerning user metrics. Your input tracking identifiers, personal titles, and contact information are never shared with or sold to outside promotional broker networks.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-heading mb-3">4. Cookie Configuration</h2>
                <p className="text-sm leading-relaxed">
                  Our system relies on browser session variables and cookie support to authenticate admin layout clearances and remember dropdown filter selections securely.
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