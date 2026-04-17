import { Server } from 'http';
import { app } from './app.js';

let server: Server | undefined;

export const startServer = async () => {
  try {

    const PORT = process.env.PORT || 3000;

    server = app.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`Server running at port: ${PORT}`);
    });
  } catch (error: unknown) {
    console.error(error);
  }
};

export const gracefulShutdown = async (signal: NodeJS.Signals) => {
  console.log(`\n${signal} signal received: Closing HTTP server.`);

  if (!server) {
    console.error('Server was not running or initialized.');
    process.exit(1);
  }

  server.close(() => {
    console.log('HTTP server closed.');
  });
};
