import { buildConfig } from 'payload/config';
import dotenv from 'dotenv';
import ParticipantsController from './collections/ParticipantsController';
import Participants from './collections/Participants';
import RegistrationForms from './collections/RegistrationForms';
import PhotoPermissions from './collections/PhotoPermissions';
dotenv.config();

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL ?? "localhost",
  collections: [
    ParticipantsController,
    Participants,
    RegistrationForms,
    PhotoPermissions
  ],
});
