export default function StatCard({ label, value, accent = false }) {
  return (
    <div className={`rounded-2xl p-5 border ${accent ? 'bg-primary/5 border-primary/20' : 'bg-white border-gray-100'}`}>
      <p className="text-xs text-gray-400 font-medium">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${accent ? 'text-primary' : 'text-gray-900'}`}>{value}</p>
    </div>
  );
}