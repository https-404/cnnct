import React from 'react';

function App() {


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full">
        <div className="flex items-center space-x-4 mb-4">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="Avatar"
          />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">John Doe</h2>
            <p className="text-sm text-gray-500">Tailwind UI Test</p>
          </div>
        </div>
        <p className="text-gray-700 mb-4">
          If you see this styled card, Tailwind CSS is working!
        </p>
        <button className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Test Button
        </button>
      </div>
    </div>
  )
}

export default App
