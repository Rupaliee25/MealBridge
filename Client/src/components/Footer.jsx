import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-8 px-6 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <h3 className="text-xl font-bold font-heading">MealBridge</h3>
          <p className="text-sm text-gray-200 mt-1">Connecting surplus food to those in need.</p>
        </div>
        <div className="flex gap-6 text-sm text-gray-200">
          <Link to="/marketplace" className="hover:text-amber-accent">Marketplace</Link>
          <Link to="/impact" className="hover:text-amber-accent">Impact</Link>
          <Link to="/admin" className="hover:text-amber-accent">Admin</Link>
        </div>
        <p className="text-xs text-gray-300">
          © {new Date().getFullYear()} MealBridge. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;