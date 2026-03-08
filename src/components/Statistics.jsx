import React, { useState, useEffect } from 'react';
import { Phone, Calendar, Users, Clock } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function Statistics() {
  const [stats, setStats] = useState({
    totalCalls: 0,
    bookings: 0,
    newCustomers: 0,
    avgDuration: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    setLoading(true);
    
    // Hämta alla samtal
    const { data: calls, error } = await supabase
      .from('calls')
      .select('*');
    
    if (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
      return;
    }

    // Beräkna statistik
    const totalCalls = calls?.length || 0;
    const bookings = calls?.filter(c => c.intent === 'bokning').length || 0;
    const newCustomers = calls?.filter(c => c.customer_name && c.customer_name !== 'Okänd kund').length || 0;
    
    // Beräkna genomsnittlig samtalstid
    const totalDuration = calls?.reduce((sum, c) => sum + (c.duration_seconds || 0), 0) || 0;
    const avgDuration = totalCalls > 0 ? Math.round(totalDuration / totalCalls) : 0;
    
    // Formatera till minuter:sekunder
    const avgMinutes = Math.floor(avgDuration / 60);
    const avgSeconds = avgDuration % 60;
    const avgDurationFormatted = `${avgMinutes}:${avgSeconds.toString().padStart(2, '0')}`;

    setStats({
      totalCalls,
      bookings,
      newCustomers,
      avgDuration: avgDurationFormatted
    });
    
    setLoading(false);
  }

  const statCards = [
    {
      icon: Phone,
      label: 'Totalt samtal',
      value: stats.totalCalls,
      change: null, // Tar bort påhittad procent
      color: 'blue'
    },
    {
      icon: Calendar,
      label: 'Bokade jobb',
      value: stats.bookings,
      change: null,
      color: 'green'
    },
    {
      icon: Users,
      label: 'Nya kunder',
      value: stats.newCustomers,
      change: null,
      color: 'orange'
    },
    {
      icon: Clock,
      label: 'Genomsnittlig tid',
      value: stats.avgDuration,
      change: null,
      color: 'purple'
    }
  ];

  if (loading) {
    return <div style={{ padding: '24px' }}>Laddar statistik...</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>Statistik</h1>
      <p style={{ color: '#64748b', marginBottom: '24px' }}>Översikt över samtal och bokningar</p>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '24px' 
      }}>
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} style={{
              background: 'white',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '16px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: card.color === 'blue' ? '#dbeafe' : 
                             card.color === 'green' ? '#dcfce7' : 
                             card.color === 'orange' ? '#ffedd5' : '#f3e8ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={24} style={{
                    color: card.color === 'blue' ? '#2563eb' : 
                           card.color === 'green' ? '#16a34a' : 
                           card.color === 'orange' ? '#ea580c' : '#9333ea'
                  }} />
                </div>
              </div>

              <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '4px' }}>
                {card.value}
              </div>
              <div style={{ color: '#64748b', fontSize: '14px' }}>
                {card.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Statistics;