"use client";

import { useEffect, useState } from "react";
import { adminAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import {
  Search, Edit, Ban, CheckCircle, Loader2, ChevronLeft, ChevronRight
} from "lucide-react";
import UserModal from "@/components/admin/UserModal";
import { toast } from "react-toastify";

const ROLES = [
  "SUPER_ADMIN", "ADDITIONAL_DIRECTOR", "STATE_OFFICER",
  "DISTRICT_MANAGER", "DISTRICT_PRESIDENT", "FIELD_OFFICER",
  "BLOCK_OFFICER", "VILLAGE_OFFICER",
  "DOCTOR", "TEACHER", "AGENT", "USER",
];

export default function UsersPage() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!isAdmin) { router.replace("/services"); return; }
    fetchUsers();
  }, [page, search, roleFilter, isAdmin]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Pass hierarchy information if needed (backend filters for you)
      const res = await adminAPI.getUsers({
        page,
        limit: 15,
        search: search || undefined,
        role: roleFilter || undefined,
      });
      setUsers(res.data.users);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      const res = await adminAPI.toggleUserActive(id);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isActive: res.data.isActive } : u));
      toast.success("Status updated");
    } catch (error) {
      toast.error("Action failed");
    }
  };

  // Restrict actions based on role
  const canEdit = user?.role === "SUPER_ADMIN" || user?.role === "ADDITIONAL_DIRECTOR" || user?.role === "STATE_OFFICER";
  const canToggle = user?.role === "SUPER_ADMIN" || user?.role === "ADDITIONAL_DIRECTOR" || user?.role === "STATE_OFFICER" || user?.role === "DISTRICT_MANAGER";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          {user?.role === "VILLAGE_OFFICER" ? "Village Users" : user?.role === "BLOCK_OFFICER" ? "Block Users" : "User Management"}
        </h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
        {canEdit && (
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="">All Roles</option>
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center py-8"><Loader2 className="animate-spin mx-auto" /></td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-8 text-gray-500">No users found.</td></tr>
            ) : (
              users.map((u: any) => (
                <tr key={u._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{u.fullName}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{u.role}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${u.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      {canEdit && (
                        <button onClick={() => { setSelectedUser(u); setModalOpen(true); }} className="p-1 hover:bg-gray-100 rounded">
                          <Edit size={16} />
                        </button>
                      )}
                      {canToggle && (
                        <button onClick={() => handleToggleActive(u._id)} className="p-1 hover:bg-gray-100 rounded">
                          {u.isActive ? <Ban size={16} className="text-red-600" /> : <CheckCircle size={16} className="text-green-600" />}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-1.5 rounded disabled:opacity-40 hover:bg-gray-200">
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm">Page {page} of {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="p-1.5 rounded disabled:opacity-40 hover:bg-gray-200">
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      <UserModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        user={selectedUser}
        onSuccess={fetchUsers}
      />
    </div>
  );
}