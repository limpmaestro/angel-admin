import React, { useState, useEffect } from 'react';
import { Phone, Calendar, TrendingUp, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

const mockStats = {
  totalCalls: 47,
  todayCalls: 8,
  bookings: 12,
  conversionRate: 68,
  avgDuration: "4:32",
  activeNow: 2
};

const recentCalls = [
  { id: 1, phone: "070-123 45 67", type: "VVS", issue: "Vattenläcka i köket", time: "14:32", status: "Bokad", urgent: true },
  { id: 2, phone: "073-987 65 43", type: "EL", issue: "Säkringen går", time: "14:15", status: "Klar", urgent: false },
  { id: 3, phone: "076-555 12 34", type: "BYGG", issue: "Fuktskada i källare", time: "13:48", status: "Bokad", urgent: true },
  { id: 4, phone: "070-111 22 33", type: "SNICKERI", issue: "Dörr måste justeras", time: "13:20", status: "Väntar", urgent: false },
  { id: 5, phone: "072-444 55 66", type: "VVS", issue: "Varmvatten fungerar inte", time: "12:55", status: "Bokad", urgent: false },
];

const upcomingBookings = [
  { id: 1, customer: "Anna Svensson", type: "VVS", date: "2024-03-09", time: "09:00", address: "Storgatan 12" },
  { id: 2, customer: "Erik Johansson", type: "EL", date: "2024-03-09", time: "13:30", address: "Kungsgatan 45" },
  { id: 3, customer: "Maria Lind", type: "BYGG", date: "2024-03-10", time: "10:00", address: "Drottninggatan 8" },
];

function StatCard({ label, value, change, icon: Icon, color }) {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <span className="stat-label">{label}</span>
        <div className={`stat-icon ${color}`}>
          <Icon size={20} />
        </div>
      </div>
      <div className="stat-value">{value}</div>
      {change && (
        <div className={`stat-change ${change.startsWith('+') ? 'positive' : 'negative'}`}>
          {change} från förra veckan
        </div>
      )}
    </div>
  );
}

function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Översikt</h1>
            <p>{format(currentTime, "EEEE d MMMM yyyy", { locale: sv })}</p>
          </div>
          <div className="live-indicator">
            <span className="pulse"></span>
            <span>{mockStats.activeNow} aktiva samtal</span>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard label="Dagens samtal" value={mockStats.todayCalls} change="+23%" icon={Phone} color="blue" />
        <StatCard label="Nya bokningar" value={mockStats.bookings} change="+12%" icon={Calendar} color="green" />
        <StatCard label="Konverteringsgrad" value={`${mockStats.conversionRate}%`} change="+5%" icon={TrendingUp} color="orange" />
        <StatCard label="Snittlängd" value={mockStats.avgDuration} icon={Clock} color="pink" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Senaste samtalen</h3>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tid</th>
                  <th>Ärende</th>
                  <th>Typ</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentCalls.map(call => (
                  <tr key={call.id}>
                    <td>{call.time}</td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{call.issue}</div>
                      <div style={{ fontSize: '12px', color: 'var(--gray-600)' }}>{call.phone}</div>
                    </td>
                    <td>
                      <span className={`badge badge-${call.type.toLowerCase()}`}>
                        {call.type}
                      </span>
                      {call.urgent && <span className="badge badge-urgent" style={{ marginLeft: '4px' }}>AKUT</span>}
                    </td>
                    <td>
                      <span className={`badge badge-${call.status === 'Klar' ? 'completed' : call.status === 'Bokad' ? 'completed' : 'pending'}`}>
                        {call.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Kommande bokningar</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {upcomingBookings.map(booking => (
              <div key={booking.id} style={{ 
                padding: '16px', 
                background: 'var(--gray-100)', 
                borderRadius: 'var(--radius-sm)',
                borderLeft: '4px solid var(--primary)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 600 }}>{booking.customer}</span>
                  <span className={`badge badge-${booking.type.toLowerCase()}`}>{booking.type}</span>
                </div>
                <div style={{ fontSize: '14px', color: 'var(--gray-600)', display: 'flex', gap: '16px' }}>
                  <span>📅 {format(new Date(booking.date), 'd MMM', { locale: sv })}</span>
                  <span>🕐 {booking.time}</span>
                  <span>📍 {booking.address}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;