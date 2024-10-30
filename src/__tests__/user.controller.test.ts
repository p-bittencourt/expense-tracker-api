import request from 'supertest';
import app from '@/app';
import { IDValidationError } from '@/middleware/error.middleware';

let server: any;

beforeAll(() => {
  server = app.listen(3001); // Start the server on a different port for testing
});

afterAll((done) => {
  server.close(done); // Close the server after tests are done
});

describe('User Controller', () => {
  it('should retrieve an array of users', (done) => {
    request(app)
      .get('/api/users')
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        done();
      });
  });

  it('should return 400 for invalid ID format', (done) => {
    request(app)
      .get('/api/users/invalid-id')
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'Invalid ID format' });
        done();
      });
  });
});
