"use client";

import React from "react";

const COMPANY_NAME = "Samraddh Bharat";
const SUPPORT_EMAIL = "support@samraddhbharat.com";

export default function PrivacyPolicyContent(): React.JSX.Element {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <header className="mb-8 border-b pb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Last Updated: April 1, 2026
        </p>
      </header>

      {/* Content */}
      <section className="bg-white shadow-md rounded-2xl p-6 md:p-8 text-gray-700 space-y-6">
        {/* Intro */}
        <p className="bg-gray-50 border-l-4 border-blue-500 p-4 rounded-md">
          At <strong>{COMPANY_NAME}</strong>, we are committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information.
        </p>

        {/* Section 1 */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            1. Information We Collect
          </h2>
          <p className="mt-2">
            We may collect personal information such as your name, email address, phone number, and payment details when you register, make a purchase, or contact support.
          </p>
        </div>

        {/* Section 2 */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            2. Usage Data
          </h2>
          <p className="mt-2">
            We automatically collect usage data (IP address, browser type, pages visited) to improve our services and analyze trends.
          </p>
        </div>

        {/* Section 3 */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            3. Cookies & Tracking
          </h2>
          <p className="mt-2">
            We use cookies to enhance your experience, remember preferences, and serve relevant content. You can disable cookies in your browser settings.
          </p>
        </div>

        {/* Section 4 */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            4. How We Use Your Information
          </h2>
          <p className="mt-2">
            Your data is used to process transactions, provide customer support, send updates, and improve our platform. We never sell your personal information to third parties.
          </p>
        </div>

        {/* Section 5 */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            5. Data Sharing & Disclosure
          </h2>
          <p className="mt-2">
            We may share your information with trusted service providers (payment processors, hosting) or when required by law. All third parties are bound by confidentiality agreements.
          </p>
        </div>

        {/* Section 6 */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            6. Data Security
          </h2>
          <p className="mt-2">
            We implement industry-standard security measures (encryption, firewalls, access controls) to protect your data. However, no online transmission is 100% secure.
          </p>
        </div>

        {/* Section 7 */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            7. Your Rights
          </h2>
          <p className="mt-2">
            You may request access, correction, or deletion of your personal data. Contact us at the email below. You may also opt out of marketing communications at any time.
          </p>
        </div>

        {/* Section 8 */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            8. Children's Privacy
          </h2>
          <p className="mt-2">
            Our services are not directed to children under 13. We do not knowingly collect personal information from minors.
          </p>
        </div>

        {/* Section 9 */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            9. Changes to This Policy
          </h2>
          <p className="mt-2">
            We may update this privacy policy periodically. The latest version will always be posted with the effective date. Continued use of our services constitutes acceptance.
          </p>
        </div>

        {/* Footer */}
        <footer className="pt-4 border-t text-sm">
          Questions? Contact us at{" "}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="text-blue-600 font-medium hover:underline"
          >
            {SUPPORT_EMAIL}
          </a>
          <p className="mt-2 text-xs">
            This policy applies to all services provided by {COMPANY_NAME}.
          </p>
        </footer>
      </section>
    </main>
  );
}