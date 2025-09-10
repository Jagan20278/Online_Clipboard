import React, { useState } from 'react';
import { Search, Lock, Copy, Check, Flame, Clock, Calendar } from 'lucide-react';

interface RetrieveClipboardProps {
  initialCode?: string;
}

interface ClipboardData {
  content: string;
  burned: boolean;
  expiresAt: Date | null;
  createdAt: Date;
}

export default function RetrieveClipboard({ initialCode = '' }: RetrieveClipboardProps) {
    const apiUrl = import.meta.env.VITE_API_URL;
  const [code, setCode] = useState(initialCode);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [clipboardData, setClipboardData] = useState<ClipboardData | null>(null);
  const [error, setError] = useState('');
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [clipboardInfo, setClipboardInfo] = useState<any>(null);

  // 🔹 Fetch clipboard metadata before retrieving content
  const fetchClipboardInfo = async (clipboardCode: string) => {
    try {
    

const response = await fetch(`${apiUrl}/api/clipboard/${clipboardCode}/info`);

      if (response.ok) {
        const info = await response.json();
        setClipboardInfo(info);
        setRequiresPassword(info.hasPassword);
      }
    } catch (error) {
      console.error('Error fetching clipboard info:', error);
    }
  };

  // 🔹 Code input change
  const handleCodeChange = (value: string) => {
    const formatted = value.toUpperCase();
    setCode(formatted);
    setError('');
    setClipboardData(null);
    setRequiresPassword(false);
    setClipboardInfo(null);

    if (formatted.length === 6) {
      fetchClipboardInfo(formatted);
    }
  };

  // 🔹 Submit request to retrieve clipboard
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setIsLoading(true);
    setError('');

    try {
     const response = await fetch(`${apiUrl}/api/clipboard/${code.trim()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password || undefined }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          setRequiresPassword(true);
          setError(errorData.error);
        } else {
          throw new Error(errorData.error || 'Failed to retrieve clipboard');
        }
        return;
      }

      const data = await response.json();
      setClipboardData(data);
      setPassword('');
      setRequiresPassword(false);
    } catch (error: any) {
      setError(error.message || 'Failed to retrieve clipboard');
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Copy to clipboard
  const copyContent = async () => {
    if (clipboardData) {
      await navigator.clipboard.writeText(clipboardData.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 🔹 Format dates
  const formatDate = (date: string | Date) => new Date(date).toLocaleString();

  const formatExpiry = (expiresAt: string | null) => {
    if (!expiresAt) return null;
    const expiry = new Date(expiresAt);
    const now = new Date();
    const diff = expiry.getTime() - now.getTime();

    if (diff <= 0) return 'Expired';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return hours > 0 ? `Expires in ${hours}h ${minutes}m` : `Expires in ${minutes}m`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <Search className="w-5 h-5 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Retrieve Clipboard</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Code Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Clipboard Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              placeholder="Enter 6-character code"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 font-mono text-lg tracking-wider text-center uppercase"
              maxLength={6}
              required
            />
          </div>

          {/* Info Section */}
          {clipboardInfo && (
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                Created: {formatDate(clipboardInfo.createdAt)}
              </div>
              {clipboardInfo.expiresAt && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  {formatExpiry(clipboardInfo.expiresAt)}
                </div>
              )}
              {clipboardInfo.burnAfterReading && (
                <div className="flex items-center gap-2 text-sm text-orange-600">
                  <Flame className="w-4 h-4" />
                  Burns after reading
                </div>
              )}
              {clipboardInfo.hasPassword && (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Lock className="w-4 h-4" />
                  Password protected
                </div>
              )}
            </div>
          )}

          {/* Password Input */}
          {requiresPassword && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4 inline mr-2" /> Password Required
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !code.trim() || code.length !== 6}
            className="w-full py-3 px-6 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
          >
            {isLoading ? 'Retrieving...' : 'Retrieve Clipboard'}
          </button>
        </form>

        {/* Retrieved Content */}
        {clipboardData && (
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Content</h3>
              <button
                onClick={copyContent}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono overflow-x-auto">
                {clipboardData.content}
              </pre>
            </div>

            <div className="text-sm text-gray-500 space-y-1">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Created: {formatDate(clipboardData.createdAt)}
              </div>
              {clipboardData.burned && (
                <div className="flex items-center gap-2 text-orange-600">
                  <Flame className="w-4 h-4" /> This clipboard has been burned and deleted
                </div>
              )}
              {clipboardData.expiresAt && !clipboardData.burned && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {formatExpiry(clipboardData.expiresAt)}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
