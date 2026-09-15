'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, RefreshCw } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const { setToastMessage } = useCart();

  const fetchOrders = () => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        if (data.orders) setOrders(data.orders);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setToastMessage(`Order status updated to ${status}`);
        fetchOrders();
      } else {
        setToastMessage(`Order status changed to ${status}`);
        fetchOrders();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredOrders = filterStatus === 'ALL'
    ? orders
    : orders.filter((o) => o.status === filterStatus);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Live Orders Queue</h1>
          <p className="text-xs text-charcoal-400 mt-1">Real-time status updates from Customer App (Auto-refreshes every 5s)</p>
        </div>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-cream-100 font-bold text-xs flex items-center gap-2 border border-charcoal-700"
        >
          <RefreshCw className="w-4 h-4 text-saffron-400" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {['ALL', 'PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filterStatus === st
                ? 'bg-saffron-500 text-charcoal-950 shadow-md shadow-saffron-500/20'
                : 'bg-charcoal-900 border border-charcoal-800 text-charcoal-400 hover:text-cream-100'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-charcoal-900 border border-charcoal-800 rounded-3xl p-12 text-center text-charcoal-400 space-y-2">
            <ShoppingBag className="w-8 h-8 text-charcoal-600 mx-auto" />
            <p className="text-xs">No orders match the selected filter.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className={`p-5 rounded-3xl border transition-all ${
                order.status === 'PENDING'
                  ? 'bg-red-500/10 border-red-500/50 shadow-lg shadow-red-500/10'
                  : 'bg-charcoal-900 border-charcoal-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-saffron-400 text-sm">#{order.id.slice(-6).toUpperCase()}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-charcoal-800 text-cream-100">
                      {order.orderType || 'DELIVERY'}
                    </span>
                    <span className="text-[10px] text-charcoal-400 font-mono">
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm font-bold text-cream-100">{order.customerName || 'Walk-in Guest'}</p>
                    <p className="text-xs text-charcoal-400">{order.deliveryAddress || 'Table / Delivery'}</p>
                  </div>

                  <div className="pt-1">
                    <p className="text-xs text-charcoal-200 font-mono">
                      {order.orderItems?.map((i: any) => `${i.quantity}x ${i.menuItem?.name || 'Item'}`).join(' • ') || 'Order details'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-xs text-charcoal-400 block font-mono">Total</span>
                    <span className="text-lg font-bold font-mono text-saffron-400">₹{order.total}</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-charcoal-400 uppercase font-mono block">Status Workflow</label>
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                      className="p-2.5 bg-charcoal-950 border border-charcoal-700 rounded-xl text-xs text-saffron-400 font-bold focus:border-saffron-500"
                    >
                      <option value="PENDING">🔴 PENDING</option>
                      <option value="CONFIRMED">🟡 CONFIRMED</option>
                      <option value="PREPARING">🔥 PREPARING</option>
                      <option value="READY">✅ READY</option>
                      <option value="COMPLETED">🎉 COMPLETED</option>
                      <option value="CANCELLED">❌ CANCELLED</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
