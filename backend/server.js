import app from './src/app.js';
import env from './src/config/env.js';
import connectDB from './src/config/db.js';
import connectCloudinary from './src/config/cloudinary.js';

/**
 * Application entry point.
 * 1. Connect to MongoDB
 * 2. Initialize Cloudinary
 * 3. Start HTTP server
 * 4. Handle graceful shutdown
 */

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Initialize Cloudinary
    connectCloudinary();

    // Start server
    const server = app.listen(env.PORT, () => {
      console.log(`\n🚀 Appointy API Server`);
      console.log(`   Environment : ${env.NODE_ENV}`);
      console.log(`   Port        : ${env.PORT}`);
      console.log(`   CORS Origin : ${env.CORS_ORIGIN}`);
      console.log(`   Health      : http://localhost:${env.PORT}/api/health\n`);
    });

    // ---- Graceful Shutdown ----
    const shutdown = (signal) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);
      server.close(() => {
        console.log('✅ HTTP server closed');
        process.exit(0);
      });

      // Force close after 10 seconds
      setTimeout(() => {
        console.error('⚠️  Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error('❌ Unhandled Rejection:', err.message);
      server.close(() => process.exit(1));
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      console.error('❌ Uncaught Exception:', err.message);
      process.exit(1);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
