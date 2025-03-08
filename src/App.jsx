import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import HomePage from './pages/HomePage';
import Auth from './components/common/Auth';
import InventoryPage from './pages/InventoryPage';
import InventoriesPage from './pages/InventoriesPage';


const App = () => {
  return (
    <AuthProvider>
      <Router basename="/edmc">
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/inventories" element={<InventoriesPage />} />
              <Route path="/inventory/new" element={<InventoryPage />} />
              <Route path="/inventory/:inventoryId" element={<InventoryPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;