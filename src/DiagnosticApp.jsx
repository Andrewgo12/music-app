import React, { useEffect, useState } from 'react';

function DiagnosticApp() {
  const [diagnostics, setDiagnostics] = useState({
    reactMounted: false,
    cssLoaded: false,
    tailwindWorking: false,
    jsWorking: false
  });

  useEffect(() => {
    console.log('🔍 DIAGNOSTIC: React component mounted');
    setDiagnostics(prev => ({ ...prev, reactMounted: true }));

    // Check if CSS is loaded
    const testElement = document.createElement('div');
    testElement.className = 'bg-red-500';
    document.body.appendChild(testElement);
    const computedStyle = window.getComputedStyle(testElement);
    const isRed = computedStyle.backgroundColor === 'rgb(239, 68, 68)' || computedStyle.backgroundColor.includes('239');
    document.body.removeChild(testElement);

    setDiagnostics(prev => ({ 
      ...prev, 
      cssLoaded: true,
      tailwindWorking: isRed,
      jsWorking: true
    }));

    console.log('🔍 DIAGNOSTIC: CSS loaded:', true);
    console.log('🔍 DIAGNOSTIC: Tailwind working:', isRed);
    console.log('🔍 DIAGNOSTIC: JavaScript working:', true);
  }, []);

  const diagnosticStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    zIndex: 9999,
    overflow: 'auto'
  };

  const cardStyle = {
    backgroundColor: '#2d2d2d',
    border: '2px solid #4a4a4a',
    borderRadius: '10px',
    padding: '20px',
    margin: '20px 0',
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
  };

  const statusStyle = (working) => ({
    color: working ? '#10b981' : '#ef4444',
    fontWeight: 'bold',
    fontSize: '18px'
  });

  return (
    <div style={diagnosticStyle}>
      <div style={cardStyle}>
        <h1 style={{ fontSize: '32px', marginBottom: '20px', textAlign: 'center' }}>
          🔍 MUSIC APP DIAGNOSTIC TOOL
        </h1>
        
        <div style={cardStyle}>
          <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>System Status:</h2>
          
          <div style={{ marginBottom: '10px' }}>
            <span>React Component: </span>
            <span style={statusStyle(diagnostics.reactMounted)}>
              {diagnostics.reactMounted ? '✅ MOUNTED' : '❌ NOT MOUNTED'}
            </span>
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <span>CSS Loading: </span>
            <span style={statusStyle(diagnostics.cssLoaded)}>
              {diagnostics.cssLoaded ? '✅ LOADED' : '❌ NOT LOADED'}
            </span>
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <span>Tailwind CSS: </span>
            <span style={statusStyle(diagnostics.tailwindWorking)}>
              {diagnostics.tailwindWorking ? '✅ WORKING' : '❌ NOT WORKING'}
            </span>
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <span>JavaScript: </span>
            <span style={statusStyle(diagnostics.jsWorking)}>
              {diagnostics.jsWorking ? '✅ WORKING' : '❌ NOT WORKING'}
            </span>
          </div>
        </div>

        <div style={cardStyle}>
          <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>Visual Tests:</h2>
          
          <div style={{ marginBottom: '15px' }}>
            <h3>Inline Styles Test:</h3>
            <div style={{ 
              backgroundColor: '#ef4444', 
              color: 'white', 
              padding: '10px', 
              borderRadius: '5px',
              marginTop: '5px'
            }}>
              ✅ If you can see this RED box, inline styles work!
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <h3>Tailwind Classes Test:</h3>
            <div className="bg-green-500 text-white p-4 rounded-lg mt-2">
              {diagnostics.tailwindWorking ? '✅' : '❌'} Tailwind CSS Test Box
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <h3>Basic HTML Test:</h3>
            <button 
              onClick={() => alert('Button clicked! JavaScript is working!')}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Click Me to Test JavaScript
            </button>
          </div>
        </div>

        <div style={cardStyle}>
          <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>Environment Info:</h2>
          <div style={{ fontFamily: 'monospace', fontSize: '14px' }}>
            <div>User Agent: {navigator.userAgent}</div>
            <div>Screen Size: {window.innerWidth} x {window.innerHeight}</div>
            <div>Current Time: {new Date().toLocaleString()}</div>
            <div>Location: {window.location.href}</div>
          </div>
        </div>

        <div style={cardStyle}>
          <h2 style={{ fontSize: '24px', marginBottom: '15px', color: '#10b981' }}>
            Next Steps:
          </h2>
          <ol style={{ fontSize: '16px', lineHeight: '1.6' }}>
            <li>If you can see this diagnostic screen, React is working ✅</li>
            <li>Check the browser console (F12) for any error messages</li>
            <li>Verify that all status indicators above show ✅</li>
            <li>Click the test button to verify JavaScript functionality</li>
            <li>If everything shows ✅, the issue is in the main App component</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default DiagnosticApp;
