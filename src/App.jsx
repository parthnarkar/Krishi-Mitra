import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import BulkBuyPage from './pages/BulkBuyPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        {/* Simple Header */}
        <header className="border-b border-gray-200">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-primary">
              Bulk Buy
            </Link>
            <nav>
              <Link to="/bulk-buy" className="text-secondary font-semibold hover:text-opacity-80">
                Start Negotiation
              </Link>
            </nav>
          </div>
        </header>

        {/* Routes */}
        <Routes>
          <Route path="/bulk-buy" element={<BulkBuyPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App 