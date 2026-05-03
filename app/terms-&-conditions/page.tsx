// app/terms-&-conditions/page.jsx
"use client";

import React from "react";

const COMPANY_NAME = "Samraddh Bharat";
// (email footer में नहीं दिखेगा, लेकिन variable रख सकते हैं अगर कहीं use करना हो)

export default function TermsConditionsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <header className="mb-8 border-b pb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Terms & Conditions
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Last Updated: April 1, 2026
        </p>
      </header>

      {/* Content */}
      <section className="bg-white shadow-md rounded-2xl p-6 md:p-8 text-gray-700 space-y-6">
        {/* Intro */}
        <p className="bg-gray-50 border-l-4 border-blue-500 p-4 rounded-md">
          Welcome to <strong>{COMPANY_NAME}</strong>. By accessing or using our website and services, you agree to be bound by these Terms & Conditions. If you disagree with any part, please do not use our platform.
        </p>

        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            1. Acceptance of Terms
          </h2>
          <p className="mt-2">
            By using this website, you confirm that you are at least 18 years old or have parental/guardian consent. These terms constitute a legally binding agreement between you and {COMPANY_NAME}.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            2. Use of Our Services
          </h2>
          <p className="mt-2">
            You agree to use our services only for lawful purposes and in a way that does not infringe the rights of others. You must not misuse our platform by introducing viruses, hacking, or overloading our infrastructure.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            3. User Accounts
          </h2>
          <p className="mt-2">
            If you create an account, you are responsible for maintaining the confidentiality of your login credentials. You agree to provide accurate and complete information and to notify us immediately of any unauthorized use.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            4. Intellectual Property
          </h2>
          <p className="mt-2">
            All content on this website – including text, graphics, logos, and software – is the property of {COMPANY_NAME} or its licensors and is protected by copyright and trademark laws. You may not reproduce, distribute, or create derivative works without explicit permission.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            5. Payments & Refunds
          </h2>
          <p className="mt-2">
            If our services involve paid transactions, you agree to pay all fees incurred. Refunds, if any, are governed by our separate refund policy. We reserve the right to change prices with prior notice.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            6. Third-Party Links
          </h2>
          <p className="mt-2">
            Our platform may contain links to external websites. We are not responsible for the content, privacy practices, or availability of those sites. Access them at your own risk.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            7. Limitation of Liability
          </h2>
          <p className="mt-2">
            To the maximum extent permitted by law, {COMPANY_NAME} shall not be liable for any indirect, incidental, or consequential damages arising from your use of our services, even if we have been advised of the possibility of such damages.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            8. Indemnification
          </h2>
          <p className="mt-2">
            You agree to indemnify and hold {COMPANY_NAME} harmless from any claims, losses, or expenses (including legal fees) arising from your violation of these terms or your use of our platform.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            9. Termination
          </h2>
          <p className="mt-2">
            We may suspend or terminate your access to our services at our sole discretion, without notice, for conduct that violates these terms or harms other users. You may also delete your account at any time.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            10. Changes to Terms
          </h2>
          <p className="mt-2">
            We reserve the right to modify these Terms & Conditions at any time. Changes will be posted on this page with an updated effective date. Your continued use of the platform constitutes acceptance of the revised terms.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            11. Governing Law
          </h2>
          <p className="mt-2">
            These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising shall be subject to the exclusive jurisdiction of the courts in [Your City/State].
          </p>
        </div>
      </section>
    </main>
  );
}