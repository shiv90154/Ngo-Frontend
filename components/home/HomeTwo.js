'use client';
import React from 'react';

const STATS = [
    { label: 'Active Citizen Records', value: '2,345,671', change: 'Aadhaar Verified' },
    { label: 'Total Services Dispatched', value: '1,234,560', change: 'Across All Sectors' },
    { label: 'Gram Panchayats Reached', value: '125,043', change: 'Nationwide Network' },
    { label: 'Grievance Resolution', value: '98.5%', change: 'Under SLA Limits' },
];

const HomeTwo = () => (
    <div className="bg-white">

        {/* Analytics Ribbon */}
        <section className="bg-gray-100 border-b border-gray-300">
            <div className="govt-container">
                <div className="flex items-center gap-2 py-3 border-b border-gray-200">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF7B00] animate-pulse" />
                    <span className="text-[11px] font-bold text-gray-800 uppercase tracking-widest">Public Service Delivery Metrics</span>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-300">
                    {STATS.map(({ label, value, change }, idx) => (
                        <div key={idx} className="p-5 text-left bg-white lg:bg-transparent">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">{label}</p>
                            <p className="text-2xl font-black text-[#FF7B00] mb-1">{value}</p>
                            <p className="text-[10px] text-gray-600 font-semibold">{change}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Vision Statement */}
        <section className="py-16 govt-container">
            <div className="govt-card p-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-gray-50 border-t-8 border-t-[#1e293b]">
                <div className="flex flex-col lg:flex-row gap-10 items-start">

                    <div className="lg:w-1/3">
                        <div className="h-2 w-16 bg-[#FF7B00] mb-5" />
                        <h2 className="text-3xl font-bold text-gray-900 leading-tight uppercase tracking-tight">
                            Core Mission <br />& Objective
                        </h2>
                    </div>

                    <div className="lg:w-2/3">
                        <p className="text-sm font-semibold text-gray-700 leading-relaxed mb-4">
                            The Samraddh Bharat Foundation operates a unified digital infrastructure dedicated to providing seamless, transparent, and direct service delivery to every Indian citizen.
                        </p>
                        <p className="text-[13px] text-gray-600 leading-relaxed mb-8">
                            We bridge the accessibility gap between urban administration and rural participation. By concentrating exclusively on 6 high-impact sectors, we guarantee that administrative efficiency reaches the Gram Panchayat level without discrepancy.
                        </p>

                        <div className="flex justify-around gap-6 pt-6 border-t border-gray-300">
                            {[
                                { num: '06', txt: 'Core Focus Sectors' },
                                { num: 'DBT', txt: 'Direct Benefit Enabled' },
                            ].map(({ num, txt }) => (
                                <div key={txt} className="flex flex-col">
                                    <span className="block text-2xl font-black text-gray-900">{num}</span>
                                    <span className="block text-[9px] font-bold text-[#FF7B00] uppercase tracking-widest mt-1">{txt}</span>
                                </div>
                            ))}
                        </div>
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
        </section>
    </div>
);

export default HomeTwo;