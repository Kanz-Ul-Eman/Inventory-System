function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500">{title}</p>

          <h2 className="mt-2 text-3xl font-bold">{value}</h2>
        </div>

        <Icon className="text-4xl text-blue-600" />
      </div>
    </div>
  );
}

export default StatCard;
