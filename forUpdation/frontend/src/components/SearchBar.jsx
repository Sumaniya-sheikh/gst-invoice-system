import { Search } from "lucide-react";

function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <div className="flex items-center gap-2 border border-[#E3D6C9] bg-[#FAF7F3] rounded-xl px-4 py-2.5 mb-5 max-w-sm focus-within:ring-2 focus-within:ring-[#C9A987] focus-within:border-[#96745B] transition-all">

      <Search size={18} className="text-[#96745B] shrink-0" />

      <input
        type="text"
        placeholder="Search invoices..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="outline-none w-full bg-transparent text-sm text-[#493B35] placeholder-[#A89586]"
      />

    </div>
  );
}

export default SearchBar;