import { Routes, Route } from 'react-router-dom'
import Navbar from './components/common/Navbar'
import HomePage from './pages/HomePage'
import InventoryPage from './pages/InventoryPage'

const App = () => {
  return (
    <div className="app">
      <Navbar />
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/inventory" element={<InventoryPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App