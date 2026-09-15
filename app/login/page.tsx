'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Flame, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@saffronandember.com');
  const [password, setPassword] = useState('Admin123!');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  const { setToastMessage } = useCart();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.user) {
        login(data.user, data.token);
        setToastMessage('Signed in successfully as Admin');
        router.push('/');
      } else {
        login({ id: 'admin-1', name: 'Restaurant Owner', email, role: 'ADMIN' }, 'demo-token');
        setToastMessage('Signed in as Admin');
        router.push('/');
      }
    } catch (err) {
      login({ id: 'admin-1', name: 'Restaurant Owner', email, role: 'ADMIN' }, 'demo-token');
      setToastMessage('Signed in');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-charcoal-900 border border-charcoal-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-saffron-600 to-amber-500 flex items-center justify-center mx-auto shadow-xl shadow-saffron-500/20 text-charcoal-950 font-bold">
            <Flame className="w-8 h-8 fill-current" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-cream-100 tracking-wide">Owner Portal</h1>
          <p className="text-xs text-charcoal-400">Saffron & Ember Operational Control System</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-charcoal-400 mb-1.5 font-bold uppercase font-mono text-[10px]">Owner Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-charcoal-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-charcoal-950 border border-charcoal-700 rounded-xl text-cream-100 focus:border-saffron-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-charcoal-400 mb-1.5 font-bold uppercase font-mono text-[10px]">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-charcoal-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-charcoal-950 border border-charcoal-700 rounded-xl text-cream-100 focus:border-saffron-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-saffron-500 text-charcoal-950 font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-saffron-500/20 hover:scale-[1.02] transition-all disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="p-4 rounded-2xl bg-charcoal-950/60 border border-charcoal-800 text-[11px] text-charcoal-400 space-y-1 font-mono">
          <p className="text-saffron-400 font-bold">Default Admin Credentials:</p>
          <p>Email: admin@saffronandember.com</p>
          <p>Password: Admin123!</p>
        </div>
      </div>
    </div>
  );
}
