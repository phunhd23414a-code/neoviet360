const http = require('http');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbXFraDFleTAwMDAwd2d6b3FrcXdtaHRyIiwiZW1haWwiOiJkZW1vQG5lb3ZpZXQzNjAuY29tIiwiaWF0IjoxNzgxODQ2OTIzLCJleHAiOjE3ODI0NTE3MjN9.XdZZDfxZVq-3uKRWEuALJ9dpzSKJ97b65Q9_1Orn7i8';

const req = http.request({
  hostname: 'localhost',
  port: 3001,
  path: '/api/accounts',
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
}, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', body);
  });
});

req.end();