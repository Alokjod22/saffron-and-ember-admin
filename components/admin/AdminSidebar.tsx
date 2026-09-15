'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, UtensilsCrossed, ShoppingBag, Calendar, LogOut, Flame } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Menu Items', href: '/menu', icon: UtensilsCrossed },
    { name: 'Live Orders', href: '/orders', icon: ShoppingBag },
    { name: 'Reservations', href: '/reservations', icon: Calendar },
  ];

  return (
    <aside className="w-64 bg-charcoal-900 border-r border-charcoal-800 flex flex-col justify-between p-4 min-h-screen text-xs">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-3 py-2 border-b border-charcoal-800 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-saffron-600 to-amber-500 flex items-center justify-center shadow-lg shadow-saffron-500/20 text-charcoal-950 font-bold">
            <Flame className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-sm text-cream-100 tracking-wide">SAFFRON & EMBER</h1>
            <span className="inline-block px-2 py-0.5 rounded-full bg-saffron-500/20 text-saffron-400 font-mono text-[9px] font-bold uppercase">
              Owner Portal
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${
                  isActive
                    ? 'bg-saffron-500 text-charcoal-950 shadow-md shadow-saffron-500/20'
                    : 'text-charcoal-300 hover:bg-charcoal-800 hover:text-cream-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Logout */}
      <div className="pt-4 border-t border-charcoal-800 space-y-3">
        <div className="px-3 py-2 rounded-2xl bg-charcoal-950/60 border border-charcoal-800/60">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-saffron-500/20 text-saffron-400 flex items-center justify-center font-mono font-bold text-[10px]">
              AD
            </div>
            <div className="overflow-hidden text-left">
              <p className="font-bold text-cream-100 truncate text-[11px]">{user?.name || 'Restaurant Owner'}</p>
              <p className="text-[10px] text-charcoal-400 truncate">{user?.email || 'admin@saffronandember.com'}</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-charcoal-800 hover:bg-red-500/20 hover:text-red-400 text-charcoal-300 font-bold transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
