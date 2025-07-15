import React from 'react';

function TestSimple() {
  return (
    <div style={{ 
      backgroundColor: 'red', 
      color: 'white', 
      padding: '20px',
      fontSize: '24px',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div>
        <h1>🎵 MUSIC APP TEST</h1>
        <p>If you can see this, React is working!</p>
        <p>Current time: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
}

export default TestSimple;
