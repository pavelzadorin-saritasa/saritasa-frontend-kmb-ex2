import { startServer } from './core/http.service';
import { connectRepository, disconnectRepository } from './core/repository.service';

await connectRepository();

process.on('SIGINT', async function() {
  console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );

  await disconnectRepository();

  process.exit(0);
});

startServer();
