import { CollectionConfig } from 'payload/types';

const RegistrationForms: CollectionConfig = {
  slug: "registrationforms",
  fields: [],
  labels: {
    singular: "Anmeldung",
    plural: "Anmeldungen"
  },
  upload: {
    staticURL: "/registrationformfiles",
    staticDir: "registrations",
    mimeTypes: ["application/pdf"],
  }
}

export default RegistrationForms
