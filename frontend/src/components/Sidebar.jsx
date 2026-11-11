import {
  LayoutDashboard,
  FileText,
  AlertTriangle,
} from "lucide-react";

function Sidebar({ activePage, setActivePage }) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "invoices", label: "Invoices", icon: FileText },
    { id: "issues", label: "Anomalies", icon: AlertTriangle },
  ];

  return (
    <aside className="w-64 min-h-screen bg-[#493B35] text-[#F5F0E9] p-6">
      <h1 className="text-xl font-bold mb-10 tracking-wide">
        GST Compliance
      </h1>

      <nav className="space-y-3">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 ${
                activePage === item.id
                  ? "bg-[#96745B] text-white shadow-md"
                  : "text-[#D9C9BC] hover:bg-[#655247] hover:text-white"
              }`}
            >
              <Icon size={20} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;