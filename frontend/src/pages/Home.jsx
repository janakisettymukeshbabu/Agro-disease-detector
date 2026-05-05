// pages/Home.jsx
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  const pageStyle = {
    minHeight: 'calc(100vh - 56px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    textAlign: 'center'
  }

  const heroStyle = {
    maxWidth: '680px'
  }

  const badgeStyle = {
    display: 'inline-block',
    background: '#dcfce7',
    color: '#16a34a',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: 'bold',
    marginBottom: '20px'
  }

  const titleStyle = {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#14532d',
    lineHeight: '1.2',
    marginBottom: '16px'
  }

  const subtitleStyle = {
    fontSize: '1.1rem',
    color: '#6b7280',
    lineHeight: '1.7',
    marginBottom: '36px'
  }

  const btnStyle = {
    background: '#16aa4c',
    color: 'white',
    border: 'none',
    padding: '14px 36px',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginRight: '12px'
  }

  const btn2Style = {
    background: 'white',
    color: '#16a34a',
    border: '2px solid #16a34a',
    padding: '14px 36px',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer'
  }

  const featuresStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    maxWidth: '800px',
    marginTop: '60px',
    width: '100%'
  }

  const featureCardStyle = {
    background: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    textAlign: 'center'
  }

  return (
    <div style={pageStyle}>
      <div style={heroStyle}>
        <div style={badgeStyle}>🌱 AI-Powered Crop Disease Detection</div>
        <h1 style={titleStyle}>Detect Corn &amp; Maize Diseases Instantly</h1>
        <p style={subtitleStyle}>
          Upload a photo of your crop leaf and our AI model will instantly identify
          the disease, provide treatment solutions, and suggest prevention tips —
          all powered by deep learning.
        </p>
        <button style={btnStyle} onClick={() => navigate('/predict')}>
          🔍 Detect Disease Now
        </button>
        <button style={btn2Style} onClick={() => navigate('/diseases')}>
          📋 View All Diseases
        </button>
      </div>

      {/* Feature Cards */}
      <div style={featuresStyle}>
        {[
          { icon: '📸', title: 'Upload Image',    desc: 'Simply upload a leaf photo from your phone or computer' },
          { icon: '🤖', title: 'AI Detection',    desc: 'MobileNetV2 CNN model trained on thousands of leaf images' },
          { icon: '💊', title: 'Get Solution',    desc: 'Receive treatment steps and prevention tips instantly' },
          { icon: '🌾', title: '4 Disease Types', desc: 'Detects Blight, Common Rust, Gray Leaf Spot & Healthy' },
        ].map((f, i) => (
          <div key={i} style={featureCardStyle}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{f.icon}</div>
            <h3 style={{ color: '#14532d', marginBottom: '8px' }}>{f.title}</h3>
            <p style={{ color: '#6b7280', fontSize: '0.88rem', lineHeight: '1.5' }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}