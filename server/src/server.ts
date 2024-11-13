import { ENV } from './config/env.config';
import app from './index';

// Start server
app.listen(ENV.PORT, () => {
  console.log(`Server running on port ${ENV.PORT}`);
});
