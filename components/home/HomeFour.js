'use client';
import React from 'react';

const WORKFLOW_STEPS = [
    { num: 'Step I', phase: 'Enrollment', title: 'Aadhaar Based KYC', desc: 'Secure digital registration using biometric or OTP verification through UIADI protocols.' },
    { num: 'Step II', phase: 'Selection', title: 'Sector Designation', desc: 'Identify required services across the 6 major hubs (Agriculture, Health, Edu, etc.).' },
    { num: 'Step III', phase: 'Processing', title: 'Nodal Verification', desc: 'Applications are routed to the respective departmental desk for strict compliance checks.' },
    { num: 'Step IV', phase: 'Execution', title: 'Direct Fulfillment', desc: 'Service execution, status updates, and digital certificates are issued to the citizen vault.' },
];

const HomeFour = () => {
    return (
        <section className="bg-gray-50 py-16 border-b border-gray-300">
            <div className="govt-container">
                
                <div className="flex flex-col lg:flex-row gap-12 items-start">
                    
                    {/* Header Context */}
                    <div className="lg:w-1/3">
                        <div className="sticky top-24">
                            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-4">
                                Citizen Access <br />Workflow
                            </h2>
                            <p className="text-sm text-gray-600 font-medium mb-6">
                                Strict administrative protocols ensure that all requests are verified, tracked, and delivered with 100% transparency. There are no hidden tiers; all verified citizens have equal access.
                            </p>
                            <ul className="space-y-3">
                                {['No Intermediaries', 'End-to-End Encryption', 'SLAs strictly enforced'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-2 text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                                        <div className="w-2 h-2 bg-[#FF7B00]" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="lg:w-2/3 w-full">
                        <div className="bg-white border border-gray-300 rounded-sm shadow-sm">
                            <div className="flex bg-[#1e293b] text-white p-4 border-b border-[#334155]">
                                <h3 className="text-[12px] font-bold uppercase tracking-widest w-1/4">Phase</h3>
                                <h3 className="text-[12px] font-bold uppercase tracking-widest w-3/4">Procedure Description</h3>
                            </div>
                            
                            <div className="flex flex-col divide-y divide-gray-200">
                                {WORKFLOW_STEPS.map((step, idx) => (
                                    <div key={idx} className="flex flex-col sm:flex-row p-6 hover:bg-gray-50 transition-colors">
                                        <div className="sm:w-1/4 mb-2 sm:mb-0">
                                            <span className="block text-[10px] font-bold text-[#FF7B00] uppercase tracking-widest">{step.num}</span>
                                            <span className="block text-sm font-bold text-gray-900">{step.phase}</span>
                                        </div>
                                        <div className="sm:w-3/4 border-l-0 sm:border-l-2 sm:border-[#FF7B00] sm:pl-5">
                                            <h4 className="text-[15px] font-bold text-gray-900 mb-1">{step.title}</h4>
                                            <p className="text-[13px] text-gray-600 font-medium">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
};

export default HomeFour;