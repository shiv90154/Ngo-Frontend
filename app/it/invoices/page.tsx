"use client";

import { useEffect, useState } from "react";
import { itAPI } from "@/lib/api";
import { Plus, Search, Loader2, MoreHorizontal, FileText, Eye, Download } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await itAPI.getInvoices({
        search: search || undefined,
        status: statusFilter === "all" ? undefined : statusFilter,
      });
      setInvoices(res.data.invoices);
    } catch (error) {
      toast.error("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(fetchInvoices, 300);
    return () => clearTimeout(delay);
  }, [search, statusFilter]);

  const getStatusBadge = (status: string) => {
    const map: any = {
      draft: "bg-gray-100 text-gray-800",
      sent: "bg-blue-100 text-blue-800",
      paid: "bg-green-100 text-green-800",
      overdue: "bg-red-100 text-red-800",
    };
    return map[status] || "bg-gray-100";
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-800">Invoices</h1>
        <Link href="/it/invoices/new" className="flex items-center gap-2 bg-[#1a237e] text-white px-4 py-2 rounded-lg">
          <Plus className="w-4 h-4" /> Create Invoice
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by invoice # or client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>
        ) : invoices.length === 0 ? (
          <p className="p-8 text-center text-gray-500">No invoices found</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Invoice #</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Client</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 hidden sm:table-cell">Date</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Amount</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-center font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {invoices.map((inv: any) => (
                <tr key={inv._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono">{inv.invoiceNumber}</td>
                  <td className="px-4 py-3">{inv.client?.name}</td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">
                    {new Date(inv.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 font-medium">₹{inv.total?.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(inv.status)}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <Link href={`/it/invoices/${inv._id}`} className="p-1.5 hover:bg-gray-100 rounded">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button className="p-1.5 hover:bg-gray-100 rounded">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}