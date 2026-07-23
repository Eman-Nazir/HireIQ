import request from 'supertest';
import './setup.js';

process.env.JWT_ACCESS_SECRET = 'test-secret';
process.env.JWT_ACCESS_EXPIRES_IN = '15m';
process.env.JWT_REFRESH_EXPIRES_IN = '7';
process.env.CLIENT_URL = 'http://localhost:5173';
process.env.JWT_ACCESS_SECRET = 'test-secret';
process.env.JWT_ACCESS_EXPIRES_IN = '15m';
process.env.JWT_REFRESH_EXPIRES_IN = '7';
process.env.CLIENT_URL = 'http://localhost:5173';
process.env.GOOGLE_CLIENT_ID = 'test-client-id';
process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret';
process.env.GOOGLE_CALLBACK_URL = 'http://localhost:5000/api/auth/google/callback';

let app;
beforeAll(async () => {
  app = (await import('../src/app.js')).default;
});


describe('Auth: Register', () => {
  it('registers a new user successfully', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'StrongPass123',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe('test@example.com');
    expect(res.body.data.user.role).toBe('user');
    expect(res.body.data.user.password).toBeUndefined();
  });

  it('rejects duplicate email registration', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'First User',
      email: 'dup@example.com',
      password: 'StrongPass123',
    });

    const res = await request(app).post('/api/auth/register').send({
      name: 'Second User',
      email: 'dup@example.com',
      password: 'StrongPass123',
    });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('rejects weak passwords', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Weak Pass User',
      email: 'weak@example.com',
      password: '12345678',
    });

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
  });
});

describe('Auth: Login', () => {
  it('logs in with correct credentials', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Login Test',
      email: 'login@example.com',
      password: 'StrongPass123',
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'login@example.com',
      password: 'StrongPass123',
    });

    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe('login@example.com');
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('rejects wrong password', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Wrong Pass Test',
      email: 'wrongpass@example.com',
      password: 'StrongPass123',
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'wrongpass@example.com',
      password: 'IncorrectPassword1',
    });

    expect(res.status).toBe(401);
  });

  it('rejects login for non-existent user', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'doesnotexist@example.com',
      password: 'anything',
    });

    expect(res.status).toBe(401);
  });
});

describe('Auth: Protected route', () => {
  it('rejects /auth/me without a token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('allows /auth/me with a valid token', async () => {
    const agent = request.agent(app);

    await agent.post('/api/auth/register').send({
      name: 'Me Test',
      email: 'metest@example.com',
      password: 'StrongPass123',
    });

    const res = await agent.get('/api/auth/me');
    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe('metest@example.com');
  });
});