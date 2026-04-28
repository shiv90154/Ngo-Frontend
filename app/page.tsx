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
  CheckCircle2,
  Play,
  Building2,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const services = [
    { 
      title: "Education", 
      icon: GraduationCap, 
      color: "#7c3aed", 
      desc: "Scholarships, DIKSHA, SWAYAM, NPTEL Courses", 
      href: "/education",
      stats: "50+ Schemes",
      badge: "50+ Schemes"               // ✅ added for hero & card badge
    },
    { 
      title: "Finance", 
      icon: Wallet, 
      color: "#0369a1", 
      desc: "PM Jan Dhan, Atal Pension, Sukanya Samriddhi", 
      href: "/finance",
      stats: "₹50K+ Cr Disbursed",
      badge: "₹50K+ Cr Disbursed"
    },
    { 
      title: "Healthcare", 
      icon: HeartPulse, 
      color: "#be123c", 
      desc: "Ayushman Bharat, e-Sanjeevani, CoWIN", 
      href: "/healthcare",
      stats: "50Cr+ Beneficiaries",
      badge: "50Cr+ Beneficiaries"
    },
    { 
      title: "Agriculture", 
      icon: Sprout, 
      color: "#15803d", 
      desc: "PM KISAN, e-NAM, Soil Health Card", 
      href: "/agriculture",
      stats: "11Cr+ Farmers",
      badge: "11Cr+ Farmers"
    },
    { 
      title: "Digital Services", 
      icon: MonitorSmartphone, 
      color: "#0f766e", 
      desc: "DigiLocker, UMANG, GeM Portal", 
      href: "/it",
      stats: "15Cr+ Users",
      badge: "15Cr+ Users"
    },
    { 
      title: "News & Info", 
      icon: Newspaper, 
      color: "#b45309", 
      desc: "PIB, MyGov, DD News, Mann Ki Baat", 
      href: "/news",
      stats: "Live Updates",
      badge: "Live Updates"
    },
  ];

  const stats = [
    { value: "147 Cr+", label: "Aadhaar Citizens", icon: Users, color: "#FF9933" },
    { value: "2,000+", label: "Govt. Schemes", icon: Shield, color: "#1a237e" },
    { value: "24x7", label: "Helpline Support", icon: Clock, color: "#138808" },
    { value: "ISO 27001", label: "CERT-In Certified", icon: Award, color: "#be123c" },
  ];

  const features = [
    "Aadhaar-based Single Sign-On Authentication",
    "Real-time Application Status Tracking",
    "12 Official Indian Languages Support",
    "Secure Payment Gateway (RBI Approved)",
    "24x7 National Citizen Helpline",
    "DigiLocker & UMANG Integration",
  ];

  return (
    <>
      <Header />
      <main className="flex-1 bg-gradient-to-b from-[#f8fafc] to-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-[#0a1550] via-[#1a237e] to-[#0f1a5c] text-white overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-10 w-80 h-80 bg-[#FF9933] rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#138808] rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/20">
                  <Building2 size={16} className="text-[#FF9933]" />
                  <span>Government of India</span>
                  <span className="w-1 h-1 bg-[#FF9933] rounded-full"></span>
                  <span className="text-blue-200">National e-Governance Portal</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif leading-tight mb-4">
                  Samraddh Bharat
                </h1>
                
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-0.5 w-12 bg-[#FF9933]"></div>
                  <p className="text-xl md:text-2xl text-white/90 font-serif italic">One Nation • One Portal</p>
                  <div className="h-0.5 w-12 bg-[#138808]"></div>
                </div>
                
                <p className="text-blue-100 text-lg mb-8 max-w-lg leading-relaxed border-l-4 border-[#FF9933] pl-5">
                  A unified platform under the National e-Governance Plan providing seamless access to all Central & State Government services.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/services"
                    className="group bg-[#FF9933] hover:bg-[#e88720] text-white px-7 py-3.5 rounded-xl font-semibold text-lg inline-flex items-center gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    Explore Services 
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/register"
                    className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-2 border-white/30 px-7 py-3.5 rounded-xl font-semibold text-lg inline-flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
                  >
                    Register Now
                  </Link>
                </div>
              </div>

              <div className="hidden lg:block">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FF9933]/20 to-[#138808]/20 rounded-3xl blur-2xl"></div>
                  <div className="relative bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/30">
                    <div className="grid grid-cols-2 gap-5">
                      {services.slice(0, 4).map((service, i) => (
                        <div key={i} className="bg-white/10 rounded-xl p-5 text-center border border-white/20 hover:scale-105 transition-transform">
                          <service.icon size={32} className="mx-auto mb-3 text-[#FF9933]" />
                          <p className="text-sm font-semibold">{service.title}</p>
                          <p className="text-xs text-blue-200 mt-1">{service.badge}</p>  {/* ✅ fixed */}
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
        <section className="py-10 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center group">
                  <div className="inline-flex p-3 bg-gradient-to-br from-gray-50 to-white rounded-xl mb-2 shadow-sm border border-gray-200 group-hover:shadow-md transition-all">
                    <stat.icon size={15} style={{ color: stat.color }} />
                  </div>
                  <div className="text-xl md:text-xl font-bold text-[#1a237e]">{stat.value}</div>
                  <div className="text-xs font-medium text-gray-600 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Services Section */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-2 rounded-full mb-4">
                <Sparkles size={16} className="text-blue-600" />
                <span className="text-[#1a237e] font-semibold text-sm uppercase tracking-wider">
                  Digital Services
                </span>
                <TrendingUp size={16} className="text-blue-600" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a237e] font-Sans-serif mb-4">
                Integrated Government Services
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Single access point to all Central & State Government digital services
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, idx) => (
                <Link
                  key={idx}
                  href={service.href}
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-[#1a237e]/30 hover:-translate-y-2"
                >
                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1a237e]/0 to-[#1a237e]/0 group-hover:from-[#1a237e]/5 group-hover:to-[#1a237e]/5 transition-all duration-500"></div>
                  
                  {/* Top Badge */}
                  {service.badge && (
                    <div className="absolute top-4 right-4 z-20">
                      <span className="px-3 py-1.5 bg-gradient-to-r from-[#1a237e] to-[#283593] text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                        <Sparkles size={10} />
                        {service.badge}
                      </span>
                    </div>
                  )}

                  <div className="p-7 relative z-10">
                    {/* Icon and Title Section */}
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 relative overflow-hidden"
                          style={{ backgroundColor: `${service.color}15` }}
                        >
                          <div 
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            style={{ 
                              background: `linear-gradient(135deg, ${service.color}10 0%, transparent 100%)` 
                            }}
                          />
                          <service.icon size={30} style={{ color: service.color }} className="relative z-10" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 group-hover:text-[#1a237e] transition-colors">
                            {service.title}
                          </h3>
                          <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            {service.stats}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="text-gray-400 group-hover:text-[#1a237e] group-hover:translate-x-2 transition-all duration-300" size={22} />
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-sm leading-relaxed mb-5 pl-20">
                      {service.desc}
                    </p>

                    {/* Bottom Info Bar */}
                    <div className="flex items-center justify-between pl-20 pt-4 border-t border-gray-100 group-hover:border-[#1a237e]/20 transition-colors">
                      <span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-green-500" />
                        Govt. Verified
                      </span>
                      <span className="text-xs font-semibold text-[#1a237e] opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                        Explore →
                      </span>
                    </div>
                  </div>

                  {/* Simple Blue Bottom Border */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-blue-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-14">
              <Link
                href="/services"
                className="inline-flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-[#1a237e] to-[#283593] text-white rounded-xl font-semibold hover:from-[#0d1757] hover:to-[#1a237e] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 group"
              >
                View All Services 
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider bg-blue-50 px-4 py-1.5 rounded-full">
                  Why Samraddh Bharat
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-[#1a237e] font-Sans-serif mt-4 mb-6">
                  Citizen-Centric Digital Governance
                </h2>
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  Built on the principles of transparency, efficiency, and accessibility under the National e-Governance Plan.
                </p>
                
                <ul className="space-y-4">
                  {features.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 size={14} />
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Video Section with YouTube Embed */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a237e]/5 to-blue-100/50 rounded-3xl blur-3xl"></div>
                <div className="relative bg-gradient-to-br from-[#f0f2f5] to-white p-8 rounded-3xl shadow-xl border border-gray-200">
                  <h3 className="text-xl font-bold text-[#1a237e] mb-4 flex items-center gap-2">
                    <Play size={20} className="text-blue-600" fill="#1a237e" />
                    Official Tutorial Video
                  </h3>
                  
                  {/* YouTube Video Embed */}
                 <div className="aspect-video rounded-xl overflow-hidden shadow-lg border-2 border-white bg-gray-900">
  <iframe 
    width="100%" 
    height="100%" 
    src="https://www.youtube.com/embed/AR3IuNG5Uj4"
    title="Samraddh Bharat Official Tutorial"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
    allowFullScreen
    className="w-full h-full"
    loading="lazy"
  />
</div>

                  <div className="mt-6 grid grid-cols-3 gap-3">
                    {["Aadhaar", "DigiLocker", "UMANG"].map((item, i) => (
                      <div key={i} className="bg-white p-3 rounded-lg text-center shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="font-bold text-[#1a237e] text-sm">{item}</div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {i === 0 ? "Verified" : i === 1 ? "Integrated" : "App"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-[#0a1550] via-[#1a237e] to-[#0f1a5c] text-white">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl md:text-4xl font-bold font-Fantasy mb-4">
              Join the Digital India Mission
            </h2>
            <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
              Register today and access hundreds of government services from the comfort of your home.
            </p>
            <div className="flex flex-wrap justify-center gap-5">
              <Link
                href="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                Create Free Account
              </Link>
              <Link
                href="/login"
                className="bg-transparent hover:bg-white/10 text-white border-2 border-white/40 px-10 py-4 rounded-xl font-semibold text-lg transition-all"
              >
                Sign In
              </Link>
            </div>
            <p className="text-blue-200 text-sm mt-8">
              📞 National Helpline: 1800-XXX-XXXX | 🔒 256-bit SSL Secured
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}