"use client";

import { HelpCircle, Phone, Mail, MessageCircle, FileText, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function HelpPage() {
  const faqs = [
    { q: "How do I book an appointment?", a: "Go to 'Find Doctors', search for a doctor, and click 'Book Appointment'." },
    { q: "How can I view my prescriptions?", a: "Navigate to 'Prescriptions' from the sidebar or dashboard." },
    { q: "What should I do in an emergency?", a: "Click the 'Emergency' button in the top navigation bar for immediate assistance." },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h1 className="text-2xl font-bold text-gray-800">Help & Support</h1>
        <p className="text-gray-500 mt-1">We're here to assist you</p>
      </div>

      {/* Contact Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <Phone className="w-8 h-8 text-[#1a237e] mb-3" />
          <h3 className="font-semibold text-gray-800">Call Us</h3>
          <p className="text-sm text-gray-500 mt-1">24/7 Helpline</p>
          <p className="text-lg font-medium text-[#1a237e] mt-2">1800-123-4567</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <Mail className="w-8 h-8 text-[#1a237e] mb-3" />
          <h3 className="font-semibold text-gray-800">Email Support</h3>
          <p className="text-sm text-gray-500 mt-1">Response within 24h</p>
          <p className="text-sm text-[#1a237e] mt-2">support@samraddhbharat.gov.in</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <MessageCircle className="w-8 h-8 text-[#1a237e] mb-3" />
          <h3 className="font-semibold text-gray-800">Live Chat</h3>
          <p className="text-sm text-gray-500 mt-1">Available 9AM-9PM</p>
          <button className="mt-2 text-[#1a237e] text-sm font-medium">Start Chat →</button>
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border-b border-gray-100 pb-3 last:border-0">
              <p className="font-medium text-gray-800">{faq.q}</p>
              <p className="text-sm text-gray-500 mt-1">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Documentation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">User Guides</h2>
        <div className="space-y-2">
          <Link href="#" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">How to use the Healthcare Portal</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>
          <Link href="#" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">Understanding Your Health Records</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>
        </div>
      </div>
    </div>
  );
}