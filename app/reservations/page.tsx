'use client';

import React, { useState, useEffect } from 'react';
import { Users, RefreshCw } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<any[]>([]);
  const { setToastMessage } = useCart();

  const fetchReservations = () => {
    fetch('/api/reservations')
      .then((res) => res.json())
      .then((data) => {
        if (data.reservations) setReservations(data.reservations);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/reservations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setToastMessage(`Reservation ${status.toLowerCase()}`);
        fetchReservations();
      } else {
        setToastMessage(`Reservation updated`);
        fetchReservations();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Table Reservations Grid</h1>
          <p className="text-xs text-charcoal-400 mt-1">Live table availability (Tables T1–T8) & booking management</p>
        </div>
        <button
          onClick={fetchReservations}
          className="px-4 py-2 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-cream-100 font-bold text-xs flex items-center gap-2 border border-charcoal-700"
        >
          <RefreshCw className="w-4 h-4 text-saffron-400" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8'].map((tableNum) => {
          const booked = reservations.find((r) => r.tableNumber === tableNum && r.status !== 'CANCELLED');
          return (
            <div
              key={tableNum}
              className={`p-6 rounded-3xl border transition-all ${
                booked
                  ? 'bg-saffron-500/10 border-saffron-500 text-cream-100 shadow-xl'
                  : 'bg-charcoal-900 border-charcoal-800 text-charcoal-400'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xl font-bold text-saffron-400">{tableNum}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  booked ? 'bg-saffron-500/20 text-saffron-400' : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {booked ? 'RESERVED' : 'AVAILABLE'}
                </span>
              </div>

              {booked ? (
                <div className="space-y-3 text-xs">
                  <div>
                    <p className="font-bold text-cream-100 text-sm">{booked.name}</p>
                    <p className="text-[11px] text-charcoal-400">{booked.phone || 'No phone provided'}</p>
                  </div>
                  <p className="text-charcoal-300 flex items-center gap-1.5 font-mono">
                    <Users className="w-3.5 h-3.5 text-saffron-400" /> {booked.guests} Guests • {booked.time}
                  </p>
                  {booked.specialRequest && (
                    <p className="text-[10px] text-charcoal-400 italic bg-charcoal-950/60 p-2 rounded-xl">"{booked.specialRequest}"</p>
                  )}
                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => handleUpdateStatus(booked.id, 'COMPLETED')}
                      className="flex-1 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 font-bold text-[10px] transition-colors"
                    >
                      Complete
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(booked.id, 'CANCELLED')}
                      className="flex-1 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 font-bold text-[10px] transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-charcoal-500 py-6 text-center font-mono">Ready for walk-in / booking</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
