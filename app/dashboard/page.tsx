import { LayoutDashboard, Activity, Bell } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <LayoutDashboard className="w-6 h-6" />
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 p-4 border rounded-lg">
          <Activity className="w-5 h-5 text-green-500" />
          <div>
            <p className="text-sm text-gray-500">Activity</p>
            <p className="font-semibold">Active</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 border rounded-lg">
          <Bell className="w-5 h-5 text-yellow-500" />
          <div>
            <p className="text-sm text-gray-500">Notifications</p>
            <p className="font-semibold">0 new</p>
          </div>
        </div>
      </div>
    </div>
  );
}
