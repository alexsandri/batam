export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  color = "blue",
}) {
  const colors = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    orange: "bg-orange-100 text-orange-600",
    red: "bg-red-100 text-red-600",
    purple: "bg-purple-100 text-purple-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h3 className="mt-3 text-3xl font-bold text-slate-800">
            {value}
          </h3>

          <p className="mt-2 text-xs text-slate-500">
            {description}
          </p>
        </div>

        <div className={`rounded-xl p-3 ${colors[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}