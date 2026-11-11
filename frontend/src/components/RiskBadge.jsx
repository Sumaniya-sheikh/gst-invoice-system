function RiskBadge({ riskLevel }) {
  const styles = {
    LOW: "bg-green-100 text-green-800 border border-green-200",
    MEDIUM: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    HIGH: "bg-red-100 text-red-800 border border-red-200",
  };

  const labels = {
    LOW: "No Issues",
    MEDIUM: "Medium Risk",
    HIGH: "High Risk",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
        styles[riskLevel] || "bg-[#F5F0E9] text-[#806D60] border border-[#E9DED3]"
      }`}
    >
      {labels[riskLevel] || "Not evaluated"}
    </span>
  );
}

export default RiskBadge;