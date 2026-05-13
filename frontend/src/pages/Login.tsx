import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import './Login.css';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || '登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="login-bg-gradient"></div>
        <div className="login-bg-pattern"></div>
      </div>

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <div className="login-logo-icon">A</div>
              <div className="login-logo-text">
                <h1>A-tech Travel</h1>
                <p>行程管理系统</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <Input
              label="用户名"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名"
              fullWidth
              required
            />

            <Input
              label="密码"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              fullWidth
              required
            />

            {error && <div className="login-error">{error}</div>}

            <Button type="submit" fullWidth disabled={loading}>
              {loading ? '登录中...' : '登录'}
            </Button>
          </form>

          <div className="login-demo-accounts">
            <div className="demo-title">演示账号</div>
            <div className="demo-accounts-grid">
              <div className="demo-account">
                <div className="demo-role">销售</div>
                <div className="demo-credentials">sales1 / 123456</div>
              </div>
              <div className="demo-account">
                <div className="demo-role">运营</div>
                <div className="demo-credentials">ops1 / 123456</div>
              </div>
              <div className="demo-account">
                <div className="demo-role">供应商</div>
                <div className="demo-credentials">supplier1 / 123456</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
