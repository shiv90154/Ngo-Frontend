// components/AboutContent.jsx
export default function AboutContent() {
    const stats = [
        { label: 'Citizens Served', value: '10M+', icon: '👥' },
        { label: 'States Covered', value: '28', icon: '🗺️' },
        { label: 'Services Launched', value: '150+', icon: '⚙️' },
        { label: 'Partner Organizations', value: '500+', icon: '🤝' },
    ];

    const coreValues = [
        { title: 'Transparency', description: 'Ensuring openness in all government processes and citizen interactions.', icon: '🔍' },
        { title: 'Accessibility', description: 'Making services available to every citizen, regardless of location or background.', icon: '🌐' },
        { title: 'Innovation', description: 'Leveraging technology to simplify and improve governance.', icon: '💡' },
        { title: 'Accountability', description: 'Taking responsibility for delivering quality services to the people.', icon: '⚖️' },
    ];

    const milestones = [
        { year: '2020', title: 'Foundation Launched', description: 'Samraddh Bharat Foundation established as a Government of India initiative.' },
        { year: '2021', title: 'Digital Portal Go-Live', description: 'Launched the unified digital platform for citizen services.' },
        { year: '2022', title: 'Reached 5M Citizens', description: 'Successfully served over 5 million citizens across the country.' },
        { year: '2023', title: 'Expanded to All States', description: 'Extended services to all 28 states and 8 union territories.' },
        { year: '2024', title: 'AI-Powered Services', description: 'Introduced AI-driven assistance for faster grievance redressal.' },
    ];

    return (
        <main className="bg-gray-50 pt-[65px] md:pt-[120px]">
            {/* Hero Section */}
            <section className="bg-[#1e3a5f] text-white py-16 px-4">
                <div className="container mx-auto max-w-5xl text-center">
                    <div className="inline-flex items-center justify-center gap-1 mb-4">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                            <div className="w-6 h-6 rounded-full border-2 border-[#FF9933] flex items-center justify-center">
                                <div className="w-3 h-3 rounded-full bg-[#138808]"></div>
                            </div>
                        </div>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold mb-4">
                        About Samraddh Bharat Foundation
                    </h1>

                    <div className="flex justify-center gap-1 my-4">
                        <div className="w-12 h-1 bg-[#FF9933] rounded"></div>
                        <div className="w-12 h-1 bg-white rounded"></div>
                        <div className="w-12 h-1 bg-[#138808] rounded"></div>
                    </div>

                    <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-200">
                        Empowering citizens through technology-driven governance and transparent service delivery.
                    </p>
                </div>
            </section>

            {/* Vision & Mission */}
            <section className="py-16 px-4">
                <div className="container mx-auto max-w-5xl">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-[#FF9933] hover:shadow-lg transition-all duration-300">
                            <div className="p-8">
                                <div className="text-5xl mb-4">🎯</div>
                                <h3 className="text-2xl font-bold text-[#1e3a5f] mb-3">Our Vision</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    To create a "Samraddh Bharat" where every citizen has equal access to government services,
                                    opportunities, and benefits through technology-driven governance.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-[#138808] hover:shadow-lg transition-all duration-300">
                            <div className="p-8">
                                <div className="text-5xl mb-4">🚀</div>
                                <h3 className="text-2xl font-bold text-[#1e3a5f] mb-3">Our Mission</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Leveraging digital infrastructure to deliver citizen-centric services, promote transparency,
                                    and ensure last-mile delivery of services.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-16 px-4 bg-white">
                <div className="container mx-auto max-w-5xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1e3a5f] mb-4">
                        Our Core Values
                    </h2>
                    <div className="flex justify-center gap-1 mb-12">
                        <div className="w-12 h-1 bg-[#FF9933]"></div>
                        <div className="w-12 h-1 bg-white"></div>
                        <div className="w-12 h-1 bg-[#138808]"></div>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {coreValues.map((value, index) => (
                            <div key={index} className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-md">
                                <div className="text-4xl mb-3">{value.icon}</div>
                                <h3 className="text-xl font-semibold text-[#1e3a5f] mb-2">{value.title}</h3>
                                <p className="text-gray-600 text-sm">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 px-4 bg-gradient-to-r from-[#FF9933]/10 to-[#138808]/10">
                <div className="container mx-auto max-w-5xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1e3a5f] mb-12">
                        Our Impact
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-white rounded-lg p-6 text-center shadow-md">
                                <div className="text-4xl mb-2">{stat.icon}</div>
                                <div className="text-3xl font-bold text-[#FF9933]">{stat.value}</div>
                                <div className="text-gray-600 text-sm mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-16 px-4 bg-white">
                <div className="container mx-auto max-w-5xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1e3a5f] mb-12">
                        Our Journey
                    </h2>
                    <div className="space-y-6">
                        {milestones.map((m, i) => (
                            <div key={i} className="bg-gray-50 p-5 rounded-lg border-l-4 border-[#138808]">
                                <div className="text-[#FF9933] font-bold">{m.year}</div>
                                <h3 className="font-semibold text-[#1e3a5f]">{m.title}</h3>
                                <p className="text-gray-600 text-sm">{m.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 px-4 bg-[#1e3a5f] text-white text-center">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                    Join Us in Building a Prosperous India
                </h3>
                <p className="mb-6 text-gray-200">
                    Whether you're a citizen seeking services or an organization wanting to collaborate.
                </p>
                <a
                    href="/contact"
                    className="bg-[#FF9933] px-6 py-3 rounded-md font-semibold"
                >
                    Get in Touch →
                </a>
            </section>
        </main>
    );
}