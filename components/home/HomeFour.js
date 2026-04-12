'use client';
import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';

const STEPS = [
    { step: 1, title: 'Register', desc: 'Sign up with your mobile number or Aadhaar', icon: '📝', color: '#FF9933' },
    { step: 2, title: 'Choose Service', desc: 'Select from 50+ digital services', icon: '🔍', color: '#138808' },
    { step: 3, title: 'Get Benefits', desc: 'Receive certificates, payments, or assistance', icon: '🎁', color: '#FF9933' },
];

const PLANS = [
    {
        name: 'Education Plan', price: '₹300 – ₹600',
        icon: '📚', popular: false,
        features: ['Full course access', 'Live classes', 'Test series', 'Certificates'],
        path: '/services/education',
    },
    {
        name: 'Health Plan', price: '₹200 – ₹2200',
        icon: '🩺', popular: true,
        features: ['Doctor consultations', 'Health records', 'AI diagnostics', 'Medicine delivery'],
        path: '/services/healthcare',
    },
    {
        name: 'Agriculture Plan', price: '₹1200+',
        icon: '🌾', popular: false,
        features: ['Crop advisory', 'Market linkage', 'AI disease detection', 'Contract farming'],
        path: '/services/agriculture',
    },
];

const HomeFour = () => {
    const router = useRouter();
    const go = useCallback((path) => router.push(path), [router]);

    return (
        <>
            {/* ── How It Works ── */}
            <section className="py-24 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-flex gap-1.5 mb-5">
                                <span className="w-8 h-1.5 rounded-full bg-[#FF9933]" />
                                <span className="w-8 h-1.5 rounded-full bg-gray-200" />
                                <span className="w-8 h-1.5 rounded-full bg-[#138808]" />
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">How It Works</h2>
                            <p className="text-gray-500 mb-10 text-lg">Simple steps to access government services online</p>

                            <div className="space-y-5">
                                {STEPS.map(({ step, title, desc, icon, color }) => (
                                    <div key={step}
                                        className="flex items-center gap-5 p-5 bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transition-all group border border-transparent hover:border-gray-200">
                                        <div className="relative shrink-0">
                                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform"
                                                style={{ backgroundColor: `${color}18` }}>
                                                {icon}
                                            </div>
                                            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-white text-[10px] font-black flex items-center justify-center"
                                                style={{ backgroundColor: color }}>
                                                {step}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                                            <p className="text-gray-500 text-sm">{desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-2xl overflow-hidden shadow-2xl">
                            <img
                                src="https://images.pexels.com/photos/4100010/pexels-photo-4100010.jpeg?auto=compress&cs=tinysrgb&w=1200"
                                alt="Farmer using smartphone"
                                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                                loading="lazy"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Subscription Plans ── */}
            <section className="py-24 px-4 ">
                <div className="container mx-auto">
                    <div className="text-center mb-14">
                        <div className="inline-flex gap-1.5 mb-5">
                            <span className="w-8 h-1.5 rounded-full bg-white" />
                            <span className="w-8 h-1.5 rounded-full bg-white/50" />
                            <span className="w-8 h-1.5 rounded-full bg-white" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black  mb-4">Membership & Plans</h2>
                        <p className="text- max-w-2xl mx-auto text-lg">
                            Affordable plans for every citizen — Education, Health, Agriculture
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {PLANS.map(({ name, price, icon, popular, features, path }) => (
                            <div key={name}
                                className={`relative bg-white rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl
                                    ${popular ? 'ring-4 ring-white/60 scale-[1.02]' : ''}`}>
                                {popular && (
                                    <div className="absolute top-0 right-0 bg-[#138808] text-white text-[10px] font-black px-3 py-1.5 rounded-bl-xl tracking-widest uppercase">
                                        Most Popular
                                    </div>
                                )}
                                <div className="p-7 text-center">
                                    <div className="text-5xl mb-3">{icon}</div>
                                    <h3 className="text-xl font-black text-gray-800 mb-1">{name}</h3>
                                    <div className="text-3xl font-black text-[#FF9933] my-3">{price}</div>
                                    <ul className="text-left space-y-2 my-5">
                                        {features.map((f) => (
                                            <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                                                <span className="text-[#138808] font-bold">✓</span> {f}
                                            </li>
                                        ))}
                                    </ul>
                                    <button onClick={() => go(path)}
                                        className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-[#FF9933] to-[#e6891c] hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
                                        Subscribe Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default HomeFour;