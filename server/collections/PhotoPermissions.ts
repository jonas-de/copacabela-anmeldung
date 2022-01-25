import { CollectionConfig } from 'payload/types';

const PhotoPermissions: CollectionConfig = {
  slug: "photopermissions",
  fields: [],
  labels: {
    singular: "Fotoerlaubnis",
    plural: "Fotoerlaubnisse"
  },
  upload: {
    staticURL: "/photopermissionfiles",
    staticDir: "photopermissions",
    mimeTypes: ["application/pdf"],
  }
}

export default PhotoPermissions
