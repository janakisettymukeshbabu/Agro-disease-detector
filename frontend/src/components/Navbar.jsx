// components/Navbar.jsx
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const { pathname } = useLocation()

  const navStyle = {
    background: '#16a34a',
    padding: '14px 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
  }

  const logoStyle = {
    color: 'white',
    fontSize: '1.4rem',
    fontWeight: 'bold',
    textDecoration: 'none'
  }

  const linksStyle = {
    display: 'flex',
    gap: '24px'
  }

  const linkStyle = (path) => ({
    color: pathname === path ? '#bbf7d0' : 'white',
    textDecoration: 'none',
    fontWeight: pathname === path ? 'bold' : 'normal',
    fontSize: '0.95rem',
    borderBottom: pathname === path ? '2px solid #bbf7d0' : '2px solid transparent',
    paddingBottom: '2px'
  })

  return (
    <nav style={navStyle}>
      <Link to="/" style={logoStyle}>🌽 AgroTech AI</Link>
      <div style={linksStyle}>
        <Link to="/"         style={linkStyle("/")}>Home</Link>
        <Link to="/predict"  style={linkStyle("/predict")}>Detect Disease</Link>
        <Link to="/diseases" style={linkStyle("/diseases")}>All Diseases</Link>
      </div>
    </nav>
  )
}