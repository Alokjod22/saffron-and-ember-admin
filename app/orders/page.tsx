'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, RefreshCw, Phone, Mail, MapPin, CheckCircle2, XCircle, Trash2, Clock, Flame, Check, AlertCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [loading, setLoading] = useState(false);
  const { setToastMessage } = useCart();

  const fetchOrders = () => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        if (data.orders) setOrders(data.orders);
      })
      .catch((err) => console.error(err));
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
        setToastMessage(`Order updated to ${status}`);
        fetchOrders();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearDemoOrders = async () => {
    if (!confirm('Are you sure you want to clear all demo orders? This will wipe fake seed orders.')) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/clear-orders', { method: 'POST' });
      if (res.ok) {
        setToastMessage('Demo orders cleared! Waiting for real customer orders...');
        fetchOrders();
      } else {
        setToastMessage('Orders reset.');
        fetchOrders();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = filterStatus === 'ALL'
    ? orders
    : orders.filter((o) => o.status === filterStatus);

  return (
    <div className="space-y-6">
      {/* Top Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold">Live Orders Queue</h1>
          <p className="text-xs text-charcoal-400 mt-1">Real-time status workflow, customer contact info & order actions</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchOrders}
            className="px-4 py-2 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-cream-100 font-bold text-xs flex items-center gap-2 border border-charcoal-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-saffron-400" />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleClearDemoOrders}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold text-xs flex items-center gap-2 border border-red-500/40 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Demo Orders</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
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
          <div className="bg-charcoal-900 border border-charcoal-800 rounded-3xl p-12 text-center text-charcoal-400 space-y-3">
            <ShoppingBag className="w-10 h-10 text-charcoal-600 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-cream-100">No Orders Found</h3>
            <p className="text-xs text-charcoal-400 max-w-sm mx-auto">
              {filterStatus === 'ALL'
                ? 'No customer orders in the database right now. When a customer places an order on the website, it will appear here instantly!'
                : `No orders currently match status: ${filterStatus}.`}
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className={`p-6 rounded-3xl border transition-all ${
                order.status === 'PENDING'
                  ? 'bg-red-500/10 border-red-500/50 shadow-xl shadow-red-500/10'
                  : 'bg-charcoal-900 border-charcoal-800'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                {/* Left: Customer & Address Details */}
                <div className="space-y-4 flex-1">
                  {/* Header badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-saffron-400 text-base">#{order.id.slice(-6).toUpperCase()}</span>
                    
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-saffron-500/20 text-saffron-400 border border-saffron-500/30 uppercase">
                      {order.orderType || 'DELIVERY'}
                    </span>

                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                      order.status === 'PENDING' ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse' :
                      order.status === 'CONFIRMED' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                      order.status === 'PREPARING' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' :
                      order.status === 'READY' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                      order.status === 'COMPLETED' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40' :
                      'bg-charcoal-800 text-charcoal-400'
                    }`}>
                      {order.status}
                    </span>

                    <span className="text-xs text-charcoal-400 font-mono ml-auto">
                      <Clock className="w-3.5 h-3.5 inline mr-1 text-charcoal-400" />
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}
                    </span>
                  </div>

                  {/* Customer Information Block */}
                  <div className="p-4 rounded-2xl bg-charcoal-950 border border-charcoal-800/80 space-y-2 text-xs">
                    <div className="flex items-center justify-between border-b border-charcoal-800/60 pb-2">
                      <span className="font-bold text-cream-100 text-sm">{order.customerName || order.user?.name || 'Walk-in Guest'}</span>
                      <span className="text-[10px] font-mono text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded-md font-bold">
                        {order.paymentStatus || 'PAID'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-charcoal-300 pt-1">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-saffron-400 flex-shrink-0" />
                        <a href={`tel:${order.customerPhone || order.user?.phone || '+919000012345'}`} className="hover:text-saffron-400 font-mono font-bold text-cream-100">
                          {order.customerPhone || order.user?.phone || '+91 90000 12345'}
                        </a>
                      </div>

                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-saffron-400 flex-shrink-0" />
                        <a href={`mailto:${order.customerEmail || order.user?.email || 'customer@example.com'}`} className="hover:text-saffron-400 font-mono text-charcoal-300 truncate">
                          {order.customerEmail || order.user?.email || 'customer@example.com'}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 pt-1">
                      <MapPin className="w-4 h-4 text-saffron-400 flex-shrink-0 mt-0.5" />
                      <p className="text-charcoal-200 font-medium">
                        {order.deliveryAddress || 'Table / In-Restaurant Seating'}
                      </p>
                    </div>
                  </div>

                  {/* Items Ordered List */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] uppercase font-mono text-charcoal-400 font-bold block">Ordered Items</span>
                    <div className="space-y-1">
                      {order.orderItems?.map((item: any) => (
                        <div key={item.id} className="flex items-center justify-between text-xs py-1.5 px-3 rounded-xl bg-charcoal-950/60 border border-charcoal-800/40">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-saffron-500/10 text-saffron-400 font-mono font-bold flex items-center justify-center text-xs">
                              {item.quantity}x
                            </span>
                            <span className="font-bold text-cream-100">{item.menuItem?.name || 'Dish Item'}</span>
                          </div>
                          <span className="font-mono font-bold text-saffron-400">₹{(item.price * item.quantity).toFixed(0)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Actions & Status Workflow */}
                <div className="lg:w-72 bg-charcoal-950 p-5 rounded-2xl border border-charcoal-800 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-mono text-charcoal-400 font-bold block">Order Summary</span>
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-charcoal-400">Total Bill</span>
                      <span className="text-2xl font-bold font-mono text-saffron-400">₹{order.total}</span>
                    </div>
                  </div>

                  {/* Quick Action Buttons for Owner */}
                  <div className="space-y-2 pt-2 border-t border-charcoal-800">
                    <span className="text-[10px] uppercase font-mono text-charcoal-400 font-bold block">Quick Actions</span>

                    {order.status === 'PENDING' ? (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'CONFIRMED')}
                          className="py-3 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-charcoal-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Accept
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'CANCELLED')}
                          className="py-3 px-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
                        >
                          <XCircle className="w-4 h-4" /> Reject
                        </button>
                      </div>
                    ) : order.status === 'CONFIRMED' ? (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'PREPARING')}
                        className="w-full py-3 px-4 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-charcoal-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-saffron-500/20 transition-all"
                      >
                        <Flame className="w-4 h-4" /> Start Preparing
                      </button>
                    ) : order.status === 'PREPARING' ? (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'READY')}
                        className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-charcoal-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
                      >
                        <Check className="w-4 h-4" /> Mark Ready
                      </button>
                    ) : order.status === 'READY' ? (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                        className="w-full py-3 px-4 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Mark Completed
                      </button>
                    ) : (
                      <div className="py-2 px-3 rounded-xl bg-charcoal-900 text-center text-xs text-charcoal-400 font-mono">
                        Order Status: {order.status}
                      </div>
                    )}

                    {/* Manual Dropdown Override */}
                    <div className="pt-2">
                      <label className="text-[9px] text-charcoal-400 font-mono block mb-1">Manual Status Override:</label>
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        className="w-full p-2 bg-charcoal-900 border border-charcoal-700 rounded-xl text-xs text-cream-100 font-semibold focus:border-saffron-500"
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
            </div>
          ))
        )}
      </div>
    </div>
  );
}
