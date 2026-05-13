import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

interface UserData {
  id: number;
  username: string;
  name: string;
  role: string;
  created_at: string;
}

const AdminUsers: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    role: 'sales'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      alert('获取用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.password || !formData.name) {
      alert('请填写所有必填字段');
      return;
    }

    try {
      await api.post('/admin/users', formData);
      alert('用户创建成功');
      setShowCreateForm(false);
      setFormData({ username: '', password: '', name: '', role: 'sales' });
      fetchUsers();
    } catch (error: any) {
      alert(error.response?.data?.error || '创建用户失败');
    }
  };

  const handleDeleteUser = async (userId: number, username: string) => {
    if (!window.confirm(`确定要删除用户 ${username} 吗？`)) {
      return;
    }

    try {
      await api.delete(`/admin/users/${userId}`);
      alert('用户删除成功');
      fetchUsers();
    } catch (error: any) {
      alert(error.response?.data?.error || '删除用户失败');
    }
  };

  const getRoleName = (role: string) => {
    const roleMap: { [key: string]: string } = {
      admin: '管理员',
      sales: '销售',
      operations: '运营',
      supplier: '供应商'
    };
    return roleMap[role] || role;
  };

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <div className="admin-users">
      <div className="page-header">
        <h1>用户管理</h1>
        <button className="btn-primary" onClick={() => setShowCreateForm(true)}>
          创建新用户
        </button>
      </div>

      {showCreateForm && (
        <div className="modal-overlay" onClick={() => setShowCreateForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>创建新用户</h2>
            <form onSubmit={handleCreateUser}>
              <div className="form-group">
                <label>用户名 *</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>密码 *</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>姓名 *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>角色 *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="sales">销售</option>
                  <option value="operations">运营</option>
                  <option value="supplier">供应商</option>
                  <option value="admin">管理员</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowCreateForm(false)}>
                  取消
                </button>
                <button type="submit" className="btn-primary">
                  创建
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>用户名</th>
              <th>姓名</th>
              <th>角色</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td>{u.name}</td>
                <td>
                  <span className={`role-badge role-${u.role}`}>
                    {getRoleName(u.role)}
                  </span>
                </td>
                <td>{new Date(u.created_at).toLocaleString('zh-CN')}</td>
                <td>
                  {u.id !== user?.id && (
                    <button
                      className="btn-danger-small"
                      onClick={() => handleDeleteUser(u.id, u.username)}
                    >
                      删除
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
