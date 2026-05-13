const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'database.json');

// Initialize database structure
const db = {
  users: [],
  orders: [],
  bookingInfo: [],
  changeRequests: [],
  activityLogs: [],
  counters: {
    userId: 1,
    orderId: 1,
    bookingInfoId: 1,
    changeRequestId: 1,
    activityLogId: 1
  }
};

// Create demo users
const hashedPassword = bcrypt.hashSync('123456', 10);

db.users = [
  {
    id: 1,
    username: 'admin',
    password: hashedPassword,
    name: '系统管理员',
    role: 'admin',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    username: 'sales1',
    password: hashedPassword,
    name: '张销售',
    role: 'sales',
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    username: 'sales2',
    password: hashedPassword,
    name: '李销售',
    role: 'sales',
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    username: 'ops1',
    password: hashedPassword,
    name: '王运营',
    role: 'operations',
    created_at: new Date().toISOString()
  },
  {
    id: 5,
    username: 'supplier1',
    password: hashedPassword,
    name: '赵供应商',
    role: 'supplier',
    created_at: new Date().toISOString()
  }
];

db.counters.userId = 6;

// Write to file
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

console.log('✅ Database initialized successfully!');
console.log('\nDemo accounts:');
console.log('管理员账号: admin / 123456');
console.log('销售账号: sales1 / 123456');
console.log('销售账号: sales2 / 123456');
console.log('运营账号: ops1 / 123456');
console.log('供应商账号: supplier1 / 123456');
console.log('\nDatabase file created at:', dbPath);
