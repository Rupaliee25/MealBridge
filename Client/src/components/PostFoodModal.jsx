import { useState } from 'react';

export default function PostFoodModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    title: '', original_price: '', prep_time: '', category_tags: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        original_price: parseFloat(form.original_price),
        prep_time: parseInt(form.prep_time),
        category_tags: form.category_tags.split(',').map(t => t.trim()).filter(Boolean)
      });
      onClose();
    } catch (err) {
      alert('Failed to post item. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Post Surplus Food</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required placeholder="Item title (e.g. Paneer Butter Masala Tray)"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
          />
          <input
            required type="number" placeholder="Original price (₹)"
            value={form.original_price}
            onChange={(e) => setForm({ ...form, original_price: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
          />
          <input
            required type="number" placeholder="Prep time (minutes ago)"
            value={form.prep_time}
            onChange={(e) => setForm({ ...form, prep_time: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
          />
          <input
            placeholder="Tags, comma separated (e.g. veg, cooked_bulk_meal)"
            value={form.category_tags}
            onChange={(e) => setForm({ ...form, category_tags: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
          />
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold disabled:opacity-50">
              {submitting ? 'Posting...' : 'Post Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}