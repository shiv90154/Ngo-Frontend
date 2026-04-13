'use client';
import React, { useState } from 'react';

const TESTIMONIALS = [
    {
        avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
        name: 'Ramesh Kumar',
        role: 'Farmer · Uttar Pradesh',
        rating: 5,
        quote: 'The agriculture module gave me real-time weather alerts and let me sell produce directly. My income went up by 30% in 4 months.',
        tag: 'Agriculture',
        location: 'Uttar Pradesh'
    },
    {
        avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
        name: 'Priya Sharma',
        role: 'Student · Bihar',
        rating: 5,
        quote: 'From my village, I now access live classes and full course libraries. The education plan completely changed my career path.',
        tag: 'Education',
        location: 'Bihar'
    },
    {
        avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
        name: 'Dr. Anil Mehta',
        role: 'Physician · Rajasthan',
        rating: 4,
        quote: 'Ayushman Telehealth lets me reach patients in remote areas. The platform is smooth, reliable, and genuinely impactful.',
        tag: 'Healthcare',
        location: 'Rajasthan'
    },
];

const STARS = Array.from({ length: 5 }, (_, i) => i);

function TestimonialCard({ avatar, name, role, rating, quote, tag }) {
    const [isHovered, setIsHovered] = useState(false);
    
    const tagColors = {
        Agriculture: 'bg-orange-100 text-orange-600',
        Education: 'bg-orange-100 text-orange-600',
        Healthcare: 'bg-green-100 text-green-600',
    };
    
    return (
        <div 
            className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer border border-gray-100"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Quote Icon */}
            <div className="absolute top-6 right-6 text-6xl font-black text-[#FF9933]/5">"</div>
            
            {/* Stars */}
            <div className="flex gap-1 mb-4">
                {STARS.map((i) => (
                    <svg key={i} className={`w-4 h-4 ${i < rating ? 'text-[#FF9933]' : 'text-gray-200'} fill-current`} viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                ))}
            </div>
            
            {/* Quote Text */}
            <p className="text-gray-700 text-sm leading-relaxed mb-5 min-h-[100px] relative z-10">
                {quote}
            </p>
            
            {/* User Info */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                        <img src={avatar} alt={name} className="w-7 h-7 object-contain" />
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white ${isHovered ? 'animate-pulse' : ''}`}></div>
                </div>
                <div className="flex-1">
                    <p className="text-gray-800 font-bold text-sm">{name}</p>
                    <p className="text-gray-500 text-xs">{role}</p>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${tagColors[tag]} shadow-sm`}>
                    {tag}
                </span>
            </div>
        </div>
    );
}

export default function HomeSix() {
    const [activeTab, setActiveTab] = useState('testimonials');
    
    return (
        <>
            {/* ── Testimonials Section ── */}
            <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
                <div className="container mx-auto max-w-6xl">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 bg-[#FF9933]/10 px-4 py-1.5 rounded-full mb-4">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FF9933] animate-pulse"></span>
                            <span className="text-xs font-bold text-[#FF9933] tracking-wider">SUCCESS STORIES</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FF9933] animate-pulse"></span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                            What Our <span className="text-[#138808]">Citizens Say</span>
                        </h2>
                        <p className="text-gray-500 text-base max-w-xl mx-auto">
                            Real stories from real people who transformed their lives
                        </p>
                    </div>

                    {/* Testimonials Grid */}
                    <div className="grid md:grid-cols-3 gap-6">
                        {TESTIMONIALS.map((t, i) => (
                            <TestimonialCard key={i} {...t} />
                        ))}
                    </div>
                    
                    {/* Trust Indicator */}
                    <div className="text-center mt-10">
                        <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                            <span className="text-[#FF9933]">⭐</span>
                            <span className="text-xs font-semibold text-gray-700">4.8/5 from 50,000+ reviews</span>
                            <span className="text-[#138808]">⭐</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── About Section Enhanced ── */}
            <section className="py-20 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left - Image with Stats */}
                        <div className="relative">
                            <div className="rounded-2xl overflow-hidden shadow-2xl">
                                <img
                                    src="https://images.pexels.com/photos/2664834/pexels-photo-2664834.jpeg?auto=compress&cs=tinysrgb&w=800"
                                    alt="Indian family using digital services"
                                    className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                                    loading="lazy"
                                />
                            </div>
                            
                            {/* Stats Floating Cards */}
                            <div className="absolute -top-4 -left-4 bg-white rounded-xl p-3 shadow-lg border-l-4 border-[#FF9933]">
                                <p className="text-lg font-bold text-[#138808]">2.5M+</p>
                                <p className="text-[9px] text-gray-500">Active Users</p>
                            </div>
                            
                            <div className="absolute -bottom-4 -right-4 bg-white rounded-xl p-3 shadow-lg border-r-4 border-[#138808]">
                                <p className="text-lg font-bold text-[#FF9933]">50+</p>
                                <p className="text-[9px] text-gray-500">Digital Services</p>
                            </div>
                        </div>

                        {/* Right - Content */}
                        <div>
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 bg-[#138808]/10 px-4 py-1.5 rounded-full mb-4">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#138808]"></span>
                                <span className="text-xs font-bold text-[#138808] tracking-wider">ABOUT US</span>
                            </div>
                            
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                The Foundation Behind <br />
                                <span className="text-[#138808]">Samraddh Bharat</span>
                            </h2>
                            
                            <p className="text-gray-600 text-sm leading-relaxed mb-6">
                                Empowering rural India through digital innovation, transparent governance, and citizen-first approach.
                            </p>

                            {/* Features Grid */}
                            <div className="grid gap-4">
                                <div className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-green-50 transition-all duration-300 group cursor-pointer">
                                    <div className="w-10 h-10 rounded-lg bg-[#FF9933]/10 flex items-center justify-center text-xl group-hover:scale-110 transition">
                                        🎯
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-sm mb-1">Our Vision</h3>
                                        <p className="text-gray-600 text-xs leading-relaxed">
                                            A Samraddh Bharat where every citizen has equal access to technology-powered opportunities.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gradient-to-r hover:from-green-50 hover:to-orange-50 transition-all duration-300 group cursor-pointer">
                                    <div className="w-10 h-10 rounded-lg bg-[#138808]/10 flex items-center justify-center text-xl group-hover:scale-110 transition">
                                        🚀
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-sm mb-1">Our Mission</h3>
                                        <p className="text-gray-600 text-xs leading-relaxed">
                                            Delivering citizen-centric services, promoting transparency, and ensuring last-mile delivery.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 transition-all duration-300 group cursor-pointer">
                                    <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center text-xl group-hover:scale-110 transition">
                                        🤲
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-sm mb-1">Our Values</h3>
                                        <p className="text-gray-600 text-xs leading-relaxed">
                                            <strong className="text-[#FF9933]">"Sabka Saath, Sabka Vikas, Sabka Vishwas"</strong> — Together for everyone's development.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Contact / Helpline Section Enhanced ── */}
            <section className="py-20 px-4 bg-gradient-to-br from-[#FF9933]/5 via-white to-[#138808]/5">
                <div className="container mx-auto max-w-5xl">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-sm mb-4">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF9933] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF9933]"></span>
                            </span>
                            <span className="text-xs font-bold text-[#FF9933] tracking-wider">24/7 SUPPORT</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                            We're Here to <span className="text-[#FF9933]">Help You</span>
                        </h2>
                        <p className="text-gray-500 text-sm max-w-xl mx-auto">
                            Samraddh Bharat Helpline — reach us any time, any day
                        </p>
                    </div>

                    {/* Contact Cards */}
                    <div className="grid md:grid-cols-2 gap-5 mb-10">
                        {/* Phone Card */}
                        <a href="tel:18001234567"
                            className="group relative overflow-hidden bg-gradient-to-r from-[#FF9933] to-[#e6891c] rounded-2xl p-6 text-center hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
                            <div className="absolute inset-0 bg-white/10 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                            <div className="relative">
                                <div className="w-16 h-16 mx-auto bg-white/20 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                    📞
                                </div>
                                <p className="text-white/80 text-xs font-bold uppercase tracking-wider mb-1">Toll Free Helpline</p>
                                <p className="text-white font-bold text-2xl mb-2">1800-123-4567</p>
                                <p className="text-white/70 text-xs">Mon–Sat · 9am to 8pm IST</p>
                            </div>
                        </a>

                        {/* Email Card */}
                        <a href="mailto:support@samraddhbharat.gov.in"
                            className="group bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border border-gray-100">
                            <div className="w-16 h-16 mx-auto bg-[#138808]/10 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                ✉️
                            </div>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Email Support</p>
                            <p className="text-gray-800 font-bold text-base mb-2 break-all">support@samraddhbharat.gov.in</p>
                            <p className="text-gray-400 text-xs">Response within 4 business hours</p>
                        </a>
                    </div>

                    {/* Bottom Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                            <span className="text-lg">📍</span> New Delhi, India
                        </div>
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                            <span className="text-lg">🌐</span> samraddhbharat.gov.in
                        </div>
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                            <span className="text-lg">🔒</span> Govt. Verified & ISO Certified
                        </div>
                    </div>
                    
                    {/* Social Links */}
                    <div className="flex justify-center gap-3 mt-6">
                        {['📘', '🐦', '📷', '💼'].map((social, i) => (
                            <div key={i} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm hover:bg-[#FF9933] hover:text-white transition-all duration-300 cursor-pointer">
                                {social}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}