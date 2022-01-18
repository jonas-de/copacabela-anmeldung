import { CollectionConfig } from 'payload/types';
import { isValidTribe, TribesWithDistrict } from '../utilitites/Tribes';
import Levels, { AccessLevels, isValidLevel } from '../utilitites/Levels';



const ParticipantsController: CollectionConfig = {
  slug: "participantscontroller",
  fields: [
    {
      name: "name",
      type: "text",
      label: "Name",
      required: true
    },
    {
      name: "access",
      type: "select",
      options: TribesWithDistrict.map(tribe => ({
        label: tribe.name,
        value: String(tribe.number)
      })),
      label: "Zugriffsbereich",
      required: true
    },
    {
      name: "level",
      type: "select",
      options: AccessLevels.map(level => ({
        label: level.plural,
        value: level.slug
      })),
      label: "Stufe",
      required: true
    }
  ],
  labels: {
    singular: "Teilnehmendenverwalter:in",
    plural: "Teilnehmendenverwaltende"
  },
  auth: true,
}

export default ParticipantsController
