import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import StatusBadge from '../components/StatusBadge';
import { OrderDetail } from '../types';
import { formatDateTime, getTravelTypeText, getChangeRequestTypeText } from '../utils/helpers';
import './OrderDetail.css';

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showChangeRequestModal, setShowChangeRequestModal] = useState(false);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject'>('approve');
  const [reviewNotes, setReviewNotes] = useState('');
  const [changeRequestType, setChangeRequestType] = useState<'refund' | 'change' | 'cancel'>('refund');
  const [changeRequestReason, setChangeRequestReason] = useState('');
  const [bookingData, setBookingData] = useState({
    ticket_number: '',
    departure_time: '',
    arrival_time: '',
    seat_info: '',
    booking_notes: '',
  });

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/orders/${id}`);
      setOrder(response.data);
    } catch (error) {
      console.error('Failed to fetch order:', error);
      alert('获取订单详情失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleReview = async () => {
    try {
      await api.post(`/orders/${id}/review`, {
        action: reviewAction,
        notes: reviewNotes,
      });
      alert('审核成功');
      setShowReviewModal(false);
      fetchOrder();
    } catch (error: any) {
      alert(error.response?.data?.error || '审核失败');
    }
  };

  const handleBooking = async () => {
    try {
      await api.post(`/orders/${id}/booking`, bookingData);
      alert('订票信息提交成功');
      setShowBookingModal(false);
      fetchOrder();
    } catch (error: any) {
      alert(error.response?.data?.error || '提交失败');
    }
  };

  const handleChangeRequest = async () => {
    try {
      await api.post(`/orders/${id}/change-request`, {
        request_type: changeRequestType,
        reason: changeRequestReason,
      });
      alert('退改签申请提交成功');
      setShowChangeRequestModal(false);
      fetchOrder();
    } catch (error: any) {
      alert(error.response?.data?.error || '提交失败');
    }
  };

  if (loading) {
    return (
      <div className="order-detail-page">
        <Header />
        <div className="loading">加载中...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-detail-page">
        <Header />
        <div className="loading">订单不存在</div>
      </div>
    );
  }

  return (
    <div className="order-detail-page">
      <Header />

      <div className="order-detail-container">
        <div className="page-header">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            返回
          </Button>
          <div className="header-info">
            <h1 className="page-title">订单详情</h1>
            <StatusBadge status={order.status} />
          </div>
        </div>

        <div className="detail-grid">
          <Card className="detail-section">
            <h3 className="section-title">基本信息</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">订单号</span>
                <span className="info-value order-number">{order.order_number}</span>
              </div>
              <div className="info-item">
                <span className="info-label">销售</span>
                <span className="info-value">{order.sales_name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">出行方式</span>
                <span className="info-value">{getTravelTypeText(order.travel_type)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">创建时间</span>
                <span className="info-value">{formatDateTime(order.created_at)}</span>
              </div>
            </div>
          </Card>

          <Card className="detail-section">
            <h3 className="section-title">行程信息</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">出发城市</span>
                <span className="info-value">{order.departure_city}</span>
              </div>
              <div className="info-item">
                <span className="info-label">到达城市</span>
                <span className="info-value">{order.arrival_city}</span>
              </div>
              <div className="info-item">
                <span className="info-label">出发日期</span>
                <span className="info-value">{order.departure_date}</span>
              </div>
              {order.return_date && (
                <div className="info-item">
                  <span className="info-label">返程日期</span>
                  <span className="info-value">{order.return_date}</span>
                </div>
              )}
            </div>
          </Card>

          <Card className="detail-section">
            <h3 className="section-title">乘客信息</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">姓名</span>
                <span className="info-value">{order.passenger_name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">电话</span>
                <span className="info-value">{order.passenger_phone}</span>
              </div>
              <div className="info-item">
                <span className="info-label">身份证号</span>
                <span className="info-value">{order.passenger_id_number}</span>
              </div>
            </div>
            {order.notes && (
              <div className="info-item full-width">
                <span className="info-label">备注</span>
                <span className="info-value">{order.notes}</span>
              </div>
            )}
          </Card>

          {order.booking_info && (
            <Card className="detail-section booking-info">
              <h3 className="section-title">订票信息</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">票号</span>
                  <span className="info-value ticket-number">{order.booking_info.ticket_number}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">出发时间</span>
                  <span className="info-value">{order.booking_info.departure_time}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">到达时间</span>
                  <span className="info-value">{order.booking_info.arrival_time}</span>
                </div>
                {order.booking_info.seat_info && (
                  <div className="info-item">
                    <span className="info-label">座位信息</span>
                    <span className="info-value">{order.booking_info.seat_info}</span>
                  </div>
                )}
                {order.booking_info.booking_notes && (
                  <div className="info-item full-width">
                    <span className="info-label">订票备注</span>
                    <span className="info-value">{order.booking_info.booking_notes}</span>
                  </div>
                )}
              </div>
            </Card>
          )}

          {order.change_requests.length > 0 && (
            <Card className="detail-section">
              <h3 className="section-title">退改签记录</h3>
              <div className="change-requests">
                {order.change_requests.map((req) => (
                  <div key={req.id} className="change-request-item">
                    <div className="change-request-header">
                      <span className="change-type">{getChangeRequestTypeText(req.request_type)}</span>
                      <StatusBadge status={req.status} />
                    </div>
                    <div className="change-request-body">
                      <p className="change-reason">{req.reason}</p>
                      <span className="change-time">{formatDateTime(req.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card className="detail-section activity-section">
            <h3 className="section-title">操作日志</h3>
            <div className="activity-timeline">
              {order.activity_logs.map((log) => (
                <div key={log.id} className="activity-item">
                  <div className="activity-dot"></div>
                  <div className="activity-content">
                    <div className="activity-header">
                      <span className="activity-user">{log.user_name}</span>
                      <span className="activity-action">{log.action}</span>
                    </div>
                    {log.details && <p className="activity-details">{log.details}</p>}
                    <span className="activity-time">{formatDateTime(log.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="actions-card">
          <div className="actions-grid">
            {user?.role === 'operations' && order.status === 'pending' && (
              <>
                <Button onClick={() => { setReviewAction('approve'); setShowReviewModal(true); }}>
                  审核通过
                </Button>
                <Button variant="danger" onClick={() => { setReviewAction('reject'); setShowReviewModal(true); }}>
                  审核拒绝
                </Button>
              </>
            )}

            {user?.role === 'supplier' && order.status === 'approved' && (
              <Button onClick={() => setShowBookingModal(true)}>
                填写订票信息
              </Button>
            )}

            {user?.role === 'sales' && order.sales_id === user.id && order.status === 'booked' && (
              <Button variant="secondary" onClick={() => setShowChangeRequestModal(true)}>
                申请退改签
              </Button>
            )}
          </div>
        </Card>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">
              {reviewAction === 'approve' ? '审核通过' : '审核拒绝'}
            </h3>
            <div className="modal-body">
              <div className="textarea-wrapper">
                <label className="textarea-label">备注（可选）</label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="请输入备注信息"
                  className="textarea"
                  rows={4}
                />
              </div>
            </div>
            <div className="modal-actions">
              <Button variant="ghost" onClick={() => setShowReviewModal(false)}>取消</Button>
              <Button onClick={handleReview}>确认</Button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
          <div className="modal large" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">填写订票信息</h3>
            <div className="modal-body">
              <div className="form-grid">
                <Input
                  label="票号"
                  value={bookingData.ticket_number}
                  onChange={(e) => setBookingData({ ...bookingData, ticket_number: e.target.value })}
                  placeholder="请输入票号"
                  fullWidth
                  required
                />
                <Input
                  label="出发时间"
                  type="datetime-local"
                  value={bookingData.departure_time}
                  onChange={(e) => setBookingData({ ...bookingData, departure_time: e.target.value })}
                  fullWidth
                  required
                />
                <Input
                  label="到达时间"
                  type="datetime-local"
                  value={bookingData.arrival_time}
                  onChange={(e) => setBookingData({ ...bookingData, arrival_time: e.target.value })}
                  fullWidth
                  required
                />
                <Input
                  label="座位信息"
                  value={bookingData.seat_info}
                  onChange={(e) => setBookingData({ ...bookingData, seat_info: e.target.value })}
                  placeholder="例如：A12"
                  fullWidth
                />
              </div>
              <div className="textarea-wrapper">
                <label className="textarea-label">订票备注（可选）</label>
                <textarea
                  value={bookingData.booking_notes}
                  onChange={(e) => setBookingData({ ...bookingData, booking_notes: e.target.value })}
                  placeholder="请输入备注信息"
                  className="textarea"
                  rows={3}
                />
              </div>
            </div>
            <div className="modal-actions">
              <Button variant="ghost" onClick={() => setShowBookingModal(false)}>取消</Button>
              <Button onClick={handleBooking}>提交</Button>
            </div>
          </div>
        </div>
      )}

      {/* Change Request Modal */}
      {showChangeRequestModal && (
        <div className="modal-overlay" onClick={() => setShowChangeRequestModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">申请退改签</h3>
            <div className="modal-body">
              <div className="select-wrapper" style={{ marginBottom: '20px' }}>
                <label className="select-label">类型</label>
                <select
                  value={changeRequestType}
                  onChange={(e) => setChangeRequestType(e.target.value as any)}
                  className="select"
                >
                  <option value="refund">退票</option>
                  <option value="change">改签</option>
                  <option value="cancel">取消</option>
                </select>
              </div>
              <div className="textarea-wrapper">
                <label className="textarea-label">原因</label>
                <textarea
                  value={changeRequestReason}
                  onChange={(e) => setChangeRequestReason(e.target.value)}
                  placeholder="请输入申请原因"
                  className="textarea"
                  rows={4}
                  required
                />
              </div>
            </div>
            <div className="modal-actions">
              <Button variant="ghost" onClick={() => setShowChangeRequestModal(false)}>取消</Button>
              <Button onClick={handleChangeRequest}>提交</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailPage;
