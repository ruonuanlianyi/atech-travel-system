export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: '待审核',
    approved: '已审核',
    rejected: '已拒绝',
    booked: '已订票',
    completed: '已完成',
    cancelled: '已取消',
  };
  return statusMap[status] || status;
};

export const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    pending: '#f59e0b',
    approved: '#0ea5e9',
    rejected: '#ef4444',
    booked: '#10b981',
    completed: '#64748b',
    cancelled: '#64748b',
  };
  return colorMap[status] || '#64748b';
};

export const getTravelTypeText = (type: string): string => {
  return type === 'flight' ? '飞机' : '火车';
};

export const getChangeRequestTypeText = (type: string): string => {
  const typeMap: Record<string, string> = {
    refund: '退票',
    change: '改签',
    cancel: '取消',
  };
  return typeMap[type] || type;
};

export const getRoleText = (role: string): string => {
  const roleMap: Record<string, string> = {
    sales: '销售',
    operations: '运营支持',
    supplier: '第三方供应商',
  };
  return roleMap[role] || role;
};
