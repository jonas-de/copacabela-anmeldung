import { GlobalConfig } from 'payload/types';

const Settings: GlobalConfig = {
  slug: "settings",
  fields: [
    {
      name: "lateRegistration",
      type: "checkbox",
      label: "Nachmeldungen aktiv",
      required: true,
    },
  ],
  label: "Einstellungen"
}

export default Settings
