import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import useBrandSettingsStore from "../../store/brandSettingsStore.js";
import AdminPageHeader from "../../components/ui/AdminPageHeader.jsx";
import ErrorBanner from "../../components/ui/ErrorBanner.jsx";
import FileUploadField from "../../components/ui/FileUploadField.jsx";
import ConfirmModal from "../../components/ui/ConfirmModal.jsx";

export default function AdminBrandSettings() {
  const { content, loading, error, fetchAdminBrandSettings, updateBrandSettings, seedBrandSettings } = useBrandSettingsStore();

  const [brand, setBrand] = useState({ name: "", logo: "", tagline: "" });
  const [socialLinks, setSocialLinks] = useState([]);
  const [contact, setContact] = useState({ phone: "", email: "", address: "", whatsapp: "", working_hours: "", location: "" });
  const [companyLinks, setCompanyLinks] = useState([]);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [confirmSocialIdx, setConfirmSocialIdx] = useState(null);
  const [confirmCompanyLinkIdx, setConfirmCompanyLinkIdx] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    fetchAdminBrandSettings();
  }, [fetchAdminBrandSettings]);

  useEffect(() => {
    if (content) {
      setBrand(content.brand ?? { name: "", logo: "", tagline: "" });
      setSocialLinks(content.socialLinks ?? []);
      setContact(content.contact ?? { phone: "", email: "", address: "", whatsapp: "", working_hours: "", location: "" });
      setCompanyLinks(content.companyLinks ?? []);
    }
  }, [content]);

  function onPickLogo(file) {
    setBrand((prev) => ({ ...prev, logo: file }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = new FormData();

      if (brand.logo instanceof File) {
        payload.append("brand_logo", brand.logo);
      } else if (typeof brand.logo === "string") {
        payload.append("brand_logo", brand.logo);
      }

      payload.append("brand", JSON.stringify({ name: brand.name, tagline: brand.tagline }));
      payload.append("socialLinks", JSON.stringify(socialLinks));
      payload.append("contact", JSON.stringify(contact));
      payload.append("companyLinks", JSON.stringify(companyLinks));

      await updateBrandSettings(payload);
      toast.success("Brand settings updated successfully.");
    } catch {
      toast.error("Failed to update brand settings.");
    } finally {
      setSaving(false);
    }
  }

  async function onConfirmReset() {
    setConfirmReset(false);
    setSeeding(true);
    try {
      await seedBrandSettings();
      toast.success("Default brand settings seeded.");
    } catch {
      toast.error("Failed to seed default brand settings.");
    } finally {
      setSeeding(false);
    }
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
          onClick={() => fetchAdminBrandSettings()}
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
          title="Brand Settings"
          subtitle="Manage brand info, social links, contact details, and company links used across the site."
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

      {/* ─── Brand Info ─── */}
      <section className="mt-6 bg-background border border-border rounded p-5">
        <h3 className="font-extrabold text-heading">Brand Info</h3>
        <p className="mt-1 text-sm text-muted">Company name, logo, and tagline shown site-wide.</p>

        <div className="mt-4 space-y-4">
          <div>
            <label className="text-sm font-semibold text-heading">Company Name</label>
            <input
              className="mt-2 w-full rounded border border-border bg-surface px-4 py-2 text-sm text-heading outline-none transition focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary-light placeholder:text-muted"
              placeholder="CrawlCrown"
              value={brand.name}
              onChange={(e) => setBrand((prev) => ({ ...prev, name: e.target.value }))}
              maxLength={100}
            />
          </div>
          <div className="w-[100px]">
            <FileUploadField
              label="Logo"
              containerHeight="h-[100px]"
              file={brand.logo instanceof File ? brand.logo : null}
              existingUrl={typeof brand.logo === "string" ? brand.logo : ""}
              onChange={onPickLogo}
              onRemove={() => setBrand((prev) => ({ ...prev, logo: "" }))}
              confirmText="Remove logo?"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-heading">Tagline</label>
            <textarea
              rows={2}
              className="mt-2 w-full rounded border border-border bg-surface px-4 py-2 text-sm text-heading outline-none transition focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary-light placeholder:text-muted resize-none"
              placeholder="Full-service digital marketing agency..."
              value={brand.tagline}
              onChange={(e) => setBrand((prev) => ({ ...prev, tagline: e.target.value }))}
              maxLength={300}
            />
          </div>
        </div>
      </section>

      {/* ─── Social Links ─── */}
      <section className="mt-6 bg-background border border-border rounded p-5">
        <h3 className="font-extrabold text-heading">Social Links</h3>
        <p className="mt-1 text-sm text-muted">Social media links displayed in the footer. Each has a platform name, URL, and icon identifier.</p>

        <div className="mt-4 space-y-3">
          {socialLinks.map((link, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2">
              <input
                className="w-full sm:flex-1 sm:min-w-[120px] rounded border border-border bg-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-light"
                placeholder="Platform (e.g. Facebook)"
                value={link.platform}
                onChange={(e) => {
                  const next = [...socialLinks];
                  next[i] = { ...next[i], platform: e.target.value };
                  setSocialLinks(next);
                }}
                maxLength={50}
              />
              <input
                className="w-full sm:flex-[2] sm:min-w-[200px] rounded border border-border bg-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-light"
                placeholder="URL (e.g. https://facebook.com/crawlcrown)"
                value={link.url}
                onChange={(e) => {
                  const next = [...socialLinks];
                  next[i] = { ...next[i], url: e.target.value };
                  setSocialLinks(next);
                }}
                maxLength={500}
              />
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  className="flex-1 sm:w-28 sm:shrink-0 rounded border border-border bg-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-light"
                  placeholder="Icon (e.g. faFacebookF)"
                  value={link.icon}
                  onChange={(e) => {
                    const next = [...socialLinks];
                    next[i] = { ...next[i], icon: e.target.value };
                    setSocialLinks(next);
                  }}
                  maxLength={50}
                />
                <button
                  type="button"
                  onClick={() => setConfirmSocialIdx(i)}
                  className="p-2 text-danger hover:text-red-700 hover:bg-red-50 rounded transition cursor-pointer shrink-0">
                  <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setSocialLinks((prev) => [...prev, { platform: "", url: "", icon: "" }])}
          className="mt-3 text-sm font-semibold text-primary hover:text-primary-hover transition cursor-pointer">
          + Add Social Link
        </button>

        <ConfirmModal
          danger
          open={confirmSocialIdx !== null}
          onCancel={() => setConfirmSocialIdx(null)}
          onConfirm={() => {
            setSocialLinks((prev) => prev.filter((_, idx) => idx !== confirmSocialIdx));
            setConfirmSocialIdx(null);
          }}
          message="Remove this social link?"
        />
      </section>

      {/* ─── Contact Info ─── */}
      <section className="mt-6 bg-background border border-border rounded p-5">
        <h3 className="font-extrabold text-heading">Contact Info</h3>
        <p className="mt-1 text-sm text-muted">Phone, email, address, WhatsApp, working hours, and location displayed in the footer contact block.</p>

        <div className="mt-4 space-y-4">
          <div>
            <label className="text-sm font-semibold text-heading">Phone</label>
            <input
              className="mt-2 w-full rounded border border-border bg-surface px-4 py-2 text-sm text-heading outline-none transition focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary-light placeholder:text-muted"
              placeholder="+91 8891212323"
              value={contact.phone}
              onChange={(e) => setContact((prev) => ({ ...prev, phone: e.target.value }))}
              maxLength={20}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-heading">Email</label>
            <input
              className="mt-2 w-full rounded border border-border bg-surface px-4 py-2 text-sm text-heading outline-none transition focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary-light placeholder:text-muted"
              placeholder="crawlcrown@gmail.com"
              value={contact.email}
              onChange={(e) => setContact((prev) => ({ ...prev, email: e.target.value }))}
              maxLength={254}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-heading">Address</label>
            <input
              className="mt-2 w-full rounded border border-border bg-surface px-4 py-2 text-sm text-heading outline-none transition focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary-light placeholder:text-muted"
              placeholder="Ernakulam, Kochi, Kerala, India"
              value={contact.address}
              onChange={(e) => setContact((prev) => ({ ...prev, address: e.target.value }))}
              maxLength={200}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-heading">WhatsApp</label>
            <input
              className="mt-2 w-full rounded border border-border bg-surface px-4 py-2 text-sm text-heading outline-none transition focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary-light placeholder:text-muted"
              placeholder="WhatsApp number or link"
              value={contact.whatsapp}
              onChange={(e) => setContact((prev) => ({ ...prev, whatsapp: e.target.value }))}
              maxLength={100}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-heading">Working Hours</label>
            <input
              className="mt-2 w-full rounded border border-border bg-surface px-4 py-2 text-sm text-heading outline-none transition focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary-light placeholder:text-muted"
              placeholder="Mon – Sat: 10:00 AM – 6:00 PM"
              value={contact.working_hours}
              onChange={(e) => setContact((prev) => ({ ...prev, working_hours: e.target.value }))}
              maxLength={200}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-heading">Location</label>
            <input
              className="mt-2 w-full rounded border border-border bg-surface px-4 py-2 text-sm text-heading outline-none transition focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary-light placeholder:text-muted"
              placeholder="Ernakulam, Kochi, Kerala, India"
              value={contact.location}
              onChange={(e) => setContact((prev) => ({ ...prev, location: e.target.value }))}
              maxLength={200}
            />
          </div>
        </div>
      </section>

      {/* ─── Company Links ─── */}
      <section className="mt-6 bg-background border border-border rounded p-5">
        <h3 className="font-extrabold text-heading">Company Links</h3>
        <p className="mt-1 text-sm text-muted">Navigation links in the Company column of the footer.</p>

        <div className="mt-4 space-y-3">
          {companyLinks.map((link, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2">
              <input
                className="w-full sm:flex-1 sm:min-w-[160px] rounded border border-border bg-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-light"
                placeholder="Label (e.g. About)"
                value={link.label}
                onChange={(e) => {
                  const next = [...companyLinks];
                  next[i] = { ...next[i], label: e.target.value };
                  setCompanyLinks(next);
                }}
                maxLength={100}
              />
              <div className="flex items-center gap-2 w-full sm:flex-1">
                <input
                  className="flex-1 sm:min-w-[160px] rounded border border-border bg-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-light"
                  placeholder="Path (e.g. /about)"
                  value={link.path}
                  onChange={(e) => {
                    const next = [...companyLinks];
                    next[i] = { ...next[i], path: e.target.value };
                    setCompanyLinks(next);
                  }}
                  maxLength={500}
                />
                <button
                  type="button"
                  onClick={() => setConfirmCompanyLinkIdx(i)}
                  className="p-2 text-danger hover:text-red-700 hover:bg-red-50 rounded transition cursor-pointer shrink-0">
                  <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setCompanyLinks((prev) => [...prev, { label: "", path: "" }])}
          className="mt-3 text-sm font-semibold text-primary hover:text-primary-hover transition cursor-pointer">
          + Add Link
        </button>

        <ConfirmModal
          danger
          open={confirmCompanyLinkIdx !== null}
          onCancel={() => setConfirmCompanyLinkIdx(null)}
          onConfirm={() => {
            setCompanyLinks((prev) => prev.filter((_, idx) => idx !== confirmCompanyLinkIdx));
            setConfirmCompanyLinkIdx(null);
          }}
          message="Remove this company link?"
        />

        <ConfirmModal
          danger
          open={confirmReset}
          onCancel={() => setConfirmReset(false)}
          onConfirm={onConfirmReset}
          message="Reset brand settings to defaults? This cannot be undone."
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
