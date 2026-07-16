import { useEffect, useState } from "react";
import { toast } from "sonner";
import useSiteContentStore from "../../store/siteContentStore.js";
import AdminPageHeader from "../../components/ui/AdminPageHeader.jsx";
import ErrorBanner from "../../components/ui/ErrorBanner.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import ConfirmModal from "../../components/ui/ConfirmModal.jsx";

export default function AdminSiteContent() {
  const {
    content,
    loading,
    error,
    fetchSiteContent,
    updateSiteContent,
    seedSiteContent,
  } = useSiteContentStore();

  const [techItems, setTechItems] = useState([]);
  const [marqueeLogos, setMarqueeLogos] = useState([]);
  const [companyStats, setCompanyStats] = useState([]);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [confirmTechIdx, setConfirmTechIdx] = useState(null);
  const [confirmMarqueeIdx, setConfirmMarqueeIdx] = useState(null);
  const [confirmStatIdx, setConfirmStatIdx] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    fetchSiteContent();
  }, [fetchSiteContent]);

  useEffect(() => {
    if (content) {
      setTechItems(content.technologyStackItems ?? []);
      setMarqueeLogos(content.trustMarqueeLogos ?? []);
      setCompanyStats(content.companyStats ?? []);
    }
  }, [content]);

  async function handleSave() {
    setSaving(true);
    try {
      await updateSiteContent({
        technologyStackItems: techItems,
        trustMarqueeLogos: marqueeLogos,
        companyStats,
      });
      toast.success("Site content updated successfully.");
    } catch {
      toast.error("Failed to update site content.");
    } finally {
      setSaving(false);
    }
  }

  async function onConfirmReset() {
    setConfirmReset(false);
    setSeeding(true);
    try {
      await seedSiteContent();
      toast.success("Default content seeded.");
    } catch {
      toast.error("Failed to seed default content.");
    } finally {
      setSeeding(false);
    }
  }

  function addTechItem() {
    setTechItems((prev) => [...prev, { name: "", code: "" }]);
  }

  function updateTechItem(i, field, value) {
    setTechItems((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: value };
      return next;
    });
  }

  function addMarqueeLogo() {
    setMarqueeLogos((prev) => [...prev, ""]);
  }

  function updateMarqueeLogo(i, value) {
    setMarqueeLogos((prev) => {
      const next = [...prev];
      next[i] = value;
      return next;
    });
  }

  const DEFAULT_STAT_KEYS = new Set([
    "yearsExperience",
    "projectsCompleted",
    "satisfiedClients",
    "clientRetention",
    "teamMembers",
    "averageRating",
    "averageRoi",
    "support247",
    "onTimeDelivery",
    "countriesServed",
    "industryAwards",
    "uptimeGuaranteed",
    "responseTime",
    "freeConsultation",
    "satisfactionGoal",
    "clientFocus",
  ]);

  function labelToKey(label) {
    return String(label)
      .trim()
      .replace(/[^a-zA-Z0-9\s-]/g, "")
      .split(/[\s-]+/)
      .filter(Boolean)
      .map((word, i) =>
        i === 0
          ? word.toLowerCase()
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
      )
      .join("");
  }

  function getUniqueKey(baseKey, stats, excludeIndex) {
    if (!baseKey) return "";
    let key = baseKey;
    let counter = 1;
    while (stats.some((s, idx) => idx !== excludeIndex && s.key === key)) {
      key = `${baseKey}${counter}`;
      counter++;
    }
    return key;
  }

  function addCompanyStat() {
    setCompanyStats((prev) => {
      const baseKey = labelToKey("New Stat");
      const key = getUniqueKey(baseKey, prev, -1);
      return [...prev, { key, target: 0, suffix: "+", label: "New Stat" }];
    });
  }

  function updateCompanyStat(i, field, value) {
    setCompanyStats((prev) => {
      const next = [...prev];
      const stat = { ...next[i] };
      if (field === "label" && !DEFAULT_STAT_KEYS.has(stat.key)) {
        const baseKey = labelToKey(value);
        stat.key = getUniqueKey(baseKey, next, i);
        stat.label = value;
      } else if (field === "target") {
        stat.target = Number(value);
      } else {
        stat[field] = value;
      }
      next[i] = stat;
      return next;
    });
  }

  if (loading && !content) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error && !content) {
    return (
      <div className="py-20 text-center">
        <div className="text-primary font-medium mb-4">{error}</div>
        <button
          type="button"
          onClick={() => fetchSiteContent()}
          className="px-5 py-2.5 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-hover transition cursor-pointer">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <AdminPageHeader
          title="Site Content"
          subtitle="Manage dynamic content for Technology Stack, Trust Marquee, and Company Statistics sections."
        />
        <button
          type="button"
          onClick={() => setConfirmReset(true)}
          disabled={seeding}
          className="px-4 py-2 text-sm font-semibold text-danger border border-red-300 rounded-lg hover:bg-red-50 transition cursor-pointer disabled:opacity-50">
          {seeding ? "Seeding..." : "Reset to Defaults"}
        </button>
      </div>

      <ErrorBanner message={error} className="mt-4" />

      {/* ─── Technology Stack Items ─── */}
      <section className="mt-6 bg-background border border-border rounded p-5">
        <h3 className="font-extrabold text-heading">Technology Stack Items</h3>
        <p className="mt-1 text-sm text-muted">
          Name/code pairs shown in the Technology Stack section.
        </p>

        <div className="mt-4 space-y-3">
          {techItems.map((item, i) => (
            <div key={i} className="flex flex-wrap items-center gap-2">
              <input
                className="flex-1 min-w-[160px] rounded border border-border bg-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-light"
                placeholder="Name (e.g. WordPress)"
                value={item.name}
                onChange={(e) => updateTechItem(i, "name", e.target.value)}
              />
              <input
                className="w-24 rounded border border-border bg-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-light"
                placeholder="Code (e.g. WP)"
                value={item.code}
                onChange={(e) => updateTechItem(i, "code", e.target.value)}
              />
              <button
                type="button"
                onClick={() => setConfirmTechIdx(i)}
                className="p-2 text-danger hover:text-red-700 hover:bg-red-50 rounded transition cursor-pointer">
                <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addTechItem}
          className="mt-3 text-sm font-semibold text-primary hover:text-primary-hover transition cursor-pointer">
          + Add Item
        </button>

        <ConfirmModal
          danger
          open={confirmTechIdx !== null}
          onCancel={() => setConfirmTechIdx(null)}
          onConfirm={() => {
            setTechItems((prev) =>
              prev.filter((_, idx) => idx !== confirmTechIdx),
            );
            setConfirmTechIdx(null);
          }}
          message="Remove this technology item?"
        />
      </section>

      {/* ─── Trust Marquee Logos ─── */}
      <section className="mt-6 bg-background border border-border rounded p-5">
        <h3 className="font-extrabold text-heading">Trust Marquee Logos</h3>
        <p className="mt-1 text-sm text-muted">
          Brand/client names that scroll in the marquee section.
        </p>

        <div className="mt-4 space-y-3">
          {marqueeLogos.map((logo, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                className="flex-1 rounded border border-border bg-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-light"
                placeholder="Brand name (e.g. NovaTech)"
                value={logo}
                onChange={(e) => updateMarqueeLogo(i, e.target.value)}
              />
              <button
                type="button"
                onClick={() => setConfirmMarqueeIdx(i)}
                className="p-2 text-danger hover:text-red-700 hover:bg-red-50 rounded transition cursor-pointer">
                <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addMarqueeLogo}
          className="mt-3 text-sm font-semibold text-primary hover:text-primary-hover transition cursor-pointer">
          + Add Logo
        </button>

        <ConfirmModal
          danger
          open={confirmMarqueeIdx !== null}
          onCancel={() => setConfirmMarqueeIdx(null)}
          onConfirm={() => {
            setMarqueeLogos((prev) =>
              prev.filter((_, idx) => idx !== confirmMarqueeIdx),
            );
            setConfirmMarqueeIdx(null);
          }}
          message="Remove this marquee logo?"
        />
      </section>

      {/* ─── Company Statistics ─── */}
      <section className="mt-6 bg-background border border-border rounded p-5">
        <h3 className="font-extrabold text-heading">Company Statistics</h3>
        <p className="mt-1 text-sm text-muted">
          Manage company stats shown across the site.
        </p>

        <div className="mt-4 space-y-4">
          {companyStats.map((stat, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  className="flex-1 sm:w-24 sm:flex-none rounded border border-border bg-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-light"
                  placeholder="Target"
                  type="number"
                  step="any"
                  value={stat.target}
                  onChange={(e) => updateCompanyStat(i, "target", e.target.value)}
                />
                <input
                  className="w-20 rounded border border-border bg-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-light"
                  placeholder="Suffix"
                  value={stat.suffix}
                  onChange={(e) => updateCompanyStat(i, "suffix", e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 flex-1 w-full sm:flex-1 sm:min-w-0">
                <input
                  className="flex-1 rounded border border-border bg-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-light"
                  placeholder="Label (e.g. Years of Experience)"
                  value={stat.label}
                  onChange={(e) => updateCompanyStat(i, "label", e.target.value)}
                />
                {!DEFAULT_STAT_KEYS.has(stat.key) && (
                  <button
                    type="button"
                    onClick={() => setConfirmStatIdx(i)}
                    className="p-2 text-danger hover:text-red-700 hover:bg-red-50 rounded transition cursor-pointer shrink-0">
                    <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addCompanyStat}
          className="mt-3 text-sm font-semibold text-primary hover:text-primary-hover transition cursor-pointer">
          + Add Stat
        </button>

        <ConfirmModal
          danger
          open={confirmStatIdx !== null}
          onCancel={() => setConfirmStatIdx(null)}
          onConfirm={() => {
            setCompanyStats((prev) =>
              prev.filter((_, idx) => idx !== confirmStatIdx),
            );
            setConfirmStatIdx(null);
          }}
          message="Remove this company statistic?"
        />

        <ConfirmModal
          danger
          open={confirmReset}
          onCancel={() => setConfirmReset(false)}
          onConfirm={onConfirmReset}
          message="Reset all site content to defaults? This cannot be undone."
        />
      </section>

      {/* ─── Save Button ─── */}
      <div className="mt-8 flex items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded bg-primary text-white px-6 py-2.5 font-extrabold hover:bg-primary-hover transition disabled:opacity-50 cursor-pointer">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
