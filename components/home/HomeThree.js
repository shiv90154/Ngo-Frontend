'use client';
import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';

const MODULES = [
    { icon: '🎓', title: 'Education', desc: 'Online courses, live classes, test series, certificates, and teacher earnings dashboard.', accent: '#FF9933', path: '/services/education' },
    { icon: '🏥', title: 'Healthcare', desc: 'Doctor search, video consultation, health records, prescription & AI disease detection.', accent: '#138808', path: '/services/healthcare' },
    { icon: '🌾', title: 'Agriculture', desc: 'Farmer registration, crop management, product selling, AI crop disease detection.', accent: '#FF9933', path: '/services/agriculture' },
    { icon: '💰', title: 'Finance', desc: 'Digital wallet, money transfer, AEPS, bill payments, loans & EMI system.', accent: '#138808', path: '/services/finance' },
    { icon: '📺', title: 'News & Media', desc: 'News posting, video editing, live streaming, ads & monetization platform.', accent: '#FF9933', path: '/services/media' },
    { icon: '💼', title: 'CRM & IT', desc: 'Client management, GST billing, project tracking, and team management tools.', accent: '#138808', path: '/services/crm' },
    { icon: '🏪', title: 'Village Store', desc: 'Ayurvedic products, agricultural goods, digital services, product exchange system.', accent: '#FF9933', path: '/services/store' },
    { icon: '🤝', title: 'Franchise & MLM', desc: 'Multi-level income distribution, weekly payouts, team hierarchy earnings.', accent: '#138808', path: '/services/franchise' },
];

const ModuleCard = React.memo(({ icon, title, desc, accent, onExplore }) => (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer"
        onClick={onExplore}>
        {/* Top accent bar */}
        <div className="h-1.5 w-full" style={{ backgroundColor: accent }} />
        <div className="p-6 text-center">
            <div className="text-5xl mb-4 inline-block transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                {icon}
            </div>
            <h3 className="text-lg font-bold mb-2 text-gray-800">{title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            <span
                className="mt-4 inline-flex items-center gap-1 text-xs font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0"
                style={{ color: accent }}>
                Explore Module →
            </span>
        </div>
    </div>
));
ModuleCard.displayName = 'ModuleCard';

const HomeThree = () => {
    const router = useRouter();
    const handleExplore = useCallback((path) => router.push(path), [router]);

    return (
        <section id="modules" className="py-24 px-4 bg-gray-50">
            <div className="container mx-auto">
                {/* Heading */}
                <div className="text-center mb-14">
                    <div className="inline-flex gap-1.5 mb-5">
                        <span className="w-8 h-1.5 rounded-full bg-[#FF9933]" />
                        <span className="w-8 h-1.5 rounded-full bg-gray-300" />
                        <span className="w-8 h-1.5 rounded-full bg-[#138808]" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                        Integrated Core Modules
                    </h2>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                        Complete digital ecosystem for governance and citizen services
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {MODULES.map((mod) => (
                        <ModuleCard key={mod.title} {...mod} onExplore={() => handleExplore(mod.path)} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HomeThree;