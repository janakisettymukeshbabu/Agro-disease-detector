// pages/Predict.jsx
// Main page: image upload → disease detection → show result
import { useState, useRef } from 'react'
import axios from 'axios'
import ResultCard from '../components/ResultCard'

export default function Predict() {
  const [image, setImage]       = useState(null)      // uploaded image file
  const [preview, setPreview]   = useState(null)      // image preview URL
  const [result, setResult]     = useState(null)      // prediction result
  const [loading, setLoading]   = useState(false)     // loading state
  const [error, setError]       = useState(null)      // error message
  const [dragging, setDragging] = useState(false)     // drag over state
  const fileInputRef            = useRef(null)

  // ── Handle file selection ───────────────────────────────
  const handleFile = (file) => {
    if (!file) return

    // Only allow image files
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (jpg, png, etc.)')
      return
    }

    setImage(file)
    setPreview(URL.createObjectURL(file))  // create local preview URL
    setResult(null)   // clear old result
    setError(null)    // clear old error
  }

  const handleFileInput = (e) => handleFile(e.target.files[0])

  // ── Drag and Drop handlers ──────────────────────────────
  const handleDragOver  = (e) => { e.preventDefault(); setDragging(true)  }
  const handleDragLeave = ()  => setDragging(false)
  const handleDrop      = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  // ── Send image to Flask API ─────────────────────────────
  const detectDisease = async () => {
    if (!image) {
      setError('Please upload a leaf image first!')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      // Create FormData to send image file
      const formData = new FormData()
      formData.append('image', image)

      // POST to Flask /predict
      const response = await axios.post('https://agro-disease-detector.onrender.com/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      setResult(response.data)  // store prediction result
    } catch (err) {
      setError(
        err.response?.data?.error ||
        'Connection failed. Make sure Flask API is running on port 5000.'
      )
    } finally {
      setLoading(false)
    }
  }

  // ── Reset everything ────────────────────────────────────
  const reset = () => {
    setImage(null)
    setPreview(null)
    setResult(null)
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // ── Styles ──────────────────────────────────────────────
  const pageStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '40px 20px'
  }

  const titleStyle = {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#14532d',
    marginBottom: '8px'
  }

  const dropZoneStyle = {
    border: `2px dashed ${dragging ? '#16a34a' : '#86efac'}`,
    borderRadius: '12px',
    padding: '48px 24px',
    textAlign: 'center',
    cursor: 'pointer',
    background: dragging ? '#dcfce7' : '#f0fdf4',
    transition: 'all 0.2s',
    marginBottom: '20px'
  }

  const previewStyle = {
    width: '100%',
    maxHeight: '320px',
    objectFit: 'contain',
    borderRadius: '10px',
    marginBottom: '20px',
    border: '1px solid #bbf7d0'
  }

  const btnStyle = {
    background: loading ? '#86efac' : '#16a34a',
    color: 'white',
    border: 'none',
    padding: '14px 32px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: loading ? 'not-allowed' : 'pointer',
    width: '100%',
    marginBottom: '10px'
  }

  const resetBtnStyle = {
    background: 'white',
    color: '#6b7280',
    border: '1px solid #d1d5db',
    padding: '10px 24px',
    borderRadius: '8px',
    fontSize: '0.9rem',
    cursor: 'pointer',
    width: '100%'
  }

  const errorStyle = {
    background: '#fef2f2',
    color: '#dc2626',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '0.9rem'
  }

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>🔍 Detect Crop Disease</h1>
      <p style={{ color: '#6b7280', marginBottom: '28px' }}>
        Upload a clear photo of the corn/maize leaf to detect disease
      </p>

      {/* Drop Zone (shown only when no image selected) */}
      {!preview && (
        <div
          style={dropZoneStyle}
          onClick={() => fileInputRef.current.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📸</div>
          <p style={{ fontWeight: 'bold', color: '#16a34a', marginBottom: '6px' }}>
            Click to upload or drag & drop
          </p>
          <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>
            Supports JPG, PNG, WEBP — Max 10MB
          </p>
        </div>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInput}
        accept="image/*"
        style={{ display: 'none' }}
      />

      {/* Image Preview */}
      {preview && (
        <img src={preview} alt="Leaf preview" style={previewStyle} />
      )}

      {/* Error Message */}
      {error && <div style={errorStyle}>❌ {error}</div>}

      {/* Detect Button */}
      {preview && (
        <>
          <button style={btnStyle} onClick={detectDisease} disabled={loading}>
            {loading ? '⏳ Analyzing leaf...' : '🤖 Detect Disease'}
          </button>
          <button style={resetBtnStyle} onClick={reset}>
            🔄 Upload Different Image
          </button>
        </>
      )}

      {/* Result Card */}
      {result && <ResultCard result={result} />}
    </div>
  )
}