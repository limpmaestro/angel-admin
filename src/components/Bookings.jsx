import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Phone, MapPin, User, Search, AlertCircle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('alla');
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
    const matchesFilter = filter === 'alla' || 
                         (filter === 'idag' && isToday(booking.created_at)) ||
                         (filter === 'akut' && (booking.urgency === 'high' || booking.urgency === 'critical')) ||
                         booking.trade_type?.toUpperCase() === filter;
    
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = searchTerm === '' || 
                         booking.customer_name?.toLowerCase().includes(searchLower) ||
                         booking.customer_phone?.includes(searchTerm) ||
                         booking.issue_summary?.toLowerCase().includes(searchLower) ||
                         booking.address?.toLowerCase().includes(searchLower);
    
    return matchesFilter && matchesSearch;
  });

  const isToday = (timestamp) => {
    if (!timestamp) return false;
    const today = new Date().toISOString().split('T')[0];
    return timestamp.startsWith(today);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Inget datum';
    const date = new Date(timestamp);
    return date.toLocaleDateString('sv-SE', { 
      year: 'numeric',
      month: '2-digit', 
      day: '2-digit'
    });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '--:--';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusBadge = (urgency) => {
    if (urgency === 'high' || urgency === 'critical') {
      return (
        <span style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '4px',
          padding: '4px 12px',
          background: '#fecaca',
          color: '#dc2626',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600'
        }}>
          <AlertCircle size={14} /> Akut
        </span>
      );
    }
    return null;
  };

  if (loading) {
    return <div style={{ padding: '24px', textAlign: 'center' }}>Laddar bokningar...</div>;
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 4px 0', color: '#0f172a' }}>Bokningar</h1>
        <p style={{ color: '#64748b', margin: 0 }}>Hantera alla schemalagda jobb</p>
      </div>

      {/* Filterknappar */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {['alla', 'idag', 'akut', 'VVS', 'EL', 'BYGG', 'SNICKERI'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f.toLowerCase())}
            style={{
              padding: '8px 16px',
              border: '1px solid #e2e8f0',
              background: filter === f.toLowerCase() ? '#0f172a' : 'white',
              color: filter === f.toLowerCase() ? 'white' : '#64748b',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              textTransform: f === 'alla' || f === 'idag' || f === 'akut' ? 'none' : 'uppercase'
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Sök */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
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
      </div>

      {/* Bokningslista */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredBookings.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 24px', 
            background: 'white',
            borderRadius: '12px',
            color: '#64748b',
            border: '2px dashed #e2e8f0'
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
              border: (booking.urgency === 'high' || booking.urgency === 'critical') ? '2px solid #fecaca' : '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>
                      {formatTime(booking.created_at)}
                    </div>
                    <div style={{ fontSize: '14px', color: '#64748b' }}>
                      {formatDate(booking.created_at)}
                    </div>
                  </div>
                  
                  <div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#0f172a' }}>
                      {booking.customer_name || 'Okänd kund'}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '14px' }}>
                      <Phone size={14} /> {booking.customer_phone || 'Inget nummer'}
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  {getStatusBadge(booking.urgency)}
                  {booking.trade_type && (
                    <span style={{ 
                      padding: '4px 12px',
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
                  <span style={{ 
                    padding: '4px 12px',
                    background: '#dcfce7',
                    color: '#166534',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    Bekräftad
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                {booking.address && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '14px' }}>
                    <MapPin size={14} /> {booking.address}
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '14px' }}>
                  <AlertCircle size={14} /> {booking.issue_summary || 'Ingen beskrivning'}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{
                  padding: '8px 16px',
                  background: '#0f172a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  Bekräfta
                </button>
                <button style={{
                  padding: '8px 16px',
                  background: 'white',
                  color: '#0f172a',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  Omboka
                </button>
                <button style={{
                  padding: '8px 16px',
                  background: 'white',
                  color: '#dc2626',
                  border: '1px solid #fecaca',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  Avboka
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Bookings;