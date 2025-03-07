import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { AuthProvider } from '../context/AuthContext';
import InventoryPage from "./pages/InventoryPage";
import SyncManager from "./components/SyncManager";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/inventory/:inventoryId"
            element={
              <>
                <InventoryTable />
                <SyncManager />
              </>
            }
          />
          {/* ... outras rotas */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}
