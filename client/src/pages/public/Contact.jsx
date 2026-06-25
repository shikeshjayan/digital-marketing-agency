import { useEffect, useState } from 'react'
import { publicGetServices, publicSubmitContactEnquiry } from '../../services/mockApi.js'
import HeroSplit from '../../components/public/HeroSplit.jsx'
import { countryCodes, defaultCountryCode } from '../../data/countryCodes.js'
import DropdownSelect from '../../components/ui/DropdownSelect.jsx'

function ContactCard({ title, value, href, icon }) {
  return (
    <a
      href={href}
      onClick={(e) => {
        // Allow phone/mail to work; for demo links without protocol, prevent navigation.
        if (href === '#') e.preventDefault()
      }}
      className="group rounded-3xl border border-pink-200 border-dashed hover:bg-gray-50 transition p-6 bg-white"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-700">
          {icon}
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-900">{title}</div>
          <div className="text-sm text-gray-600">{value}</div>
        </div>
      </div>
    </a>
  )
}

export default function Contact() {
  const [services, setServices] = useState([])

  const [form, setForm] = useState({
    name: '',
    countryCode: defaultCountryCode,
    phone: '',
    email: '',
    service: '',
    message: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    publicGetServices({ page: 1, limit: 50 }).then((res) => setServices(res.data ?? []))
  }, [])

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    const nameOk = /^[a-zA-Z\s]+$/.test(form.name.trim())
    const phoneOk = /^\d{6,}$/.test(form.phone.trim())
    const emailOk = /^\S+@\S+\.\S+$/.test(form.email.trim())

    if (!form.name.trim() || !nameOk) {
      setError('Please enter a valid Full Name (alphabets only).')
      return
    }
    if (!form.phone.trim() || !phoneOk) {
      setError('Please enter a valid Phone Number.')
      return
    }
    if (!form.email.trim() || !emailOk) {
      setError('Please enter a valid Email Address.')
      return
    }
    if (!form.service) {
      setError('Please select a service.')
      return
    }
    if (!form.message.trim()) {
      setError('Please write a message.')
      return
    }

    const res = await publicSubmitContactEnquiry({
      name: form.name.trim(),
      email: form.email.trim(),
      service: form.service,
      message: form.message.trim(),
      phone: `${form.countryCode}${form.phone.trim()}`,
    })

    if (!res.success) {
      setError(res.error?.message ?? 'Submission failed.')
      return
    }
    setSuccess('Thanks! Your enquiry has been submitted successfully.')
    setForm({ name: '', countryCode: defaultCountryCode, phone: '', email: '', service: '', message: '' })
  }

  return (
    <div>
      <HeroSplit title="Contact Us" titleHighlight=" " subtitle="Get in touch and let’s plan your next growth step." leftColor="bg-gray-900" />

      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ContactCard title="Phone" value="+91 8891212323" href="tel:+918891212323" icon="☎" />
            <ContactCard title="Mail" value="info@s.com" href="mailto:info@s.com" icon="✉" />
            <ContactCard title="Address" value="Kochi, India" href="#" icon="📍" />
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div className="lg:pr-2">
              <div className="bg-black text-white rounded-3xl p-8">
                <div className="text-sm font-semibold text-red-400">How Can I Help You?</div>
                <div className="mt-3 text-3xl font-extrabold">
                  Wanna <span className="text-red-500">Hear</span> From You
                </div>
                <p className="mt-4 text-gray-300 leading-relaxed">
                  Tell us what you need and we’ll respond with a clear plan and timeline.
                </p>
                <div className="mt-6 space-y-2 text-sm text-gray-200">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">☎</span>
                    <a className="hover:text-white" href="tel:+918891212323">
                      +91 8891212323
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">✉</span>
                    <a className="hover:text-white" href="mailto:info@s.com">
                      info@s.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-red-100 rounded-3xl p-6">
              <div className="text-sm font-semibold text-red-700">Lead Generation Form</div>
              <div className="mt-2 text-2xl font-extrabold text-gray-900">Submit</div>

              <form className="mt-6 space-y-4" onSubmit={onSubmit}>
                <div>
                  <label className="text-sm font-semibold text-gray-800">Full Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-800">Phone No.</label>
                  <div className="mt-2 flex items-stretch">
                    <DropdownSelect
                      value={form.countryCode}
                      onChange={(countryCode) => setForm((f) => ({ ...f, countryCode }))}
                      options={countryCodes.map((c) => ({
                        value: c.code,
                        label: `${c.code} ${c.label}`,
                        triggerLabel: c.code,
                      }))}
                      className="shrink-0 w-[5.75rem]"
                      triggerClassName="rounded-l-xl rounded-r-none border-r-0 bg-gray-50 px-3"
                      menuClassName="min-w-[14rem]"
                      aria-label="Country code"
                    />
                    <input
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, '') }))}
                      className="flex-1 min-w-0 h-10 rounded-r-xl border border-gray-200 px-4 text-sm outline-none focus:ring-2 focus:ring-red-100"
                      placeholder="Phone number"
                      inputMode="numeric"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-800">Email Address</label>
                  <input
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100"
                    placeholder="name@example.com"
                    inputMode="email"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-800">Our Services</label>
                  <DropdownSelect
                    value={form.service}
                    onChange={(service) => setForm((f) => ({ ...f, service }))}
                    placeholder="Select a service"
                    className="mt-2"
                    options={[
                      { value: '', label: 'Select a service' },
                      ...services.map((s) => ({
                        value: s.service_name,
                        label: s.service_name,
                      })),
                    ]}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-800">Write a message</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    rows={4}
                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100 resize-none"
                    placeholder="How can we help?"
                  />
                </div>

                {error && <div className="text-sm text-red-600">{error}</div>}
                {success && <div className="text-sm text-green-600">{success}</div>}

                <button type="submit" className="w-full rounded-xl bg-red-600 text-white py-3 font-extrabold hover:bg-orange-500 transition">
                  Submit
                </button>
              </form>
            </div>
          </div>

          <div className="mt-10">
            <div className="rounded-3xl border border-gray-200 overflow-hidden bg-white">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="font-semibold text-gray-900">Location Map</div>
                <a
                  href="https://www.google.com/maps?q=Kochi"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold text-red-700 hover:text-orange-600"
                >
                  Open in Maps
                </a>
              </div>
              <div className="w-full aspect-[16/9]">
                <iframe
                  title="Map"
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
  )
}


