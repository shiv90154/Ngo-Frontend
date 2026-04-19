import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight, Search, Filter } from "lucide-react";
import Link from "next/link";

// Sample schemes data
const schemes = [
  {
    id: 1,
    title: "PM Kisan Samman Nidhi",
    ministry: "Ministry of Agriculture",
    description: "Direct income support of ₹6,000 per year to eligible farmer families.",
    category: "Agriculture",
    eligibility: "Small and marginal farmers",
    benefit: "₹6,000 per annum",
    link: "#",
  },
  {
    id: 2,
    title: "Ayushman Bharat - PMJAY",
    ministry: "Ministry of Health",
    description: "Health insurance cover of ₹5 lakh per family per year for secondary and tertiary care.",
    category: "Healthcare",
    eligibility: "Poor and vulnerable families",
    benefit: "₹5 lakh health cover",
    link: "#",
  },
  {
    id: 3,
    title: "Pradhan Mantri Awas Yojana (Gramin)",
    ministry: "Ministry of Rural Development",
    description: "Assistance for construction of pucca house with basic amenities.",
    category: "Housing",
    eligibility: "Rural BPL families",
    benefit: "Up to ₹1.20 lakh",
    link: "#",
  },
  {
    id: 4,
    title: "National Scholarship Portal",
    ministry: "Ministry of Education",
    description: "One-stop platform for various scholarships offered by central and state governments.",
    category: "Education",
    eligibility: "Students from economically weaker sections",
    benefit: "Variable",
    link: "#",
  },
  {
    id: 5,
    title: "Stand-Up India",
    ministry: "Ministry of Finance",
    description: "Bank loans between ₹10 lakh and ₹1 crore to SC/ST and women entrepreneurs.",
    category: "Finance",
    eligibility: "SC/ST and women entrepreneurs",
    benefit: "Loans up to ₹1 crore",
    link: "#",
  },
  {
    id: 6,
    title: "Digital India Programme",
    ministry: "MeitY",
    description: "Transforming India into a digitally empowered society and knowledge economy.",
    category: "IT & Digital",
    eligibility: "All citizens",
    benefit: "Digital infrastructure",
    link: "#",
  },
];

export default function SchemesPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-[#f8fafc]">
        {/* Header */}
        <section className="bg-gradient-to-r from-[#1a237e] to-[#283593] text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-bold font-serif mb-2">Government Schemes</h1>
            <p className="text-blue-100">Explore and apply for various central and state government schemes</p>
          </div>
        </section>
        <div className="h-1 flex">
          <div className="w-1/3 bg-[#FF9933]"></div>
          <div className="w-1/3 bg-white"></div>
          <div className="w-1/3 bg-[#138808]"></div>
        </div>

        {/* Search and Filter */}
        <section className="py-8 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:w-96">
                <input
                  type="text"
                  placeholder="Search schemes by name, ministry, or category..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a237e] focus:border-[#1a237e] outline-none"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
              <div className="flex gap-2">
                <select className="px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-[#1a237e] outline-none">
                  <option>All Categories</option>
                  <option>Agriculture</option>
                  <option>Education</option>
                  <option>Healthcare</option>
                  <option>Housing</option>
                  <option>Finance</option>
                  <option>IT & Digital</option>
                </select>
                <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition">
                  <Filter size={16} /> Filter
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Schemes Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {schemes.map((scheme) => (
                <div
                  key={scheme.id}
                  className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition overflow-hidden flex flex-col"
                >
                  <div className="p-5 flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-semibold px-2 py-1 bg-[#1a237e]/10 text-[#1a237e] rounded-full">
                        {scheme.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{scheme.title}</h3>
                    <p className="text-xs text-gray-500 mb-2">{scheme.ministry}</p>
                    <p className="text-sm text-gray-600 mb-3">{scheme.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div>
                        <span className="text-gray-500">Eligibility:</span>
                        <p className="font-medium">{scheme.eligibility}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Benefit:</span>
                        <p className="font-medium">{scheme.benefit}</p>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 p-4 bg-gray-50">
                    <Link
                      href={scheme.link}
                      className="text-[#1a237e] font-medium text-sm inline-flex items-center gap-1 hover:underline"
                    >
                      View Details <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <button className="bg-white border border-[#1a237e] text-[#1a237e] px-6 py-2.5 rounded-lg font-medium hover:bg-[#1a237e]/5 transition">
                Load More Schemes
              </button>
            </div>
          </div>
        </section>

        {/* Info Note */}
        <section className="pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-blue-50 border-l-4 border-[#1a237e] p-4 rounded-r-lg">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> This is a representative list of popular schemes. For a complete and updated list, please visit the respective ministry websites or contact our helpline at 1800-111-555.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}