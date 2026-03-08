import React, { useState } from 'react';
import { Calendar, Clock, User, Phone, MapPin, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const mockBookings = [
  { id: 1, customer: "Anders Persson", phone: "070-123 45 67", type: "VVS", issue: "Vattenläcka", date: "2024-03-09", time: "09:00", address: "Storgatan 12", status: "Bekräftad", urgent: true },
  { id: 2, customer: "Lisa Berg", phone: "073-987 65 43", type: "EL", issue: "Säkringsbyte", date: "2024-03-09", time: "11:30", address: "Kungsgatan 45", status: "Bekräftad", urgent: false },
  { id: 3, customer: "Karl Nilsson", phone: "076-555 12 34", type: "BYGG", issue: "Fuktskada", date: "2024-03-10", time: "08:00", address: "Drottninggatan 8", status: "Väntar", urgent: true },
  { id: 4, customer: "Sofia Eriksson", phone: "070-111 22 33", type: "SNICKERI", issue: "Dörrjustering", date: "2024-03-10", time: "14:00", address: "Sveavägen 22", status: "Bekräftad", urgent: false },
];

function Bookings() {
  const [filter, setFilter] = useState('all');

  const filteredBookings = mockBookings.filter(booking => {
    if (filter === 'all') return true;
    if (filter === 'urgent') return booking.urgent;
    if (filter === 'today') return booking.date === '2024-03-09';
    return booking.type.toLowerCase() === filter;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'Bekräftad': return { bg: '#dcfce7', color: '#166534' };
      case 'Väntar': return { bg: '#fef3c7', color: '#92400e' };
      case 'Avbokad': return { bg: '#fecaca', color: '#dc2626' };
      default: return { bg: '#f3f4f6', color: '#374151' };
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px', fontFamily: 'system-ui, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 8px 0', color: '#0f172a' }}>Bokningar</h1>
        <p style={{ color: '#64748b', margin: 0 }}>Hantera alla schemalagda jobb</p>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {['all', 'today', 'urgent', 'vvs', 'el', 'bygg', 'snickeri'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '8px 16px',
              border: '1px solid #e2e8f0',
              background: filter === f ? '#0f172a' : 'white',
              color: filter === f ? 'white' : '#64748b',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              textTransform: f === 'all' || f === 'today' || f === 'urgent' ? 'none' : 'uppercase'
            }}
          >
            {f === 'all' ? 'Alla' : f === 'today' ? 'Idag' : f === 'urgent' ? 'Akut' : f}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredBookings.map(booking => {
          const statusStyle = getStatusColor(booking.status);
          
          return (
            <div key={booking.id} style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: booking.urgent ? '2px solid #fecaca' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a' }}>{booking.time}</span>
                    <span style={{ color: '#64748b', fontSize: '14px' }}>{booking.date}</span>
                  </div>
                  <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>{booking.customer}</h3>
                </div>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  {booking.urgent && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', background: '#fecaca', color: '#dc2626', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                      <AlertCircle size={14} /> Akut
                    </span>
                  )}
                  <span style={{ padding: '4px 10px', background: '#f1f5f9', color: '#0f172a', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                    {booking.type}
                  </span>
                  <span style={{ padding: '4px 10px', background: statusStyle.bg, color: statusStyle.color, borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                    {booking.status}
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', color: '#64748b', fontSize: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={16} /> {booking.phone}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={16} /> {booking.address}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertCircle size={16} /> {booking.issue}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <button style={{ padding: '8px 16px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>
                  Bekräfta
                </button>
                <button style={{ padding: '8px 16px', background: 'white', color: '#0f172a', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>
                  Omboka
                </button>
                <button style={{ padding: '8px 16px', background: 'white', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>
                  Avboka
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredBookings.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
          Inga bokningar hittades
        </div>
      )}
    </div>
  );
}

export default Bookings;