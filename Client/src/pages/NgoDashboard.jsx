import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFoodItems } from '../api/foodItems';
import { getMyOrders } from '../api/orders';
import { getMyReceiverProfile } from '../api/receiverProfile';
import FoodItemCard from '../components/FoodItemCard';
import QRTicket from '../components/QRTicket';
import StatCard from '../components/StatCard';

export default function NgoDashboard() {
  const [profile, setProfile] = useState(null);
  const [freeItems, setFreeItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([getMyReceiverProfile(), getFoodItems(), getMyOrders()])
      .then(([profileRes, itemsRes, ordersRes]) => {
        setProfile(profileRes.data);
        setFreeItems((itemsRes.data || []).filter(i => i.status === 'pivoted_to_ngo'));
        setOrders(ordersRes.data || []);
      })
      .catch((err) => console.error('Error loading NGO dashboard:', err))
      .finally(() => setLoading(false));
  }, []);

  const activeClaims = orders.filter(o => o.claim_status !== 'picked_up');
  const mealsReceived = orders.filter(o => o.claim_status === 'picked_up').length;

  if (loading) return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-1">NGO Dashboard</h1>
      <p className="text-gray-600 mb-6">Find and track free food available for your organization.</p>

      {profile?.verification_status === 'pending' && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-4 mb-6 text-sm font-medium">
          Your account is pending verification. Some features may be limited until an admin approves your registration.
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="People Served" value={profile?.people_count || 0} />
        <StatCard label="Dietary Preference" value={profile?.dietary_preference?.replace('_', ' ') || 'N/A'} />
        <StatCard label="Meals Received" value={mealsReceived} accent />
        <StatCard label="Active Claims" value={activeClaims.length} accent />
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-4">Available Free Items Near You</h2>
      {freeItems.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-2xl border border-gray-100 mb-8">
          <p className="text-gray-500">No free items available right now — check back soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {freeItems.map((item) => (
            <FoodItemCard key={item.item_id} item={item} onClick={() => navigate(`/item/${item.item_id}`)} />
          ))}
        </div>
      )}

      {activeClaims.length > 0 && (
        <>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Active Claims</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeClaims.map((order) => (
              <QRTicket key={order.order_id} order={order} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}