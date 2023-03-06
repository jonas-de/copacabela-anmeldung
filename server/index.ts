/* eslint-disable global-require */
/* eslint-disable no-console */
import path from 'path';
import next from 'next';
import express from 'express';
import payload from 'payload';
import {config as dotenv} from 'dotenv';
import {nextBuild} from 'next/dist/cli/next-build';

dotenv({
  path: path.resolve(__dirname, '../.env'),
});

const dev = process.env.NODE_ENV !== 'production';
const server = express();

const start = async () => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET_KEY ?? 'SECRET',
    mongoURL: process.env.MONGO_URL ?? '',
    express: server,
    email: process.env.SMTP_HOST
      ? {
          transportOptions: {
            host: process.env.SMTP_HOST!,
            auth: {
              user: process.env.SMTP_USER!,
              pass: process.env.SMTP_PASS!,
            },
            port: process.env.SMTP_PORT!,
            secure: true,
          },
          fromName: 'Anmeldung BeLeWe',
          fromAddress: process.env.SMTP_USER!,
        }
      : undefined,
  });

  if (!process.env.NEXT_BUILD) {
    const nextApp = next({dev});

    const nextHandler = nextApp.getRequestHandler();

    server.use(payload.authenticate);

    server.get('*', (req, res) => nextHandler(req, res));

    nextApp.prepare().then(() => {
      server.listen(process.env.PORT);
    });
  } else {
    server.listen(process.env.PORT, async () => {
      await nextBuild([__dirname, '../']);
      // eslint-disable-next-line no-process-exit
      process.exit();
    });
  }
};

start().then();
