'use client';
import React from 'react';

const HomeTwo = () => (
    <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
            {/* Simple Header */}
            <div className="text-center mb-12">
                <div className="inline-block bg-[#FF9933]/10 px-4 py-1 rounded-full mb-3">
                    <span className="text-xs font-bold text-[#FF9933]">DIGITAL INDIA INITIATIVE</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                    About <span className="text-[#138808]">Samraddh Bharat</span> Foundation
                </h2>
                <div className="w-20 h-0.5 bg-[#FF9933] mx-auto"></div>
            </div>

            {/* Simple Grid */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Left - Text */}
                <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                        Welcome to <span className="text-[#138808]">SAMRADDH BHARAT</span>
                    </h3>
                    
                    <div className="space-y-5 text-gray-600">
                        <p className="text-base md:text-lg leading-relaxed">
                            <strong className="text-[#138808] text-base md:text-lg">Samraddh Bharat Foundation</strong> is a premier digital ecosystem transforming rural governance through cutting-edge technology integration and innovative solutions.
                        </p>
                        
                        <p className="text-base md:text-lg leading-relaxed">
                            We seamlessly integrate <strong className="text-gray-800">Education, Healthcare, Agriculture, Finance, NGO Operations, and Media</strong> into a unified, powerful platform for efficient service delivery across the nation.
                        </p>
                        
                        <p className="text-base md:text-lg leading-relaxed">
                            Our platform connects <strong className="text-gray-800">villages to state level</strong>, ensuring transparent, accountable, and citizen-centric governance for every Indian.
                        </p>
                        
                        <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-[#FF9933]">
                            <p className="text-base md:text-lg text-gray-700 font-semibold">
                                "Sabka Saath, Sabka Vikas, Sabka Vishwas"
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                Ensuring transparent governance from village panchayats to state administration
                            </p>
                        </div>
                    </div>

                    {/* Simple Stats */}
                    <div className="grid grid-cols-2 gap-3 mt-8">
                        {[
                            { value: '50+', label: 'Digital Services' },
                            { value: '8', label: 'Core Modules' },
                            { value: '28+', label: 'States/UTs' },
                            { value: '24/7', label: 'Support Available' },
                        ].map((stat, idx) => (
                            <div key={idx} className="bg-gray-50 rounded-lg p-3 text-center hover:shadow-md transition">
                                <p className="text-xl font-bold text-[#138808]">{stat.value}</p>
                                <p className="text-xs text-gray-600 font-medium">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right - Compressed Image */}
                <div>
                    <img
                        src="https://i.pinimg.com/736x/8b/94/6c/8b946c6b3a6d452dbea16a0ac556aa4d.jpg"
                        alt="Digital India"
                        className="w-full rounded-lg shadow-md hover:shadow-lg transition"
                        loading="lazy"
                        width="300"
                        height="100"
                    />
                </div>
            </div>

            {/* Simple Bottom Bar */}
            <div className="mt-12 pt-6 border-t text-center">
                <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">🔒 256-bit Encrypted</span>
                    <span className="flex items-center gap-1">⚡ 99.9% Uptime</span>
                    <span className="flex items-center gap-1">🛡️ CERT-In Compliant</span>
                    <span className="flex items-center gap-1">📱 Web + Mobile</span>
                </div>
            </div>
        </div>
    </section>
);

export default HomeTwo;