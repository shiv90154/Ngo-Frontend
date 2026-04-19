import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  ArrowRight,
  GraduationCap,
  Wallet,
  HeartPulse,
  Newspaper,
  Sprout,
  MonitorSmartphone,
  Shield,
  Users,
  Award,
  Clock,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const services = [
    { title: "Education", icon: GraduationCap, color: "#7c3aed", desc: "Courses, live classes & certificates", href: "/education" },
    { title: "Finance", icon: Wallet, color: "#0369a1", desc: "Wallet, loans, bill payments", href: "/finance" },
    { title: "Healthcare", icon: HeartPulse, color: "#be123c", desc: "Doctors, records & medicines", href: "/healthcare" },
    { title: "News", icon: Newspaper, color: "#b45309", desc: "Live local news & stories", href: "/news" },
    { title: "Agriculture", icon: Sprout, color: "#15803d", desc: "AI crop tips & market prices", href: "/agriculture" },
    { title: "IT Services", icon: MonitorSmartphone, color: "#0f766e", desc: "Billing, projects & CRM", href: "/it" },
  ];

  const stats = [
    { value: "2.5 Cr+", label: "Registered Users", icon: Users },
    { value: "50+", label: "Integrated Services", icon: Shield },
    { value: "24/7", label: "Support Available", icon: Clock },
    { value: "ISO 27001", label: "Certified Security", icon: Award },
  ];

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#f8fafc]">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#1a237e] text-white">
          {/* Tricolor overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 flex">
            <div className="w-1/3 bg-[#FF9933]"></div>
            <div className="w-1/3 bg-white"></div>
            <div className="w-1/3 bg-[#138808]"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium mb-4">
                  🇮🇳 Digital India Initiative
                </div>
                <h1 className="text-3xl md:text-5xl font-bold font-serif leading-tight mb-4">
                  One Portal.<br />
                  <span className="text-[#FF9933]">All Government Services.</span>
                </h1>
                <p className="text-blue-100 text-lg mb-6 max-w-lg">
                  Access schemes and services across education, health, agriculture, finance, and more — all in one unified platform.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/services"
                    className="bg-[#FF9933] hover:bg-[#e88720] text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2 transition shadow-lg"
                  >
                    Explore Services <ArrowRight size={18} />
                  </Link>
                  <Link
                    href="/register"
                    className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/30 px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2 transition"
                  >
                    Register Now
                  </Link>
                </div>
              </div>
              <div className="hidden md:flex justify-center">
                <div className="relative">
                  <div className="w-64 h-64 bg-white/10 rounded-full absolute -top-8 -left-8 blur-3xl"></div>
                  <div className="relative bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
                    <div className="grid grid-cols-2 gap-4">
                      {services.slice(0, 4).map((s, i) => (
                        <div key={i} className="bg-white/10 rounded-xl p-4 text-center">
                          <s.icon size={32} className="mx-auto mb-2 text-[#FF9933]" />
                          <p className="text-sm font-medium">{s.title}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="inline-flex p-3 bg-gray-100 rounded-full mb-3">
                    <stat.icon className="text-[#1a237e]" size={24} />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-[#1a237e]">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Overview */}
        <section className="py-16 bg-[#f0f2f5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-[#1a237e] font-serif mb-2">
                Our Integrated Services
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Seamlessly access all government and public services through a single, secure platform.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, idx) => (
                <Link
                  key={idx}
                  href={service.href}
                  className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-[#1a237e]/50 hover:-translate-y-1"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${service.color}15` }}
                      >
                        <service.icon size={24} style={{ color: service.color }} />
                      </div>
                      <ChevronRight className="text-gray-400 group-hover:text-[#1a237e] group-hover:translate-x-1 transition-all" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{service.title}</h3>
                    <p className="text-gray-500 text-sm">{service.desc}</p>
                  </div>
                  <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-[#1a237e] font-medium hover:underline"
              >
                View All Services <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* Features / Why Choose Us */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <span className="text-[#FF9933] font-semibold text-sm uppercase tracking-wider">
                  Why Samraddh Bharat?
                </span>
                <h2 className="text-3xl font-bold text-[#1a237e] font-serif mt-2 mb-4">
                  Citizen‑First Digital Governance
                </h2>
                <p className="text-gray-600 mb-6">
                  We bring all government services under one roof with a focus on accessibility, transparency, and efficiency.
                </p>
                <ul className="space-y-4">
                  {[
                    "Single Sign‑On with Aadhaar‑based authentication",
                    "Real‑time application tracking and status updates",
                    "Multilingual support in 12 Indian languages",
                    "Secure payment gateway for fees and bills",
                    "24x7 citizen support helpline",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        ✓
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-[#f0f2f5] p-6 rounded-2xl">
                <div className="aspect-video bg-gray-300 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">[ Official Tutorial Video ]</span>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="bg-white p-3 rounded-lg text-center shadow-sm">
                    <div className="font-bold text-[#1a237e]">Aadhaar</div>
                    <div className="text-xs text-gray-500">Verified</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg text-center shadow-sm">
                    <div className="font-bold text-[#1a237e]">DigiLocker</div>
                    <div className="text-xs text-gray-500">Integrated</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg text-center shadow-sm">
                    <div className="font-bold text-[#1a237e]">UMANG</div>
                    <div className="text-xs text-gray-500">App</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-[#1a237e] to-[#283593] text-white">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-2xl md:text-3xl font-bold font-serif mb-4">
              Join the Digital India Movement
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Register today and access hundreds of government services from the comfort of your home.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/register"
                className="bg-[#FF9933] hover:bg-[#e88720] text-white px-8 py-3 rounded-lg font-medium text-lg transition shadow-lg"
              >
                Create Account
              </Link>
              <Link
                href="/login"
                className="bg-transparent hover:bg-white/10 text-white border border-white px-8 py-3 rounded-lg font-medium text-lg transition"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}