'use client';
import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';

// STRICT 6 MODULE LIMIT as requested: Agriculture, Finance, Education, News and Social, IT, Healthcare
const MODULES = [
    { id: 'SEC-01', title: 'Agriculture', desc: 'Direct market linkages, crop pricing advisories, subsidy tracking, and farmer registration portals.', icon: '🌾', path: '/services/agriculture' },
    { id: 'SEC-02', title: 'Finance', desc: 'Micro-loans processing, DBT (Direct Benefit Transfers), AEPS, and rural banking facilitation.', icon: '💰', path: '/services/finance' },
    { id: 'SEC-03', title: 'Education', desc: 'Syllabus distribution, online learning modules, and rural school integration programs.', icon: '🎓', path: '/services/education' },
    { id: 'SEC-04', title: 'Healthcare', desc: 'Primary health consultations, e-prescriptions, and maternal health record keeping.', icon: '🏥', path: '/services/healthcare' },
    { id: 'SEC-05', title: 'IT & CRM', desc: 'Citizen record management, grievance ticketing, and rural IT center administration.', icon: '💻', path: '/services/crm' },
    { id: 'SEC-06', title: 'News & Social', desc: 'Verified local broadcasts, social welfare updates, and community engagement portals.', icon: '📰', path: '/services/media' },
];

const HomeThree = () => {
    const router = useRouter();
    
    const handleExplore = useCallback((path) => {
        router.push(path);
    }, [router]);

    return (
        <section id="modules" className="py-16 bg-white border-y border-gray-300">
            <div className="govt-container">
                
                <div className="mb-10 text-center max-w-2xl mx-auto">
                    <span className="inline-block px-3 py-1 bg-[#fff2e6] text-[#FF7B00] text-[11px] font-bold uppercase tracking-widest border border-[#FF7B00]/30 rounded-sm mb-4">
                        National Operating Framework
                    </span>
                    <h2 className="text-3xl font-black text-gray-900 uppercase">
                        6 Pillars of Development
                    </h2>
                    <div className="h-1 w-20 bg-[#FF7B00] mx-auto mt-4 mb-4" />
                    <p className="text-sm text-gray-600 font-medium">
                        Our services are strictly categorized into six foundational sectors to ensure targeted and efficient delivery to all citizens.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MODULES.map((mod) => (
                        <div 
                            key={mod.id}
                            onClick={() => handleExplore(mod.path)}
                            className="bg-white border border-gray-300 hover:border-[#FF7B00] hover:shadow-md cursor-pointer transition-all flex flex-col h-full rounded-sm"
                        >
                            <div className="bg-gray-100 p-3 border-b border-gray-300 flex items-center justify-between">
                                <span className="text-[11px] font-bold text-gray-800 tracking-wider">Sector: {mod.id}</span>
                                <span className="text-xl opacity-80">{mod.icon}</span>
                            </div>
                            
                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-lg font-bold text-gray-900 uppercase mb-3">{mod.title}</h3>
                                <p className="text-[13px] text-gray-600 font-medium leading-relaxed mb-6 flex-1">
                                    {mod.desc}
                                </p>
                                
                                <div className="mt-auto flex items-center justify-between border-t border-gray-200 pt-4">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Available Services</span>
                                    <span className="text-[#FF7B00] text-sm font-bold">→</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
            </div>
        </section>
    );
};

export default HomeThree;