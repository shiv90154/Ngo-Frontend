import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, Users, Globe, Award, Target, Eye } from "lucide-react";

export default function AboutPage() {
  const values = [
    { icon: Shield, title: "Integrity", desc: "We uphold the highest standards of transparency and accountability." },
    { icon: Users, title: "Citizen First", desc: "Every service is designed with the citizen at the center." },
    { icon: Globe, title: "Inclusivity", desc: "Accessible to all, across languages and geographies." },
    { icon: Award, title: "Excellence", desc: "Continuous improvement and innovation in governance." },
  ];

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#f8fafc]">
        {/* Page Header */}
        <section className="bg-gradient-to-r from-[#1a237e] to-[#283593] text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-bold font-serif mb-2">About Samraddh Bharat</h1>
            <p className="text-blue-100">A Digital India Initiative for unified citizen services</p>
          </div>
        </section>

        {/* Tricolor */}
        <div className="h-1 flex">
          <div className="w-1/3 bg-[#FF9933]"></div>
          <div className="w-1/3 bg-white"></div>
          <div className="w-1/3 bg-[#138808]"></div>
        </div>

        {/* Mission & Vision */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[#FF9933]/10 rounded-lg">
                    <Target className="text-[#FF9933]" size={28} />
                  </div>
                  <h2 className="text-2xl font-bold text-[#1a237e] font-serif">Our Mission</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  To empower every Indian citizen with seamless, secure, and single‑window access to all government schemes and services, fostering transparency, efficiency, and inclusive growth.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[#138808]/10 rounded-lg">
                    <Eye className="text-[#138808]" size={28} />
                  </div>
                  <h2 className="text-2xl font-bold text-[#1a237e] font-serif">Our Vision</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  To become the single digital gateway for all citizen‑government interactions, enabling a truly Digital India where every service is just a click away.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a237e] font-serif text-center mb-8">
              Core Values
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((item, idx) => (
                <div key={idx} className="text-center p-5 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="inline-flex p-3 bg-[#1a237e]/10 rounded-full mb-4">
                    <item.icon className="text-[#1a237e]" size={28} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-[#1a237e] to-[#283593] text-white rounded-2xl p-8 md:p-10">
              <h2 className="text-2xl md:text-3xl font-bold font-serif mb-6">What Makes Us Different</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { title: "Unified Platform", desc: "Over 50 government services integrated under one roof." },
                  { title: "Aadhaar‑Based Auth", desc: "Secure, verified access with multi‑factor authentication." },
                  { title: "Multilingual Support", desc: "Available in 12 official Indian languages." },
                  { title: "Real‑Time Tracking", desc: "Monitor application status and benefits in real time." },
                  { title: "24x7 Helpline", desc: "Round‑the‑clock citizen support via phone and chat." },
                  { title: "ISO 27001 Certified", desc: "World‑class data security and privacy standards." },
                ].map((feat, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#FF9933] text-white flex items-center justify-center flex-shrink-0 mt-0.5 text-xs">
                      ✓
                    </div>
                    <div>
                      <p className="font-medium">{feat.title}</p>
                      <p className="text-sm text-blue-100">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Leadership / Team (optional placeholder) */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a237e] font-serif mb-2">
              Leadership & Governance
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Guided by a committee of senior officials and domain experts from various ministries.
            </p>
            <div className="grid sm:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
                  <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-3"></div>
                  <h4 className="font-bold text-gray-800">Shri. [Official Name]</h4>
                  <p className="text-sm text-gray-500">Chairperson / Secretary</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}