import React from 'react';
import { getStatusColor, getStatusText } from '../utils/helpers';
import './StatusBadge.css';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <span
      className="status-badge"
      style={{
        backgroundColor: `${getStatusColor(status)}20`,
        color: getStatusColor(status),
        borderColor: `${getStatusColor(status)}40`,
      }}
    >
      {getStatusText(status)}
    </span>
  );
};

export default StatusBadge;
