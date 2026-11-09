function StatCard({ icon: Icon, title, value, color }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <Icon className={`${color} mb-3`} />
      <p className="text-slate-500">{title}</p>
      <h3 className="text-3xl font-bold mt-2">{value}</h3>
    </div>
  );
}

export default StatCard;