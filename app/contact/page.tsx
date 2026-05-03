import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-[#f8fafc]">
        {/* Page Header */}
        <section className="bg-gradient-to-r from-[#1a237e] to-[#283593] text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-bold font-serif mb-2">Contact Us</h1>
            <p className="text-blue-100">Get in touch with the Samraddh Bharat support team</p>
          </div>
        </section>

        {/* Tricolor separator */}
        <div className="h-1 flex">
          <div className="w-1/3 bg-[#FF9933]"></div>
          <div className="w-1/3 bg-white"></div>
          <div className="w-1/3 bg-[#138808]"></div>
        </div>

        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Contact Information */}
              <div className="md:col-span-1 space-y-6">
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-[#1a237e] mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-[#FF9933] rounded-full"></span>
                    Contact Information
                  </h3>
                  <div className="space-y-5">
                    {/* Chhattisgarh Head Office */}
                    <div className="flex items-start gap-3">
                      <MapPin className="text-[#1a237e] mt-0.5 flex-shrink-0" size={20} />
                      <div>
                        <p className="font-medium text-gray-800">Head Office (Chhattisgarh)</p>
                        <p className="text-sm text-gray-600">
                          Rani Durgavati Chowk,<br />
                          Dattatreya, Gaurella,<br />
                          Chhattisgarh – 495117, India
                        </p>
                      </div>
                    </div>

                    {/* Madhya Pradesh Head Office */}
                    <div className="flex items-start gap-3">
                      <MapPin className="text-[#1a237e] mt-0.5 flex-shrink-0" size={20} />
                      <div>
                        <p className="font-medium text-gray-800">Head Office (Madhya Pradesh)</p>
                        <p className="text-sm text-gray-600">
                          Ward No. 13, Anuppur Near Kediya Petrol Pump,<br />
                          Amarkantak, Chowk, Jaitahari Road,<br />
                          Anuppur, Madhya Pradesh 484224
                        </p>
                      </div>
                    </div>

                    {/* Phone Numbers */}
                    <div className="flex items-start gap-3">
                      <Phone className="text-[#1a237e] mt-0.5 flex-shrink-0" size={20} />
                      <div>
                        <p className="font-medium text-gray-800">Phone</p>
                        <p className="text-sm text-gray-600">+91 92437 73487</p>
                        <p className="text-sm text-gray-600">+9630959865</p>
                      </div>
                    </div>

                    {/* Email (keeping a generic one – update if you have actual email) */}
                    <div className="flex items-start gap-3">
                      <Mail className="text-[#1a237e] mt-0.5 flex-shrink-0" size={20} />
                      <div>
                        <p className="font-medium text-gray-800">Email</p>
                        <p className="text-sm text-gray-600">info@samraddhbharat.org</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Optional: Regional Offices – removed as not provided */}
              </div>

              {/* Contact Form */}
              <div className="md:col-span-2">
                <div className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-gray-200">
                  <h3 className="text-xl font-bold text-[#1a237e] mb-2">Send us a Message</h3>
                  <p className="text-gray-600 mb-6">
                    Fill the form below and our team will get back to you within 2 working days.
                  </p>

                  <form className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a237e] focus:border-[#1a237e] outline-none"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="email"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a237e] focus:border-[#1a237e] outline-none"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a237e] focus:border-[#1a237e] outline-none"
                          placeholder="+91 XXXXX XXXXX"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Subject <span className="text-red-600">*</span>
                        </label>
                        <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a237e] focus:border-[#1a237e] outline-none bg-white">
                          <option>General Enquiry</option>
                          <option>Technical Support</option>
                          <option>Service Related</option>
                          <option>Feedback / Suggestions</option>
                          <option>Grievance</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message <span className="text-red-600">*</span>
                      </label>
                      <textarea
                        rows={5}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a237e] focus:border-[#1a237e] outline-none"
                        placeholder="Please describe your query in detail..."
                      ></textarea>
                    </div>

                    <div>
                      <button
                        type="submit"
                        className="bg-[#1a237e] hover:bg-[#0d1757] text-white font-medium px-6 py-3 rounded-lg transition shadow-md hover:shadow-lg inline-flex items-center gap-2"
                      >
                        <Send size={18} /> Send Message
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="mt-12 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
              <div className="aspect-[21/9] bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">[ Interactive Map  Headquarters Location ]</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}