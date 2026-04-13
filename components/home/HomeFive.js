'use client';
import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';

const INITIATIVES = [
    { title: 'Digital Literacy Mission', desc: 'Empowering rural India with digital skills and computer education.', tag: 'Education', icon: '💻' },
    { title: 'Ayushman Telehealth', desc: 'Affordable healthcare consultations via video and AI support.', tag: 'Healthcare', icon: '🏥' },
    { title: 'Smart Kisan Samriddhi', desc: 'Real-time crop advisories and direct market access for farmers.', tag: 'Agriculture', icon: '🚜' },
    { title: 'Jan Dhan Fintech', desc: 'Banking, AEPS, and micro-loans for every village citizen.', tag: 'Finance', icon: '💰' },
    { title: 'Gramin Media Network', desc: 'Local news, live events, and monetization for content creators.', tag: 'Media', icon: '📡' },
    { title: 'e-Panchayat ERP', desc: 'GST billing, project tracking, and digital governance for local bodies.', tag: 'CRM & IT', icon: '🏛️' },
];

const TAG_COLORS = {
    Education: { bg: '#FFF3E0', text: '#FF9933' },
    Healthcare: { bg: '#E8F5E9', text: '#138808' },
    Agriculture: { bg: '#FFF3E0', text: '#FF9933' },
    Finance: { bg: '#E8F5E9', text: '#138808' },
    Media: { bg: '#FFF3E0', text: '#FF9933' },
    'CRM & IT': { bg: '#E8F5E9', text: '#138808' },
};

const InitiativeCard = React.memo(({ title, desc, tag, icon }) => {
    const colors = TAG_COLORS[tag] || { bg: '#f3f4f6', text: '#374151' };
    return (
        <div className="group bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 border border-gray-100">
            <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="text-3xl group-hover:scale-110 transition-transform duration-200 shrink-0">
                    {icon}
                </div>
                
                {/* Content */}
                <div className="flex-1">
                    {/* Tag */}
                    <span className="inline-block text-[10px] font-bold px-2 py-1 rounded-full uppercase"
                        style={{ backgroundColor: colors.bg, color: colors.text }}>
                        {tag}
                    </span>
                    
                    {/* Title */}
                    <h3 className="text-base font-bold mt-2 mb-1 text-gray-800 group-hover:text-[#138808] transition-colors">
                        {title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-500 text-xs leading-relaxed">
                        {desc}
                    </p>
                </div>
            </div>
        </div>
    );
});
InitiativeCard.displayName = 'InitiativeCard';

const HomeFive = () => {
    const router = useRouter();
    const goFranchise = useCallback(() => router.push('/franchise'), [router]);

    return (
        <>
            {/* ── Flagship Initiatives Section ── */}
            <section className="py-16 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-block bg-gradient-to-r from-[#FF9933]/10 to-[#138808]/10 px-4 py-1 rounded-full mb-3">
                            <span className="text-xs font-bold text-[#FF9933]">OUR INITIATIVES</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                            Flagship <span className="text-[#138808]">Initiatives</span>
                        </h2>
                        <p className="text-gray-500 text-sm">
                            Transforming India — One initiative at a time
                        </p>
                    </div>

                    {/* Initiatives Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {INITIATIVES.map((item) => (
                            <InitiativeCard key={item.title} {...item} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Franchise Highlight Section ── */}
            <section className="py-16 px-4 bg-gradient-to-br from-[#FF9933]/5 to-[#138808]/5">
                <div className="container mx-auto max-w-5xl">
                    <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 text-center relative overflow-hidden">
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF9933]/5 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#138808]/5 rounded-full blur-2xl"></div>

                        <div className="relative z-10">
                            {/* Icon */}
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#FF9933] to-[#138808] rounded-2xl mb-5 shadow-lg">
                                <span className="text-3xl">🤝</span>
                            </div>
                            
                            {/* Title */}
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                Franchise & MLM System
                            </h2>
                            
                            <p className="text-gray-500 text-sm mb-4">
                                Multi-level income distribution with weekly payouts
                            </p>
                            
                            {/* Features */}
                            <div className="flex flex-wrap justify-center gap-2 mb-6">
                                {['Weekly Payouts', 'Team Hierarchy', 'Passive Income', 'Nationwide Network'].map((f) => (
                                    <span key={f} className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-700 font-medium">
                                        {f}
                                    </span>
                                ))}
                            </div>
                            
                            {/* Button */}
                            <button onClick={goFranchise}
                                className="px-8 py-2.5 rounded-lg font-bold text-sm text-white bg-[#138808] hover:bg-[#0a5c06] hover:shadow-lg transition-all duration-300">
                                Become a Partner →
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default HomeFive;