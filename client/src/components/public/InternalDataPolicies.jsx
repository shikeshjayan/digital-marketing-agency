import { useEffect } from "react";
import HeroSplit from "../../components/public/HeroSplit.jsx";
import FadeIn from "../../components/ui/FadeIn.jsx";
import useBrandSettingsStore from "../../store/brandSettingsStore.js";

export default function InternalDataPolicies() {
  const { content, fetchBrandSettings } = useBrandSettingsStore();

  useEffect(() => {
    fetchBrandSettings();
  }, [fetchBrandSettings]);

  return (
    <div className="bg-background min-h-screen">
      <HeroSplit
        title="Data Policies"
        titleHighlight="Internal"
        subtitle="Our internal data handling protocols governing administrative access, information processing, and compliance standards."
        imageSrc="/internal-data-policies.png"
        imageAlt="Internal Data Policies"
      />

      <section className="py-14 bg-surface animate-page-fade">
        <div className="max-w-4xl mx-auto px-4">
          <FadeIn>
            <div className="bg-background border border-border rounded-lg p-6 md:p-10 space-y-8 text-text">

              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <img
                  src={content?.brand?.logo || "/crown-99.png"}
                  alt={content?.brand?.name || "CrawlCrown"}
                  className="h-10 w-10 rounded-lg object-contain"
                />
                <span className="text-lg font-bold text-heading">
                  {content?.brand?.name || "CrawlCrown"}
                </span>
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-heading mb-3">1. Data Collection & Purpose</h2>
                <p className="text-sm leading-relaxed">
                  We collect only the minimum personal data necessary to administer your account and deliver our services. This includes your name, email address, and hashed authentication credentials. No sensitive personal data is collected unless explicitly required for a specific service engagement.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-heading mb-3">2. Data Storage & Retention</h2>
                <p className="text-sm leading-relaxed">
                  All personal data is stored on secure servers with encrypted database layers. We retain your data only as long as your account remains active plus a standard grace period thereafter. You may request deletion of your data at any point by contacting our administration team.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-heading mb-3">3. Access Control & Authentication</h2>
                <p className="text-sm leading-relaxed">
                  Administrative access is strictly limited to authenticated and authorized personnel only. Multi-factor authentication mechanisms and session timeouts are enforced to prevent unauthorized access. All access attempts are logged and monitored for anomalous activity.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-heading mb-3">4. Data Sharing & Third Parties</h2>
                <p className="text-sm leading-relaxed">
                  We do not sell, rent, or trade your personal data. Third-party service providers engaged in platform operations are contractually bound to maintain the same level of data protection and may only process data for the specific purposes outlined in our service agreements.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-heading mb-3">5. Breach Notification Protocol</h2>
                <p className="text-sm leading-relaxed">
                  In the event of a data breach that compromises your personal data, we will notify affected parties within the legally required timeframe. Our incident response team will take immediate remedial action to contain and resolve the breach.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-heading mb-3">6. Compliance & Policy Updates</h2>
                <p className="text-sm leading-relaxed">
                  We regularly review and update these internal data policies to remain compliant with applicable data protection regulations. Any material changes will be communicated through the platform. Continued use of the platform after updates constitutes acceptance of the revised policies.
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
