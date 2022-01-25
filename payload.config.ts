import { buildConfig } from 'payload/config';
import dotenv from 'dotenv';
import ParticipantsController from './server/collections/ParticipantsController';
import RegistrationForms from './server/collections/RegistrationForms';
import PhotoPermissions from './server/collections/PhotoPermissions';
dotenv.config();

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL ?? "localhost",
  collections: [
    ParticipantsController,
    RegistrationForms,
    PhotoPermissions
  ],
});
