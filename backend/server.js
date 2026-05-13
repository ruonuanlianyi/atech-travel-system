require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
const dbPath = path.join(__dirname, 'database.json');

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'atech_travel_secret_key';

// Database helper functions
const readDB = () => {
  if (!fs.existsSync(dbPath)) {
    return {
      users: [],
      orders: [],
      bookingInfo: [],
      changeRequests: [],
      activityLogs: [],
      counters: { userId: 1, orderId: 1, bookingInfoId: 1, changeRequestId: 1, activityLogId: 1 }
    };
  }
  return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
};

const writeDB = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// Middleware: Verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Helper: Add activity log
const addActivityLog = (db, orderId, userId, userName, action, details = null) => {
  const log = {
    id: db.counters.activityLogId++,
    order_id: orderId,
    user_id: userId,
    user_name: userName,
    action,
    details,
    created_at: new Date().toISOString()
  };
  db.activityLogs.push(log);
};

// Helper: Generate order number
const generateOrderNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `AT${year}${month}${day}${random}`;
};

// ==================== AUTH ROUTES ====================

// Login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const db = readDB();

  const user = db.users.find(u => u.username === username);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role
    }
  });
});

// Get current user
app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// ==================== ORDER ROUTES ====================

// Create order (Sales only)
app.post('/api/orders', authenticateToken, (req, res) => {
  if (req.user.role !== 'sales') {
    return res.status(403).json({ error: 'Only sales can create orders' });
  }

  const {
    travel_type,
    departure_city,
    arrival_city,
    departure_date,
    return_date,
    passenger_name,
    passenger_phone,
    passenger_id_number,
    notes
  } = req.body;

  const db = readDB();
  const order_number = generateOrderNumber();

  const order = {
    id: db.counters.orderId++,
    order_number,
    sales_id: req.user.id,
    sales_name: req.user.name,
    travel_type,
    departure_city,
    arrival_city,
    departure_date,
    return_date: return_date || null,
    passenger_name,
    passenger_phone,
    passenger_id_number,
    notes: notes || null,
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  db.orders.push(order);
  addActivityLog(db, order.id, req.user.id, req.user.name, '创建订单', `订单号: ${order_number}`);
  writeDB(db);

  res.json({ success: true, order_id: order.id, order_number });
});

// Get orders (filtered by role)
app.get('/api/orders', authenticateToken, (req, res) => {
  const { status } = req.query;
  const db = readDB();

  let orders = db.orders;

  if (req.user.role === 'sales') {
    orders = orders.filter(o => o.sales_id === req.user.id);
  }

  if (status) {
    orders = orders.filter(o => o.status === status);
  }

  orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  res.json(orders);
});

// Get single order
app.get('/api/orders/:id', authenticateToken, (req, res) => {
  const db = readDB();
  const order = db.orders.find(o => o.id === parseInt(req.params.id));

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  // Check permission
  if (req.user.role === 'sales' && order.sales_id !== req.user.id) {
    return res.status(403).json({ error: 'Access denied' });
  }

  // Get booking info if exists
  const bookingInfo = db.bookingInfo.find(b => b.order_id === order.id);

  // Get activity logs
  const logs = db.activityLogs.filter(l => l.order_id === order.id)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // Get change requests
  const changeRequests = db.changeRequests.filter(c => c.order_id === order.id)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  res.json({
    ...order,
    booking_info: bookingInfo || null,
    activity_logs: logs,
    change_requests: changeRequests
  });
});

// Approve/Reject order (Operations only)
app.post('/api/orders/:id/review', authenticateToken, (req, res) => {
  if (req.user.role !== 'operations') {
    return res.status(403).json({ error: 'Only operations can review orders' });
  }

  const { action, notes } = req.body;
  const db = readDB();
  const order = db.orders.find(o => o.id === parseInt(req.params.id));

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  if (order.status !== 'pending') {
    return res.status(400).json({ error: 'Order is not pending review' });
  }

  order.status = action === 'approve' ? 'approved' : 'rejected';
  order.updated_at = new Date().toISOString();

  const actionText = action === 'approve' ? '审核通过' : '审核拒绝';
  addActivityLog(db, order.id, req.user.id, req.user.name, actionText, notes);
  writeDB(db);

  res.json({ success: true });
});

// Add booking info (Supplier only)
app.post('/api/orders/:id/booking', authenticateToken, (req, res) => {
  if (req.user.role !== 'supplier') {
    return res.status(403).json({ error: 'Only suppliers can add booking info' });
  }

  const { ticket_number, departure_time, arrival_time, seat_info, booking_notes } = req.body;
  const db = readDB();
  const order = db.orders.find(o => o.id === parseInt(req.params.id));

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  if (order.status !== 'approved') {
    return res.status(400).json({ error: 'Order must be approved first' });
  }

  const bookingInfo = {
    id: db.counters.bookingInfoId++,
    order_id: order.id,
    ticket_number,
    departure_time,
    arrival_time,
    seat_info: seat_info || null,
    booking_notes: booking_notes || null,
    supplier_id: req.user.id,
    created_at: new Date().toISOString()
  };

  db.bookingInfo.push(bookingInfo);
  order.status = 'booked';
  order.updated_at = new Date().toISOString();

  addActivityLog(db, order.id, req.user.id, req.user.name, '完成订票', `票号: ${ticket_number}`);
  writeDB(db);

  res.json({ success: true });
});

// ==================== CHANGE REQUEST ROUTES ====================

// Create change request (Sales only)
app.post('/api/orders/:id/change-request', authenticateToken, (req, res) => {
  if (req.user.role !== 'sales') {
    return res.status(403).json({ error: 'Only sales can create change requests' });
  }

  const { request_type, reason } = req.body;
  const db = readDB();
  const order = db.orders.find(o => o.id === parseInt(req.params.id));

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  if (order.sales_id !== req.user.id) {
    return res.status(403).json({ error: 'Access denied' });
  }

  const changeRequest = {
    id: db.counters.changeRequestId++,
    order_id: order.id,
    request_type,
    reason,
    requested_by: req.user.id,
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  db.changeRequests.push(changeRequest);

  const typeText = { refund: '退票', change: '改签', cancel: '取消' }[request_type];
  addActivityLog(db, order.id, req.user.id, req.user.name, `申请${typeText}`, reason);
  writeDB(db);

  res.json({ success: true, request_id: changeRequest.id });
});

// Review change request (Operations only)
app.post('/api/change-requests/:id/review', authenticateToken, (req, res) => {
  if (req.user.role !== 'operations') {
    return res.status(403).json({ error: 'Only operations can review change requests' });
  }

  const { action, notes } = req.body;
  const db = readDB();
  const changeRequest = db.changeRequests.find(c => c.id === parseInt(req.params.id));

  if (!changeRequest) {
    return res.status(404).json({ error: 'Change request not found' });
  }

  if (changeRequest.status !== 'pending') {
    return res.status(400).json({ error: 'Change request is not pending' });
  }

  changeRequest.status = action === 'approve' ? 'approved' : 'rejected';
  changeRequest.updated_at = new Date().toISOString();

  const typeText = { refund: '退票', change: '改签', cancel: '取消' }[changeRequest.request_type];
  const actionText = action === 'approve' ? '批准' : '拒绝';
  addActivityLog(db, changeRequest.order_id, req.user.id, req.user.name, `${actionText}${typeText}申请`, notes);
  writeDB(db);

  res.json({ success: true });
});

// Get all change requests (Operations and Supplier)
app.get('/api/change-requests', authenticateToken, (req, res) => {
  if (req.user.role === 'sales') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const db = readDB();
  const requests = db.changeRequests.map(cr => {
    const order = db.orders.find(o => o.id === cr.order_id);
    return {
      ...cr,
      order_number: order ? order.order_number : null,
      sales_name: order ? order.sales_name : null
    };
  }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  res.json(requests);
});

// ==================== STATS ROUTES ====================

app.get('/api/stats', authenticateToken, (req, res) => {
  const db = readDB();
  let stats = {};

  if (req.user.role === 'sales') {
    const userOrders = db.orders.filter(o => o.sales_id === req.user.id);
    stats = {
      pending: userOrders.filter(o => o.status === 'pending').length,
      approved: userOrders.filter(o => o.status === 'approved').length,
      booked: userOrders.filter(o => o.status === 'booked').length,
      total: userOrders.length
    };
  } else if (req.user.role === 'operations') {
    stats = {
      pending: db.orders.filter(o => o.status === 'pending').length,
      approved: db.orders.filter(o => o.status === 'approved').length,
      booked: db.orders.filter(o => o.status === 'booked').length,
      total: db.orders.length,
      pending_changes: db.changeRequests.filter(c => c.status === 'pending').length
    };
  } else if (req.user.role === 'supplier') {
    stats = {
      approved: db.orders.filter(o => o.status === 'approved').length,
      booked: db.orders.filter(o => o.status === 'booked').length,
      total: db.orders.length
    };
  } else if (req.user.role === 'admin') {
    stats = {
      total_users: db.users.length,
      total: db.orders.length,
      pending: db.orders.filter(o => o.status === 'pending').length,
      completed: db.orders.filter(o => o.status === 'completed').length
    };
  }

  res.json(stats);
});

// Admin: Get all users
app.get('/api/admin/users', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const db = readDB();
  const users = db.users.map(u => ({
    id: u.id,
    username: u.username,
    name: u.name,
    role: u.role,
    created_at: u.created_at
  }));

  res.json(users);
});

// Admin: Create new user
app.post('/api/admin/users', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const { username, password, name, role } = req.body;

  if (!username || !password || !name || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!['sales', 'operations', 'supplier', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  const db = readDB();

  // Check if username already exists
  if (db.users.find(u => u.username === username)) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = {
    id: db.counters.userId++,
    username,
    password: hashedPassword,
    name,
    role,
    created_at: new Date().toISOString()
  };

  db.users.push(newUser);
  writeDB(db);

  res.json({
    success: true,
    user: {
      id: newUser.id,
      username: newUser.username,
      name: newUser.name,
      role: newUser.role
    }
  });
});

// Admin: Delete user
app.delete('/api/admin/users/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const userId = parseInt(req.params.id);
  const db = readDB();

  // Prevent deleting yourself
  if (userId === req.user.id) {
    return res.status(400).json({ error: 'Cannot delete your own account' });
  }

  const userIndex = db.users.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  db.users.splice(userIndex, 1);
  writeDB(db);

  res.json({ success: true });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
