'use client';

import { useState } from 'react';

export default function ContactContent() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [formStatus, setFormStatus] = useState({ submitted: false, error: false, message: '' });
    const [activeFAQ, setActiveFAQ] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            setFormStatus({ submitted: true, error: true, message: 'Please fill in all required fields.' });
            return;
        }
        setFormStatus({ submitted: true, error: false, message: 'Sending...' });
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Form submitted:', formData);
            setFormStatus({ submitted: true, error: false, message: 'Thank you! Your message has been sent.' });
            setFormData({ name: '', email: '', subject: '', message: '' });
            setTimeout(() => setFormStatus({ submitted: false, error: false, message: '' }), 5000);
        } catch (err) {
            setFormStatus({ submitted: true, error: true, message: 'Something went wrong. Please try again later.' });
        }
    };

    const faqData = [
        {
            question: 'What are the operating hours of the helpline?',
            answer: 'Our helpline (1800-123-4567) is available 24/7, 365 days a year to assist you with any government services.'
        },
        {
            question: 'How quickly can I expect a response to my email?',
            answer: 'We strive to respond to all email inquiries within 24-48 business hours. For urgent matters, please call our helpline.'
        },
        {
            question: 'Is Samraddh Bharat Foundation an official government body?',
            answer: 'Yes, Samraddh Bharat Foundation is a Government of India initiative dedicated to providing accessible citizen services.'
        },
        {
            question: 'What services can I avail through this portal?',
            answer: 'You can access various government schemes, apply for certificates, track application status, and get assistance with public welfare programs.'
        },
        {
            question: 'Are there any charges for using the helpline or email support?',
            answer: 'All our support services are completely free of charge. We are here to help citizens without any cost.'
        }
    ];

    const toggleFAQ = (index) => {
        setActiveFAQ(activeFAQ === index ? null : index);
    };

    return (
        <section id="contact" className="py-16 px-4 bg-white pt-[65px] md:pt-[120px]">
            <div className="container mx-auto max-w-5xl">
                {/* Hero Section */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-2">Need Assistance?</h2>
                    <p className="text-gray-600 text-base max-w-2xl mx-auto">
                        Samraddh Bharat Helpline is available 24/7 to assist you with any government services
                    </p>
                </div>

                {/* Quick Contact Buttons */}
                <div className="grid md:grid-cols-2 gap-5 mb-12">
                    <a
                        href="tel:18001234567"
                        className="bg-gradient-to-r from-[#ff8c42] to-[#ff6b22] text-white px-6 py-3 rounded-xl font-semibold text-base shadow-md hover:shadow-lg transition-all text-center"
                    >
                        📞 Call Helpline: 1800-123-4567
                    </a>
                    <a
                        href="mailto:support@samraddhbharat.gov.in"
                        className="border-2 border-[#1e3a5f] text-[#1e3a5f] px-6 py-3 rounded-xl font-semibold text-base hover:bg-[#1e3a5f] hover:text-white transition-all text-center"
                    >
                        ✉️ Send Email
                    </a>
                </div>

                {/* Contact Form & Info Grid */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    {/* Form Section */}
                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                        <h3 className="text-xl font-bold text-[#1e3a5f] mb-4">Send us a Message</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff8c42] focus:border-transparent transition"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff8c42] focus:border-transparent transition"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff8c42] focus:border-transparent transition"
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                    Message <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="4"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff8c42] focus:border-transparent transition"
                                    required
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-[#1e3a5f] to-[#2c4e7a] text-white font-semibold py-2 rounded-lg hover:shadow-md transition-all hover:scale-[1.01]"
                            >
                                Send Message
                            </button>
                            {formStatus.submitted && (
                                <div className={`text-center p-2 rounded-lg text-sm ${formStatus.error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                    {formStatus.message}
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Info Card */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 shadow-md">
                        <h3 className="text-xl font-bold text-[#1e3a5f] mb-4">Get in Touch</h3>
                        <div className="space-y-5">
                            <div className="flex items-start gap-3">
                                <div className="bg-[#ff8c42] p-2 rounded-full text-white text-sm">📍</div>
                                <div>
                                    <h4 className="font-semibold text-gray-800 text-sm">Visit Us</h4>
                                    <p className="text-gray-600 text-sm">Samraddh Bharat Foundation,<br />Government of India,<br />New Delhi - 110001</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="bg-[#ff8c42] p-2 rounded-full text-white text-sm">📞</div>
                                <div>
                                    <h4 className="font-semibold text-gray-800 text-sm">Helpline Numbers</h4>
                                    <p className="text-gray-600 text-sm">Toll Free: 1800-123-4567<br />Office: +91-11-23456789</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="bg-[#ff8c42] p-2 rounded-full text-white text-sm">✉️</div>
                                <div>
                                    <h4 className="font-semibold text-gray-800 text-sm">Email Support</h4>
                                    <p className="text-gray-600 text-sm">support@samraddhbharat.gov.in<br />grievance@samraddhbharat.gov.in</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}