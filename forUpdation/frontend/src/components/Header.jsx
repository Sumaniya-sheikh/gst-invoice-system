import { Bell, ShieldCheck } from "lucide-react";

function Header() {
  return (
    <header className="flex justify-between items-center mb-8">

      <div>
        <h2 className="text-3xl font-bold text-[#493B35]">
          Dashboard
        </h2>

        <p className="text-[#927F71] mt-1">
          GST Invoice Compliance Overview
        </p>
      </div>

      <div className="flex gap-4 items-center">

        <button
          type="button"
          aria-label="Notifications"
          className="text-[#96745B] hover:text-[#493B35] transition-colors"
        >
          <Bell size={21} />
        </button>

        <div className="bg-[#EDE2D6] text-[#805D48] rounded-full p-3">
          <ShieldCheck size={22} />
        </div>

      </div>

    </header>
  );
}

export default Header;