import React, { useState, useEffect } from 'react';
import { Play, Pause, Download, Search, Phone, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Supabase client
const supabaseUrl = 'https://yiakpslwegyzhcljnavo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpYWtwc2x3ZWd5emhjbGpuYXZvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDk3NzQxMywiZXhwIjoyMDg2NTUzNDEzfQ.fUS9SVmOayg43oAmZaY1HoPWMIoIYXdtHdqqFketz7U';
const supabase = createClient(supabaseUrl, supabaseKey);

function AudioPlayer({ duration }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f8fafc', borderRadius: '8px', marginTop: '12px' }}>
      <button 
        onClick={() => setIsPlaying(!isPlaying)}
        style={{ 
          width: '36px', 
          height: '36px', 
          borderRadius: '50%', 
          border: 'none', 
          background: isPlaying ? '#dc2626' : '#0f172a', 
          color: 'white', 
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
      </button>
      
      <div style={{ flex: 1, height: '4px', background: '#e2e8f0', borderRadius: '2px' }}>
        <div style={{ width: isPlaying ? '60%' : '0%', height: '100%', background: '#0f172a', borderRadius: '2px', transition: 'width 0.3s' }} />
      </div>
      
      <span style={{ fontSize: '13px', color: '#64748b', minWidth: '45px' }}>{duration || '0:00'}</span>
      
      <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
        <Download size={16} />
      </button>
    </div>
  );
}

function Calls() {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCalls();
  }, []);

  async function fetchCalls() {
    setLoading(true);
    const { data, error } = await supabase
      .from('calls')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching calls:', error);
    } else {
      setCalls(data || []);
    }
    setLoading(false);
  }

  const filteredCalls = calls.filter(call => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'urgent' && (call.urgency === 'high' || call.urgency === 'critical')) ||
                         call.intent?.toLowerCase() === filter;
    const matchesSearch = call.customer_phone?.includes(searchTerm) || 
                         call.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         call.issue_summary?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return { bg: '#dcfce7', text: '#166534', icon: CheckCircle, label: 'Klar' };
      case 'needs_followup': return { bg: '#fef3c7', text: '#92400e', icon: Clock, label: 'Väntar' };
      case 'escalated': return { bg: '#fecaca', text: '#dc2626', icon: AlertCircle, label: 'Eskalerad' };
      default: return { bg: '#f3f4f6', text: '#374151', icon: Clock, label: 'Okänd' };
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' });
  };

  if (loading) {
    return <div style={{ padding: '24px', textAlign: 'center' }}>Laddar samtal...</div>;
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px', fontFamily: 'system-ui, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 4px 0', color: '#0f172a' }}>Samtalslogg</h1>
        <p style={{ color: '#64748b', margin: 0 }}>Alla samtal hanterade av Lina</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['all', 'urgent', 'bokning', 'akut', 'offert', 'info'].map((f) => (
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
                textTransform: f === 'all' || f === 'urgent' ? 'none' : 'uppercase'
              }}
            >
              {f === 'all' ? 'Alla' : f === 'urgent' ? 'Akut' : f}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input 
            type="text" 
            placeholder="Sök..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '8px 12px 8px 40px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', width: '200px' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredCalls.map(call => {
          const status = getStatusColor(call.status);
          const StatusIcon = status.icon;
          const isUrgent = call.urgency === 'high' || call.urgency === 'critical';
          
          return (
            <div key={call.id} style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: isUrgent ? '2px solid #fecaca' : 'none' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <span style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>{formatTime(call.created_at)}</span>
                  <span style={{ marginLeft: '12px', color: '#64748b', fontSize: '14px' }}>{formatDate(call.created_at)}</span>
                </div>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  {isUrgent && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', background: '#fecaca', color: '#dc2626', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                      <AlertCircle size={14} /> Akut
                    </span>
                  )}
                  <span style={{ padding: '4px 10px', background: '#f1f5f9', color: '#0f172a', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                    {call.intent?.toUpperCase() || 'OKÄNT'}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', background: status.bg, color: status.text, borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                    <StatusIcon size={14} /> {status.label}
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#0f172a' }}>{call.customer_name || 'Okänd kund'}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '14px' }}>
                    <Phone size={14} /> {call.customer_phone || 'Inget nummer'}
                  </div>
                </div>
                <div>
                  <p style={{ margin: 0, color: '#334155', fontSize: '15px' }}>{call.issue_summary || 'Ingen beskrivning'}</p>
                  <span style={{ color: '#64748b', fontSize: '13px' }}>{formatDuration(call.duration_seconds)}</span>
                </div>
              </div>

              <AudioPlayer duration={formatDuration(call.duration_seconds)} />
            </div>
          );
        })}
      </div>

      {filteredCalls.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
          Inga samtal hittades
        </div>
      )}
    </div>
  );
}

export default Calls;