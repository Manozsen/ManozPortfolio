import { LayoutDashboard, Settings, Users, FolderOpen } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-3 p-4 border rounded-lg">
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </div>
        <div className="flex items-center gap-3 p-4 border rounded-lg">
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </div>
        <div className="flex items-center gap-3 p-4 border rounded-lg">
          <Users className="w-5 h-5" />
          <span>Users</span>
        </div>
        <div className="flex items-center gap-3 p-4 border rounded-lg">
          <FolderOpen className="w-5 h-5" />
          <span>Projects</span>
        </div>
      </div>
    </div>
  );
}
