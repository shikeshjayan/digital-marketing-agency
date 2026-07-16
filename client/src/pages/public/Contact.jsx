import { useEffect, useState } from "react";
import { toast } from "sonner";
import HeroSplit from "../../components/public/HeroSplit.jsx";
import FadeIn from "../../components/ui/FadeIn.jsx";
import SectionHeading from "../../components/ui/SectionHeading.jsx";
import HelpCard from "../../components/public/HelpCard.jsx";
import usePageStore from "../../store/pageStore.js";
import useContactStore from "../../store/contactStore.js";
import flags from "country-flag-icons/react/3x2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faEnvelope,
  faLocation,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faInstagram,
  faLinkedinIn,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

function ContactCard({ title, value, icon }) {
  return (
    <div className="group rounded-lg border border-primary border-dashed hover:bg-surface transition p-6 bg-background">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary-light border border-primary-light flex items-center justify-center text-primary">
          <FontAwesomeIcon icon={icon} className="text-sm" />
        </div>
        <div>
          <div className="text-sm font-semibold text-heading">{title}</div>
          <div className="text-sm text-text">{value}</div>
        </div>
      </div>
    </div>
  );
}

function FlagIcon({ countryCode, className = "w-5 h-auto rounded-sm flex-shrink-0" }) {
  const Flag = flags[countryCode];
  return Flag ? <Flag className={className} /> : null;
}

const countryCodes = [
  { code: "+91", label: "IN +91", countryCode: "IN" },
  { code: "+1", label: "US +1", countryCode: "US" },
  { code: "+44", label: "UK +44", countryCode: "GB" },
  { code: "+61", label: "AU +61", countryCode: "AU" },
  { code: "+971", label: "AE +971", countryCode: "AE" },
  { code: "+81", label: "JP +81", countryCode: "JP" },
  { code: "+86", label: "CN +86", countryCode: "CN" },
  { code: "+49", label: "DE +49", countryCode: "DE" },
  { code: "+33", label: "FR +33", countryCode: "FR" },
  { code: "+39", label: "IT +39", countryCode: "IT" },
  { code: "+7", label: "RU +7", countryCode: "RU" },
  { code: "+82", label: "KR +82", countryCode: "KR" },
  { code: "+65", label: "SG +65", countryCode: "SG" },
  { code: "+966", label: "SA +966", countryCode: "SA" },
  { code: "+92", label: "PK +92", countryCode: "PK" },
  { code: "+880", label: "BD +880", countryCode: "BD" },
  { code: "+94", label: "LK +94", countryCode: "LK" },
  { code: "+977", label: "NP +977", countryCode: "NP" },
  { code: "+55", label: "BR +55", countryCode: "BR" },
  { code: "+52", label: "MX +52", countryCode: "MX" },
];

export default function Contact() {
  const { contactPage, loading: pageLoading, error: pageError, fetchPageContact } = usePageStore();
  const {
    submitContact,
    error: storeError,
    success: storeSuccess,
    loading: submitting,
    reset,
  } = useContactStore();
  const [form, setForm] = useState({
    name: "",
    phone: "+91",
    email: "",
    service: "",
    message: "",
  });
  const [consent, setConsent] = useState(false);
  const [localError, setLocalError] = useState("");

  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);
  const [codeDropdownOpen, setCodeDropdownOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");

  const services = contactPage?.services ?? [];
  const brandSettings = contactPage?.brandSettings ?? {};
  const contact = brandSettings?.contact ?? {};
  const socialLinks = brandSettings?.socialLinks ?? [];

  useEffect(() => {
    fetchPageContact();
    return () => reset();
  }, [fetchPageContact, reset]);

  const iconMap = { faFacebookF, faInstagram, faLinkedinIn, faYoutube };

  useEffect(() => {
    function handleOutsideClick() {
      setServiceDropdownOpen(false);
      setCodeDropdownOpen(false);
    }
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setLocalError("");
    reset();

    const nameOk = /^[a-zA-Z\s]+$/.test(form.name.trim());
    const phoneOk = /^\+?\d{6,}$/.test(form.phone);
    const emailOk = /^\S+@\S+\.\S+$/.test(form.email.trim());

    if (!form.name.trim() || !nameOk) {
      setLocalError("Please enter a valid Full Name (alphabets only).");
      return;
    }
    if (!form.phone.trim() || !phoneOk) {
      setLocalError("Please enter a valid Phone Number.");
      return;
    }
    if (!form.email.trim() || !emailOk) {
      setLocalError("Please enter a valid Email Address.");
      return;
    }
    if (!form.service) {
      setLocalError("Please select a service.");
      return;
    }
    if (!form.message.trim()) {
      setLocalError("Please write a message.");
      return;
    }
    if (!consent) {
      setLocalError(
        "Please agree to the privacy policy and terms & conditions before submitting.",
      );
      return;
    }

    await submitContact({
      name: form.name.trim(),
      email: form.email.trim(),
      service: form.service,
      message: form.message.trim(),
      phone: form.phone,
    });
  }

  // Clear form inputs upon successful store submission
  useEffect(() => {
    if (storeSuccess) {
      toast.success("Thanks! Your enquiry has been submitted successfully.");
      setForm({
        name: "",
        phone: "+91",
        email: "",
        service: "",
        message: "",
      });
      setConsent(false);
      setSelectedCode("+91");
      setPhoneNumber("");
    }
  }, [storeSuccess]);

  useEffect(() => {
    if (storeError) {
      toast.error(storeError);
    }
  }, [storeError]);

  if (pageError)
    return (
      <div>
        <HeroSplit
          title="Contact Us"
          titleHighlight="Let's"
          subtitle="Ready to grow your business? Get in touch with us today for a free consultation and let's discuss how we can help you achieve your goals."
          primaryCTA={{ label: "Get a Free Quote", to: "#contact-form" }}
          secondaryCTA={{
            label: "Call Us Now",
            to: `tel:${contact.phone || "+918891212323"}`,
          }}
          imageSrc="/contact.webp"
          imageAlt="Contact Us"
        />
        <section className="py-14 bg-surface">
          <div className="max-w-6xl mx-auto px-4 text-center py-20">
            <div className="text-primary font-medium mb-4">{pageError}</div>
            <button
              type="button"
              onClick={() => fetchPageContact()}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-hover transition cursor-pointer button-text">
              Retry
            </button>
          </div>
        </section>
      </div>
    );

  const selectedCountry = countryCodes.find((c) => c.code === selectedCode);

  return (
    <div>
      <HeroSplit
        title="Contact Us"
        titleHighlight="Let's"
        subtitle="Ready to grow your business? Get in touch with us today for a free consultation and let's discuss how we can help you achieve your goals."
        primaryCTA={{ label: "Get a Free Quote", to: "#contact-form" }}
        secondaryCTA={{
          label: "Call Us Now",
          to: `tel:${contact.phone || "+918891212323"}`,
        }}
        imageSrc="/contact.webp"
        imageAlt="Contact Us"
        trustIndicators={[
          { value: "24/7", label: "Support\nAvailable" },
          { value: "Free", label: "Consultation" },
          { value: "24h", label: "Response\nTime" },
        ]}
      />

      <section id="contact-form" className="py-12 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          {pageLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-lg border border-border p-6 bg-background animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-surface-border" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-16 bg-surface-border rounded" />
                      <div className="h-3 w-32 bg-surface-border rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FadeIn delay={0}>
                <ContactCard
                  title="Phone"
                  value={contact.phone || "+91 8891212323"}
                  icon={faPhone}
                />
              </FadeIn>
              <FadeIn delay={100}>
                <ContactCard
                  title="Mail"
                  value={contact.email || "crowlcrown@gmail.com"}
                  icon={faEnvelope}
                />
              </FadeIn>
              <FadeIn delay={200}>
                <ContactCard
                  title="Address"
                  value={contact.address || "Ernakulam, Kochi, Kerala, India"}
                  icon={faLocation}
                />
              </FadeIn>
            </div>
          )}

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <FadeIn direction="left">
              <div className="lg:pr-2 space-y-6">
                <HelpCard contact={contact} />
                {socialLinks.length > 0 && (
                  <FadeIn direction="none" delay={150}>
                    <div className="bg-secondary text-white rounded-lg p-8">
                      <div className="text-sm font-semibold text-primary">
                        Follow Us
                      </div>
                      <div className="mt-4 flex w-full gap-3">
                        {socialLinks.map((social) => (
                          <a
                            key={social.platform}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 h-12 rounded-xl bg-white/10 flex items-center justify-center hover:bg-primary-hover hover:text-white transition-all duration-200"
                            aria-label={social.platform}>
                            <FontAwesomeIcon
                              icon={iconMap[social.icon]}
                              className="text-lg"
                            />
                          </a>
                        ))}
                      </div>
                    </div>
                  </FadeIn>
                )}
              </div>
            </FadeIn>

            <FadeIn direction="right">
              <div className="bg-background border border-primary-light rounded-lg p-6">
                <div className="text-sm font-semibold text-primary">
                  Get in Touch
                </div>
                <div className="mt-2 section-heading text-heading">Submit</div>

                <form className="mt-6 space-y-4" onSubmit={onSubmit}>
                  <div>
                    <label className="text-sm font-semibold text-heading">
                      Full Name
                    </label>
                    <input
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      className="mt-2 w-full rounded-ip border border-border px-4 py-2 outline-none focus:ring-2 focus:ring-primary-light bg-background text-sm text-heading"
                      placeholder="Your name"
                      disabled={submitting}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-heading">
                      Phone Number
                    </label>
                    <div className="mt-2 flex">
                      <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          disabled={submitting}
                          onClick={() => {
                            setCodeDropdownOpen(!codeDropdownOpen);
                            setServiceDropdownOpen(false);
                          }}
                          className="flex items-center justify-between gap-1 h-full rounded-l-lg border border-border px-3 py-[9px] text-sm text-heading outline-none focus:ring-2 focus:ring-primary-light bg-background cursor-pointer disabled:opacity-50"
                        >
                          <FlagIcon countryCode={selectedCountry?.countryCode} />
                          <span className="font-medium">{selectedCode}</span>
                          <svg className={`w-3 h-3 text-muted transition ${codeDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {codeDropdownOpen && (
                          <div className="absolute left-0 mt-1 bg-background border border-border rounded-lg  z-20 p-2 space-y-1 max-h-60 overflow-y-auto overscroll-contain scrollbar-custom min-w-[140px]">
                            {countryCodes.map((c) => (
                              <button
                                key={c.code + c.label}
                                type="button"
                                onClick={() => {
                                  setSelectedCode(c.code);
                                  setPhoneNumber("");
                                  setForm((f) => ({ ...f, phone: c.code }));
                                  setCodeDropdownOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition cursor-pointer ${
                                  selectedCode === c.code
                                    ? "bg-primary-light text-primary font-semibold"
                                    : "text-text hover:bg-surface"
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <FlagIcon countryCode={c.countryCode} />
                                  <span>{c.label}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, "");
                          setPhoneNumber(digits);
                          setForm((f) => ({ ...f, phone: selectedCode + digits }));
                        }}
                        disabled={submitting}
                        className="-ml-px flex-1 min-w-0 rounded-r-lg border border-border px-4 py-[9px] text-sm text-heading outline-none focus:ring-2 focus:ring-primary-light bg-background"
                        placeholder="Phone number"
                        inputMode="numeric"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-heading">
                      Email Address
                    </label>
                    <input
                      value={form.email}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
                      className="mt-2 w-full rounded-lg border border-border px-4 py-2 text-sm text-heading outline-none focus:ring-2 focus:ring-primary-light bg-background"
                      placeholder="name@example.com"
                      inputMode="email"
                      disabled={submitting}
                    />
                  </div>

                  <div
                    className="relative"
                    onClick={(e) => e.stopPropagation()}>
                    <label className="text-sm font-semibold text-heading">
                      Our Services
                    </label>
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => {
                        setServiceDropdownOpen(!serviceDropdownOpen);
                        setCodeDropdownOpen(false);
                      }}
                      className="mt-2 w-full text-left rounded-lg border border-border px-4 py-2 outline-none focus:ring-2 focus:ring-primary-light bg-background text-sm flex justify-between items-center h-full cursor-pointer disabled:opacity-50">
                      <span
                        className={
                          form.service ? "text-heading" : "text-muted"
                        }>
                        {form.service || "Select a service"}
                      </span>
                    </button>
                    {serviceDropdownOpen && (
                      <div className="absolute left-0 right-0 mt-1 bg-background border border-border rounded-lg  z-20 p-2 space-y-1 max-h-60 overflow-y-auto overscroll-contain scrollbar-custom">
                        <button
                          type="button"
                          onClick={() => {
                            setForm((f) => ({ ...f, service: "" }));
                            setServiceDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg text-sm text-muted hover:bg-surface transition cursor-pointer">
                          Select a service
                        </button>
                        <div className="border-t border-border my-1" />
                        {services.map((s) => (
                          <button
                            key={s._id || s.service_id}
                            type="button"
                            onClick={() => {
                              setForm((f) => ({
                                ...f,
                                service: s.service_name,
                              }));
                              setServiceDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition cursor-pointer ${
                              form.service === s.service_name
                                ? "bg-primary-light text-primary font-semibold"
                                : "text-text hover:bg-surface"
                            }`}>
                            {s.service_name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-heading">
                      Write a message
                    </label>
                    <textarea
                      value={form.message}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, message: e.target.value }))
                      }
                      rows={4}
                      className="mt-2 w-full rounded-lg border border-border px-4 py-2 text-sm text-heading outline-none focus:ring-2 focus:ring-primary-light bg-background resize-none"
                      placeholder="How can we help?"
                      disabled={submitting}
                    />
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="consent"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      disabled={submitting}
                      className="mt-1 h-4 w-4 rounded border-border accent-primary-hover text-primary focus:ring-primary cursor-pointer"
                    />
                    <label
                      htmlFor="consent"
                      className="text-sm text-text leading-snug cursor-pointer">
                      I agree to the{" "}
                      <a
                        href="/privacy"
                        target="_self"
                        className="text-primary underline hover:text-primary-hover">
                        Privacy Policy
                      </a>{" "}
                      and{" "}
                      <a
                        href="/terms"
                        target="_self"
                        className="text-primary underline hover:text-primary-hover">
                        Terms & Conditions
                      </a>
                      . I consent to the collection and processing of my
                      personal data for enquiry purposes.
                    </label>
                  </div>

                  {(localError || storeError) && (
                    <FadeIn direction="none">
                      <div
                        className="text-sm text-primary text-center"
                        style={{ fontSize: "12.5px" }}>
                        {localError || storeError}
                      </div>
                    </FadeIn>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-lg bg-primary text-white py-3 font-extrabold hover:bg-primary-hover transition cursor-pointer disabled:opacity-50">
                    {submitting ? "Submitting..." : "Submit"}
                  </button>
                </form>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="py-14 bg-background-section">
        <div className="max-w-6xl mx-auto px-4">
          <FadeIn>
            <SectionHeading
              eyebrow="Location"
              title="Visit Our Office"
              subtitle=""
            />
            <div className="mt-10 rounded-lg border border-border overflow-hidden bg-background">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div className="font-semibold text-heading">Location Map</div>
                <a
                  href="https://www.google.com/maps?q=Kochi"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold text-primary hover:text-primary-hover cursor-pointer">
                  Open in Maps
                </a>
              </div>
              <div className="w-full h-75">
                <iframe
                  title="Office Location Map - Kochi, Kerala, India"
                  className="w-full h-full"
                  src="https://www.google.com/maps?q=Kochi&output=embed"
                  loading="lazy"
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
