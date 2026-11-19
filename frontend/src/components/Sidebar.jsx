
import {
  LayoutDashboard,
  FileText,
  AlertTriangle,
  UserRound,
  LogOut,
  CalendarDays,
  Building2,
  CreditCard,
  BookOpen,
  History,
  ShieldAlert,
} from "lucide-react";

function Sidebar({ activePage, setActivePage, currentUser, onLogout }) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "invoices", label: "Invoices", icon: FileText },
    { id: "issues", label: "Anomalies", icon: AlertTriangle },
    { id: "vendors", label: "Vendor Management", icon: Building2 },
    { id: "payments", label: "Payment Tracking", icon: CreditCard },
    { id: "gst-summary", label: "Monthly GST Summary", icon: CalendarDays },
    { id: "registers", label: "Purchase & Sales", icon: BookOpen },
    { id: "audit", label: "Audit History", icon: History },
    { id: "vendor-risk", label: "Vendor Risk Profile", icon: ShieldAlert },
    { id: "account", label: "Account Settings", icon: UserRound },
    ...(currentUser?.role === "ADMIN"
      ? [{ id: "users", label: "User Management", icon: UserRound }]
      : []),
  ];

  const roleLabel =
    currentUser?.role === "ADMIN" ? "Administrator" : "Business User";

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col overflow-y-auto bg-[#493B35] p-5 text-[#F5F0E9]">
      <h1 className="mb-8 text-xl font-bold tracking-wide">
        GST Compliance
      </h1>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${
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

      <div className="mt-auto border-t border-[#756156] pt-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#96745B]">
            <UserRound size={21} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">
              {currentUser?.username}
            </p>
            <p className="text-xs text-[#D9C9BC]">{roleLabel}</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#F5F0E9] hover:bg-[#655247]"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
