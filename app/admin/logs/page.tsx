"use client";

import { useEffect, useState } from "react";
import { adminAPI } from "@/lib/api";
import { Loader2, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";

const ACTION_TYPES = ["", "USER_UPDATED", "COURSE_CREATED", "APPOINTMENT_BOOKED", "SETTINGS_CHANGED"];

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionFilter, setActionFilter] = useState("");
  const [userIdFilter, setUserIdFilter] = useState("");

  useEffect(() => {
    fetchLogs();
  }, [page, actionFilter, userIdFilter]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getLogs({ page, limit: 20, action: actionFilter || undefined, userId: userIdFilter || undefined });
      setLogs(res.data.logs);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch logs", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Activity Logs</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Filter className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          >
            <option value="">All Actions</option>
            {ACTION_TYPES.filter(Boolean).map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
        <input
          type="text"
          placeholder="Filter by User ID"
          value={userIdFilter}
          onChange={(e) => setUserIdFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 sm:w-64"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Action</th>
              <th className="px-4 py-3 text-left hidden md:table-cell">Details</th>
              <th className="px-4 py-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-8">
                  <Loader2 className="animate-spin mx-auto" />
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">No logs found.</td>
              </tr>
            ) : (
              logs.map((log: any) => (
                <tr key={log._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {log.user ? (
                      <div>
                        <p className="font-medium">{log.user.fullName}</p>
                        <p className="text-xs text-gray-500">{log.user.email}</p>
                      </div>
                    ) : "System"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">{log.action}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell max-w-xs truncate">{log.details}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{new Date(log.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-50">
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm">Page {page} of {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-50">
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}