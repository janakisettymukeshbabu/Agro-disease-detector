// pages/Diseases.jsx
// Shows all diseases with their solutions and prevention tips
import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Diseases() {
  const [diseases, setDiseases] = useState({})
  const [loading, setLoading]   = useState(true)
  const [expanded, setExpanded] = useState(null)  // which card is open

  // Load all diseases from Flask API on page load
  useEffect(() => {
    axios.get('http://localhost:5000/diseases')
      .then(res => {
        setDiseases(res.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const severityColors = {
    High:   '#ef4444',
    Medium: '#f59e0b',
    Low:    '#22c55e',
    None:   '#22c55e',
  }

  const pageStyle = {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '40px 20px'
  }

  const cardStyle = {
    background: 'white',
    borderRadius: '12px',
    marginBottom: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    overflow: 'hidden'
  }

  const cardHeaderStyle = (key) => ({
    padding: '20px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    background: expanded === key ? '#f0fdf4' : 'white',
    borderLeft: `4px solid ${severityColors[diseases[key]?.severity] || '#22c55e'}`
  })

  const cardBodyStyle = {
    padding: '0 24px 20px',
    borderTop: '1px solid #f3f4f6'
  }

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '80px', color: '#6b7280' }}>
      ⏳ Loading disease data...
    </div>
  )

  return (
    <div style={pageStyle}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#14532d', marginBottom: '8px' }}>
        📋 All Corn/Maize Diseases
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '28px' }}>
        Click on any disease to see treatment and prevention details
      </p>

      {Object.entries(diseases).map(([key, d]) => (
        <div key={key} style={cardStyle}>

          {/* Card Header — click to expand */}
          <div style={cardHeaderStyle(key)} onClick={() => setExpanded(expanded === key ? null : key)}>
            <div>
              <h2 style={{ fontSize: '1.1rem', color: '#14532d', marginBottom: '4px' }}>
                🦠 {d.full_name}
              </h2>
              <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                🌾 {d.crop}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{
                background: severityColors[d.severity] + '22',
                color: severityColors[d.severity],
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 'bold'
              }}>
                {d.severity} Severity
              </span>
              <span style={{ color: '#16a34a', fontSize: '1.2rem' }}>
                {expanded === key ? '▲' : '▼'}
              </span>
            </div>
          </div>

          {/* Expanded Card Body */}
          {expanded === key && (
            <div style={cardBodyStyle}>
              <p style={{ color: '#374151', margin: '16px 0', lineHeight: '1.6', fontSize: '0.92rem' }}>
                {d.description}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '12px' }}>

                {/* Solution */}
                <div>
                  <h3 style={{ color: '#16a34a', marginBottom: '10px', fontSize: '0.95rem' }}>
                    💊 Treatment
                  </h3>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {d.solution.map((s, i) => (
                      <li key={i} style={{ fontSize: '0.85rem', padding: '6px 10px', marginBottom: '5px', background: '#f9fafb', borderRadius: '6px', borderLeft: '3px solid #16a34a' }}>
                        ✅ {s}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Prevention */}
                <div>
                  <h3 style={{ color: '#16a34a', marginBottom: '10px', fontSize: '0.95rem' }}>
                    🛡️ Prevention
                  </h3>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {d.prevention.map((p, i) => (
                      <li key={i} style={{ fontSize: '0.85rem', padding: '6px 10px', marginBottom: '5px', background: '#f9fafb', borderRadius: '6px', borderLeft: '3px solid #86efac' }}>
                        🔹 {p}
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}