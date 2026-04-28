export default function AdminSettingsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Settings</h1>
      <p className="text-gray-600">
        Configure your application settings here.
        Don&apos;t forget to save your changes.
      </p>
      <div className="mt-6">
        <h2 className="text-lg font-semibold">General Settings</h2>
        <p className="text-sm text-gray-500">
          Use these settings to manage your app&apos;s behavior.
        </p>
      </div>
    </div>
  );
}
