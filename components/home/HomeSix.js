'use client';
import React, { useState } from 'react';

const HomeSix = () => {
    const [formData, setFormData] = useState({ id: '', name: '', dept: 'Agriculture', query: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Grievance ticket raised for ${formData.name}. Department: ${formData.dept}`);
        setFormData({ id: '', name: '', dept: 'Agriculture', query: '' });
    };

    return (
        <section className="bg-white py-16">
            <div className="govt-container">
                
                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* Directory */}
                    <div className="lg:w-1/3">
                        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-6 pb-2 border-b-2 border-gray-200">
                            Nodal Contact <br/><span className="text-[#FF7B00]">Registry</span>
                        </h2>
                        
                        <div className="space-y-6">
                            <div className="border border-gray-300 p-4 rounded-sm bg-gray-50 border-l-4 border-l-[#FF7B00]">
                                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Central Support Desk</h3>
                                <p className="text-[13px] font-bold text-gray-900 flex items-center gap-2">📞 1800-123-4567</p>
                                <p className="text-[13px] font-bold text-gray-900 flex items-center gap-2">✉ support@samraddhbharat.gov.in</p>
                            </div>
                            
                            <div className="border border-gray-300 p-4 rounded-sm bg-white">
                                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Administrative Office</h3>
                                <p className="text-sm font-semibold text-gray-800">
                                    Block A, Digital India Hub<br />
                                    New Delhi, 110001
                                </p>
                            </div>

                            <div className="bg-gray-100 p-4 rounded-sm text-xs font-semibold text-gray-600 border border-gray-200">
                                Note: Physical meetings require prior appointment verified via the portal.
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="lg:w-2/3">
                        <div className="bg-white border border-gray-300 p-6 sm:p-10 rounded-sm shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight mb-2">Centralized Grievance Redressal Mechanism</h3>
                            <p className="text-xs text-gray-600 font-medium mb-6 pb-4 border-b border-gray-200">
                                Submit official complaints or service disruptions affecting any of the 6 core modules. Tickets are logged and escalated according to standard SLAs.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">Aadhaar/Applicant ID *</label>
                                        <input 
                                            type="text" required value={formData.id}
                                            onChange={e => setFormData({...formData, id: e.target.value})}
                                            className="w-full p-2.5 text-sm bg-gray-50 border border-gray-300 rounded-sm focus:bg-white focus:border-[#FF7B00] outline-none"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">Full Name *</label>
                                        <input 
                                            type="text" required value={formData.name}
                                            onChange={e => setFormData({...formData, name: e.target.value})}
                                            className="w-full p-2.5 text-sm bg-gray-50 border border-gray-300 rounded-sm focus:bg-white focus:border-[#FF7B00] outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">Module / Department *</label>
                                    <select 
                                        value={formData.dept} onChange={e => setFormData({...formData, dept: e.target.value})}
                                        className="w-full p-2.5 text-sm bg-gray-50 border border-gray-300 rounded-sm focus:bg-white focus:border-[#FF7B00] outline-none"
                                    >
                                        <option>Agriculture Hub</option>
                                        <option>Healthcare Systems</option>
                                        <option>Digital Education</option>
                                        <option>Financial DBTs</option>
                                        <option>IT & CRM Auth</option>
                                        <option>News & Media</option>
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">Detailed Description *</label>
                                    <textarea 
                                        rows="4" required value={formData.query}
                                        onChange={e => setFormData({...formData, query: e.target.value})}
                                        className="w-full p-2.5 text-sm bg-gray-50 border border-gray-300 rounded-sm focus:bg-white focus:border-[#FF7B00] outline-none font-medium text-gray-800"
                                    />
                                </div>

                                <div className="flex justify-end pt-2">
                                    <button type="submit" className="govt-btn-primary px-8 py-3 tracking-widest text-[11px]">
                                        Lodge Grievance
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>

            </div>
            
            {/* Footer Ribbon */}
            <div className="w-full h-1 mt-16 bg-[#FF7B00]" />
        </section>
    );
};

export default HomeSix;