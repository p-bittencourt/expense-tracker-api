import request from 'supertest';
import { Application } from 'express';
import { createTestApp, setupTestEnvironment } from './utils/setup';
import { createTestDependencies } from './utils/factories';
import { NotFoundError } from '@/types/errors';
import { MOCKS } from './utils/mocks';

describe('Admin User Controller - Users', () => {
  let app: Application;
  let dependencies: ReturnType<typeof createTestDependencies>;

  setupTestEnvironment();

  beforeAll(() => {
    dependencies = createTestDependencies();
    app = createTestApp(dependencies);
  });

  describe('GET /api/v1/admin', () => {
    it('should retrieve an array of users', async () => {
      dependencies.services.adminUser.getAllUsers = jest
        .fn()
        .mockResolvedValue([]);

      await request(app)
        .get('/api/v1/admin')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Array);
        });
    });
  });

  describe('GET /api/v1/admin/:id', () => {
    it('should return 404 when user is not found', async () => {
      dependencies.services.adminUser.getUserById = jest
        .fn()
        .mockRejectedValue(new NotFoundError('User not found'));

      await request(app)
        .get('/api/v1/admin/507f1f77bcf86cd799439011')
        .expect(404)
        .expect((res) => {
          expect(
            dependencies.services.adminUser.getUserById
          ).toHaveBeenCalled();
          expect(res.body).toEqual({
            message: 'User not found',
            status: 'not_found',
          });
        });
    });

    it('should return 400 for invalid ID format', async () => {
      await request(app)
        .get('/api/v1/admin/invalid-id')
        .expect(400)
        .expect((res) => {
          expect(res.body).toEqual({
            message: 'Invalid ID format',
            status: 'validation_error',
          });
        });
    });

    it('should return a user when found', async () => {
      dependencies.services.adminUser.getUserById = jest
        .fn()
        .mockResolvedValue(MOCKS.MOCKUSER);

      await request(app)
        .get('/api/v1/admin/507f1f77bcf86cd799439011')
        .expect(200)
        .expect((res) => {
          expect(
            dependencies.services.adminUser.getUserById
          ).toHaveBeenCalled();
          expect(res.body).toEqual(MOCKS.MOCKUSER);
        });
    });
  });

  describe('POST /api/v1/admin', () => {
    it('should return 201 when user is suceessfully created', async () => {
      dependencies.services.adminUser.createUser = jest
        .fn()
        .mockResolvedValue(MOCKS.MOCKUSER);

      await request(app)
        .post('/api/v1/admin')
        .send(MOCKS.VALIDUSERINPUT)
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual(MOCKS.MOCKUSER);
          expect(
            dependencies.services.adminUser.createUser
          ).toHaveBeenCalledWith(MOCKS.VALIDUSERINPUT);
        });
    });

    it('should return 400 when request body is empty', async () => {
      await request(app)
        .post('/api/v1/admin')
        .send({})
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('status', 'validation_error');
          expect(res.body.message).toContain('required');
        });
    });

    it('should return 400 when required fields are missing', async () => {
      await request(app)
        .post('/api/v1/admin')
        .send(MOCKS.INCOMPLETEUSER)
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('status', 'validation_error');
          expect(res.body.message).toContain('email');
        });
    });
  });

  describe('DELETE /api/admin/:id', () => {
    it('should return 404 NotFoundError if user not found', async () => {
      dependencies.services.adminUser.deleteUser = jest
        .fn()
        .mockRejectedValue(new NotFoundError('User not found'));

      await request(app)
        .delete('/api/v1/admin/507f1f77bcf86cd799439011')
        .expect(404)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
        });
    });

    it('should return 200 when successfully deleting the user', async () => {
      dependencies.services.adminUser.deleteUser = jest
        .fn()
        .mockResolvedValue(MOCKS.MOCKUSER);

      await request(app)
        .delete('/api/v1/admin/507f1f77bcf86cd799439011')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('user', MOCKS.MOCKUSER);
          expect(res.body).toHaveProperty(
            'message',
            'User successfully deleted'
          );
        });
    });
  });

  describe('PATCH /api/v1/admin/:id', () => {
    it('should successfully update an user', async () => {
      dependencies.services.adminUser.updateUser = jest
        .fn()
        .mockResolvedValue(MOCKS.MOCKUSER);

      await request(app)
        .patch('/api/v1/admin/507f1f77bcf86cd799439011')
        .send({ email: 'janedoe@email.com' })
        .expect(200)
        .expect((res) => {
          expect(res.body.user.email).toEqual(MOCKS.MOCKUSER.email);
          expect(dependencies.services.adminUser.updateUser).toHaveBeenCalled();
        });
    });

    it('should return 404 NotFoundError if user not found', async () => {
      dependencies.services.adminUser.updateUser = jest
        .fn()
        .mockRejectedValue(new NotFoundError('User not found'));

      await request(app)
        .patch('/api/v1/admin/507f1f77bcf86cd799439011')
        .send({ email: 'test@email.com' })
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
        })
        .expect(404);
    });
  });
});
