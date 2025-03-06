import { Routes, Route } from 'react-router-dom'
import Navbar from './components/common/Navbar'
import HomePage from './components/pages/HomePage'
import InventoryPage from './components/pages/InventoryPage'

const App = () => {
  return (
    <div className="app">
      <Navbar />
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/reports" element={<div>Página de Relatórios (em desenvolvimento)</div>} />
        </Routes>
      </main>
    </div>
  )
}

export default App