import { ENV } from './env.config';

export const authConfig = {
  authRequired: false,
  auth0Logout: true,
  baseURL: 'http://localhost:5000',
  secret: ENV.SECRET,
  clientID: ENV.CLIENT_ID,
  issuerBaseURL: ENV.ISSUER_BASE_URL,
};
