import { useEffect, useState } from "react";
import { toast } from "sonner";
import HeroSplit from "../../components/public/HeroSplit.jsx";
import FadeIn from "../../components/ui/FadeIn.jsx";
import useServiceStore from "../../store/serviceStore.js";
import useContactStore from "../../store/contactStore.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faEnvelope,
  faLocation,
} from "@fortawesome/free-solid-svg-icons";

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

export default function Contact() {
  const { services, fetchServices } = useServiceStore();
  const {
    submitContact,
    error: storeError,
    success: storeSuccess,
    loading,
    reset,
  } = useContactStore();

  const [form, setForm] = useState({
    name: "",
    countryCode: "+91",
    phone: "",
    email: "",
    service: "",
    message: "",
  });

  const [consent, setConsent] = useState(false);

  const [localError, setLocalError] = useState("");

  // Custom dropdown states
  const [codeDropdownOpen, setCodeDropdownOpen] = useState(false);
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);

  const countryCodes = [
    { code: "+91", label: "+91 (IN)" },
    { code: "+1", label: "+1 (US)" },
    { code: "+44", label: "+44 (UK)" },
    { code: "+971", label: "+971 (AE)" },
    { code: "+61", label: "+61 (AU)" },
  ];

  useEffect(() => {
    fetchServices();
    return () => reset(); // Reset submission messages when leaving the page
  }, [fetchServices, reset]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleOutsideClick() {
      setCodeDropdownOpen(false);
      setServiceDropdownOpen(false);
    }
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setLocalError("");
    reset();

    const nameOk = /^[a-zA-Z\s]+$/.test(form.name.trim());
    const phoneOk = /^\d{6,}$/.test(form.phone.trim());
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
        "Please agree to the privacy policy and terms before submitting.",
      );
      return;
    }

    const fullPhone = `${form.countryCode} ${form.phone.trim()}`;

    await submitContact({
      name: form.name.trim(),
      email: form.email.trim(),
      service: form.service,
      message: form.message.trim(),
      phone: fullPhone,
    });
  }

  // Clear form inputs upon successful store submission
  useEffect(() => {
    if (storeSuccess) {
      toast.success("Thanks! Your enquiry has been submitted successfully.");
      setForm({
        name: "",
        countryCode: "+91",
        phone: "",
        email: "",
        service: "",
        message: "",
      });
      setConsent(false);
    }
  }, [storeSuccess]);

  useEffect(() => {
    if (storeError) {
      toast.error(storeError);
    }
  }, [storeError]);

  return (
    <div>
      <HeroSplit
        title="Contact Us"
        titleHighlight="Let's"
        subtitle="Ready to grow your business? Get in touch with us today for a free consultation and let's discuss how we can help you achieve your goals."
        primaryCTA={{ label: "Get a Free Quote", to: "#contact-form" }}
        secondaryCTA={{ label: "Call Us Now", to: "tel:+918891212323" }}
        imageSrc="/contact.webp"
        imageAlt="Contact Us"
        trustIndicators={[
          { value: "24/7", label: "Support\nAvailable" },
          { value: "Free", label: "Consultation" },
          { value: "24h", label: "Response\nTime" },
        ]}
      />

      <section id="contact-form" className="py-12 bg-surface">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FadeIn delay={0}>
              <ContactCard
                title="Phone"
                value="+91 8891212323"
                icon={faPhone}
              />
            </FadeIn>
            <FadeIn delay={100}>
              <ContactCard
                title="Mail"
                value="crowlcrown@gmail.com"
                icon={faEnvelope}
              />
            </FadeIn>
            <FadeIn delay={200}>
              <ContactCard
                title="Address"
                value="Ernakulam, Kochi, Kerala, India"
                icon={faLocation}
              />
            </FadeIn>
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <FadeIn direction="left">
              <div className="lg:pr-2">
                <div className="bg-secondary text-white rounded-lg p-8">
                  <div className="text-sm font-semibold text-primary">
                    How Can I Help You?
                  </div>
                  <div className="mt-3 section-heading">
                    Wanna <span className="text-primary">Hear</span> From You
                  </div>
                  <p className="mt-4 text-gray-300 body-text">
                    Tell us what you need and we'll respond with a clear plan
                    and timeline.
                  </p>
                  <div className="mt-6 space-y-2 text-sm text-gray-200">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-xs text-gray-300">
                        <FontAwesomeIcon icon={faPhone} />
                      </span>
                      <a href="tel:+91 8891212323" className="text-gray-200">
                        +91 8891212323
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-xs text-gray-300">
                        <FontAwesomeIcon icon={faEnvelope} />
                      </span>
                      <a
                        href="mailto:crowlcrown@gmail.com"
                        className="text-gray-200">
                        crowlcrown@gmail.com
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-xs text-gray-300">
                        <FontAwesomeIcon icon={faLocation} />
                      </span>
                      <a
                        href="https://www.google.com/maps/search/Ernakulam+Kochi+Kerala+India"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-200">
                        Ernakulam, Kochi, Kerala, India
                      </a>
                    </div>
                  </div>
                </div>
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
                      className="mt-2 w-full rounded-lg border border-border px-4 py-2 outline-none focus:ring-2 focus:ring-primary-light"
                      placeholder="Your name"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-heading">
                      Phone Number
                    </label>
                    <div className="mt-2 grid grid-cols-3 gap-3 relative">
                      <div
                        className="relative"
                        onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          disabled={loading}
                          onClick={() => {
                            setCodeDropdownOpen(!codeDropdownOpen);
                            setServiceDropdownOpen(false);
                          }}
                          className="w-full text-left rounded-lg border border-border px-4 py-2 outline-none focus:ring-2 focus:ring-primary-light bg-background text-sm flex justify-between items-center h-full cursor-pointer disabled:opacity-50">
                          <span>{form.countryCode}</span>
                          <span className="text-xs text-muted">▼</span>
                        </button>

                        {codeDropdownOpen && (
                          <div className="absolute left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-20 p-1 space-y-1">
                            {countryCodes.map((item) => (
                              <button
                                key={item.code}
                                type="button"
                                onClick={() => {
                                  setForm((f) => ({
                                    ...f,
                                    countryCode: item.code,
                                  }));
                                  setCodeDropdownOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition cursor-pointer ${
                                  form.countryCode === item.code
                                    ? "bg-primary-light text-primary font-semibold"
                                    : "text-text hover:bg-surface"
                                }`}>
                                {item.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <input
                        type="number"
                        value={form.phone}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, phone: e.target.value }))
                        }
                        className="col-span-2 w-full rounded-lg border border-border px-4 py-2 outline-none focus:ring-2 focus:ring-primary-light"
                        placeholder="Enter your phone number"
                        inputMode="numeric"
                        disabled={loading}
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
                      className="mt-2 w-full rounded-lg border border-border px-4 py-2 outline-none focus:ring-2 focus:ring-primary-light"
                      placeholder="name@example.com"
                      inputMode="email"
                      disabled={loading}
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
                      disabled={loading}
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
                      <span className="text-xs text-muted">▼</span>
                    </button>

                    {serviceDropdownOpen && (
                      <div className="absolute left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-20 p-2 space-y-1">
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
                      className="mt-2 w-full rounded-lg border border-border px-4 py-2 outline-none focus:ring-2 focus:ring-primary-light resize-none"
                      placeholder="How can we help?"
                      disabled={loading}
                    />
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="consent"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      disabled={loading}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                    />
                    <label
                      htmlFor="consent"
                      className="text-sm text-text leading-snug cursor-pointer">
                      I agree to the{" "}
                      <a
                        href="/privacy-policy"
                        target="_blank"
                        className="text-primary underline hover:text-primary-hover">
                        Privacy Policy
                      </a>{" "}
                      and{" "}
                      <a
                        href="/terms"
                        target="_blank"
                        className="text-primary underline hover:text-primary-hover">
                        Terms of Service
                      </a>
                      . I consent to the collection and processing of my
                      personal data for enquiry purposes.
                    </label>
                  </div>

                  {(localError || storeError) && (
                    <div className="text-sm text-primary">
                      {localError || storeError}
                    </div>
                  )}
                  {storeSuccess && (
                    <div className="text-sm text-green-600">
                      Thanks! Your enquiry has been submitted successfully.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-primary text-white py-3 font-extrabold hover:bg-primary-hover transition cursor-pointer disabled:opacity-50">
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                </form>
              </div>
            </FadeIn>
          </div>

          <div className="mt-10">
            <div className="rounded-lg border border-border overflow-hidden bg-background">
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
              <div className="w-full aspect-video">
                <iframe
                  title="Office Location Map - Kochi, Kerala, India"
                  className="w-full h-full"
                  src="https://www.google.com/maps?q=Kochi&output=embed"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
