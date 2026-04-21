"use client";

import { useEffect, useState } from "react";
import { itAPI } from "@/lib/api";
import { Plus, Search, Loader2, MoreHorizontal, Edit, Trash2, Filter } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";

const statusOptions = ["all", "planning", "active", "on-hold", "completed", "cancelled"];

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showMenu, setShowMenu] = useState<string | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await itAPI.getProjects({
        search: search || undefined,
        status: statusFilter === "all" ? undefined : statusFilter,
      });
      setProjects(res.data.projects);
    } catch (error) {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(fetchProjects, 300);
    return () => clearTimeout(delay);
  }, [search, statusFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project? All related tasks will be orphaned.")) return;
    try {
      await itAPI.deleteProject(id);
      toast.success("Project deleted");
      fetchProjects();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const getStatusBadge = (status: string) => {
    const map: any = {
      planning: "bg-gray-100 text-gray-800",
      active: "bg-blue-100 text-blue-800",
      "on-hold": "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return map[status] || "bg-gray-100";
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
        <Link href="/it/projects/new" className="flex items-center gap-2 bg-[#1a237e] text-white px-4 py-2 rounded-lg">
          <Plus className="w-4 h-4" /> New Project
        </Link>
      </div>

      {/* 筛选栏 */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 项目列表 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>
        ) : projects.length === 0 ? (
          <p className="p-8 text-center text-gray-500">No projects found</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 hidden md:table-cell">Client</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Progress</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {projects.map((p: any) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">
                    <Link href={`/it/projects/${p._id}`} className="hover:text-[#1a237e]">
                      {p.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                    {p.client?.name || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#1a237e] rounded-full"
                          style={{ width: `${p.progress || 0}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{p.progress || 0}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(p.status)}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right relative">
                    <button onClick={() => setShowMenu(showMenu === p._id ? null : p._id)}>
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    {showMenu === p._id && (
                      <div className="absolute right-4 mt-1 w-32 bg-white shadow-lg border rounded-lg py-1 z-10">
                        <Link href={`/it/projects/${p._id}/edit`} className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                          <Edit className="w-3 h-3" /> Edit
                        </Link>
                        <button onClick={() => handleDelete(p._id)} className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </div>
                    )}
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