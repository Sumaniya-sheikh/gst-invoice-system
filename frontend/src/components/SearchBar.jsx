import { Search } from "lucide-react";

function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <div className="flex items-center gap-2 border rounded-lg px-3 py-2 mb-5 max-w-sm">
      <Search size={18} className="text-slate-400" />

      <input
        placeholder="Search invoices..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="outline-none w-full"
      />
    </div>
  );
}

export default SearchBar;