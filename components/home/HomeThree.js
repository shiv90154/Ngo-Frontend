'use client';
import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';

const MODULES = [
    { 
        title: 'Education', 
        desc: 'Online courses, live classes, test series, certificates, and teacher earnings dashboard.',
        shortDesc: 'Empowering learners and educators',
        image: 'https://cdn-icons-png.flaticon.com/512/3050/3050525.png',
        path: '/services/education' 
    },
    { 
        title: 'Healthcare', 
        desc: 'Doctor search, video consultation, health records, prescription & AI disease detection.',
        shortDesc: 'Quality healthcare at your doorstep',
        image: 'https://cdn-icons-png.flaticon.com/512/2966/2966327.png',
        path: '/services/healthcare' 
    },
    { 
        title: 'Agriculture', 
        desc: 'Farmer registration, crop management, product selling, AI crop disease detection.',
        shortDesc: 'Smart farming for better yield',
        image: 'https://cdn-icons-png.flaticon.com/512/2950/2950553.png',
        path: '/services/agriculture' 
    },
    { 
        title: 'Finance', 
        desc: 'Digital wallet, money transfer, AEPS, bill payments, loans & EMI system.',
        shortDesc: 'Financial inclusion for all',
        image: 'https://cdn-icons-png.flaticon.com/512/2949/2949407.png',
        path: '/services/finance' 
    },
    { 
        title: 'News & Media', 
        desc: 'News posting, video editing, live streaming, ads & monetization platform.',
        shortDesc: 'Voice of rural India',
        image: 'https://cdn-icons-png.flaticon.com/512/2926/2926732.png',
        path: '/services/media' 
    },
    { 
        title: 'CRM & IT', 
        desc: 'Client management, GST billing, project tracking, and team management tools.',
        shortDesc: 'Streamline your business',
        image: 'https://cdn-icons-png.flaticon.com/512/2784/2784459.png',
        path: '/services/crm' 
    },
    { 
        title: 'Village Store', 
        desc: 'Ayurvedic products, agricultural goods, digital services, product exchange system.',
        shortDesc: 'Local products, global reach',
        image: 'https://cdn-icons-png.flaticon.com/512/3081/3081755.png',
        path: '/services/store' 
    },
    { 
        title: 'Franchise & MLM', 
        desc: 'Multi-level income distribution, weekly payouts, team hierarchy earnings.',
        shortDesc: 'Grow with us',
        image: 'https://cdn-icons-png.flaticon.com/512/2991/2991115.png',
        path: '/services/franchise' 
    },
];

const ModuleCard = React.memo(({ title, desc, shortDesc, image, onExplore }) => (
    <div 
        className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer transform hover:-translate-y-2"
        onClick={onExplore}
    >
        {/* Image Section */}
        <div className="relative overflow-hidden h-40 bg-gradient-to-br from-gray-50 to-gray-100">
            <img 
                src={image} 
                alt={title}
                className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        <div className="p-5">
            {/* Title */}
            <h3 className="text-xl font-bold text-center mb-2 text-gray-800 group-hover:text-[#138808] transition-colors duration-300">
                {title}
            </h3>
            
            {/* Short Description */}
            <p className="text-xs text-center text-[#FF9933] font-semibold mb-3 uppercase tracking-wide">
                {shortDesc}
            </p>
            
            {/* Main Description */}
            <p className="text-gray-600 text-sm leading-relaxed text-center line-clamp-3">
                {desc}
            </p>
            
            {/* Button */}
            <div className="mt-5 flex justify-center">
                <button
                    className="px-5 py-2 rounded-lg text-xs font-semibold transition-all duration-300 bg-gray-100 text-gray-700 hover:bg-[#138808] hover:text-white hover:shadow-md"
                >
                    Learn More →
                </button>
            </div>
        </div>
    </div>
));

ModuleCard.displayName = 'ModuleCard';

const HomeThree = () => {
    const router = useRouter();
    
    const handleExplore = useCallback((path) => {
        router.push(path);
    }, [router]);

    return (
        <section id="modules" className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto max-w-7xl">
                {/* Heading Section */}
                <div className="text-center mb-14">
                    {/* Simple Accent */}
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-1 bg-[#FF9933] rounded-full"></div>
                    </div>
                    
                    {/* Main Title */}
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Our <span className="text-[#138808]">Integrated Core</span> Modules
                    </h2>
                    
                    {/* Subtitle */}
                    <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
                        Complete digital ecosystem for governance and citizen services
                    </p>
                </div>

                {/* Modules Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {MODULES.map((mod) => (
                        <ModuleCard 
                            key={mod.title} 
                            {...mod} 
                            onExplore={() => handleExplore(mod.path)} 
                        />
                    ))}
                </div>
                
                {/* Bottom Section */}
                <div className="text-center mt-12 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                        🚀 Empowering India through digital innovation
                    </p>
                </div>
            </div>
        </section>
    );
};

export default HomeThree;