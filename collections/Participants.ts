import { CollectionConfig } from 'payload/types';
import Tribes from '../utilitites/Tribes';
import { EatingBehaviour, Genders } from '../utilitites/Wording';
import { TeilnehmendenverwalterIn, User } from '../payload-types';
import { RegistrationStates } from '../utilitites/Wording';
import Levels from '../utilitites/Levels';

const Participants: CollectionConfig = {
  slug: "participants",
  fields: [
    { name: "gender",
      type: "select",
      options: Genders.map(gender => { return {
        label: gender.name,
        value: gender.slug
      }}),
      label: "Geschlecht",
      required: true
    },
    {
      name: "firstName",
      type: 'text',
      label: "Vorname",
      required: true
    },
    {
      name: "lastName",
      type: 'text',
      label: "Nachname",
      required: true
    },
    {
      name: "tribe",
      options: Tribes.map(tribe => { return {
          label: tribe.name,
          value: String(tribe.number)
      }}),
      type: 'select',
      label: "Stamm",
      required: true
    },
    {
      name: "birthData",
      type: 'date',
      label: "Geburtsdatum",
      admin: {
        date: {
          pickerAppearance: "dayOnly",
          displayFormat: "dd.MM.yyyy"
        }
      },
      required: true
    },
    {
      name: "eatingBehaviour",
      type: 'select',
      options: EatingBehaviour.map(behaviour => { return {
        label: behaviour.name,
        value: behaviour.slug
      }}),
      label: "Essensverhalten",
      required: true
    },
    {
      name: "foodIntolerances",
      type: 'textarea',
      label: "Lebensmittelunverträglichkeiten",
    },
    {
      name: "swimmer",
      type: "checkbox",
      label: "Schwimmer:in",
      required: true
    },
    {
      name: "state",
      type: "select",
      options: RegistrationStates.map(state => { return {
        label: state.name,
        value: state.slug
      }}),
      label: "Status",
      required: true,
      access: {
        read: (req) => {
          console.log("req")
          console.log(req)
          return true
        }
      }
    },
    {
      name: "level",
      type: "select",
      options: Levels.map(level => { return {
        label: level.singular,
        value: level.slug
      }})
    },
    {
      name: "registration",
      type: "upload",
      relationTo: "registrationforms",
      label: "Anmeldung"
    },
    {
      name: "photopermission",
      type: "upload",
      relationTo: "photopermissions",
      label: "Fotoerlaubnis"
    }
  ],
  labels: {
    singular: "Teilnehmer:in",
    plural: "Teilnehmende"
  },
  admin: {
    useAsTitle: "firstName",
    defaultColumns: ["firstName", "lastName", "tribe", "level", "state"]
  },
  access: {
    create: () => true,
    read: ({ req: { user } }) => ParticipantsQuery(user),
    update: ({ req: { user } }) => ParticipantsQuery(user),
    delete: ({ req: { user } }) => ParticipantsQuery(user),
  },
}

const ParticipantsQuery = (user: (TeilnehmendenverwalterIn | User) & { collection: string } ) => {
  if (user.collection == "users") {
    return true
  }
  const query = {}
  if (user.access != "1312") {
    // @ts-ignore
    query["tribe"] = {
      equals: user.access
    }
  }
  if (user.level != "all") {
    // @ts-ignore
    query["level"] = {
      equals: user.level
    }
  }
  console.log(query)
  return query
}

export default Participants
