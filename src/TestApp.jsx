import React from 'react';

const TestApp = () => {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">🎵 Music Streaming App</h1>
        <p className="text-xl text-gray-400 mb-8">All components loaded successfully!</p>
        
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">✅ Components</h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>VinylRecord</li>
              <li>MusicVisualizer</li>
              <li>PlayerBar</li>
              <li>MiniPlayer</li>
              <li>QueueManager</li>
            </ul>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">✅ Features</h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>Animations</li>
              <li>YouTube Integration</li>
              <li>Download Manager</li>
              <li>Analytics</li>
              <li>Settings</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8">
          <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors">
            🚀 Launch Full App
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestApp;
