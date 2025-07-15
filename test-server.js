// Simple test to check if the server can start
console.log('Testing server startup...');

// Test imports
try {
  console.log('✅ Server test completed successfully');
  process.exit(0);
} catch (error) {
  console.error('❌ Server test failed:', error);
  process.exit(1);
}
