import {
  LayoutDashboard,
  FileText,
  AlertTriangle,
} from "lucide-react";

function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white p-6">
      <h1 className="text-xl font-bold mb-10">
        GST Compliance
      </h1>

      <nav className="space-y-4">
        <div className="flex items-center gap-3 bg-blue-600 p-3 rounded-lg">
          <LayoutDashboard size={20} />
          Dashboard
        </div>

        <div className="flex items-center gap-3 p-3 text-slate-300">
          <FileText size={20} />
          Invoices
        </div>

        <div className="flex items-center gap-3 p-3 text-slate-300">
          <AlertTriangle size={20} />
          Anomalies
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;