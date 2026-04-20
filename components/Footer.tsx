"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const quickLinks = ["About Us", "All Services", "Schemes", "Contact", "Help & Support", "FAQs"];
  const policyLinks = ["Privacy Policy", "Terms & Conditions", "Copyright Policy", "Accessibility", "Sitemap", "Disclaimer"];

  const LinkList = ({ title, links }) => (
    <div>
      <h3 className="font-semibold text-gray-800 mb-4">{title}</h3>
      <ul className="space-y-2">
        {links.map(item => (
          <li key={item}>
            <Link href={`/${item.toLowerCase().replace(/\s+/g, "-")}`} className="text-sm text-gray-600 hover:text-blue-600">
              {item}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className="bg-white text-gray-700 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-blue-900">Samraddh Bharat</h2>
            <p className="text-xs text-gray-500 mt-1">Government of India Initiative</p>
            <p className="text-sm text-gray-600 mt-4 leading-relaxed">
              A Digital India initiative providing unified access to government schemes and public services.
            </p>
          </div>

          <LinkList title="Quick Links" links={quickLinks} />
          <LinkList title="Policies" links={policyLinks} />

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Contact</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>NIC, CGO Complex, Lodhi Road,</p>
              <p>New Delhi - 110003</p>
              <p className="mt-2">📞 1800-111-555</p>
              <p>✉️ support@samraddhbharat.gov.in</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-gray-500">
            <span>भारत सरकार | Government of India</span>
            <span>© {new Date().getFullYear()} Samraddh Bharat. All Rights Reserved.</span>
            <span>Designed by NIC</span>
          </div>
        </div>
      </div>

      {/* Scroll to Top */}
      {showScrollTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all">
          <ArrowUp size={20} />
        </button>
      )}
    </footer>
  );
};

export default Footer;