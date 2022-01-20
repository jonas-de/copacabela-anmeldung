import { CollectionConfig, Field, Where } from 'payload/types';
import Tribes from '../utilitites/Tribes';
import { EatingBehaviour, Genders } from '../utilitites/Wording';
import { TeilnehmendenverwalterIn, TeilnehmerIn, User } from '../payload-types';
import { RegistrationStates } from '../utilitites/Wording';
import Levels from '../utilitites/Levels';
import ParticipantsController, { ParticipantsControllerUser } from './ParticipantsController';
import { Access } from 'payload/config';

const ParticipantsQuery = (user: ParticipantsControllerUser) => {
  if (user.collection == "users") {
    return true
  }
  const participantController = user as TeilnehmendenverwalterIn
  const query: Where = {}
  if (participantController.tribe != "1312") {
    query.tribe = {
      equals: participantController.tribe
    }
  }
  if (participantController.level != "all") {
    query.level = {
      equals: participantController.level
    }
  }
  return query
}

const ParticipantsAccess: Access = ({ req: { user } }: { req: { user: ParticipantsControllerUser }}) => ParticipantsQuery(user)

const participantFields: Field[] = [
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
    name: "birthDate",
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
]


const Participants: CollectionConfig = {
  slug: "participants",
  fields: participantFields,
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
    read: ParticipantsAccess,
    update: ParticipantsAccess,
    delete: ParticipantsAccess,
  },
}

export default Participants
