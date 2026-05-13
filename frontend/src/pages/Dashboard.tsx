import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import { Order, Stats } from '../types';
import { formatDateTime, getTravelTypeText } from '../utils/helpers';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ordersRes, statsRes] = await Promise.all([
        api.get('/orders'),
        api.get('/stats'),
      ]);
      setOrders(ordersRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatCards = () => {
    if (!stats) return [];

    if (user?.role === 'sales') {
      return [
        { label: '待审核', value: stats.pending || 0, color: '#f59e0b' },
        { label: '已审核', value: stats.approved || 0, color: '#0ea5e9' },
        { label: '已订票', value: stats.booked || 0, color: '#10b981' },
        { label: '总订单', value: stats.total || 0, color: '#64748b' },
      ];
    } else if (user?.role === 'operations') {
      return [
        { label: '待审核', value: stats.pending || 0, color: '#f59e0b' },
        { label: '待处理退改签', value: stats.pending_changes || 0, color: '#ef4444' },
        { label: '已订票', value: stats.booked || 0, color: '#10b981' },
        { label: '总订单', value: stats.total || 0, color: '#64748b' },
      ];
    } else if (user?.role === 'admin') {
      return [
        { label: '总用户', value: stats.total_users || 0, color: '#8b5cf6' },
        { label: '总订单', value: stats.total || 0, color: '#64748b' },
        { label: '待审核', value: stats.pending || 0, color: '#f59e0b' },
        { label: '已完成', value: stats.completed || 0, color: '#10b981' },
      ];
    } else {
      return [
        { label: '待订票', value: stats.approved || 0, color: '#0ea5e9' },
        { label: '已订票', value: stats.booked || 0, color: '#10b981' },
        { label: '总订单', value: stats.total || 0, color: '#64748b' },
      ];
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <Header />
        <div className="dashboard-loading">加载中...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <Header />

      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">工作台</h1>
            <p className="dashboard-subtitle">欢迎回来，{user?.name}</p>
          </div>
          {user?.role === 'sales' && (
            <Button onClick={() => navigate('/orders/new')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              创建订单
            </Button>
          )}
          {user?.role === 'admin' && (
            <Button onClick={() => navigate('/admin/users')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              用户管理
            </Button>
          )}
        </div>

        <div className="stats-grid">
          {getStatCards().map((stat, index) => (
            <Card key={index} className="stat-card">
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value" style={{ color: stat.color }}>
                {stat.value}
              </div>
            </Card>
          ))}
        </div>

        <Card className="orders-section">
          <div className="section-header">
            <h2 className="section-title">最近订单</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/orders')}>
              查看全部
            </Button>
          </div>

          {orders.length === 0 ? (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
              </svg>
              <p>暂无订单</p>
            </div>
          ) : (
            <div className="orders-table">
              <div className="table-header">
                <div className="table-cell">订单号</div>
                <div className="table-cell">销售</div>
                <div className="table-cell">类型</div>
                <div className="table-cell">行程</div>
                <div className="table-cell">乘客</div>
                <div className="table-cell">状态</div>
                <div className="table-cell">创建时间</div>
                <div className="table-cell">操作</div>
              </div>
              {orders.slice(0, 10).map((order) => (
                <div key={order.id} className="table-row" onClick={() => navigate(`/orders/${order.id}`)}>
                  <div className="table-cell">
                    <span className="order-number">{order.order_number}</span>
                  </div>
                  <div className="table-cell">{order.sales_name}</div>
                  <div className="table-cell">{getTravelTypeText(order.travel_type)}</div>
                  <div className="table-cell">
                    <span className="route">{order.departure_city} → {order.arrival_city}</span>
                  </div>
                  <div className="table-cell">{order.passenger_name}</div>
                  <div className="table-cell">
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="table-cell">{formatDateTime(order.created_at)}</div>
                  <div className="table-cell">
                    <Button variant="ghost" size="sm" onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/orders/${order.id}`);
                    }}>
                      查看
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
