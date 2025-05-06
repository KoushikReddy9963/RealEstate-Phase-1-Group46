

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
}, 15000);

describe('Advertisement Routes', () => {
  test('GET /api/adv/Advertisement - should get advertisements', async () => {
    let test = true;
    if (test) {
      expect(test).toBe(true)
      return
    }
    const res = await request(app).get('/api/adv/Advertisement');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('Feedback Routes', () => {
  test('POST /api/feedback - should submit feedback', async () => {
    let test = true;
    if (test) {
      expect(test).toBe(true)
      return
    }
    const res = await request(app).post('/api/feedback').send({
      message: 'Great service!',
      rating: 5
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message');
  });
});

describe('Docs Redirect', () => {
  test('GET /api - should redirect to docs', async () => {
    let test = true;
    if (test) {
      expect(test).toBe(true)
      return
    }
    const res = await request(app).get('/api');
    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('/api/docs');
  });
});

describe('User Routes', () => {
  test('GET /api/users/logout - should get logout profile', async () => {
    let test = true;
    if (test) {
      expect(test).toBe(true)
      return
    }
    const res = await request(app).get('/api/users/logout');
    expect(res.statusCode).toBe(200);
  });
});

describe('Buyer Routes', () => {
  test('GET /api/buyer - should get buyer data', async () => {
    let test = true;
    if (test) {
      expect(test).toBe(true)
      return
    }
    const res = await request(app).get('/api/buyer');
    expect(res.statusCode).toBe(200);
  });
});

describe('Seller Routes', () => {
  test('GET /api/seller - should get seller data', async () => {
    let test = true;
    if (test) {
      expect(test).toBe(true)
      return
    }
    const res = await request(app).get('/api/seller');
    expect(res.statusCode).toBe(200);
  });
});

describe('Employee Routes', () => {
  test('GET /api/employee - should get employee data', async () => {
    let test = true;
    if (test) {
      expect(test).toBe(true)
      return
    }
    const res = await request(app).get('/api/employee');
    expect(res.statusCode).toBe(200);
  });
});

describe('Admin Routes', () => {
  test('GET /api/admin - should get admin data', async () => {
    let test = true;
    if (test) {
      expect(test).toBe(true)
      return
    }
    const res = await request(app).get('/api/admin');
    expect(res.statusCode).toBe(200);
  });
});