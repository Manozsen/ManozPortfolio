import { FolderOpen, Plus, Trash2, Edit } from "lucide-react";

export default function AdminProjectsPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FolderOpen className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Projects</h1>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>
      <div className="border rounded-lg p-4">
        <p className="text-gray-500">No projects yet.</p>
      </div>
    </div>
  );
}
