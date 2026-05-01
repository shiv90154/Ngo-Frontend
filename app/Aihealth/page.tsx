// app/page.tsx
'use client';

import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';

// -------------------------------
// Types
// -------------------------------
interface AnalysisResult {
  condition: string;
  confidence: number;
  status: string;
  advice: string;
  subtypes?: string;
  definition?: string;
  top_predictions?: Array<{ condition: string; confidence: number }>;
  ai_generated?: boolean;
  is_urgent?: boolean;
  display_name?: string;
}

// -------------------------------
// Main Component
// -------------------------------
export default function Home() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [streamingAdvice, setStreamingAdvice] = useState<string>('');
  const [language, setLanguage] = useState<'English' | 'Hindi'>('English');
  const abortControllerRef = useRef<AbortController | null>(null);

  // Drag & drop handler
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('File exceeds 10 MB.');
      return;
    }
    setUploadedFile(file);
    setResult(null);
    setStreamingAdvice('');
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [], 'image/bmp': [] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  });

  const clearFile = () => {
    setUploadedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setStreamingAdvice('');
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  // Analyze function with streaming
  const analyzeImage = async () => {
    if (!uploadedFile) return;

    setAnalyzing(true);
    setResult(null);
    setStreamingAdvice('');

    const formData = new FormData();
    formData.append('file', uploadedFile);
    formData.append('language', language);

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('https://5918brkf-8000.inc1.devtunnels.ms/predict', {
        method: 'POST',
        body: formData,
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = '';
      let metaParsed = false;
      let parsedResult: AnalysisResult = {
        condition: 'Uncertain',
        confidence: 0,
        status: 'uncertain',
        advice: '',
      };

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;

        // Extract meta line (first line until newline)
        if (!metaParsed && fullText.includes('\n')) {
          const firstLine = fullText.split('\n')[0];
          if (firstLine.startsWith('__META__')) {
            const parts = firstLine.split('|');
            if (parts.length >= 4) {
              parsedResult = {
                condition: parts[1],
                confidence: parseFloat(parts[2]),
                status: parts[3],
                advice: '',
              };
              metaParsed = true;
              setResult(parsedResult);
            }
          }
        }

        // Update streaming advice after meta
        if (metaParsed) {
          const advicePart = fullText.split('\n').slice(1).join('\n');
          setStreamingAdvice(advicePart);
          parsedResult.advice = advicePart;
          setResult({ ...parsedResult });
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error(err);
        alert('Analysis failed. Please try again.');
      }
    } finally {
      setAnalyzing(false);
      abortControllerRef.current = null;
    }
  };

  // ----- Helpers for rendering -----
  const isHealthy = () => {
    const cond = result?.condition?.trim() || '';
    return ['Healthy', 'Heathy', 'Normal Skin', 'No Disease'].includes(cond);
  };

  const isUncertain = () => {
    return result?.status === 'uncertain' || (result?.confidence || 0) < 60;
  };

  const displayName = () => {
    if (!result) return '';
    return language === 'Hindi' ? (result.display_name || result.condition) : result.condition;
  };

  // ----- Render -----
  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          background: #f9fafb;
          font-family: system-ui, -apple-system, 'Inter', sans-serif;
        }
        .container {
          max-width: 800px;
          margin: 2rem auto;
          padding: 0 1.5rem;
        }
        .app-title {
          font-size: 1.65rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 0.15rem;
        }
        .app-sub {
          font-size: 0.88rem;
          color: #6b7280;
          margin-bottom: 1.5rem;
        }
        .dropzone {
          border: 2px dashed #d1d5db;
          border-radius: 14px;
          padding: 2rem 1rem;
          text-align: center;
          cursor: pointer;
          background: #f9fafb;
          transition: all 0.2s;
        }
        .dropzone-active {
          border-color: #3b82f6;
          background: #eff6ff;
        }
        .preview-img {
          max-width: 100%;
          max-height: 300px;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
          margin: 1rem 0;
        }
        .btn-analyze {
          background: #2563eb;
          color: white;
          font-weight: 600;
          padding: 0.6rem 1rem;
          border-radius: 8px;
          width: 100%;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
          margin-top: 1rem;
        }
        .btn-analyze:hover { background: #1d4ed8; }
        .btn-analyze:disabled { background: #9ca3af; cursor: not-allowed; }
        .result-wrap {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 1.4rem 1.6rem;
          margin-top: 1rem;
        }
        .badge {
          display: inline-block;
          padding: 3px 12px;
          border-radius: 20px;
          font-size: 0.73rem;
          font-weight: 700;
          margin-bottom: 0.8rem;
        }
        .badge-ok { background: #d1fae5; color: #065f46; }
        .badge-urgent { background: #fee2e2; color: #991b1b; }
        .cond-name { font-size: 1.4rem; font-weight: 700; color: #111827; margin-bottom: 4px; }
        .confidence-bar {
          width: 100%;
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          margin: 0.5rem 0 1rem;
          overflow: hidden;
        }
        .confidence-fill {
          height: 100%;
          background: #3b82f6;
          border-radius: 4px;
          transition: width 0.3s;
        }
        .subtype-box {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 10px;
          padding: 0.75rem 1rem;
          margin: 0.75rem 0;
        }
        .subtype-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: #1d4ed8;
          font-weight: 700;
          margin-bottom: 4px;
        }
        .section-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: #9ca3af;
          font-weight: 600;
          margin-bottom: 3px;
        }
        .section-value {
          font-size: 0.92rem;
          color: #374151;
          line-height: 1.7;
          white-space: pre-wrap;
        }
        .ai-badge {
          display: inline-block;
          padding: 2px 10px;
          border-radius: 12px;
          font-size: 0.68rem;
          font-weight: 600;
          margin-left: 8px;
          background: #f3e8ff;
          color: #7c3aed;
        }
        .healthy-box {
          background: #f0fdf4;
          border: 1px solid #86efac;
          border-radius: 14px;
          padding: 1.4rem 1.6rem;
          margin-top: 1rem;
        }
        .uncertain-box {
          background: #fefce8;
          border: 1px solid #fde047;
          border-radius: 14px;
          padding: 1.4rem 1.6rem;
          margin-top: 1rem;
        }
        .disclaimer {
          background: #fff7ed;
          border: 1px solid #fed7aa;
          border-radius: 10px;
          padding: 0.8rem 1rem;
          font-size: 0.82rem;
          color: #92400e;
          margin-top: 1.2rem;
        }
        .sidebar {
          background: white;
          border-radius: 16px;
          padding: 1rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          border: 1px solid #e5e7eb;
        }
        .toggle-switch {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }
        .toggle-switch button {
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          border: 1px solid #d1d5db;
          background: white;
          cursor: pointer;
          font-size: 0.8rem;
        }
        .toggle-switch .active {
          background: #2563eb;
          color: white;
          border-color: #2563eb;
        }
        hr {
          margin: 1rem 0;
        }
      `}</style>

      <div className="container">
        <div className="app-title">🔬 Skin Disease Screening</div>
        <div className="app-sub">AI‑powered skin image analysis</div>

        <div className="sidebar">
          <div style={{ fontWeight: 600 }}>⚙️ Settings</div>
          <div className="toggle-switch">
            <button
              onClick={() => setLanguage('English')}
              className={language === 'English' ? 'active' : ''}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('Hindi')}
              className={language === 'Hindi' ? 'active' : ''}
            >
              हिंदी (Hindi)
            </button>
          </div>
        </div>

        {!uploadedFile ? (
          <div
            {...getRootProps()}
            className={`dropzone ${isDragActive ? 'dropzone-active' : ''}`}
          >
            <input {...getInputProps()} />
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📷</div>
            <div style={{ fontWeight: 600, color: '#4b5563' }}>
              Drag & drop a skin image here
            </div>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '0.5rem' }}>
              JPG · PNG · WEBP · BMP — max 10 MB
            </div>
          </div>
        ) : (
          <div>
            {previewUrl && (
              <img src={previewUrl} alt="Preview" className="preview-img" />
            )}
            <button onClick={clearFile} style={{ color: '#dc2626', fontSize: '0.8rem', marginBottom: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
              Remove image
            </button>
            <button
              onClick={analyzeImage}
              disabled={analyzing}
              className="btn-analyze"
            >
              {analyzing ? 'Analyzing...' : '🔍 Analyze Image'}
            </button>
          </div>
        )}

        {analyzing && (
          <div className="result-wrap" style={{ marginTop: '1rem' }}>
            <div style={{ fontWeight: 500 }}>📡 Analyzing image...</div>
            <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.5rem' }}>
              Running AI model (ViT) – streaming results...
            </div>
            {streamingAdvice && (
              <div className="section-value" style={{ marginTop: '0.8rem' }}>
                {streamingAdvice}
              </div>
            )}
          </div>
        )}

        {result && !analyzing && (
          <>
            {isHealthy() ? (
              <div className="healthy-box">
                <div className="healthy-title">✨ Healthy Skin</div>
                <div className="healthy-text">
                  No signs of disease detected. Continue maintaining good skincare practices.
                </div>
              </div>
            ) : isUncertain() ? (
              <div className="uncertain-box">
                <div className="uncertain-title">❓ Low Confidence Result</div>
                <div className="uncertain-text">
                  The model is uncertain about this image. Please upload a clearer, well‑lit image for better analysis.
                </div>
              </div>
            ) : (
              <div>
                <div className="result-wrap">
                  <span className={`badge ${result.is_urgent ? 'badge-urgent' : 'badge-ok'}`}>
                    {result.is_urgent ? '⚠️ Seek Medical Attention' : '✓ Classified'}
                  </span>
                  <div className="cond-name">
                    {displayName()}
                    {result.ai_generated && <span className="ai-badge">AI Generated</span>}
                  </div>
                  <div className="confidence-bar">
                    <div
                      className="confidence-fill"
                      style={{ width: `${Math.min(result.confidence, 100)}%` }}
                    />
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#4b5563' }}>
                    Confidence: {result.confidence}%
                  </div>
                </div>

                {result.subtypes && (
                  <div className="subtype-box">
                    <div className="subtype-label">
                      {language === 'Hindi' ? 'आपको विशेष रूप से यह हो सकता है' : 'You may specifically have'}
                    </div>
                    <div className="subtype-text">{result.subtypes}</div>
                  </div>
                )}

                {result.advice && (
                  <div className="result-wrap">
                    <div className="section-label">
                      {language === 'Hindi' ? 'सामान्य देखभाल सलाह' : 'General care advice'}
                    </div>
                    <div className="section-value">{result.advice}</div>
                  </div>
                )}

                {result.top_predictions && result.top_predictions.length > 0 && (
                  <div className="result-wrap">
                    <div className="section-label">Possible Conditions</div>
                    <div className="section-value">
                      {result.top_predictions.map((p, idx) => (
                        <div key={idx}>
                          • {p.condition} ({p.confidence}%)
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        <div className="disclaimer">
          <strong>Disclaimer:</strong> This is not medical advice. Always consult a qualified healthcare professional for proper diagnosis and treatment.
        </div>
      </div>
    </>
  );
}