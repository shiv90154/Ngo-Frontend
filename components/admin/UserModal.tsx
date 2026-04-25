"use client";

import { useEffect, useState } from "react";
import { adminAPI } from "@/lib/api";
import { X, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const allModules = ["EDUCATION","HEALTHCARE","AGRICULTURE","FINANCE","IT","MEDIA","CRM","ECOMMERCE"];
const roles = [
  "SUPER_ADMIN","ADDITIONAL_DIRECTOR","STATE_OFFICER","DISTRICT_MANAGER",
  "DISTRICT_PRESIDENT","FIELD_OFFICER","BLOCK_OFFICER","VILLAGE_OFFICER",
  "DOCTOR","TEACHER","AGENT","USER"
];

export default function UserModal({ isOpen, onClose, user, onSuccess }: any) {
  const [form, setForm] = useState({ role: "USER", modules: [], isActive: true, reportsTo: "", hierarchyLevel: 0 });
  const [loading, setLoading] = useState(false);
  const [allUsers, setAllUsers] = useState([]); // for reportsTo dropdown

  useEffect(() => {
    if (user) {
      setForm({
        role: user.role,
        modules: user.modules || [],
        isActive: user.isActive,
        reportsTo: user.reportsTo || "",
        hierarchyLevel: user.hierarchyLevel || 0
      });
      // Fetch all users for reporter selection (simplified)
      adminAPI.getUsers({ limit: 100 }).then(res => setAllUsers(res.data.users));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminAPI.updateUser(user._id, form);
      toast.success("User updated");
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Save failed");
    } finally { setLoading(false); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Edit User</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="w-full border rounded-lg p-2">
              {roles.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Modules</label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded-lg p-2">
              {allModules.map(mod => (
                <label key={mod} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.modules.includes(mod)}
                    onChange={e => {
                      if (e.target.checked) setForm({...form, modules: [...form.modules, mod]});
                      else setForm({...form, modules: form.modules.filter((m:string) => m !== mod)});
                    }}
                  /> {mod}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Reports To</label>
            <select value={form.reportsTo} onChange={e => setForm({...form, reportsTo: e.target.value})} className="w-full border rounded-lg p-2">
              <option value="">None</option>
              {allUsers.map((u: any) => u._id !== user._id && <option key={u._id} value={u._id}>{u.fullName} ({u.role})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Hierarchy Level</label>
            <input type="number" value={form.hierarchyLevel} onChange={e => setForm({...form, hierarchyLevel: Number(e.target.value)})} className="w-full border rounded-lg p-2" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} />
            <label className="text-sm font-medium">Active</label>
          </div>
          <div className="flex justify-end gap-2 pt-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-[#1a237e] text-white rounded-lg flex items-center gap-2">
              {loading && <Loader2 className="animate-spin" size={16} />} Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}