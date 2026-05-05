// components/ResultCard.jsx
// Displays the disease prediction result with solution & prevention

export default function ResultCard({ result }) {
  if (!result) return null

  // Severity color mapping
  const severityColors = {
    High:   { bg: '#fef2f2', border: '#ef4444', text: '#dc2626' },
    Medium: { bg: '#fffbeb', border: '#f59e0b', text: '#d97706' },
    Low:    { bg: '#f0fdf4', border: '#22c55e', text: '#16a34a' },
    None:   { bg: '#f0fdf4', border: '#22c55e', text: '#16a34a' },
  }

  const sev = severityColors[result.severity] || severityColors['Medium']

  const cardStyle = {
    background: 'white',
    borderRadius: '12px',
    padding: '28px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
    marginTop: '24px',
    borderLeft: `5px solid ${sev.border}`
  }

  const sectionStyle = {
    marginTop: '20px'
  }

  const sectionTitleStyle = {
    fontSize: '1rem',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#166534'
  }

  const listStyle = {
    listStyle: 'none',
    padding: 0
  }

  const listItemStyle = {
    padding: '8px 12px',
    marginBottom: '6px',
    background: '#f9fafb',
    borderRadius: '6px',
    fontSize: '0.9rem',
    borderLeft: '3px solid #16a34a'
  }

  return (
    <div style={cardStyle}>

      {/* Disease Name + Confidence */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', color: '#14532d', marginBottom: '4px' }}>
            🦠 {result.full_name}
          </h2>
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
            🌾 Crop: <strong>{result.crop}</strong>
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ background: '#dcfce7', color: '#16a34a', padding: '6px 14px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.95rem' }}>
            {result.confidence}% confident
          </div>
          <div style={{ marginTop: '6px', background: sev.bg, color: sev.text, padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
            Severity: {result.severity}
          </div>
        </div>
      </div>

      {/* Description */}
      <p style={{ marginTop: '16px', color: '#374151', lineHeight: '1.6', fontSize: '0.95rem', background: '#f9fafb', padding: '12px', borderRadius: '8px' }}>
        📋 {result.description}
      </p>

      {/* Solution */}
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>💊 Treatment / Solution</h3>
        <ul style={listStyle}>
          {result.solution.map((step, i) => (
            <li key={i} style={listItemStyle}>
              ✅ {step}
            </li>
          ))}
        </ul>
      </div>

      {/* Prevention */}
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>🛡️ Prevention Tips</h3>
        <ul style={listStyle}>
          {result.prevention.map((tip, i) => (
            <li key={i} style={listItemStyle}>
              🔹 {tip}
            </li>
          ))}
        </ul>
      </div>

    </div>
  )
}