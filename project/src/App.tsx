import React, { useState } from 'react';
import { Clipboard, Plus, Search } from 'lucide-react';
import CreateClipboard from './components/CreateClipboard';
import RetrieveClipboard from './components/RetrieveClipboard';

type Tab = 'create' | 'retrieve';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('create');

  const handleClipboardCreated = (code: string, hasPassword: boolean, expiresAt: Date | null, burnAfterReading: boolean) => {
    // Could add analytics or other tracking here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-full flex items-center justify-center">
              <Clipboard className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              CloudClip
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Securely share text, code, and content across devices with unique codes, password protection, and auto-expiry options.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20">
            <div className="flex">
              <button
                onClick={() => setActiveTab('create')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 font-medium ${
                  activeTab === 'create'
                    ? 'bg-teal-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <Plus className="w-4 h-4" />
                Create
              </button>
              <button
                onClick={() => setActiveTab('retrieve')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 font-medium ${
                  activeTab === 'retrieve'
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <Search className="w-4 h-4" />
                Retrieve
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex justify-center">
          {activeTab === 'create' ? (
            <CreateClipboard onClipboardCreated={handleClipboardCreated} />
          ) : (
            <RetrieveClipboard />
          )}
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clipboard className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Cross-Device Sync</h3>
            <p className="text-gray-600 text-sm">Paste on mobile, retrieve on desktop. Access your clipboards from anywhere.</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-6 h-6 bg-emerald-600 rounded text-white flex items-center justify-center text-xs font-bold">🔒</div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Secure & Private</h3>
            <p className="text-gray-600 text-sm">Optional password protection and burn-after-reading for sensitive content.</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-6 h-6 bg-teal-600 rounded text-white flex items-center justify-center text-xs font-bold">⚡</div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Auto-Expiry</h3>
            <p className="text-gray-600 text-sm">Set custom expiry times from 10 minutes to never. Your data, your control.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
