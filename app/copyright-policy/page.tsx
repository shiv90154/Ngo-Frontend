// app/copyright-policy/page.jsx
"use client";

import React from "react";

const COMPANY_NAME = "Samraddh Bharat";

export default function CopyrightPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <header className="mb-8 border-b pb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Copyright Policy
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Last Updated: April 1, 2026
        </p>
      </header>

      {/* Content */}
      <section className="bg-white shadow-md rounded-2xl p-6 md:p-8 text-gray-700 space-y-6">
        {/* Intro */}
        <p className="bg-gray-50 border-l-4 border-blue-500 p-4 rounded-md">
          <strong>{COMPANY_NAME}</strong> respects the intellectual property rights of others and expects our users to do the same. This Copyright Policy explains how we handle claims of copyright infringement on our platform.
        </p>

        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            1. Ownership of Content
          </h2>
          <p className="mt-2">
            All content published on this website – including text, images, graphics, logos, videos, and software – is the exclusive property of {COMPANY_NAME} or its content suppliers, and is protected by Indian and international copyright laws. Unauthorized use, reproduction, or distribution of any material from this site may violate copyright, trademark, and other laws.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            2. User-Generated Content
          </h2>
          <p className="mt-2">
            By submitting or posting any content (such as comments, reviews, or uploads) on our platform, you grant {COMPANY_NAME} a non-exclusive, royalty-free, perpetual license to use, modify, display, and distribute that content solely for operating and improving our services. You represent that you own or have permission to share any content you submit.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            3. Copyright Infringement Claims (DMCA Notice)
          </h2>
          <p className="mt-2">
            If you believe that any material on our website infringes your copyright, you may submit a written notice to our designated agent. The notice must include:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700">
            <li>A physical or electronic signature of the copyright owner or authorized person.</li>
            <li>Identification of the copyrighted work claimed to have been infringed.</li>
            <li>Identification of the material that is claimed to be infringing (e.g., URL or specific location).</li>
            <li>Your contact information (address, phone number, email).</li>
            <li>A statement that you have a good faith belief that use is not authorized.</li>
            <li>A statement, under penalty of perjury, that the information in your notice is accurate and you are authorized to act.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            4. Counter-Notice
          </h2>
          <p className="mt-2">
            If you believe that your content was removed or disabled by mistake or misidentification, you may file a counter-notice. Your counter-notice must include your signature, identification of the removed material, a statement under penalty of perjury that you have a good faith belief the material was removed in error, and your contact information. We will forward your counter-notice to the original complainant.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            5. Repeat Infringer Policy
          </h2>
          <p className="mt-2">
            {COMPANY_NAME} maintains a policy of terminating, in appropriate circumstances, the accounts of users who are determined to be repeat infringers. We also reserve the right to disable access to any material that we believe in good faith infringes a copyright.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            6. Fair Use Disclaimer
          </h2>
          <p className="mt-2">
            Some content on this site may include copyrighted material the use of which has not always been specifically authorized by the copyright owner. We believe this constitutes &quot;fair use&quot; as provided for in Section 107 of the U.S. Copyright Act (or applicable local laws) for purposes such as criticism, comment, news reporting, teaching, scholarship, or research. If you wish to use copyrighted material from this site for purposes beyond fair use, you must obtain permission from the copyright owner.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            7. Reporting Copyright Infringement
          </h2>
          <p className="mt-2">
            To report an alleged infringement, please send a detailed notice to our designated copyright agent at the following email address. We will respond promptly and take appropriate action.
          </p>
        </div>
      </section>
    </main>
  );
}