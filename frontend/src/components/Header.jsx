import { Bell, ShieldCheck } from "lucide-react";

function Header() {
  return (
    <header className="flex justify-between items-center mb-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">
          Dashboard
        </h2>
        <p className="text-slate-500 mt-1">
          GST Invoice Compliance Overview
        </p>
      </div>

      <div className="flex gap-4 items-center">
        <Bell className="text-slate-500" />
        <div className="bg-blue-100 text-blue-700 rounded-full p-3">
          <ShieldCheck size={22} />
        </div>
      </div>
    </header>
  );
}

export default Header;