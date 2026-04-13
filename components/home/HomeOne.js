'use client';
import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';

const ScrollIndicator = () => (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/70 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/80 rounded-full" />
        </div>
    </div>
);

const HomeOne = () => {
    const router = useRouter();

    const handleExplore = useCallback(() => {
        document.getElementById('modules')?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    const handleRegister = useCallback(() => router.push('/register'), [router]);

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0">
                <img
                    src="https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?auto=compress&cs=tinysrgb&w=1600"
                    alt="Indian village landscape"
                    className="w-full h-full object-cover"
                    loading="eager"
                />
                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-[#138808]/50 to-black/60" />
                {/* Tricolor bottom glow */}
                <div className="absolute bottom-0 left-0 right-0 h-1 flex">
                    <div className="flex-1 bg-[#FF9933]" />
                    <div className="flex-1 bg-white/60" />
                    <div className="flex-1 bg-[#138808]" />
                </div>
            </div>

            <div className="container mx-auto px-4 text-center relative z-10">
                <div className="max-w-4xl mx-auto">
                    {/* Badge */}
                    <span className="inline-flex items-center mt-10 gap-2 px-5 py-2 bg-white/15 backdrop-blur-sm rounded-full text-white text-xs font-bold mb-8 tracking-widest uppercase border border-white/20">
                        🇮🇳 Government of India Initiative
                    </span>

                    {/* Headline */}
                    <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-white drop-shadow-2xl mb-4 leading-none tracking-tight">
                        Samraddh<br />
                        <span className="text-[#FF9933]">Bharat</span>
                    </h1>

                    <p className="text-2xl md:text-3xl font-light text-white/90 mb-2 tracking-wide">
                        समृद्ध भारत · विकसित भारत
                    </p>
                    <p className="text-base md:text-lg text-gray-200 mb-2 font-medium">
                        Integrated Digital Management System
                    </p>
                    <p className="text-sm text-gray-300 mb-10">
                        Web Portal + Mobile Application &nbsp;|&nbsp; Village to State Level Digital Governance
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={handleExplore}
                            className="px-8 py-3.5 rounded-xl font-bold text-base bg-white text-[#138808] hover:bg-gray-100 shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95">
                            Explore Modules ↓
                        </button>
                        <button
                            onClick={handleRegister}
                            className="px-8 py-3.5 rounded-xl font-bold text-base border-2 border-white text-white hover:bg-white hover:text-[#138808] transition-all duration-300 hover:scale-105">
                            Get Started Free →
                        </button>
                    </div>

                    {/* Trust badges */}
                    <div className="mt-12 flex flex-wrap justify-center gap-6">
                        {['ISO 27001 Certified', '256-bit Encrypted', 'CERT-In Compliant'].map((badge) => (
                            <span key={badge} className="flex items-center gap-1.5 text-xs text-white/80 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                                <span className="text-[#FF9933]">✓</span> {badge}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <ScrollIndicator />
        </section>
    );
};

export default HomeOne;