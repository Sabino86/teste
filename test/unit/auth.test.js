const authMiddleware = require('../../src/middlewares/auth');

describe('Authentication Middleware', () => {
  it('should validate clientId', async () => {
    const req = {
      query: {},
    };
    const res = {};
    const next = () => { };

    try {
      await authMiddleware(req, res, next);
    } catch (e) {
      expect(e.message).toBe('No client ID');
    }
  });

  it('should find for a valid clientId', async () => {
    const req = {
      query: {
        clientId: 298,
      },
    };
    const res = {};
    const next = () => { };

    try {
      await authMiddleware(req, res, next);
    } catch (e) {
      expect(e.message).toBe('No client ID');
    }
  });

  it('should work and add client to req object', async () => {
    const req = {
      query: {
        clientId: 1,
      },
    };
    const res = {};
    const next = () => { };

    await authMiddleware(req, res, next);

    expect(req).toHaveProperty('client');
  });
});
