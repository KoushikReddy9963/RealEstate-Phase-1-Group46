// import { sum } from '../sum.js';

// test('adds 1 + 2 to equal 3', () => {
//   expect(sum(1, 2)).toBe(3);
// });

import request from 'supertest';
import app from '../index.js'; 

describe('Auth Routes', () => {
  test('POST /api/users/login - should log in a user', async () => {
    let testEmail = 'seller@gmail.com';
    let testPassword = 'seller';
    const res = await request(app).post('/api/users/login').send({
      email: testEmail,
      password: testPassword,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
},15000);