export default function AuditTimeline({ logs }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 mt-10">
      <h2 className="text-xl font-semibold mb-6">Activity Timeline</h2>

      <ol className="relative border-l border-gray-300 pl-6 space-y-6">
        {logs.map((log) => {
          const actor =
            log.performedBy?.fullName ||
            log.performedBy?.email ||
            "System";

          return (
            <li key={log._id} className="relative">
              <span className="absolute -left-[9px] top-1.5 w-3 h-3 bg-blue-600 rounded-full" />

              <p className="font-medium">{log.description}</p>

              <p className="text-sm text-gray-500">
                {actor} • {new Date(log.createdAt).toLocaleString()}
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
