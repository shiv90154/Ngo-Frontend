"use client";

import { useState, useMemo } from "react";
import { Search, X, ChevronDown } from "lucide-react";

// FAQ Data (same as before)
const faqData = [
    {
        id: 1,
        category: "General",
        question: "What is Samraddh Bharat?",
        answer: "Samraddh Bharat is a digital platform dedicated to supporting education, skill development, and holistic growth for individuals across India.",
    },
    {
        id: 2,
        category: "General",
        question: "What is the mission of Samraddh Bharat?",
        answer: "Our mission is to empower every individual with accessible education and development opportunities.",
    },
    {
        id: 3,
        category: "Account",
        question: "How can I register on Samraddh Bharat?",
        answer: "Click on the 'Sign Up' button on the login page and provide your details.",
    },
    {
        id: 4,
        category: "Account",
        question: "How do I reset my password?",
        answer: "Use the 'Forgot Password' option and follow instructions sent to your email.",
    },
    {
        id: 5,
        category: "Account",
        question: "Can I delete my account?",
        answer: "Yes, from Settings > Account > Delete Account. This action is permanent.",
    },
    {
        id: 6,
        category: "Payment",
        question: "Is Samraddh Bharat free to use?",
        answer: "Basic features are free. Premium courses require payment.",
    },
    {
        id: 7,
        category: "Payment",
        question: "What payment methods do you accept?",
        answer: "We accept cards, UPI, net banking, and EMI options.",
    },
    {
        id: 8,
        category: "Payment",
        question: "Can I get a refund?",
        answer: "Yes, within 7 days if less than 20% course is completed.",
    },
    {
        id: 9,
        category: "Courses",
        question: "What types of courses are available?",
        answer: "Digital skills, professional development, academic, and vocational courses.",
    },
    {
        id: 10,
        category: "Courses",
        question: "How do I enroll?",
        answer: "Click 'Enroll Now' on the course page.",
    },
    {
        id: 11,
        category: "Courses",
        question: "Will I receive a certificate?",
        answer: "Yes, after successful completion.",
    },
    {
        id: 12,
        category: "Courses",
        question: "Can I access on mobile?",
        answer: "Yes, platform is fully responsive.",
    },
    {
        id: 13,
        category: "Technical Support",
        question: "Videos not loading?",
        answer: "Check internet, clear cache, or switch browser.",
    },
    {
        id: 14,
        category: "Technical Support",
        question: "How to contact support?",
        answer: "Email or use live chat from dashboard.",
    },
    {
        id: 15,
        category: "Community",
        question: "Is there a community forum?",
        answer: "Yes, available in dashboard.",
    },
    {
        id: 16,
        category: "Community",
        question: "Can I become a mentor?",
        answer: "Apply via 'Become a Mentor' page.",
    },
    {
        id: 17,
        category: "General",
        question: "Are scholarships available?",
        answer: "Yes, need-based and merit-based.",
    },
    {
        id: 18,
        category: "Account",
        question: "How to update profile?",
        answer: "Go to 'My Profile' and edit details.",
    },
];

export default function Faq() {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [expanded, setExpanded] = useState([]);

    // Get unique categories with counts
    const categories = useMemo(() => {
        const counts = {};
        faqData.forEach((item) => {
            counts[item.category] = (counts[item.category] || 0) + 1;
        });
        return [{ name: "All", count: faqData.length }, ...Object.entries(counts).map(([name, count]) => ({ name, count }))];
    }, []);

    // Filter FAQs based on search and category
    const filteredData = useMemo(() => {
        return faqData.filter((item) => {
            const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
            const matchesSearch =
                item.question.toLowerCase().includes(search.toLowerCase()) ||
                item.answer.toLowerCase().includes(search.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [search, selectedCategory]);

    const handleToggle = (id) => {
        setExpanded((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleClearFilters = () => {
        setSearch("");
        setSelectedCategory("All");
        setExpanded([]);
    };

    return (
        <div className="max-w-[900px] mx-auto py-12 px-4">
            {/* Hero Section */}
            <div className="bg-slate-50 p-6 md:p-8 rounded-2xl mb-8 text-center shadow-sm">
                <h1 className="text-3xl md:text-5xl font-bold text-[#1e3a5f] mb-3">
                    Frequently Asked Questions
                </h1>
                <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
                    Find quick answers to common questions about Samraddh Bharat services, account, courses, and more.
                </p>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search by question or answer..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {search && (
                    <button
                        onClick={() => setSearch("")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Category Chips */}
            <div className="flex flex-wrap gap-2 mb-6 items-center">
                {categories.map((cat) => (
                    <button
                        key={cat.name}
                        onClick={() => setSelectedCategory(cat.name)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${selectedCategory === cat.name
                                ? "bg-blue-600 text-white shadow-md"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        {cat.name} ({cat.count})
                    </button>
                ))}
                {selectedCategory !== "All" && (
                    <button
                        onClick={handleClearFilters}
                        className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 ml-2"
                    >
                        <X className="w-4 h-4" /> Clear filters
                    </button>
                )}
            </div>

            {/* FAQs List */}
            {filteredData.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-12 text-center">
                    <p className="text-gray-500 text-lg">😔 No FAQs match your search.</p>
                    <button
                        onClick={handleClearFilters}
                        className="mt-4 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                    >
                        Clear filters
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredData.map((item) => (
                        <div
                            key={item.id}
                            className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white"
                        >
                            <button
                                onClick={() => handleToggle(item.id)}
                                className="w-full flex justify-between items-center p-4 text-left font-semibold text-gray-800 hover:bg-gray-50 transition"
                            >
                                <span>{item.question}</span>
                                <ChevronDown
                                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${expanded.includes(item.id) ? "rotate-180" : ""
                                        }`}
                                />
                            </button>
                            {expanded.includes(item.id) && (
                                <div className="p-4 pt-0 text-gray-600 border-t border-gray-100 bg-gray-50/50">
                                    {item.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Footer note */}
            <div className="mt-10 text-center text-sm text-gray-500">
                Still have questions? Contact us at{" "}
                <a href="mailto:support@samraddhbharat.com" className="text-blue-600 hover:underline">
                    support@samraddhbharat.com
                </a>
            </div>
        </div>
    );
}