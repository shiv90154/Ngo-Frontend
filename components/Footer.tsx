import Link from "next/link";
import { Facebook, Twitter, Youtube, Instagram, MapPin, Phone, Mail, Globe, ChevronRight } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#1a237e] text-white mt-auto">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: About & Emblem */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-[#FF9933]">
                  <span className="text-[#1a237e] text-lg font-serif">अ</span>
                </div>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-[#FF9933] -ml-2">
                  <span className="text-[#1a237e] text-lg font-serif">₹</span>
                </div>
              </div>
              <span className="text-xl font-bold font-serif">Samraddh Bharat</span>
            </div>
            <p className="text-sm text-gray-300 mb-4 leading-relaxed">
              A Digital India initiative providing unified access to government schemes and public services.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="bg-white/10 hover:bg-[#FF9933] p-2 rounded-full transition">
                <Facebook size={18} />
              </a>
              <a href="#" className="bg-white/10 hover:bg-[#FF9933] p-2 rounded-full transition">
                <Twitter size={18} />
              </a>
              <a href="#" className="bg-white/10 hover:bg-[#FF9933] p-2 rounded-full transition">
                <Youtube size={18} />
              </a>
              <a href="#" className="bg-white/10 hover:bg-[#FF9933] p-2 rounded-full transition">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-[#FF9933] rounded-full"></span>
              Quick Links
            </h3>
            <ul className="space-y-2">
              {["About Us", "All Services", "Schemes", "Contact", "Help & Support", "FAQs"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-sm text-gray-300 hover:text-white transition flex items-center gap-1 group"
                  >
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Policies & Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-white rounded-full"></span>
              Policies
            </h3>
            <ul className="space-y-2">
              {[
                "Privacy Policy",
                "Terms & Conditions",
                "Copyright Policy",
                "Accessibility",
                "Sitemap",
                "Disclaimer",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-sm text-gray-300 hover:text-white transition flex items-center gap-1 group"
                  >
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-[#138808] rounded-full"></span>
              Get in Touch
            </h3>
            <ul className="space-y-3 text-sm text-gray-300 mb-4">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 flex-shrink-0 text-[#FF9933]" />
                <span>NIC, CGO Complex, Lodhi Road, New Delhi - 110003</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-[#FF9933]" />
                <span>1800-111-555 (Toll Free)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-[#FF9933]" />
                <span>support@samraddhbharat.gov.in</span>
              </li>
            </ul>
            {/* Newsletter (static) */}
            <div>
              
             
               
            
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-300">
            <div className="flex items-center gap-2 mb-2 md:mb-0">
              <Globe size={14} />
              <span>भारत सरकार | Government of India</span>
            </div>
            <p>© {new Date().getFullYear()} Samraddh Bharat Foundation. All Rights Reserved.</p>
            <p className="hidden md:block">Designed & Developed by NIC</p>
          </div>
          <div className="text-center mt-3 text-[10px] text-gray-400">
            <p>Last Updated: 01 April 2026 | Visitors: 12,34,567 | Version: 2.1.0</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;