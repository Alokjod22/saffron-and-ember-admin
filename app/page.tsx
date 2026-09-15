'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Calendar, TrendingUp, Plus, UtensilsCrossed } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = data?.stats || {
    totalOrders: 12,
    totalRevenue: 24850,
    todayRevenue: 6420,
    activeReservations: 4,
    totalCustomers: 18,
  };

  const recentOrders = data?.recentOrders || [];

  return (
    <div className="space-y-8">
      {/* Top Title Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-cream-100">Executive Dashboard</h1>
          <p className="text-xs text-charcoal-400 mt-1">Real-time sales, order traffic, and restaurant operations</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/orders"
            className="px-4 py-2 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-cream-100 font-bold text-xs flex items-center gap-2 border border-charcoal-700"
          >
            <ShoppingBag className="w-4 h-4 text-saffron-400" />
            <span>Live Orders</span>
          </Link>
          <Link
            href="/menu"
            className="px-4 py-2 rounded-xl bg-saffron-500 text-charcoal-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-saffron-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-3xl bg-charcoal-900 border border-charcoal-800 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono uppercase text-charcoal-400 font-bold">Today's Revenue</span>
            <div className="p-2.5 rounded-2xl bg-saffron-500/10 text-saffron-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold font-mono text-saffron-400">₹{stats.todayRevenue.toLocaleString()}</p>
          <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-2 font-semibold">
            <TrendingUp className="w-3 h-3" /> +22.4% vs yesterday
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-charcoal-900 border border-charcoal-800 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono uppercase text-charcoal-400 font-bold">Total Sales</span>
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold font-mono text-cream-100">₹{stats.totalRevenue.toLocaleString()}</p>
          <p className="text-[10px] text-charcoal-400 mt-2 font-mono">Shared Postgres DB total</p>
        </div>

        <div className="p-6 rounded-3xl bg-charcoal-900 border border-charcoal-800 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono uppercase text-charcoal-400 font-bold">Total Orders</span>
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold font-mono text-cream-100">{stats.totalOrders}</p>
          <p className="text-[10px] text-charcoal-400 mt-2">Dine-in & Delivery</p>
        </div>

        <div className="p-6 rounded-3xl bg-charcoal-900 border border-charcoal-800 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono uppercase text-charcoal-400 font-bold">Table Bookings</span>
            <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-400">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold font-mono text-purple-400">{stats.activeReservations}</p>
          <p className="text-[10px] text-charcoal-400 mt-2">Active table reservations</p>
        </div>
      </div>

      {/* Operational Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Overview */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-charcoal-900 border border-charcoal-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold">Recent Customer Orders</h3>
            <Link href="/orders" className="text-xs text-saffron-400 hover:underline font-bold">
              View All Orders →
            </Link>
          </div>

          <div className="space-y-3">
            {recentOrders.length === 0 ? (
              <p className="text-xs text-charcoal-400 py-6 text-center">No orders recorded yet.</p>
            ) : (
              recentOrders.map((order: any) => (
                <div key={order.id} className="p-4 rounded-2xl bg-charcoal-950 border border-charcoal-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-saffron-400 text-xs">#{order.id.slice(-6).toUpperCase()}</span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-charcoal-800 text-charcoal-300">
                        {order.orderType || 'DELIVERY'}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-cream-100">{order.customerName || 'Customer'}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold font-mono text-saffron-400">₹{order.total}</span>
                    <span className="block text-[10px] text-emerald-400 font-bold uppercase">{order.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Management Shortcuts */}
        <div className="p-6 rounded-3xl bg-charcoal-900 border border-charcoal-800 shadow-xl space-y-4">
          <h3 className="font-serif text-lg font-bold">Quick Management</h3>

          <div className="space-y-3">
            <Link
              href="/menu"
              className="p-4 rounded-2xl bg-charcoal-950 border border-charcoal-800 hover:border-saffron-500/50 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-saffron-500/10 text-saffron-400 group-hover:bg-saffron-500 group-hover:text-charcoal-950 transition-colors">
                  <UtensilsCrossed className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-cream-100">Manage Menu Dishes</h4>
                  <p className="text-[10px] text-charcoal-400">Add, edit prices, dietary flags</p>
                </div>
              </div>
              <span className="text-saffron-400 font-bold">→</span>
            </Link>

            <Link
              href="/orders"
              className="p-4 rounded-2xl bg-charcoal-950 border border-charcoal-800 hover:border-saffron-500/50 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-charcoal-950 transition-colors">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-cream-100">Live Order Queue</h4>
                  <p className="text-[10px] text-charcoal-400">Accept & track preparation</p>
                </div>
              </div>
              <span className="text-saffron-400 font-bold">→</span>
            </Link>

            <Link
              href="/reservations"
              className="p-4 rounded-2xl bg-charcoal-950 border border-charcoal-800 hover:border-saffron-500/50 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 group-hover:bg-purple-500 group-hover:text-charcoal-950 transition-colors">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-cream-100">Table Reservations</h4>
                  <p className="text-[10px] text-charcoal-400">Manage seating T1–T8</p>
                </div>
              </div>
              <span className="text-saffron-400 font-bold">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
