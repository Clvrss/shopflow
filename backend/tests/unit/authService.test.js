const authService = require('../../src/services/authService');
const { models, resetDb, seedRoles, createUser } = require('../helpers/db');

describe('authService', () => {
  beforeEach(async () => {
    await resetDb();
    await seedRoles();
  });

  describe('register', () => {
    it('creates an active customer account', async () => {
      const user = await authService.register({
        email: 'new@example.com',
        firstName: 'New',
        lastName: 'User',
        password: 'Password123!',
      });

      expect(user.email).toBe('new@example.com');
      expect(user.role).toBe('customer');
      expect(user.passwordHash).toBeUndefined();

      const stored = await models.User.unscoped().findByPk(user.id);
      expect(await stored.verifyPassword('Password123!')).toBe(true);
    });

    it('creates a profile row for the new account', async () => {
      const user = await authService.register({
        email: 'profile@example.com',
        firstName: 'Prof',
        lastName: 'Test',
        password: 'Password123!',
      });
      const profile = await models.Profile.findOne({ where: { userId: user.id } });
      expect(profile).not.toBeNull();
    });

    it('rejects duplicate emails', async () => {
      await createUser({ email: 'dup@example.com' });
      await expect(
        authService.register({ email: 'dup@example.com', firstName: 'A', lastName: 'B', password: 'Password123!' })
      ).rejects.toThrow();
    });
  });

  describe('login', () => {
    it('returns tokens for valid credentials', async () => {
      await createUser({ email: 'login@example.com' });
      const result = await authService.login({ email: 'login@example.com', password: 'Password123!' });

      expect(result.accessToken).toBeTruthy();
      expect(result.refreshToken).toBeTruthy();
      expect(result.user.email).toBe('login@example.com');
    });

    it('rejects a wrong password', async () => {
      await createUser({ email: 'login2@example.com' });
      await expect(
        authService.login({ email: 'login2@example.com', password: 'wrong-password' })
      ).rejects.toThrow('Invalid email or password');
    });
  });
});
