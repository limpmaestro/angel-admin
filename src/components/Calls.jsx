import React, { useState } from 'react';
import { Play, Pause, Download, Search, PhoneOff, Phone, Calendar, Clock, AlertCircle, CheckCircle, Clock3, MoreVertical, Filter } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { sv } from 'date-fns/locale';

// Utökad mockdata med realistiska scenarier för Lina
const allCalls = [
  { 
    id: 1, 
    phone: "070-123 45 67", 
    customer: "Anders Persson", 
    type: "VVS", 
    issue: "Vattenläcka i köket", 
    duration: "5:23", 
    date: "2024-03-08", 
    time: "14:32", 
    status: "Bokad", 
    urgent: true, 
    recording: true,
    address: "Storgatan 12, 123 45 Stockholm",
    notes: "Akut läcka under diskbänken. Kunden har stängt av huvudkranen."
  },
  { 
    id: 2, 
    phone: "073-987 65 43", 
    customer: "Lisa Berg", 
    type: "EL", 
    issue: "Säkringen går hela tiden", 
    duration: "3:45", 
    date: "2024-03-08", 
    time: "14:15", 
    status: "Klar", 
    urgent: false, 
    recording: true,
    address: "Kungsgatan 45, 123 45 Stockholm",
    notes: "Återkommande problem med säkring i köket. Bokad tekniker imorgon."
  },
  { 
    id: 3, 
    phone: "076-555 12 34", 
    customer: "Karl Nilsson", 
    type: "BYGG", 
    issue: "Fuktskada i källare", 
    duration: "8:12", 
    date: "2024-03-08", 
    time: "13:48", 
    status: "Bokad", 
    urgent: true, 
    recording: true,
    address: "Drottninggatan 8, 123 45 Stockholm",
    notes: "Upptäckt mögel efter vattenskada. Kräver omedelbar inspektion."
  },
  { 
    id: 4, 
    phone: "070-111 22 33", 
    customer: "Sofia Eriksson", 
    type: "SNICKERI", 
    issue: "Dörr måste justeras", 
    duration: "2:15", 
    date: "2024-03-08", 
    time: "13:20", 
    status: "Väntar", 
    urgent: false, 
    recording: true,
    address: "Sveavägen 22, 123 45 Stockholm",
    notes: "Inåtgående dörr skaver i golvet. Ej akut, bokas inom veckan."
  },
  { 
    id: 5, 
    phone: "072-444 55 66", 
    customer: "Johan Lindqvist", 
    type: "VVS", 
    issue: "Varmvatten fungerar inte", 
    duration: "4:50", 
    date: "2024-03-08", 
    time: "12:55", 
    status: "Bokad", 
    urgent: false, 
    recording: true,
    address: "Hornsgatan 15, 123 45 Stockholm",
    notes: "Inget varmvatten i hela huset. Troligen värmepumpsfel."
  },
];

// Hjälpfunktion för status-färger
const getStatusStyle = (status) => {
  switch (status) {
    case 'Bokad': return { bg: '#dcfce7', color: '#166534', icon: CheckCircle };
    case 'Klar': return { bg: '#dbeafe', color: '#1e40af', icon: CheckCircle };
    case 'Väntar': return { bg: '#fef3c7', color: '#92400e', icon: Clock3 };
    default: return { bg: '#f3f4f6', color: '#374151', icon: Clock3 };
  }
};

// Hjälpfunktion för trade-färger
const getTradeColor = (type) => {
  const colors = {
    'VVS': '#0ea5e9',
    'EL': '#f59e0b',
    'BYGG': '#10b981',
    'SNICKERI': '#8b5cf6'
  };
  return colors[type] || '#6b7280';
};

function AudioPlayer({ duration, callId }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Simulerad progress för demo
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            clearInterval(interval);
            return 0;
          }
          return prev + 1;
        });
      }, 100);
    }
  };

  return (
    <div className="audio-player">
      <button 
        className={`play-button ${isPlaying ? 'playing' : ''}`} 
        onClick={togglePlay}
      >
        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
      </button>
      
      <div className="waveform-container">
        <div className="waveform">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="waveform-bar" 
              style={{ 
                height: `${Math.random() * 20 + 5}px`,
                opacity: i < (progress / 5) ? 1 : 0.3
              }}
            />
          ))}
        </div>
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>
      
      <span className="duration">{duration}</span>
      
      <button className="download-btn">
        <Download size={16} />
      </button>
    </div>
  );
}

function CallCard({ call }) {
  const [expanded, setExpanded] = useState(false);
  const statusStyle = getStatusStyle(call.status);
  const StatusIcon = statusStyle.icon;
  const tradeColor = getTradeColor(call.type);

  return (
    <div className={`call-card ${call.urgent ? 'urgent' : ''} ${expanded ? 'expanded' : ''}`}>
      <div className="call-card-main" onClick={() => setExpanded(!expanded)}>
        <div className="call-header">
          <div className="call-meta">
            <span className="call-time">{call.time}</span>
            <span className="call-date">{format(parseISO(call.date), 'd MMM', { locale: sv })}</span>
          </div>
          
          <div className="badges">
            {call.urgent && (
              <span className="badge urgent-badge">
                <AlertCircle size={14} />
                Akut
              </span>
            )}
            <span className="badge trade-badge" style={{ backgroundColor: `${tradeColor}20`, color: tradeColor }}>
              {call.type}
            </span>
            <span className="badge status-badge" style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}>
              <StatusIcon size={14} />
              {call.status}
            </span>
          </div>
        </div>

        <div className="call-content">
          <div className="customer-info">
            <h3>{call.customer}</h3>
            <div className="phone-number">
              <Phone size={14} />
              {call.phone}
            </div>
          </div>
          
          <div className="issue-preview">
            <p>{call.issue}</p>
            <div className="duration-pill">
              <Clock size={14} />
              {call.duration}
            </div>
          </div>
        </div>

        {call.recording && (
          <div className="recording-section" onClick={(e) => e.stopPropagation()}>
            <AudioPlayer duration={call.duration} callId={call.id} />
          </div>
        )}
      </div>

      {expanded && (
        <div className="call-details">
          <div className="detail-row">
            <span className="detail-label">Adress:</span>
            <span className="detail-value">{call.address}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Anteckningar:</span>
            <span className="detail-value">{call.notes}</span>
          </div>
          <div className="detail-actions">
            <button className="action-btn secondary">Visa fullständig logg</button>
            <button className="action-btn primary">Hantera ärende</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Calls() {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' eller 'compact'

  const filteredCalls = allCalls.filter(call => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'urgent' && call.urgent) ||
                         call.type.toLowerCase() === filter;
    const matchesSearch = call.phone.includes(searchTerm) || 
                         call.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         call.issue.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: allCalls.length,
    urgent: allCalls.filter(c => c.urgent).length,
    today: allCalls.filter(c => c.date === '2024-03-08').length
  };

  return (
    <div className="calls-page">
      <style>{`
        .calls-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background-color: #f8fafc;
          min-height: 100vh;
        }

        .page-header {
          margin-bottom: 32px;
        }

        .page-header h1 {
          font-size: 28px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 8px 0;
        }

        .page-header p {
          color: #64748b;
          margin: 0;
          font-size: 16px;
        }

        .stats-bar {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f1f5f9;
          color: #64748b;
        }

        .stat-icon.urgent {
          background: #fef2f2;
          color: #dc2626;
        }

        .stat-content h4 {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
          color: #0f172a;
        }

        .stat-content p {
          margin: 4px 0 0 0;
          color: #64748b;
          font-size: 14px;
        }

        .controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
          background: white;
          padding: 16px;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .filters {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .filter-button {
          padding: 8px 16px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: #64748b;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .filter-button:hover {
          border-color: #cbd5e1;
          background: #f8fafc;
        }

        .filter-button.active {
          background: #0f172a;
          color: white;
          border-color: #0f172a;
        }

        .search-box {
          position: relative;
          flex: 1;
          min-width: 250px;
          max-width: 400px;
        }

        .search-box input {
          width: 100%;
          padding: 10px 16px 10px 40px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          transition: all 0.2s;
        }

        .search-box input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .calls-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .call-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          overflow: hidden;
          transition: all 0.2s;
          border: 2px solid transparent;
        }

        .call-card:hover {
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          transform: translateY(-1px);
        }

        .call-card.urgent {
          border-color: #fecaca;
          background: linear-gradient(to right, #fff, #fef2f2);
        }

        .call-card.expanded {
          box-shadow: 0 10px 15px rgba(0,0,0,0.1);
        }

        .call-card-main {
          padding: 20px;
          cursor: pointer;
        }

        .call-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .call-meta {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .call-time {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
        }

        .call-date {
          font-size: 14px;
          color: #64748b;
        }

        .badges {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .badge {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .urgent-badge {
          background: #fecaca;
          color: #dc2626;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        .call-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 16px;
        }

        @media (max-width: 640px) {
          .call-content {
            grid-template-columns: 1fr;
          }
        }

        .customer-info h3 {
          margin: 0 0 8px 0;
          font-size: 18px;
          color: #0f172a;
        }

        .phone-number {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #64748b;
          font-size: 14px;
        }

        .issue-preview {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
        }

        .issue-preview p {
          margin: 0;
          color: #334155;
          font-size: 15px;
          line-height: 1.5;
        }

        .duration-pill {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          background: #f1f5f9;
          border-radius: 20px;
          font-size: 13px;
          color: #64748b;
          white-space: nowrap;
        }

        .recording-section {
          padding-top: 16px;
          border-top: 1px solid #e2e8f0;
        }

        .audio-player {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #f8fafc;
          padding: 12px;
          border-radius: 8px;
        }

        .play-button {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: none;
          background: #0f172a;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .play-button:hover {
          transform: scale(1.05);
          background: #1e293b;
        }

        .play-button.playing {
          background: #dc2626;
        }

        .waveform-container {
          flex: 1;
          height: 40px;
          position: relative;
          display: flex;
          align-items: center;
        }

        .waveform {
          display: flex;
          align-items: center;
          gap: 3px;
          width: 100%;
          height: 100%;
        }

        .waveform-bar {
          flex: 1;
          background: #cbd5e1;
          border-radius: 2px;
          transition: all 0.3s;
        }

        .progress-bar {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: rgba(59, 130, 246, 0.1);
          pointer-events: none;
          transition: width 0.1s linear;
        }

        .duration {
          font-size: 13px;
          color: #64748b;
          font-weight: 500;
          min-width: 45px;
          text-align: center;
        }

        .download-btn {
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 8px;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .download-btn:hover {
          background: #e2e8f0;
          color: #0f172a;
        }

        .call-details {
          padding: 0 20px 20px 20px;
          border-top: 1px solid #e2e8f0;
          background: #f8fafc;
          animation: slideDown 0.2s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .detail-row {
          display: flex;
          padding: 12px 0;
          border-bottom: 1px solid #e2e8f0;
        }

        .detail-row:last-of-type {
          border-bottom: none;
        }

        .detail-label {
          width: 120px;
          color: #64748b;
          font-size: 14px;
          font-weight: 500;
        }

        .detail-value {
          flex: 1;
          color: #0f172a;
          font-size: 14px;
          line-height: 1.5;
        }

        .detail-actions {
          display: flex;
          gap: 12px;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #e2e8f0;
        }

        .action-btn {
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .action-btn.primary {
          background: #0f172a;
          color: white;
        }

        .action-btn.primary:hover {
          background: #1e293b;
        }

        .action-btn.secondary {
          background: white;
          color: #0f172a;
          border: 1px solid #e2e8f0;
        }

        .action-btn.secondary:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #64748b;
        }

        .empty-state svg {
          margin-bottom: 16px;
          opacity: 0.5;
        }
      `}</style>

      <div className="page-header">
        <h1>Samtalslogg</h1>
        <p>Alla samtal hanterade av Lina, din AI-receptionist</p>
      </div>

      <div className="stats-bar">
        <div className="stat-card">
          <div className="stat-icon">
            <Phone size={24} />
          </div>
          <div className="stat-content">
            <h4>{stats.total}</h4>
            <p>Totalt idag</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon urgent">
            <AlertCircle size={24} />
          </div>
          <div className="stat-content">
            <h4>{stats.urgent}</h4>
            <p>Akuta ärenden</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <h4>24m</h4>
            <p>Total tid</p>
          </div>
        </div>
      </div>

      <div className="controls">
        <div className="filters">
          <button 
            className={`filter-button ${filter === 'all' ? 'active' : ''}`} 
            onClick={() => setFilter('all')}
          >
            Alla
          </button>
          <button 
            className={`filter-button ${filter === 'urgent' ? 'active' : ''}`} 
            onClick={() => setFilter('urgent')}
          >
            <AlertCircle size={14} />
            Akuta
          </button>
          <button 
            className={`filter-button ${filter === 'vvs' ? 'active' : ''}`} 
            onClick={() => setFilter('vvs')}
          >
            VVS
          </button>
          <button 
            className={`filter-button ${filter === 'el' ? 'active' : ''}`} 
            onClick={() => setFilter('el')}
          >
            EL
          </button>
          <button 
            className={`filter-button ${filter === 'bygg' ? 'active' : ''}`} 
            onClick={() => setFilter('bygg')}
          >
            BYGG
          </button>
          <button 
            className={`filter-button ${filter === 'snickeri' ? 'active' : ''}`} 
            onClick={() => setFilter('snickeri')}
          >
            SNICKERI
          </button>
        </div>

        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Sök telefon, namn eller ärende..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="calls-list">
        {filteredCalls.length === 0 ? (
          <div className="empty-state">
            <PhoneOff size={48} />
            <h3>Inga samtal hittades</h3>
            <p>Prova att ändra dina filter eller sökterm</p>
          </div>
        ) : (
          filteredCalls.map(call => (
            <CallCard key={call.id} call={call} />
          ))
        )}
      </div>
    </div>
  );
}

export default Calls;