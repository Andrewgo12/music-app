// EMERGENCY TEST COMPONENT - MINIMAL REACT TEST
function EmergencyTest() {
  console.log('🚨 EMERGENCY TEST: Component is rendering');
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#ff0000',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '32px',
      fontWeight: 'bold',
      zIndex: 99999
    }}>
      🚨 EMERGENCY TEST - REACT IS WORKING! 🚨
    </div>
  );
}

export default EmergencyTest;
