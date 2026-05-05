import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Predict from './pages/Predict'
import Diseases from './pages/Diseases'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/predict"  element={<Predict />} />
        <Route path="/diseases" element={<Diseases />} />
      </Routes>
    </BrowserRouter>
  )
}