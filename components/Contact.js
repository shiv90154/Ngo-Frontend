"use client";

import React, { useState } from "react";
import {
    FaPhoneAlt,
    FaEnvelope,
    FaMapMarkerAlt,
    FaClock,
    FaTractor,
    FaGraduationCap,
    FaWallet,
    FaHeartbeat,
    FaLaptopCode,
    FaNewspaper,
} from "react-icons/fa";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        module: "",
        message: "",
    });
    const [status, setStatus] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            setStatus("Please fill all required fields.");
            return;
        }
        setStatus("Sending...");
        setTimeout(() => {
            setStatus("Your message has been sent. Our team will respond within 24 hours.");
            setFormData({ name: "", email: "", module: "", message: "" });
        }, 800);
    };

    const modules = [
        { name: "Agriculture", icon: FaTractor, color: "orange", desc: "Crop advisories, market prices, subsidies" },
        { name: "Education", icon: FaGraduationCap, color: "orange", desc: "Courses, scholarships, digital classrooms" },
        { name: "Finance", icon: FaWallet, color: "orange", desc: "Loans, banking, insurance schemes" },
        { name: "Healthcare", icon: FaHeartbeat, color: "orange", desc: "Telemedicine, records, wellness programs" },
        { name: "IT Services", icon: FaLaptopCode, color: "orange", desc: "E-governance, digital infrastructure" },
        { name: "News", icon: FaNewspaper, color: "orange", desc: "Real-time updates, policy announcements" },
    ];

    return (
        <div className="bg-white min-h-screen">
            <div className="relative bg-gray-900 text-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 flex justify-center">

                    <div className="max-w-3xl text-center">

                        <div className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-1.5 mb-6">
                            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                            <span className="text-xs font-bold tracking-wider text-orange-300">
                                SUPPORT HUB
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
                            We're Here to <span className="text-orange-400">Support You</span>
                        </h1>

                        <div className="w-20 h-1 bg-orange-500 my-6 mx-auto"></div>

                        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                            Dedicated assistance for all six pillars of Samraddh Bharat. Whether you're a farmer, student,
                            entrepreneur, or citizen – our team is ready to help.
                        </p>

                    </div>
                </div>
            </div>

            {/* Module Support Cards */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        Support for Every <span className="text-orange-600">Module</span>
                    </h2>
                    <div className="w-16 h-0.5 bg-orange-500 mx-auto mt-4 mb-4"></div>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Choose your service below – get specialised help for your specific needs.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {modules.map((mod, idx) => {
                        const Icon = mod.icon;
                        return (
                            <div
                                key={idx}
                                className="group shadow-xl   bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition">
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800">{mod.name}</h3>
                                </div>
                                <p className="text-gray-500 text-sm leading-relaxed mb-4">{mod.desc}</p>
                                <button className="text-orange-600 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Contact Options – Form + Info Cards (equal height) */}
            <div className="bg-gray-50 py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-10 items-stretch">
                        {/* Contact Form */}
                        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 border border-gray-100 flex flex-col h-full">
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-gray-800">Send us a Message</h3>
                                <div className="w-12 h-0.5 bg-orange-500 mt-2"></div>
                            </div>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Module</label>
                                    <select
                                        name="module"
                                        value={formData.module}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
                                    >
                                        <option value="">General Inquiry</option>
                                        <option value="Agriculture">Agriculture Support</option>
                                        <option value="Education">Education Support</option>
                                        <option value="Finance">Finance Support</option>
                                        <option value="Healthcare">Healthcare Support</option>
                                        <option value="IT">IT Services Support</option>
                                        <option value="News">News & Media Support</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                                    <textarea
                                        rows="2"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none resize-none"
                                        required
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition transform hover:scale-[1.01] shadow-md"
                                >
                                    Submit Query
                                </button>
                                {status && (
                                    <p className="text-sm text-center text-gray-600 bg-gray-100 p-2 rounded">{status}</p>
                                )}
                            </form>
                        </div>

                        {/* Contact Info Cards – equal height via flex column */}
                        <div className="flex flex-col gap-5 h-full">
                            <div className="bg-white rounded-2xl shadow-md p-6 flex items-start gap-4 border border-gray-100 hover:shadow-lg transition">
                                <div className="bg-orange-100 p-3 rounded-full text-orange-600">
                                    <FaPhoneAlt className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 text-lg">Helpline Numbers</h4>
                                    <p className="text-gray-600 text-sm mt-1">
                                        Toll Free: <span className="font-semibold">1800-123-4567</span><br />
                                        Direct: +91-11-23456789
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-md p-6 flex items-start gap-4 border border-gray-100 hover:shadow-lg transition">
                                <div className="bg-orange-100 p-3 rounded-full text-orange-600">
                                    <FaEnvelope className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 text-lg">Email Support</h4>
                                    <p className="text-gray-600 text-sm mt-1 break-all">
                                        support@samraddhbharat.gov.in<br />
                                        grievance@samraddhbharat.gov.in
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-md p-6 flex items-start gap-4 border border-gray-100 hover:shadow-lg transition">
                                <div className="bg-orange-100 p-3 rounded-full text-orange-600">
                                    <FaMapMarkerAlt className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 text-lg">Central Office</h4>
                                    <p className="text-gray-600 text-sm mt-1">
                                        Samraddh Bharat Foundation<br />
                                        Chhatisgarh - 110001
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-md p-6 flex items-start gap-4 border border-gray-100 hover:shadow-lg transition">
                                <div className="bg-orange-100 p-3 rounded-full text-orange-600">
                                    <FaClock className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 text-lg">Working Hours</h4>
                                    <p className="text-gray-600 text-sm mt-1">
                                        Mon – Sat: 9:00 AM – 8:00 PM IST<br />
                                        Sunday: Closed (Emergency helpline active)
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer / Trust Badge */}
            <div className="border-t border-gray-200 py-8 text-center text-gray-500 text-sm">
                <p>🇮🇳 Samraddh Bharat – A Government of India Initiative | Digital India Partner</p>
                <p className="mt-1">Secure, transparent, and citizen‑first support.</p>
            </div>
        </div>
    );
}