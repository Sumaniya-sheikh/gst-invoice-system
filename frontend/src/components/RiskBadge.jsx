function RiskBadge({ riskLevel }) {
  const styles = {
    LOW: "bg-green-100 text-green-700",
    MEDIUM: "bg-yellow-100 text-yellow-700",
    HIGH: "bg-red-100 text-red-700",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[riskLevel] || "bg-slate-100 text-slate-600"}`}>
      {riskLevel || "Not evaluated"}
    </span>
  );
}

export default RiskBadge;