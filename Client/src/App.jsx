import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Marketplace from './pages/Marketplace';
import ItemDetails from './pages/ItemDetails';
import Orders from './pages/Orders';
import VendorDashboard from './pages/VendorDashboard';
import NgoDashboard from './pages/NgoDashboard';
import ScrapDashboard from './pages/ScrapDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ImpactTracker from './pages/ImpactTracker';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Landing />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="marketplace" element={<Marketplace />} />
            <Route path="item/:id" element={<ItemDetails />} />
            <Route path="orders" element={<Orders />} />
            <Route path="vendor/dashboard" element={<VendorDashboard />} />
            <Route path="ngo/dashboard" element={<NgoDashboard />} />
            <Route path="scrap/dashboard" element={<ScrapDashboard />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="impact" element={<ImpactTracker />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;