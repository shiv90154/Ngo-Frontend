'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const INITIATIVES = [
    { code: 'AGR-DBT', title: 'Farmer Subsidy Linkage', sector: 'Agriculture', status: 'Active' },
    { code: 'EDU-RUR', title: 'Smart Class Deployment', sector: 'Education', status: 'In Progress' },
    { code: 'HLT-TELE', title: 'Tele-Medicine Hubs', sector: 'Healthcare', status: 'Active' },
    { code: 'FIN-AEPS', title: 'Aadhaar Payment Systems', sector: 'Finance', status: 'Active' },
];

const HomeFive = () => {
    const router = useRouter();

    return (
        <section className="bg-white py-16 border-b border-gray-300">
            <div className="govt-container">
                
                {/* PPP Model Explanation */}
                <div className="mb-12">
                    <div className="flex flex-col md:flex-row bg-[#FF7B00] text-white rounded-sm overflow-hidden shadow-sm">
                        <div className="md:w-3/4 p-8">
                            <span className="block text-[10px] uppercase tracking-widest font-bold mb-2 text-white/80">Public-Private Partnership</span>
                            <h2 className="text-2xl font-black mb-4 uppercase">Gram Panchayat Service Hubs</h2>
                            <p className="text-sm font-medium mb-6 max-w-3xl leading-relaxed text-white/90">
                                The Samraddh Bharat Foundation authorizes local individuals to serve as official nodal points. These Franchise hubs are empowered to distribute our 6 core services directly to the rural populace, ensuring last-mile delivery while earning official commission structures.
                            </p>
                            <button 
                                onClick={() => router.push('/services/franchise')}
                                className="px-6 py-2.5 bg-white text-[#FF7B00] text-xs font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors rounded-sm"
                            >
                                Submit Hub Application
                            </button>
                        </div>
                        <div className="md:w-1/4 bg-[#cc6200] p-8 flex flex-col justify-center border-l-4 border-white/20">
                            <h3 className="text-4xl font-black mb-2">15,000+</h3>
                            <p className="text-[11px] uppercase tracking-wider font-bold">Authorized Centers<br/>Nationwide</p>
                        </div>
                    </div>
                </div>

                {/* Status Table */}
                <div>
                    <h3 className="text-lg font-bold text-gray-900 uppercase mb-4 pl-2 border-l-4 border-[#FF7B00]">Real-Time Sector Deployments</h3>
                    <div className="overflow-x-auto border border-gray-300 rounded-sm">
                        <table className="w-full text-left bg-white">
                            <thead className="bg-gray-100 border-b border-gray-300">
                                <tr>
                                    <th className="p-3 text-[11px] font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Scheme Code</th>
                                    <th className="p-3 text-[11px] font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Initiative Detail</th>
                                    <th className="p-3 text-[11px] font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Associated Module</th>
                                    <th className="p-3 text-[11px] font-bold text-gray-700 uppercase tracking-wider">Deployment Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {INITIATIVES.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="p-3 text-gray-600 font-mono text-[11px] font-bold border-r border-gray-200">{item.code}</td>
                                        <td className="p-3 font-bold text-gray-900 border-r border-gray-200 text-[13px] uppercase">{item.title}</td>
                                        <td className="p-3 border-r border-gray-200">
                                            <span className="bg-gray-100 px-2 py-1 text-[9px] font-bold tracking-widest text-[#FF7B00] uppercase border border-[#FF7B00]/20 rounded-sm">
                                                {item.sector}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <span className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${item.status === 'Active' ? 'text-green-700' : 'text-blue-700'}`}>
                                                <div className={`w-2 h-2 rounded-full ${item.status === 'Active' ? 'bg-green-600' : 'bg-blue-600'}`} />
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default HomeFive;