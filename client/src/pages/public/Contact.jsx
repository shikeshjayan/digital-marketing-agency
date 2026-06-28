import { useEffect, useState } from 'react'
import HeroSplit from '../../components/public/HeroSplit.jsx'
import useServiceStore from '../../store/serviceStore.js'
import useContactStore from '../../store/contactStore.js'

function ContactCard({ title, value, icon }) {
  return (
    <div className="group rounded-3xl border border-pink-200 border-dashed hover:bg-gray-50 transition p-6 bg-white">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-700 text-xs font-semibold">
          {icon}
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-900">{title}</div>
          <div className="text-sm text-gray-600">{value}</div>
        </div>
      </div>
    </div>
  )
}

export default function Contact() {
  const { services, fetchServices } = useServiceStore()
  const { submitContact, error: storeError, success: storeSuccess, loading, reset } = useContactStore()

  const [form, setForm] = useState({
    name: '',
    countryCode: '+91',
    phone: '',
    email: '',
    service: '',
    message: '',
  })
  
  const [localError, setLocalError] = useState('')

  // Custom dropdown states
  const [codeDropdownOpen, setCodeDropdownOpen] = useState(false)
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false)

  const countryCodes = [
    { code: '+91', label: '+91 (IN)' },
    { code: '+1', label: '+1 (US)' },
    { code: '+44', label: '+44 (UK)' },
    { code: '+971', label: '+971 (AE)' },
    { code: '+61', label: '+61 (AU)' },
  ]

  useEffect(() => {
    fetchServices()
    return () => reset() // Reset submission messages when leaving the page
  }, [fetchServices, reset])

  // Close dropdowns on outside click
  useEffect(() => {
    function handleOutsideClick() {
      setCodeDropdownOpen(false)
      setServiceDropdownOpen(false)
    }
    window.addEventListener('click', handleOutsideClick)
    return () => window.removeEventListener('click', handleOutsideClick)
  }, [])

  async function onSubmit(e) {
    e.preventDefault()
    setLocalError('')
    reset()

    const nameOk = /^[a-zA-Z\s]+$/.test(form.name.trim())
    const phoneOk = /^\d{6,}$/.test(form.phone.trim())
    const emailOk = /^\S+@\S+\.\S+$/.test(form.email.trim())

    if (!form.name.trim() || !nameOk) {
      setLocalError('Please enter a valid Full Name (alphabets only).')
      return
    }
    if (!form.phone.trim() || !phoneOk) {
      setLocalError('Please enter a valid Phone Number.')
      return
    }
    if (!form.email.trim() || !emailOk) {
      setLocalError('Please enter a valid Email Address.')
      return
    }
    if (!form.service) {
      setLocalError('Please select a service.')
      return
    }
    if (!form.message.trim()) {
      setLocalError('Please write a message.')
      return
    }

    const fullPhone = `${form.countryCode} ${form.phone.trim()}`

    await submitContact({
      name: form.name.trim(),
      email: form.email.trim(),
      service: form.service,
      message: form.message.trim(),
      phone: fullPhone,
    })
  }

  // Clear form inputs upon successful store submission
  useEffect(() => {
    if (storeSuccess) {
      setForm({ name: '', countryCode: '+91', phone: '', email: '', service: '', message: '' })
    }
  }, [storeSuccess])

  return (
    <div>
      <HeroSplit title="Contact Us" titleHighlight=" " subtitle="Get in touch and let’s plan your next growth step." leftColor="bg-gray-900" />

      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ContactCard title="Phone" value="+91 8891212323" icon="Ph" />
            <ContactCard title="Mail" value="info@s.com" icon="Mail" />
            <ContactCard title="Address" value="Kochi, India" icon="Loc" />
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
                    <span className="w-10 h-8 rounded-xl bg-white/10 flex items-center justify-center text-xs text-gray-300">Ph</span>
                    <span className="text-gray-200">
                      +91 8891212323
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-8 rounded-xl bg-white/10 flex items-center justify-center text-xs text-gray-300">Mail</span>
                    <span className="text-gray-200">
                      info@s.com
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-red-100 rounded-3xl p-6">
              <div className="text-sm font-semibold text-red-700">Get in Touch</div>
              <div className="mt-2 text-2xl font-extrabold text-gray-900">Submit</div>

              <form className="mt-6 space-y-4" onSubmit={onSubmit}>
                <div>
                  <label className="text-sm font-semibold text-gray-800">Full Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100"
                    placeholder="Your name"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-800">Phone No.</label>
                  <div className="mt-2 grid grid-cols-3 gap-3 relative">
                    {/* Custom Country Code Dropdown */}
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => {
                          setCodeDropdownOpen(!codeDropdownOpen)
                          setServiceDropdownOpen(false)
                        }}
                        className="w-full text-left rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100 bg-white text-sm flex justify-between items-center h-full cursor-pointer disabled:opacity-50"
                      >
                        <span>{form.countryCode}</span>
                        <span className="text-xs text-gray-400">▼</span>
                      </button>
                      
                      {codeDropdownOpen && (
                        <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 p-1 space-y-1">
                          {countryCodes.map((item) => (
                            <button
                              key={item.code}
                              type="button"
                              onClick={() => {
                                setForm((f) => ({ ...f, countryCode: item.code }))
                                setCodeDropdownOpen(false)
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg text-xs transition cursor-pointer ${
                                form.countryCode === item.code
                                  ? 'bg-red-50 text-red-700 font-semibold'
                                  : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <input
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      className="col-span-2 w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100"
                      placeholder="Enter your phone number"
                      inputMode="numeric"
                      disabled={loading}
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
                    disabled={loading}
                  />
                </div>

                {/* Custom Services Dropdown */}
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <label className="text-sm font-semibold text-gray-800">Our Services</label>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      setServiceDropdownOpen(!serviceDropdownOpen)
                      setCodeDropdownOpen(false)
                    }}
                    className="mt-2 w-full text-left rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100 bg-white text-sm flex justify-between items-center h-full cursor-pointer disabled:opacity-50"
                  >
                    <span className={form.service ? 'text-gray-900' : 'text-gray-400'}>
                      {form.service || 'Select a service'}
                    </span>
                    <span className="text-xs text-gray-400">▼</span>
                  </button>

                  {serviceDropdownOpen && (
                    <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 p-2 space-y-1">
                      <button
                        type="button"
                        onClick={() => {
                          setForm((f) => ({ ...f, service: '' }))
                          setServiceDropdownOpen(false)
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-50 transition cursor-pointer"
                      >
                        Select a service
                      </button>
                      <div className="border-t border-gray-100 my-1" />
                      {services.map((s) => (
                        <button
                          key={s._id || s.service_id}
                          type="button"
                          onClick={() => {
                            setForm((f) => ({ ...f, service: s.service_name }))
                            setServiceDropdownOpen(false)
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition cursor-pointer ${
                            form.service === s.service_name
                              ? 'bg-red-50 text-red-700 font-semibold'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {s.service_name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-800">Write a message</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    rows={4}
                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:ring-2 focus:ring-red-100 resize-none"
                    placeholder="How can we help?"
                    disabled={loading}
                  />
                </div>

                {(localError || storeError) && <div className="text-sm text-red-600">{localError || storeError}</div>}
                {storeSuccess && <div className="text-sm text-green-600">Thanks! Your enquiry has been submitted successfully.</div>}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full rounded-xl bg-red-600 text-white py-3 font-extrabold hover:bg-red-500 transition cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit'}
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
                  className="text-sm font-semibold text-red-700 hover:text-orange-600 cursor-pointer"
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