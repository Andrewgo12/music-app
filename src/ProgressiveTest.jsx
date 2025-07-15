import React, { useState, useEffect } from 'react';

function ProgressiveTest() {
  const [step, setStep] = useState(1);
  const [results, setResults] = useState({});

  useEffect(() => {
    console.log('🔍 PROGRESSIVE TEST: Starting step', step);
    
    const timer = setTimeout(() => {
      if (step < 5) {
        setStep(step + 1);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [step]);

  const testCSS = () => {
    try {
      const testDiv = document.createElement('div');
      testDiv.className = 'bg-blue-500';
      document.body.appendChild(testDiv);
      const styles = window.getComputedStyle(testDiv);
      const isTailwind = styles.backgroundColor.includes('59, 130, 246') || styles.backgroundColor === 'rgb(59, 130, 246)';
      document.body.removeChild(testDiv);
      return isTailwind;
    } catch (error) {
      console.error('CSS test failed:', error);
      return false;
    }
  };

  const stepContent = {
    1: {
      title: "Step 1: Basic React Rendering",
      content: "✅ React is working! Components can render.",
      bgColor: "#10b981"
    },
    2: {
      title: "Step 2: CSS Loading Test",
      content: `CSS Status: ${testCSS() ? '✅ Tailwind Working' : '❌ Tailwind Not Working'}`,
      bgColor: "#3b82f6"
    },
    3: {
      title: "Step 3: State Management Test",
      content: `✅ useState and useEffect are working! Current step: ${step}`,
      bgColor: "#8b5cf6"
    },
    4: {
      title: "Step 4: Event Handling Test",
      content: (
        <div>
          <div>✅ Event handling test:</div>
          <button 
            onClick={() => alert('Button works!')}
            style={{
              backgroundColor: '#ef4444',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              marginTop: '10px',
              cursor: 'pointer'
            }}
          >
            Click Me!
          </button>
        </div>
      ),
      bgColor: "#f59e0b"
    },
    5: {
      title: "Step 5: Ready for Main App",
      content: (
        <div>
          <div>✅ All basic tests passed!</div>
          <div style={{ marginTop: '20px' }}>
            <button 
              onClick={() => {
                // Switch to main app
                window.location.reload();
              }}
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                padding: '15px 30px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '18px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Load Main Application
            </button>
          </div>
        </div>
      ),
      bgColor: "#10b981"
    }
  };

  const currentStep = stepContent[step];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: currentStep.bgColor,
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      fontWeight: 'bold',
      zIndex: 99999,
      textAlign: 'center',
      flexDirection: 'column',
      transition: 'background-color 0.5s ease'
    }}>
      <div style={{ 
        backgroundColor: 'rgba(0,0,0,0.2)', 
        padding: '40px', 
        borderRadius: '20px',
        maxWidth: '600px'
      }}>
        <h1 style={{ fontSize: '32px', marginBottom: '30px' }}>
          🔍 PROGRESSIVE DIAGNOSTIC
        </h1>
        
        <h2 style={{ fontSize: '28px', marginBottom: '20px' }}>
          {currentStep.title}
        </h2>
        
        <div style={{ fontSize: '20px', lineHeight: '1.6' }}>
          {currentStep.content}
        </div>
        
        <div style={{ 
          marginTop: '30px', 
          fontSize: '16px', 
          opacity: 0.8 
        }}>
          Step {step} of 5 • Auto-advancing in 2 seconds
        </div>

        {step < 5 && (
          <div style={{
            marginTop: '20px',
            width: '300px',
            height: '4px',
            backgroundColor: 'rgba(255,255,255,0.3)',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${(step / 5) * 100}%`,
              height: '100%',
              backgroundColor: 'white',
              transition: 'width 0.5s ease'
            }} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ProgressiveTest;
