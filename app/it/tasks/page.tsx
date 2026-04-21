"use client";

import { useEffect, useState } from "react";
import { itAPI } from "@/lib/api";
import { Plus, Loader2, CheckCircle, Circle, Clock } from "lucide-react";
import { toast } from "react-toastify";
import TaskModal from "@/components/it/TaskModal";

const columns = [
  { id: "todo", label: "To Do", icon: Circle },
  { id: "in-progress", label: "In Progress", icon: Clock },
  { id: "done", label: "Done", icon: CheckCircle },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [filterProject, setFilterProject] = useState("all");
  const [projects, setProjects] = useState<any[]>([]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await itAPI.getTasks({ project: filterProject === "all" ? undefined : filterProject });
      setTasks(res.data.tasks);
    } catch (error) {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await itAPI.getProjects({ limit: 100 });
      setProjects(res.data.projects);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [filterProject]);

  const handleTaskUpdate = async (taskId: string, status: string) => {
    try {
      await itAPI.updateTask(taskId, { status });
      fetchTasks();
      toast.success("Task updated");
    } catch (error) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-800">Tasks</h1>
        <div className="flex items-center gap-2">
          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="all">All Projects</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
          <button
            onClick={() => { setEditingTask(null); setModalOpen(true); }}
            className="flex items-center gap-2 bg-[#1a237e] text-white px-4 py-2 rounded-lg"
          >
            <Plus className="w-4 h-4" /> New Task
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.map((col) => {
            const columnTasks = tasks.filter((t) => t.status === col.id);
            const Icon = col.icon;
            return (
              <div key={col.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <h2 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Icon className="w-4 h-4" /> {col.label} ({columnTasks.length})
                </h2>
                <div className="space-y-2">
                  {columnTasks.map((task) => (
                    <div
                      key={task._id}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-sm cursor-pointer"
                      onClick={() => { setEditingTask(task); setModalOpen(true); }}
                    >
                      <p className="font-medium text-gray-800">{task.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{task.project?.name}</p>
                      {task.dueDate && (
                        <p className="text-xs text-gray-400 mt-1">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <TaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        task={editingTask}
        onSuccess={fetchTasks}
        projects={projects}
      />
    </div>
  );
}