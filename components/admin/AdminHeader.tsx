'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Plus, RefreshCw } from 'lucide-react';

export default function AdminHeader() {
  const [pendingCount, setPendingCount] = useState(0);

  const checkPendingOrders = () => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        if (data.orders) {
          const pending = data.orders.filter((o: any) => o.status === 'PENDING').length;
          setPendingCount(pending);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    checkPendingOrders();
    const interval = setInterval(checkPendingOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 bg-charcoal-900 border-b border-charcoal-800 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-xs font-mono font-semibold text-charcoal-300">SYSTEM LIVE & CONNECTED TO POSTGRES</span>
      </div>

      <div className="flex items-center gap-4">
        {/* Refresh Button */}
        <button
          onClick={checkPendingOrders}
          className="p-2 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-charcoal-300 hover:text-cream-100 transition-colors"
          title="Refresh Data"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Live Orders Indicator */}
        <Link
          href="/orders"
          className="relative p-2 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-cream-100 transition-colors flex items-center gap-2 text-xs font-bold px-3"
        >
          <ShoppingBag className="w-4 h-4 text-saffron-400" />
          <span>Orders</span>
          {pendingCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white font-mono text-[10px] font-bold animate-bounce">
              {pendingCount}
            </span>
          )}
        </Link>

        {/* Quick Add Dish Button */}
        <Link
          href="/menu"
          className="px-4 py-2 rounded-xl bg-saffron-500 text-charcoal-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-saffron-500/20 hover:scale-105 transition-transform"
        >
          <Plus className="w-4 h-4" />
          <span>Add Dish</span>
        </Link>
      </div>
    </header>
  );
}
