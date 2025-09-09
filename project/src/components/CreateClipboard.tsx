import React, { useState } from 'react';
import { Plus, Lock, Flame, Clock, Copy, Check } from 'lucide-react';

interface CreateClipboardProps {
  onClipboardCreated: (code: string, hasPassword: boolean, expiresAt: Date | null, burnAfterReading: boolean) => void;
}

export default function CreateClipboard({ onClipboardCreated }: CreateClipboardProps) {
  const [content, setContent] = useState('');
  const [password, setPassword] = useState('');
  const [expiryOption, setExpiryOption] = useState('never');
  const [burnAfterReading, setBurnAfterReading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [createdCode, setCreatedCode] = useState<string | null>(null);

  const expiryOptions = [
    { value: 'never', label: 'Never', minutes: 0 },
    { value: '10min', label: '10 minutes', minutes: 10 },
    { value: '1hour', label: '1 hour', minutes: 60 },
    { value: '1day', label: '1 day', minutes: 1440 }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsLoading(true);
    
    try {
      const expiryMinutes = expiryOptions.find(opt => opt.value === expiryOption)?.minutes || 0;
      
      const response = await fetch('http://localhost:3001/api/clipboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: content.trim(),
          password: password || undefined,
          expiryMinutes: expiryMinutes || undefined,
          burnAfterReading
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create clipboard');
      }

      const data = await response.json();
      setCreatedCode(data.code);
      onClipboardCreated(data.code, data.hasPassword, data.expiresAt, data.burnAfterReading);
      
      // Reset form
      setContent('');
      setPassword('');
      setExpiryOption('never');
      setBurnAfterReading(false);
    } catch (error) {
      console.error('Error creating clipboard:', error);
      alert('Failed to create clipboard. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyCode = async () => {
    if (createdCode) {
      await navigator.clipboard.writeText(createdCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (createdCode) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Clipboard Created!</h2>
            <p className="text-gray-600 mb-6">Your clipboard has been created. Share this code to give others access:</p>
            
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center gap-4">
                <span className="text-3xl font-mono font-bold text-blue-600 tracking-wider">{createdCode}</span>
                <button
                  onClick={copyCode}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <button
              onClick={() => setCreatedCode(null)}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium"
            >
              Create Another Clipboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Plus className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Create Clipboard</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your text, code, or any content here..."
              className="w-full h-40 px-4 py-3 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                Password (Optional)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave empty for no password"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-2" />
                Expiry
              </label>
              <select
                value={expiryOption}
                onChange={(e) => setExpiryOption(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                {expiryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="burnAfterReading"
              checked={burnAfterReading}
              onChange={(e) => setBurnAfterReading(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="burnAfterReading" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              Burn after reading (delete after first view)
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading || !content.trim()}
            className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
          >
            {isLoading ? 'Creating...' : 'Create Clipboard'}
          </button>
        </form>
      </div>
    </div>
  );
}