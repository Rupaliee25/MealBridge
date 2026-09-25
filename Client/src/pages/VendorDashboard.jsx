import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyListings, createFoodItem } from '../api/foodItems';
import FoodItemCard from '../components/FoodItemCard';
import PostFoodModal from '../components/PostFoodModal';

export default function VendorDashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const loadItems = () => {
    getMyListings()
      .then((res) => setItems(res.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(loadItems, []);

  const handlePost = async (formData) => {
    await createFoodItem(formData);
    loadItems(); // refresh the grid
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vendor Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your surplus food listings.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold"
        >
          + Post Surplus Food
        </button>
      </div>

      {loading && <p className="text-gray-500">Loading your listings...</p>}

      {!loading && items.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-500">No listings yet — post your first surplus item.</p>
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <FoodItemCard key={item.item_id} item={item} onClick={() => navigate(`/item/${item.item_id}`)} />
          ))}
        </div>
      )}

      {showModal && <PostFoodModal onClose={() => setShowModal(false)} onSubmit={handlePost} />}
    </div>
  );
}