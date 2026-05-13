import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getRoleText } from '../utils/helpers';
import './Header.css';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <div className="logo">
            <div className="logo-icon">A</div>
            <div className="logo-text">
              <span className="logo-title">A-tech</span>
              <span className="logo-subtitle">Travel System</span>
            </div>
          </div>
        </div>

        <div className="header-right">
          <div className="user-info">
            <div className="user-avatar">{user?.name.charAt(0)}</div>
            <div className="user-details">
              <div className="user-name">{user?.name}</div>
              <div className="user-role">{user && getRoleText(user.role)}</div>
            </div>
          </div>
          <button className="logout-btn" onClick={logout}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            退出
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
