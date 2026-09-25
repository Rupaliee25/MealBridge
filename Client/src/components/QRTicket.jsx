export default function QRTicket({ order, highlighted }) {
  const statusSteps = ['reserved', 'ready', 'picked_up'];
  const currentStep = statusSteps.indexOf(order.claim_status);

  return (
    <div className={`bg-white rounded-2xl border p-6 ${highlighted ? 'border-primary shadow-md' : 'border-gray-100 shadow-sm'}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">{order.item_title}</h3>
          <p className="text-xs text-gray-400 mt-1">
            {order.order_type === 'free_ngo_rescue' ? 'Free NGO Rescue' : 'Paid Purchase'}
            {order.amount_paid > 0 && ` · ₹${order.amount_paid}`}
          </p>
        </div>
        <span className="text-xs font-mono bg-gray-50 px-2 py-1 rounded-lg text-gray-500">
          {order.pickup_qr_code}
        </span>
      </div>

      {/* Timeline stepper */}
      <div className="flex items-center gap-1 mb-4">
        {statusSteps.map((step, i) => (
          <div key={step} className="flex items-center flex-1">
            <div className={`w-2.5 h-2.5 rounded-full ${i <= currentStep ? 'bg-primary' : 'bg-gray-200'}`} />
            {i < statusSteps.length - 1 && (
              <div className={`flex-1 h-0.5 ${i < currentStep ? 'bg-primary' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-gray-400 mb-4">
        <span className={currentStep >= 0 ? 'text-primary font-medium' : ''}>Reserved</span>
        <span className={currentStep >= 1 ? 'text-primary font-medium' : ''}>Ready</span>
        <span className={currentStep >= 2 ? 'text-primary font-medium' : ''}>Picked Up</span>
      </div>

      <div className="border-t border-dashed border-gray-200 pt-4 text-center">
        <p className="text-xs text-gray-400 mb-1">Show this at pickup</p>
        <p className="font-mono font-bold text-lg tracking-wider text-gray-800">{order.pickup_qr_code}</p>
      </div>
    </div>
  );
}