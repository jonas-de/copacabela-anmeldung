import { buildConfig } from 'payload/config';
import dotenv from 'dotenv';
import ParticipantsController from './collections/ParticipantsController';
import Participants from './collections/Participants';

dotenv.config();

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL ?? "localhost",
  collections: [
    ParticipantsController,
    Participants
  ],
  cors: [
    process.env.PAYLOAD_CORS ?? "*"
  ],
  csrf: [
    process.env.PAYLOAD_CSRF ?? "http://localhost"
  ],
  rateLimit: {
    trustProxy: true
  },
  admin: {
    webpack: (config) => ({
      ...config,
      resolve: {
        ...config.resolve,
        fallback: {
          ...config.resolve!.fallback,
          fs: false
        }
      }
    })
  }
});
