import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getMyOrders } from '../api/orders';
import QRTicket from '../components/QRTicket';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const highlightQr = searchParams.get('qr');

  useEffect(() => {
    getMyOrders()
      .then((res) => setOrders(res.data || []))
      .catch((err) => console.error('Error fetching orders:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading your orders...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-1">Your Orders</h1>
      <p className="text-gray-600 mb-6">Track your claimed and purchased items.</p>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-500">No orders yet — browse the Marketplace to claim your first item.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orders.map((order) => (
            <QRTicket
              key={order.order_id}
              order={order}
              highlighted={order.pickup_qr_code === highlightQr}
            />
          ))}
        </div>
      )}
    </div>
  );
}