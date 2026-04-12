'use client';
import React from 'react';

const TESTIMONIALS = [
    {
        avatar: '👨‍🌾', name: 'Ramesh Kumar', role: 'Farmer · Uttar Pradesh', rating: 5,
        quote: 'The agriculture module gave me real-time weather alerts and let me sell produce directly. My income went up by 30% in 4 months.',
        tag: 'Agriculture',
    },
    {
        avatar: '👩‍🎓', name: 'Priya Sharma', role: 'Student · Bihar', rating: 5,
        quote: 'From my village, I now access live classes and full course libraries. The education plan completely changed my career path.',
        tag: 'Education',
    },
    {
        avatar: '👨‍⚕️', name: 'Dr. Anil Mehta', role: 'Physician · Rajasthan', rating: 4,
        quote: 'Ayushman Telehealth lets me reach patients in remote areas. The platform is smooth, reliable, and genuinely impactful.',
        tag: 'Healthcare',
    },
];

const STARS = Array.from({ length: 5 }, (_, i) => i);

function TestimonialCard({ avatar, name, role, rating, quote, tag }) {
    return (
        <div className="group bg-white border border-gray-200 hover:border-[#FF9933] rounded-3xl p-7 transition-all duration-300 flex flex-col gap-5 shadow-sm hover:shadow-md">
            <div className="text-6xl font-black text-[#FF9933]/20 leading-none -mb-2 select-none">"</div>
            <p className="text-gray-700 text-sm leading-relaxed flex-1">
                {quote}
            </p>
            <div className="flex gap-1">
                {STARS.map((i) => (
                    <span key={i} className={`text-sm ${i < rating ? 'text-[#FF9933]' : 'text-gray-200'}`}>★</span>
                ))}
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-11 h-11 rounded-2xl bg-[#FF9933]/10 flex items-center justify-center text-2xl">
                    {avatar}
                </div>
                <div>
                    <p className="text-gray-800 font-black text-sm">{name}</p>
                    <p className="text-gray-500 text-xs">{role}</p>
                </div>
                <span className="ml-auto text-[10px] font-bold text-[#FF9933] bg-[#FF9933]/10 px-2 py-1 rounded-full">
                    {tag}
                </span>
            </div>
        </div>
    );
}

export default function HomeSix() {
    return (
        <>
            {/* ── Testimonials ── Light version */}
            <section className="py-28 px-4 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                <div className="absolute top-20 right-1/4 w-80 h-80 rounded-full bg-[#FF9933]/5 blur-3xl pointer-events-none" />

                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 mb-6 shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-[#FF9933] animate-pulse" />
                            <span className="text-[#FF9933] text-xs font-bold tracking-widest uppercase">Citizen Stories</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-5 leading-tight">
                            Real People.<br />
                            <span style={{ WebkitTextStroke: '2px #FF9933', color: 'transparent' }}>Real Impact.</span>
                        </h2>
                        <p className="text-gray-600 max-w-xl mx-auto text-lg">
                            Millions of lives improved across India through our platform.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {TESTIMONIALS.map((t) => <TestimonialCard key={t.name} {...t} />)}
                    </div>
                </div>
            </section>

            {/* ── About Section ── already light, keep as is */}
            <section className="py-28 px-4 bg-white relative overflow-hidden">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[18rem] font-black text-gray-50 leading-none select-none pointer-events-none">
                    SBF
                </div>

                <div className="container mx-auto max-w-7xl relative z-10">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="relative hidden lg:block">
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                                <img
                                    src="https://images.pexels.com/photos/2664834/pexels-photo-2664834.jpeg?auto=compress&cs=tinysrgb&w=1200"
                                    alt="Indian family using digital services"
                                    className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                                <div className="absolute bottom-6 left-6 right-6">
                                    <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl p-4 shadow-md">
                                        <p className="text-gray-800 font-black text-sm">🏆 Government of India Recognized</p>
                                        <p className="text-gray-500 text-xs mt-1">Certified Digital India Partner since 2024</p>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -bottom-4 -right-4 w-2/3 h-2/3 rounded-3xl border-2 border-[#FF9933]/20 -z-10" />
                        </div>

                        <div>
                            <div className="inline-flex items-center gap-2 bg-[#138808]/10 border border-[#138808]/20 rounded-full px-4 py-2 mb-8">
                                <span className="w-2 h-2 rounded-full bg-[#138808]" />
                                <span className="text-[#138808] text-xs font-bold tracking-widest uppercase">About Us</span>
                            </div>

                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 leading-tight">
                                The Foundation<br />
                                Behind <span className="text-[#138808]">Samraddh</span><br />
                                <span className="text-[#FF9933]">Bharat</span>
                            </h2>

                            <div className="space-y-5">
                                <div className="flex gap-5 p-6 bg-gray-50 rounded-2xl border-l-4 border-[#FF9933] hover:bg-[#FF9933]/5 transition-colors duration-200">
                                    <div className="text-3xl shrink-0">🎯</div>
                                    <div>
                                        <h3 className="font-black text-gray-900 text-lg mb-2">Our Vision</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            A Samraddh Bharat where every citizen — regardless of location or income — has
                                            equal, technology-powered access to opportunities and government services.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-5 p-6 bg-gray-50 rounded-2xl border-l-4 border-[#138808] hover:bg-[#138808]/5 transition-colors duration-200">
                                    <div className="text-3xl shrink-0">🚀</div>
                                    <div>
                                        <h3 className="font-black text-gray-900 text-lg mb-2">Our Mission</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            Leveraging digital infrastructure to deliver citizen-centric services, promote
                                            transparency, and ensure last-mile delivery of schemes and programs.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-5 p-6 bg-gray-50 rounded-2xl border-l-4 border-gray-200 hover:bg-gray-100 transition-colors duration-200">
                                    <div className="text-3xl shrink-0">🤲</div>
                                    <div>
                                        <h3 className="font-black text-gray-900 text-lg mb-2">Our Values</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            <strong className="text-[#FF9933]">"Sabka Saath, Sabka Vikas, Sabka Vishwas"</strong> —
                                            Together for everyone's development and trust.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Contact / Helpline ── Light version */}
            <section className="py-28 px-4 bg-gray-50 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
                    style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                <div className="container mx-auto max-w-5xl relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 mb-8 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-[#FF9933] animate-pulse" />
                        <span className="text-[#FF9933] text-xs font-bold tracking-widest uppercase">24/7 Support</span>
                    </div>

                    <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-4 leading-tight">
                        We're Here to<br />
                        <span className="text-[#FF9933]">Help You</span>
                    </h2>
                    <p className="text-gray-600 text-xl mb-14 max-w-xl mx-auto">
                        Samraddh Bharat Helpline — reach us any time, any day.
                    </p>

                    <div className="grid sm:grid-cols-2 gap-5 mb-14">
                        <a href="tel:18001234567"
                            className="group flex items-center gap-4 bg-[#FF9933] hover:bg-[#e6891c] rounded-3xl p-6 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                            <div className="w-14 h-14 bg-white/30 rounded-2xl flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
                                📞
                            </div>
                            <div>
                                <p className="text-white/80 text-xs font-bold uppercase tracking-wider mb-1">Toll Free Helpline</p>
                                <p className="text-white font-black text-2xl">1800-123-4567</p>
                                <p className="text-white/70 text-xs mt-0.5">Mon–Sat · 9am to 8pm IST</p>
                            </div>
                        </a>

                        <a href="mailto:support@samraddhbharat.gov.in"
                            className="group flex items-center gap-4 bg-white border border-gray-200 hover:border-[#138808] rounded-3xl p-6 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                            <div className="w-14 h-14 bg-[#138808]/10 rounded-2xl flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
                                ✉
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Email Support</p>
                                <p className="text-gray-800 font-black text-base break-all">support@samraddhbharat.gov.in</p>
                                <p className="text-gray-400 text-xs mt-0.5">Response within 4 business hours</p>
                            </div>
                        </a>
                    </div>

                    <div className="flex flex-wrap justify-center gap-8 pt-10 border-t border-gray-200 text-sm text-gray-500">
                        <span className="flex items-center gap-2">📍 New Delhi, India</span>
                        <span className="flex items-center gap-2">🌐 samraddhbharat.gov.in</span>
                        <span className="flex items-center gap-2">🔒 Govt. Verified & ISO Certified</span>
                    </div>
                </div>
            </section>
        </>
    );
}