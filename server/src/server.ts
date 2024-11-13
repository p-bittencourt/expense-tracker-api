import { Server } from 'http';
import app from './index';
import { ENV } from './config/env.config';
import mongoose from 'mongoose';

class AppServer {
  private server: Server | null = null;

  public async start(): Promise<void> {
    try {
      this.server = app.listen(ENV.PORT, () => {
        console.log(`
🚀 Server running in ${ENV.NODE_ENV} mode on port ${ENV.PORT}
👉 http://localhost:${ENV.PORT}
        `);
      });

      this.server.on('error', (error: NodeJS.ErrnoException) => {
        if (error.code === 'EADDRINUSE') {
          console.error(`⛔️ Port ${ENV.PORT} is already in use`);
        } else {
          console.error('⛔️ Server error:', error);
        }
        this.shutdown(1);
      });

      // Handle process signals
      this.setupGracefulShutdown();
    } catch (error) {
      console.error('⛔️ Failed to start server:', error);
      this.shutdown(1);
    }
  }

  private setupGracefulShutdown(): void {
    const signals: NodeJS.Signals[] = ['SIGTERM', 'SIGINT'];

    signals.forEach((signal) => {
      process.on(signal, () => {
        console.log(`\n${signal} received. Starting graceful shutdown...`);
        this.shutdown(0);
      });
    });

    process.on('uncaughtException', (error) => {
      console.error('⛔️ Uncaught Exception:', error);
      this.shutdown(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('⛔️ Unhandled Rejection at:', promise, 'reason:', reason);
      this.shutdown(1);
    });
  }

  private async shutdown(code: number): Promise<void> {
    console.log('🔄 Shutting down server...');

    if (this.server) {
      // Close server
      await new Promise<void>((resolve) => {
        this.server?.close(() => {
          console.log('✅ Server closed');
          resolve();
        });
      });

      // Close database connection if exists
      try {
        await mongoose.connection.close();
        console.log('✅ Database connection closed');
      } catch (error) {
        console.error('⛔️ Error closing database connection:', error);
      }

      console.log(`👋 Process exiting with code ${code}`);
      process.exit(code);
    }
  }
}

// Start the server
const server = new AppServer();
server.start().catch((error) => {
  console.error('⛔️ Failed to start server:', error);
  process.exit(1);
});
