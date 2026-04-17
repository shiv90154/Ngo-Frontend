'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const HomeOne = () => {
    const router = useRouter();

    return (
        <section className="relative min-h-[75svh] flex items-center bg-gray-900 overflow-hidden">
            
            {/* Background Image requested by user */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.pexels.com/photos/1261730/pexels-photo-1261730.jpeg?auto=compress&cs=tinysrgb&w=1920"
                    alt="Indian context background"
                    className="w-full h-full object-cover opacity-30"
                />
                {/* Official Orange/Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/90 to-transparent" />
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#FF7B00]/20 to-transparent mix-blend-multiply" />
            </div>

            <div className="govt-container relative z-10 py-16">
                <div className="max-w-2xl">
                    <span className="inline-block px-3 py-1 mb-6 text-[10px] font-bold text-white bg-[#FF7B00] uppercase tracking-widest border border-[#cc6200] rounded-sm">
                        National Integration Portal
                    </span>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-6 uppercase tracking-tight">
                        Samraddh Bharat <br />
                        <span className="text-[#FF7B00]">Foundation</span>
                    </h1>

                    <p className="text-lg text-gray-300 font-medium mb-12 max-w-xl leading-relaxed border-l-4 border-[#FF7B00] pl-4">
                        A unified digital gateway providing transparent, high-speed administrative solutions and essential services to the rural and urban grass-roots level.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <button
                            onClick={() => router.push('/register')}
                            className="w-full sm:w-auto px-8 py-3.5 bg-[#FF7B00] text-white text-sm font-bold uppercase tracking-widest border-2 border-[#FF7B00] hover:bg-transparent hover:text-[#FF7B00] transition-colors rounded-sm"
                        >
                            Complete Registration
                        </button>
                        <button
                            onClick={() => document.getElementById('modules')?.scrollIntoView({ behavior: 'smooth' })}
                            className="w-full sm:w-auto px-8 py-3.5 bg-white/10 backdrop-blur-sm text-white text-sm font-bold uppercase tracking-widest border border-white/30 hover:bg-white hover:text-gray-900 transition-colors rounded-sm"
                        >
                            View Core Services
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Border */}
            <div className="absolute bottom-0 left-0 right-0 h-[6px] bg-[#FF7B00] z-20" />
        </section>
    );
};

export default HomeOne;