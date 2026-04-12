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
    Education: { bg: '#FFF3E0', text: '#8B3A00' },
    Healthcare: { bg: '#E8F5E9', text: '#0a5c06' },
    Agriculture: { bg: '#FFF3E0', text: '#8B3A00' },
    Finance: { bg: '#E8F5E9', text: '#0a5c06' },
    Media: { bg: '#FFF3E0', text: '#8B3A00' },
    'CRM & IT': { bg: '#E8F5E9', text: '#0a5c06' },
};

const InitiativeCard = React.memo(({ title, desc, tag, icon }) => {
    const colors = TAG_COLORS[tag] || { bg: '#f3f4f6', text: '#374151' };
    return (
        <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer border border-transparent hover:border-gray-100">
            <div className="flex items-start gap-4">
                <div className="text-3xl group-hover:scale-110 transition-transform duration-200 shrink-0">{icon}</div>
                <div>
                    <span className="inline-block text-[10px] font-black px-2.5 py-1 rounded-full tracking-wider uppercase"
                        style={{ backgroundColor: colors.bg, color: colors.text }}>
                        {tag}
                    </span>
                    <h3 className="text-base font-bold mt-2 mb-1 text-gray-800">{title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
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
            {/* ── Flagship Initiatives ── */}
            <section className="py-24 px-4 bg-white">
                <div className="container mx-auto">
                    <div className="text-center mb-14">
                        <div className="inline-flex gap-1.5 mb-5">
                            <span className="w-8 h-1.5 rounded-full bg-[#FF9933]" />
                            <span className="w-8 h-1.5 rounded-full bg-gray-200" />
                            <span className="w-8 h-1.5 rounded-full bg-[#138808]" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Flagship Initiatives</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                            Transforming India — One initiative at a time
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {INITIATIVES.map((item) => <InitiativeCard key={item.title} {...item} />)}
                    </div>
                </div>
            </section>

            {/* ── Franchise Highlight ── */}
            <section className="py-16 px-4 bg-[#E8F5E9]">
                <div className="container mx-auto max-w-4xl">
                    <div className="bg-white rounded-3xl p-10 shadow-2xl text-center relative overflow-hidden">
                        {/* Decorative circles */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#FF9933]/10" />
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-[#138808]/10" />

                        <div className="relative z-10">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FF9933]/10 rounded-2xl mb-5 text-4xl">
                                🤝
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
                                Franchise & MLM System
                            </h2>
                            <p className="text-gray-500 text-lg mb-2">Multi-level income distribution</p>
                            <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm">
                                {['Weekly Payouts', 'Team Hierarchy Earnings', 'Passive Income', 'Nationwide Network'].map((f) => (
                                    <span key={f} className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full text-gray-600 font-medium">
                                        <span className="text-[#138808]">✓</span> {f}
                                    </span>
                                ))}
                            </div>
                            <button onClick={goFranchise}
                                className="px-10 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#138808] to-[#0a5c06] hover:shadow-xl hover:scale-105 transition-all duration-300">
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