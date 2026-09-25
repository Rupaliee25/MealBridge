import CountdownRing from './CountdownRing';

const statusConfig = {
  listed: { label: 'Available', color: 'bg-primary/10 text-primary' },
  reserved: { label: 'Reserved', color: 'bg-amber-100 text-amber-700' },
  picked_up: { label: 'Picked Up', color: 'bg-gray-100 text-gray-500' },
  pivoted_to_ngo: { label: 'Free for NGOs', color: 'bg-primary/10 text-primary' },
};

export default function FoodItemCard({ item, onClick }) {
  const status = statusConfig[item.status] || statusConfig.listed;
  const isFree = item.status === 'pivoted_to_ngo';

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-4 cursor-pointer border border-gray-100"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{item.title}</h3>
          <span className={`inline-block mt-1 text-xs px-2 py-1 rounded-full font-medium ${status.color}`}>
            {status.label}
          </span>
        </div>
        <CountdownRing expiryTimer={item.expiry_timer} size={56} />
      </div>

      <div className="flex items-baseline gap-2">
        {isFree ? (
          <span className="text-lg font-bold text-primary">FREE</span>
        ) : (
          <>
            <span className="text-lg font-bold text-gray-900">₹{item.current_price}</span>
            <span className="text-sm text-gray-400 line-through">₹{item.original_price}</span>
          </>
        )}
      </div>

      {/* Cascade pipeline indicator — your unique differentiator */}
      <div className="flex items-center gap-1 mt-3 text-[10px] text-gray-400">
        <span className={item.status === 'listed' ? 'text-primary font-semibold' : ''}>Sale</span>
        <span>→</span>
        <span className={item.status === 'pivoted_to_ngo' ? 'text-primary font-semibold' : ''}>NGO</span>
        <span>→</span>
        <span>Scrap</span>
      </div>
    </div>
  );
}