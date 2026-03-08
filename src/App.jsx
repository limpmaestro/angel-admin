import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Phone, Calendar, BarChart3, Home } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Calls from './components/Calls';
import Bookings from './components/Bookings';
import Statistics from './components/Statistics';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="sidebar">
          <div className="logo">
            <div className="logo-icon">A</div>
            <span>Angel Admin</span>
          </div>
          
          <div className="nav-links">
            <NavLink to="/" end className={({isActive}) => isActive ? 'active' : ''}>
              <Home size={20} />
              <span>Översikt</span>
            </NavLink>
            <NavLink to="/calls" className={({isActive}) => isActive ? 'active' : ''}>
              <Phone size={20} />
              <span>Samtal</span>
            </NavLink>
            <NavLink to="/bookings" className={({isActive}) => isActive ? 'active' : ''}>
              <Calendar size={20} />
              <span>Bokningar</span>
            </NavLink>
            <NavLink to="/statistics" className={({isActive}) => isActive ? 'active' : ''}>
              <BarChart3 size={20} />
              <span>Statistik</span>
            </NavLink>
          </div>
        </nav>
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/calls" element={<Calls />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/statistics" element={<Statistics />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;