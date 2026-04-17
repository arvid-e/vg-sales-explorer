import 'dotenv/config';
import { gracefulShutdown, startServer } from './server.js';

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

startServer();
