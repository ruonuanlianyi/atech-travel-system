import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import './CreateOrder.css';

const CreateOrder: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    travel_type: 'flight',
    departure_city: '',
    arrival_city: '',
    departure_date: '',
    return_date: '',
    passenger_name: '',
    passenger_phone: '',
    passenger_id_number: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/orders', formData);
      alert('订单创建成功！');
      navigate(`/orders/${response.data.order_id}`);
    } catch (error: any) {
      alert(error.response?.data?.error || '创建订单失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-order-page">
      <Header />

      <div className="create-order-container">
        <div className="page-header">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            返回
          </Button>
          <h1 className="page-title">创建订单</h1>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="order-form">
            <div className="form-section">
              <h3 className="form-section-title">行程信息</h3>
              <div className="form-grid">
                <Select
                  label="出行方式"
                  name="travel_type"
                  value={formData.travel_type}
                  onChange={handleChange}
                  options={[
                    { value: 'flight', label: '飞机' },
                    { value: 'train', label: '火车' },
                  ]}
                  fullWidth
                  required
                />

                <Input
                  label="出发城市"
                  name="departure_city"
                  value={formData.departure_city}
                  onChange={handleChange}
                  placeholder="例如：北京"
                  fullWidth
                  required
                />

                <Input
                  label="到达城市"
                  name="arrival_city"
                  value={formData.arrival_city}
                  onChange={handleChange}
                  placeholder="例如：上海"
                  fullWidth
                  required
                />

                <Input
                  label="出发日期"
                  name="departure_date"
                  type="date"
                  value={formData.departure_date}
                  onChange={handleChange}
                  fullWidth
                  required
                />

                <Input
                  label="返程日期（可选）"
                  name="return_date"
                  type="date"
                  value={formData.return_date}
                  onChange={handleChange}
                  fullWidth
                />
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">乘客信息</h3>
              <div className="form-grid">
                <Input
                  label="乘客姓名"
                  name="passenger_name"
                  value={formData.passenger_name}
                  onChange={handleChange}
                  placeholder="请输入乘客姓名"
                  fullWidth
                  required
                />

                <Input
                  label="联系电话"
                  name="passenger_phone"
                  value={formData.passenger_phone}
                  onChange={handleChange}
                  placeholder="请输入联系电话"
                  fullWidth
                  required
                />

                <Input
                  label="身份证号"
                  name="passenger_id_number"
                  value={formData.passenger_id_number}
                  onChange={handleChange}
                  placeholder="请输入身份证号"
                  fullWidth
                  required
                />
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">备注信息</h3>
              <div className="textarea-wrapper">
                <label className="textarea-label">备注（可选）</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="请输入备注信息"
                  className="textarea"
                  rows={4}
                />
              </div>
            </div>

            <div className="form-actions">
              <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
                取消
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? '提交中...' : '提交订单'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateOrder;
