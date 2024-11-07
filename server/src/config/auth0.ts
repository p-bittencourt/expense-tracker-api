export const authConfig = {
  authRequired: false,
  auth0Logout: true,
  baseURL: 'http://localhost:5000',
  secret: process.env.SECRET,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
};
