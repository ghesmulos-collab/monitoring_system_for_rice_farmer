"use client"; // Required for useState and useRouter

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // SUCCESS: Save the ID that the Dashboard useEffect is looking for
        localStorage.setItem('farmerId', data.user.id); 
        router.push('/dashboard');
      } else {
        alert(data.error || 'Invalid credentials');
      }
    } catch (err) {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E6F4EA] p-4 font-sans">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        
        <header className="text-center mb-8">
          <h1 className="text-[#0D6D32] text-2xl font-bold leading-tight">
            Monitoring System for Rice Farmers
          </h1>
          <p className="text-gray-500 text-sm mt-2">Please login to continue</p>
        </header>

        <form className="space-y-6" onSubmit={handleLogin}>
          {/* Username Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-4 py-2 bg-[#F1F3F4] text-black placeholder-gray-400 border-none rounded-md focus:ring-2 focus:ring-[#0D6D32] outline-none"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 bg-[#F1F3F4] text-black placeholder-gray-400 border-none rounded-md focus:ring-2 focus:ring-[#0D6D32] outline-none"
            />
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#008136] hover:bg-[#006b2d] text-white font-semibold py-2 rounded-md transition-colors disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
            
            <button
              type="button"
              onClick={() => router.push('/register')}
              className="w-full bg-[#008136] hover:bg-[#006b2d] text-white font-semibold py-2 rounded-md transition-colors"
            >
              Register Farmer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}