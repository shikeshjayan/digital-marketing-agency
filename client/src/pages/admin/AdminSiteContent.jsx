import { useEffect, useState } from "react";
import { toast } from "sonner";
import useSiteContentStore from "../../store/siteContentStore.js";
import AdminPageHeader from "../../components/ui/AdminPageHeader.jsx";
import ErrorBanner from "../../components/ui/ErrorBanner.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function AdminSiteContent() {
  const { content, loading, error, fetchSiteContent, updateSiteContent, seedSiteContent } = useSiteContentStore();

  const [techItems, setTechItems] = useState([]);
  const [marqueeLogos, setMarqueeLogos] = useState([]);
  const [companyStats, setCompanyStats] = useState([]);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

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

  async function handleSeed() {
    if (!window.confirm("Reset all site content to defaults? This cannot be undone.")) return;
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

  function removeTechItem(i) {
    setTechItems((prev) => prev.filter((_, idx) => idx !== i));
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

  function removeMarqueeLogo(i) {
    setMarqueeLogos((prev) => prev.filter((_, idx) => idx !== i));
  }

  function addCompanyStat() {
    setCompanyStats((prev) => [...prev, { key: "", target: 0, suffix: "+", label: "" }]);
  }

  function updateCompanyStat(i, field, value) {
    setCompanyStats((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: field === "target" ? Number(value) : value };
      return next;
    });
  }

  function removeCompanyStat(i) {
    setCompanyStats((prev) => prev.filter((_, idx) => idx !== i));
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
          onClick={handleSeed}
          disabled={seeding}
          className="px-4 py-2 text-sm font-semibold text-primary border border-primary rounded-lg hover:bg-primary-light transition cursor-pointer disabled:opacity-50">
          {seeding ? "Seeding..." : "Reset to Defaults"}
        </button>
      </div>

      <ErrorBanner message={error} className="mt-4" />

      {/* ─── Technology Stack Items ─── */}
      <section className="mt-6 bg-background border border-border rounded p-5">
        <h3 className="font-extrabold text-heading">Technology Stack Items</h3>
        <p className="mt-1 text-xs text-muted">Name/code pairs shown in the Technology Stack section.</p>

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
                onClick={() => removeTechItem(i)}
                className="p-2 text-primary hover:text-primary-hover hover:bg-primary-light rounded transition cursor-pointer">
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
      </section>

      {/* ─── Trust Marquee Logos ─── */}
      <section className="mt-6 bg-background border border-border rounded p-5">
        <h3 className="font-extrabold text-heading">Trust Marquee Logos</h3>
        <p className="mt-1 text-xs text-muted">Brand/client names that scroll in the marquee section.</p>

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
                onClick={() => removeMarqueeLogo(i)}
                className="p-2 text-primary hover:text-primary-hover hover:bg-primary-light rounded transition cursor-pointer">
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
      </section>

      {/* ─── Company Statistics ─── */}
      <section className="mt-6 bg-background border border-border rounded p-5">
        <h3 className="font-extrabold text-heading">Company Statistics</h3>
        <p className="mt-1 text-xs text-muted">All 15 company stats used across the site. Each has a unique key that pages reference.</p>

        <div className="mt-4 space-y-4">
          {companyStats.map((stat, i) => (
             <div key={i} className="flex flex-wrap items-center gap-2">
              <span className="w-full sm:w-24 shrink-0 text-xs font-mono text-muted truncate" title={stat.key}>
                {stat.key || "—"}
              </span>
              <input
                className="flex-1 min-w-[80px] sm:w-24 sm:flex-none rounded border border-border bg-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-light"
                placeholder="Target (e.g. 8)"
                type="number"
                step="any"
                value={stat.target}
                onChange={(e) => updateCompanyStat(i, "target", e.target.value)}
              />
              <input
                className="w-20 rounded border border-border bg-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-light"
                placeholder="Suffix (e.g. +)"
                value={stat.suffix}
                onChange={(e) => updateCompanyStat(i, "suffix", e.target.value)}
              />
              <input
                className="w-full sm:flex-1 rounded border border-border bg-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-light"
                placeholder="Label (e.g. Years of Experience)"
                value={stat.label}
                onChange={(e) => updateCompanyStat(i, "label", e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeCompanyStat(i)}
                className="p-2 text-primary hover:text-primary-hover hover:bg-primary-light rounded transition cursor-pointer">
                <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addCompanyStat}
          className="mt-3 text-sm font-semibold text-primary hover:text-primary-hover transition cursor-pointer">
          + Add Stat
        </button>
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
