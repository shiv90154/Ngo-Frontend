'use client';
import React from 'react';

const STATS = [
    { label: 'Live Users', value: '2,34,567+', icon: '👥' },
    { label: "Today's Services", value: '1,23,456', icon: '⚡' },
    { label: 'Satisfaction', value: '98.5%', icon: '😊' },
    { label: 'Villages Covered', value: '1,25,000+', icon: '🏘️' },
];

const HomeTwo = () => (
    <>
        {/* ── Stats Bar ── */}
        <section className="relative -mt-14 z-20 container mx-auto px-4">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 p-5 md:p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-x-0 md:divide-x divide-gray-100">
                    {STATS.map(({ label, value, icon }, idx) => (
                        <div key={idx} className="text-center group px-4">
                            <div className="text-3xl mb-1.5 group-hover:scale-110 transition-transform duration-200">
                                {icon}
                            </div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
                            <p className="text-2xl md:text-3xl font-black text-[#138808]">{value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* ── Mission Section ── */}
        <section className="py-24 px-4 bg-white">
            <div className="container mx-auto max-w-6xl">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        {/* Tricolor accent */}
                        <div className="flex gap-1 mb-5">
                            <span className="w-10 h-1.5 rounded-full bg-[#FF9933]" />
                            <span className="w-10 h-1.5 rounded-full bg-gray-200" />
                            <span className="w-10 h-1.5 rounded-full bg-[#138808]" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                            Welcome to<br />
                            <span className="text-[#138808]">Samraddh Bharat</span><br />
                            Foundation
                        </h2>
                        <p className="text-gray-600 leading-relaxed text-lg mb-6">
                            A unified digital ecosystem integrating <strong className="text-gray-800">Education, Healthcare,
                                Agriculture, Finance, NGO operations,</strong> and Media into a single platform.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            Our mission is to provide seamless, transparent, and efficient delivery of services
                            from village to state level, ensuring{' '}
                            <strong className="text-[#FF9933]">"Sabka Saath, Sabka Vikas, Sabka Vishwas"</strong>{' '}
                            through technology-driven governance.
                        </p>

                        <div className="mt-8 grid grid-cols-2 gap-4">
                            {[
                                { num: '50+', txt: 'Digital Services' },
                                { num: '8', txt: 'Core Modules' },
                                { num: '28+', txt: 'States Covered' },
                                { num: '24/7', txt: 'Support Active' },
                            ].map(({ num, txt }) => (
                                <div key={txt} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                                    <span className="text-2xl font-black text-[#FF9933]">{num}</span>
                                    <span className="text-sm font-semibold text-gray-600">{txt}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="rounded-2xl overflow-hidden shadow-2xl">
                            <img
                                src="https://images.pexels.com/photos/2284166/pexels-photo-2284166.jpeg?auto=compress&cs=tinysrgb&w=1200"
                                alt="Indian village community"
                                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                                loading="lazy"
                            />
                        </div>
                        {/* Floating badge */}
                        <div className="absolute -bottom-5 -left-5 bg-[#FF9933] text-white rounded-2xl p-4 shadow-xl">
                            <p className="text-2xl font-black">2024</p>
                            <p className="text-xs font-bold opacity-90">Founded</p>
                        </div>
                        <div className="absolute -top-5 -right-5 bg-[#138808] text-white rounded-2xl p-4 shadow-xl">
                            <p className="text-2xl font-black">🏆</p>
                            <p className="text-xs font-bold opacity-90">Govt. Certified</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>
);

export default HomeTwo;
