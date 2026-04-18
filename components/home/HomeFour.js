'use client';
import React from 'react';

const STEPS = [
    { step: 1, title: 'Register', desc: 'Sign up with your mobile number or Aadhaar', icon: 'https://cdn-icons-png.flaticon.com/512/2991/2991115.png', color: '#FF9933' },
    { step: 2, title: 'Choose Service', desc: 'Select from 50+ digital services', icon: 'https://cdn-icons-png.flaticon.com/512/3031/3031293.png', color: '#138808' },
    { step: 3, title: 'Get Benefits', desc: 'Receive certificates, payments, or assistance', icon: 'https://cdn-icons-png.flaticon.com/512/3094/3094845.png', color: '#FF9933' },
];

const PLANS = [
    {
        name: 'Education Plan', price: '₹300 – ₹600',
        image: 'https://cdn-icons-png.flaticon.com/512/3050/3050525.png', 
        popular: false,
        features: ['Full course access', 'Live classes', 'Test series', 'Certificates'],
        path: '/services/education',
    },
    {
        name: 'Health Plan', price: '₹200 – ₹2200',
        image: 'https://cdn-icons-png.flaticon.com/512/2966/2966327.png', 
        popular: true,
        features: ['Doctor consultations', 'Health records', 'AI diagnostics', 'Medicine delivery'],
        path: '/services/healthcare',
    },
    {
        name: 'Agriculture Plan', price: '₹1200+',
        image: 'https://cdn-icons-png.flaticon.com/512/2950/2950553.png', 
        popular: false,
        features: ['Crop advisory', 'Market linkage', 'AI disease detection', 'Contract farming'],
        path: '/services/agriculture',
    },
];

const HomeFour = () => {
    return (
        <>
            {/* ── How It Works Section - Enhanced ── */}
            <section className="py-16 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    {/* Section Header */}
                    <div className="text-center mb-12">
                        <div className="inline-block bg-gradient-to-r from-[#FF9933]/10 to-[#138808]/10 px-4 py-1 rounded-full mb-3">
                            <span className="text-xs font-bold text-[#FF9933]">HOW IT WORKS</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                            Get Started in <span className="text-[#138808]">3 Simple Steps</span>
                        </h2>
                        <p className="text-gray-500 text-sm mt-2">Access government services online instantly</p>
                    </div>

                    {/* Steps Grid */}  
                    <div className="grid md:grid-cols-3 gap-6">
                        {STEPS.map(({ step, title, desc, icon, color }) => (
                            <div key={step}
                                className="group relative bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                                
                                {/* Step Number */}
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full text-white text-sm font-bold flex items-center justify-center shadow-lg"
                                    style={{ backgroundColor: color }}>
                                    {step}
                                </div>
                                
                                {/* Icon */}
                                <div className="mt-4 mb-4">
                                    <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                        <img src={icon} alt={title} className="w-10 h-10 object-contain" />
                                    </div>
                                </div>
                                
                                {/* Title */}
                                <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-[#138808] transition-colors">
                                    {title}
                                </h3>
                                
                                {/* Description */}
                                <p className="text-gray-500 text-sm">{desc}</p>
                                
                                {/* Connector Line for Desktop */}
                                {step < 3 && (
                                    <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-0.5 bg-gradient-to-r from-[#FF9933] to-[#138808] opacity-50"></div>
                                )}
                            </div>
                        ))}
                    </div>

                </div>

            {/* ── Subscription Plans Section - Enhanced ── */}
            <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
                <div className="container mx-auto max-w-6xl">
                    {/* Section Header */}
                    <div className="text-center mb-10">
                        <div className="inline-block bg-[#FF9933]/10 px-4 py-1 rounded-full mb-3">
                            <span className="text-xs font-bold text-[#FF9933]">MEMBERSHIP PLANS</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                            Choose Your <span className="text-[#138808]">Perfect Plan</span>
                        </h2>
                        <p className="text-gray-500 text-sm mt-2">Affordable plans for every citizen</p>
                    </div>

                    {/* Plans Grid */}
                    <div className="grid md:grid-cols-3 gap-6">
                        {PLANS.map(({ name, price, image, popular, features, path }) => (
                            <div key={name}
                                className={`group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2
                                    ${popular ? 'ring-2 ring-[#FF9933] shadow-xl' : 'border border-gray-100'}`}>
                                
                                {/* Popular Tag */}
                                {popular && (
                                    <div className="absolute top-0 right-0 bg-[#FF9933] text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg z-10">
                                        POPULAR
                                    </div>
                                )}
                                
                                {/* Image */}
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 flex justify-center">
                                    <img src={image} alt={name} className="w-16 h-16 object-contain group-hover:scale-110 transition-transform duration-300" />
                                </div>
                                
                                {/* Content */}
                                <div className="p-5 text-center">
                                    <h3 className="text-lg font-bold text-gray-800 mb-1">{name}</h3>
                                    <div className="text-2xl font-bold text-[#FF9933] my-2">{price}</div>
                                    
                                    {/* Features */}
                                    <ul className="space-y-2 my-4">
                                        {features.map((f) => (
                                            <li key={f} className="flex items-center gap-2 text-xs text-gray-600">
                                                <span className="text-[#138808] font-bold">✓</span> {f}
                                            </li>
                                        ))}
                                    </ul>
                                    
                                    {/* Button */}
                                    <button onClick={() => go(path)}
                                        className="w-full py-2 rounded-lg font-semibold text-sm text-white bg-[#138808] hover:bg-[#0a5c06] transition-all duration-300">
                                        Subscribe Now →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Bottom Text */}
                    <div className="text-center mt-8">
                        <p className="text-xs text-gray-400">✨ No hidden charges • Cancel anytime • 24/7 support</p>
                    </div>
                </div>
            </section>
        </>
    );
};

export default HomeFour;