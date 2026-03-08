import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Phone, MapPin, User, Search } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    setLoading(true);
    
    // Hämta samtal med intent = 'bokning'
    const { data, error } = await supabase
      .from('calls')
      .select('*')
      .eq('intent', 'bokning')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching bookings:', error);
    } else {
      setBookings(data || []);
    }
    
    setLoading(false);
  }

  const filteredBookings = bookings.filter(booking => {
    const searchLower = searchTerm.toLowerCase();
    return (
      booking.customer_name?.toLowerCase().includes(searchLower) ||
      booking.customer_phone?.includes(searchTerm) ||
      booking.issue_summary?.toLowerCase().includes(searchLower) ||
      booking.address?.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Inget datum';
    const date = new Date(timestamp);
    return date.toLocaleDateString('sv-SE', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div style={{ padding: '24px', textAlign: 'center' }}>Laddar bokningar...</div>;
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 4px 0', color: '#0f172a' }}>Bokningar</h1>
        <p style={{ color: '#64748b', margin: 0 }}>Alla bokade jobb från samtal</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input 
            type="text" 
            placeholder="Sök bokningar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%',
              padding: '10px 12px 10px 40px', 
              border: '1px solid #e2e8f0', 
              borderRadius: '8px', 
              fontSize: '14px' 
            }}
          />
        </div>
        
        <div style={{ color: '#64748b', fontSize: '14px' }}>
          {filteredBookings.length} bokningar
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredBookings.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 24px', 
            background: 'white',
            borderRadius: '12px',
            color: '#64748b' 
          }}>
            <Calendar size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
            <h3 style={{ margin: '0 0 8px 0', color: '#0f172a' }}>Inga bokningar ännu</h3>
            <p style={{ margin: 0 }}>När kunder bokar tid via Lina visas de här</p>
          </div>
        ) : (
          filteredBookings.map(booking => (
            <div key={booking.id} style={{ 
              background: 'white', 
              padding: '20px', 
              borderRadius: '12px', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              borderLeft: '4px solid #10b981'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#0f172a' }}>
                    {booking.customer_name || 'Okänd kund'}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '14px' }}>
                    <Phone size={14} /> {booking.customer_phone || 'Inget nummer'}
                  </div>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px',
                  padding: '6px 12px',
                  background: '#dcfce7',
                  color: '#166534',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: '600'
                }}>
                  <Calendar size={14} />
                  {formatDate(booking.preferred_date || booking.created_at)}
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <p style={{ margin: '0 0 8px 0', color: '#334155' }}>{booking.issue_summary || 'Ingen beskrivning'}</p>
                
                {booking.trade_type && (
                  <span style={{ 
                    display: 'inline-block',
                    padding: '4px 10px',
                    background: '#f1f5f9',
                    color: '#0f172a',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase'
                  }}>
                    {booking.trade_type}
                  </span>
                )}
              </div>

              {booking.address && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '14px' }}>
                  <MapPin size={14} /> {booking.address}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Bookings;