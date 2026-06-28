import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-10">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3">
              <img src="/crown-96.png" alt="CrawlCrown Logo" className="w-9 h-9 rounded-xl object-contain" />
              <div className="font-bold text-lg">CrawlCrown</div>
            </div>
            <p className="mt-3 text-sm text-gray-300">
              Full-service digital marketing agency with design, development, and performance growth.
            </p>
            <div className="mt-4 flex gap-3 text-sm text-gray-300">
              {['Facebook', 'Instagram', 'LinkedIn', 'YouTube'].map((x) => (
                <a key={x} href="#" className="hover:text-white cursor-pointer" onClick={(e) => e.preventDefault()}>
                  {x}
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-sm font-semibold mb-3">Services</div>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <Link to="/services" className="cursor-pointer">Brand &amp; PR</Link>
                </li>
                <li>
                  <Link to="/services" className="cursor-pointer">Creative Production</Link>
                </li>
                <li>
                  <Link to="/services" className="cursor-pointer">Digital Marketing</Link>
                </li>
              </ul>
            </div>
            <div>
              <div className="text-sm font-semibold mb-3">Company</div>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <Link to="/about" className="cursor-pointer">About</Link>
                </li>
                <li>
                  <Link to="/projects" className="cursor-pointer">Projects</Link>
                </li>
                <li>
                  <Link to="/contact" className="cursor-pointer">Contact</Link>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold mb-3">Contact</div>
            <div className="text-sm text-gray-300 space-y-2">
              <div>Phone: +91 8891212323</div>
              <div>Email: info@s.com</div>
              <div className="text-gray-400">Address: Kochi, India</div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} <span className="text-red-400">CrawlCrown</span>. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

