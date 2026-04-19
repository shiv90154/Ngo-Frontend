
"use client";

import React from "react";

const AboutContent = () => {
  return (
    <div className="bg-white text-gray-900">
      {/* 🔶 Hero */}
      <section className="max-w-6xl mx-auto  grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Building a <span className="text-[#FF9933]">Digitally Empowered</span> Bharat
          </h1>
          <div className="w-20 h-1 bg-[#FF9933] mt-6 mb-6"></div>
          <p className="text-gray-600 text-lg leading-relaxed">
            Samraddh Bharat is a unified digital platform that connects citizens
            with essential services through a seamless, accessible, and
            transparent ecosystem designed for national growth.
          </p>
        </div>

        <div className="border-l-4 border-[#FF9933] pl-6">
          <p className="text-2xl font-semibold text-gray-800 leading-relaxed">
            “Empowering citizens with access, knowledge, and opportunity
            through one integrated platform.”
          </p>
        </div>
      </section>

      {/* 🔷 Split Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

          <div className="space-y-6">
            <h2 className="text-4xl font-bold">
              Our <span className="text-[#FF9933]">Mission</span>
            </h2>
            <p className="text-gray-600 leading-relaxed">
              The mission of Samraddh Bharat is to simplify access to essential
              services by creating a centralized digital ecosystem that is easy
              to use, inclusive, and reliable for every citizen.
            </p>
            <p className="text-gray-600 leading-relaxed">
              By integrating multiple sectors into one platform, we aim to
              eliminate barriers, reduce complexity, and ensure that every
              individual benefits from digital transformation.
            </p>
          </div>

          <div className="bg-white border rounded-xl p-8 shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-[#FF9933]">
              Core Objective
            </h3>
            <p className="text-gray-600 leading-relaxed">
              To deliver transparent, efficient, and accessible services that
              contribute to inclusive growth and empower individuals across all
              sectors of society.
            </p>
          </div>

        </div>
      </section>

      {/* 🔶 Services (Mixed Layout) */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold mb-12 text-center">
          Integrated Service Ecosystem
        </h2>

        <div className="grid md:grid-cols-2 gap-12">

          <div className="space-y-6">
            <h3 className="text-2xl font-semibold border-l-4 border-[#FF9933] pl-4">
              Education & Knowledge
            </h3>
            <p className="text-gray-600">
              Access to educational resources, skill development programs, and
              learning opportunities designed to enhance individual growth and
              career development.
            </p>

            <h3 className="text-2xl font-semibold border-l-4 border-[#FF9933] pl-4">
              Financial Services
            </h3>
            <p className="text-gray-600">
              Financial awareness, inclusion schemes, and accessible resources
              that support economic stability and informed decision-making.
            </p>

            <h3 className="text-2xl font-semibold border-l-4 border-[#FF9933] pl-4">
              Agriculture Support
            </h3>
            <p className="text-gray-600">
              Modern farming insights, updates, and government initiatives that
              help improve productivity and sustainability in agriculture.
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-semibold border-l-4 border-[#FF9933] pl-4">
              IT & Digital Services
            </h3>
            <p className="text-gray-600">
              Digital tools and e-governance systems that enhance accessibility
              and strengthen digital participation across the country.
            </p>

            <h3 className="text-2xl font-semibold border-l-4 border-[#FF9933] pl-4">
              News & Information
            </h3>
            <p className="text-gray-600">
              Reliable updates on policies, initiatives, and developments to
              keep citizens informed and aware.
            </p>

            <h3 className="text-2xl font-semibold border-l-4 border-[#FF9933] pl-4">
              Healthcare Access
            </h3>
            <p className="text-gray-600">
              Essential healthcare services, awareness programs, and schemes
              focused on improving public well-being.
            </p>
          </div>

        </div>
      </section>

      {/* 🔷 Vision Section (Centered Bold) */}
      <section className="bg-gray-900 text-white py-20 px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Our Vision
        </h2>
        <div className="w-16 h-1 bg-[#FF9933] mx-auto mb-6"></div>
        <p className="max-w-3xl mx-auto text-lg leading-relaxed text-gray-300">
          To create a digitally inclusive nation where every citizen has equal
          access to opportunities, services, and information, contributing to a
          stronger and more self-reliant India.
        </p>
      </section>

      {/* 🔶 Closing */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <p className="text-2xl font-semibold text-gray-800 leading-relaxed">
          Samraddh Bharat stands as a unified gateway to essential services,
          enabling citizens to connect, access, and grow within a single digital
          ecosystem.
        </p>
      </section>

    </div>
  );
};

export default AboutContent;