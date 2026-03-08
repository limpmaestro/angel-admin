import React, { useState, useEffect } from 'react';
import { Phone, Calendar, TrendingUp, Clock } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function Dashboard() {
  const [stats, setStats] = useState({
    todayCalls: 0,
    newBookings: 0,
    conversionRate: 0,
    avgDuration: '0:00'
  });
  const [recentCalls, setRecentCalls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    setLoading(true);
    
    // Hämta alla samtal
    const { data: calls, error } = await supabase
      .from('calls')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
      return;
    }

    const callsList = calls || [];
    
    // Dagens datum (svensk tid)
    const today = new Date().toISOString().split('T')[0];
    
    // Filtrera dagens samtal
    const todayCalls = callsList.filter(c => c.created_at?.startsWith(today)).length;
    
    // Nya bokningar (totalt, inte bara idag)
    const newBookings = callsList.filter(c => c.intent === 'bokning').length;
    
    // Konverteringsgrad (bokningar / totalt samtal)
    const conversionRate = callsList.length > 0 
      ? Math.round((newBookings / callsList.length) * 100) 
      : 0;
    
    // Snittlängd
    const totalDuration = callsList.reduce((sum, c) => sum + (c.duration_seconds || 0), 0);
    const avgSeconds = callsList.length > 0 ? Math.round(totalDuration / callsList.length) : 0;
    const avgMinutes = Math.floor(avgSeconds / 60);
    const avgSecs = avgSeconds % 60;
    const avgDuration = `${avgMinutes}:${avgSecs.toString().padStart(2, '0')}`;

    setStats({
      todayCalls,
      newBookings,
      conversionRate,
      avgDuration
    });

    // Senaste 5 samtalen
    setRecentCalls(callsList.slice(0, 5));
    setLoading(false);
  }

  const statCards = [
    { icon: Phone, label: 'Dagens samtal', value: stats.todayCalls, change: null },
    { icon: Calendar, label: 'Nya bokningar', value: stats.newBookings, change: null },
    { icon: TrendingUp, label: 'Konverteringsgrad', value: `${stats.conversionRate}%`, change: null },
    { icon: Clock, label: 'Snittlängd', value: stats.avgDuration, change: null }
  ];

  if (loading) {
    return <div style={{ padding: '24px' }}>Laddar...</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>Översikt</h1>
          <p style={{ color: '#64748b' }}>{new Date().toLocaleDateString('sv-SE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981' }}>
          <span style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></span>
          <span>0 aktiva samtal</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ color: '#64748b' }}>{card.label}</span>
                <Icon size={20} style={{ color: '#6366f1' }} />
              </div>
              <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '4px' }}>{card.value}</div>
              {card.change && <div style={{ color: '#10b981', fontSize: '14px' }}>{card.change}</div>}
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginBottom: '16px' }}>Senaste samtalen</h3>
          {recentCalls.length === 0 ? (
            <p style={{ color: '#64748b' }}>Inga samtal ännu</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentCalls.map(call => (
                <div key={call.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                  <div>
                    <div style={{ fontWeight: '600' }}>{call.customer_name || 'Okänd'}</div>
                    <div style={{ fontSize: '14px', color: '#64748b' }}>{call.intent || 'Okänt'}</div>
                  </div>
                  <div style={{ fontSize: '14px', color: '#64748b' }}>
                    {new Date(call.created_at).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginBottom: '16px' }}>Kommande bokningar</h3>
          <p style={{ color: '#64748b' }}>Inga bokningar ännu</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;