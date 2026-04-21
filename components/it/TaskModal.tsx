"use client";

import { useEffect, useState } from "react";
import { itAPI } from "@/lib/api";
import { X, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

export default function TaskModal({ isOpen, onClose, task, onSuccess, projects }: any) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    project: "",
    assignedTo: "",
    status: "todo",
    priority: "medium",
    dueDate: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setForm({
        ...task,
        dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
      });
    } else {
      setForm({ title: "", description: "", project: "", assignedTo: "", status: "todo", priority: "medium", dueDate: "" });
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (task) await itAPI.updateTask(task._id, form);
      else await itAPI.createTask(form);
      toast.success(task ? "Task updated" : "Task created");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Save failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{task ? "Edit Task" : "New Task"}</h2>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="text" placeholder="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full p-2 border rounded-lg" required />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full p-2 border rounded-lg" rows={2} />
          <select value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} className="w-full p-2 border rounded-lg" required>
            <option value="">Select Project</option>
            {projects?.map((p: any) => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="p-2 border rounded-lg">
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Review</option>
              <option value="done">Done</option>
            </select>
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="p-2 border rounded-lg">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="w-full p-2 border rounded-lg" />
          <div className="flex justify-end gap-2 pt-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-[#1a237e] text-white rounded-lg flex items-center gap-2">
              {loading ? <Loader2 className="animate-spin w-4 h-4" /> : null} Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}