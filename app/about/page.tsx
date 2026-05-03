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

  // Local images – place these files in public/images/
  const managers = [
    {
      name: "श्रीमती पार्वती सिंह आर्मो",
      role: "जिला शाखा प्रबंधक (District Branch Manager)",
      area: "अनूपपुर, मध्य प्रदेश",
      image: "/parvati.jpeg",       // <-- add your image file
    },
    {
      name: "श्री द्वारिका सिंह",
      role: "ब्लॉक विकास समन्वयक (Block Development Coordinator)",
      area: "पुष्पराजगढ़ ब्लॉक, जिला अनूपपुर, मध्य प्रदेश",
      image: "/divakar.jpeg",       // <-- add your image file
    },
    {
      name: "Mis Nandni",
      role: "Founder Director MD",
      area: "",
      image: "/nandni.jpeg",        // <-- add your image file
    },
    {
      name: "Mr SHIVESH PATEL",
      role: "FOUNDER DIRECTOR CEO",
      area: "",
      image: "/ceo.jpeg",       // <-- add your image file
    },
    {
      name: "Mr Jay Prakash Singh dhurve",
      role: "राज्य विकास अधिकारी (State Development Officer)",
      area: "छत्तीसगढ़ राज्य (Chhattisgarh)",
      image: "/singh.jpeg",    // <-- add your image file
    },
    {
      name: "Mrs. Rekha kushvaha",
      role: "ब्लॉक विकास अधिकारी (Block Development Officer)",
      area: "कोतमा, जिला अनूपपुर (Kotma, Anuppur)",
      image: "/rekha.jpg",         // <-- add your image file
    },
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

        {/* Leadership Section with Local Images */}
        <section className="py-12 bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a237e] font-serif text-center mb-4">
              Meet Our Leadership
            </h2>
            <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
              Dedicated branch managers and directors ensuring smooth delivery of citizen services across India.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {managers.map((manager, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 text-center p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="flex justify-center mb-4">
                    <img
                      src={manager.image}
                      alt={manager.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-[#1a237e]/20"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 font-serif">{manager.name}</h3>
                  <p className="text-[#1a237e] font-medium mt-1">{manager.role}</p>
                  {manager.area && (
                    <p className="text-sm text-gray-600 mt-2">{manager.area}</p>
                  )}
                  <div className="mt-4 flex justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#FF9933]"></div>
                    <div className="w-2 h-2 rounded-full bg-white border border-gray-300"></div>
                    <div className="w-2 h-2 rounded-full bg-[#138808]"></div>
                  </div>
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
      </main>
      <Footer />
    </>
  );
}