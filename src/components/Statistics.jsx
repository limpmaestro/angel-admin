import React from 'react';
import { BarChart3, TrendingUp, Users, Phone, Clock, Calendar } from 'lucide-react';

function Statistics() {
  const stats = [
    { label: 'Totalt samtal', value: '156', change: '+12%', icon: Phone, color: '#0ea5e9' },
    { label: 'Bokade jobb', value: '89', change: '+8%', icon: Calendar, color: '#10b981' },
    { label: 'Nya kunder', value: '34', change: '+15%', icon: Users, color: '#f59e0b' },
    { label: 'Genomsnittlig tid', value: '4:32', change: '-5%', icon: Clock, color: '#8b5cf6' },
  ];

  const weeklyData = [
    { day: 'Mån', calls: 12 },
    { day: 'Tis', calls: 19 },
    { day: 'Ons', calls: 15 },
    { day: 'Tor', calls: 22 },
    { day: 'Fre', calls: 28 },
    { day: 'Lör', calls: 8 },
    { day: 'Sön', calls: 5 },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px', fontFamily: 'system-ui, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 8px 0', color: '#0f172a' }}>Statistik</h1>
        <p style={{ color: '#64748b', margin: 0 }}>Översikt över samtal och bokningar</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${stat.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
                  <Icon size={24} />
                </div>
                <span style={{ fontSize: '14px', fontWeight: '600', color: stat.change.startsWith('+') ? '#10b981' : '#dc2626' }}>
                  {stat.change}
                </span>
              </div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '32px', fontWeight: '700', color: '#0f172a' }}>{stat.value}</h3>
              <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', color: '#0f172a' }}>Samtal denna vecka</h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', height: '200px' }}>
          {weeklyData.map((day, index) => (
            <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '100%', background: '#e2e8f0', borderRadius: '4px', height: '100%', position: 'relative' }}>
                <div style={{ position: 'absolute', bottom: 0, width: '100%', background: '#0f172a', borderRadius: '4px', height: `${(day.calls / 30) * 100}%` }} />
              </div>
              <span style={{ fontSize: '12px', color: '#64748b' }}>{day.day}</span>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a' }}>{day.calls}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Statistics;