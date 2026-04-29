import { Users, UserPlus } from "lucide-react";

export default function AdminUsersPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Users</h1>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
          <UserPlus className="w-4 h-4" />
          Add User
        </button>
      </div>
      <div className="border rounded-lg p-4">
        <p className="text-gray-500">No users found.</p>
      </div>
    </div>
  );
}
