import { CollectionConfig, Field, FieldAccess, Where } from 'payload/types';
import { TribesWithDistrict } from '../utilitites/Tribes';
import {
  CovidVaccinationStates,
  EatingBehaviours,
  Genders,
  InsuranceTypes, LocationObject,
  PhotoPermissionStates,
  RegistrationStates
} from '../utilitites/Wording';
import { TeilnehmendenverwalterIn, TeilnehmerIn } from '../payload-types';
import { LevelsWithNone } from '../utilitites/Levels';
import { isBevo, ParticipantsControllerUser } from './ParticipantsController';
import { Access } from 'payload/config';
import { ParticipantRoles } from '../utilitites/Persons';
import payload from 'payload';
import sendRegistrationMail from '../utilitites/sendRegistrationMail';
import { dateArray } from '../utilitites/Fees';
import { BeforeChangeHook } from 'payload/dist/globals/config/types';
import moment from 'moment-timezone';

const ParticipantsQuery = (user: ParticipantsControllerUser) => {
  if (user.collection == "users") {
    return true
  }

  const participantController = user as TeilnehmendenverwalterIn

  const query: Where = {}
  if (participantController.tribe !== "1312") {
    query.tribe = {
      equals: participantController.tribe
    }
  }
  if (participantController.level !== "all") {
    query.level = {
      equals: participantController.level
    }
  }
  if (participantController.level === "kitchen" || participantController.level === "strandkorb") {
    return false
  }
  return query
}

const ParticipantsAccess: Access = ({ req: { user } }: { req: { user: ParticipantsControllerUser }}) => ParticipantsQuery(user)

const BevoOnlyFieldAccess: FieldAccess = ({ req: { user } }: { req: { user: ParticipantsControllerUser }}): boolean => {
  return user && (user.collection === "users" || isBevo(user as TeilnehmendenverwalterIn))
}

const BevoOnlyAccess: Access = ({ req: { user } }: { req: { user: ParticipantsControllerUser }}): boolean => {
  return user && (user.collection === "users" || isBevo(user as TeilnehmendenverwalterIn))
}

const AdminAccess: Access = ({ req: { user } }: { req: { user: ParticipantsControllerUser }}):boolean => {
  return user && user.collection === "users"
}

const Role: Field = {
  name: "role",
  type: "radio",
  options: ParticipantRoles.map(role => ({
    label: role.name,
    value: role.slug
  })),
  label: "Rolle",
  defaultValue: ParticipantRoles[0].slug,
  required: true
}

const OrderId: Field = {
  name: "orderId",
  type: "number",
  label: "Bestellnummer",
  required: true,
  index: true
}

const FirstName: Field = {
  name: "firstName",
  type: 'text',
  label: "Vorname",
  required: true
}

const LastName: Field = {
  name: "lastName",
  type: 'text',
  label: "Nachname",
  required: true
}

const BirthDate: Field = {
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
}

const Gender: Field = {
  name: "gender",
  type: "select",
  options: Genders.map(gender => { return {
    label: gender.name,
    value: gender.slug
  }}),
  label: "Geschlecht",
  required: true
}

const Email: Field = {
  name: "email",
  type: "email",
  label: "E-Mail",
  required: true
}

const PhoneNumber: Field = {
  name: "phoneNumber",
  type: "text",
  label: "Telefonnummer",
  required: false
}

const Address: Field = {
  name: "address",
  type: "group",
  fields: [
    {
      name: "street",
      type: "text",
      label: "Straße & Hausnummer",
      required: true
    },
    {
      type: "row",
      fields: [
        {
          name: "zipCode",
          type: "text",
          label: "Postleitzahl",
          validate: value => {
            const num = Number(value)
            if (!Number.isNaN(num) && num >= 10000 && num <= 99999) {
              return true
            }
            return "Keine gültige Postleitzahl"
          },
          required: true,
          admin: {
            width: "33%"
          }
        },
        {
          name: "city",
          type: "text",
          label: "Ort",
          required: true,
          admin: {
            width: "66%"
          }
        }
      ]
    }
  ],
  label: "Adresse",
  required: true
}

const Tribe: Field = {
  name: "tribe",
  type: 'select',
  options: TribesWithDistrict.map(tribe => ({
    label: tribe.name,
    value: String(tribe.number)
  })),
  label: "Stamm",
  required: true,
  access: {
    update: ({ req: { user }}) => {
      return user.collection === "users" || isBevo((user as unknown) as TeilnehmendenverwalterIn)
    }
  }
}

const Level: Field = {
  name: "level",
  type: "select",
  options: LevelsWithNone.map(level => ({
    label: level.singular,
    value: level.slug
  })),
  label: "Stufe",
  required: true
}

const Food: Field = {
  name: "food",
  type: "group",
  fields: [
    {
      name: "eatingBehaviour",
      type: "select",
      options: EatingBehaviours.map(behaviour => ({
        label: behaviour.name,
        value: behaviour.slug
      })),
      label: "Essverhalten",
      defaultValue: EatingBehaviours[0].slug,
      required: true
    },
    {
      name: "intolerances",
      type: "textarea",
      label: "Unverträglichkeiten",
      required: false
    }
  ],
  label: "Essen",
  required: true
}

const Vaccinations: Field = {
  name: "vaccinations",
  type: "group",
  fields: [
    {
      name: "tetanus",
      type: "checkbox",
      label: "Tetanus-Impfung",
      defaultValue: false,
      required: true,
    },
    {
      name: "fsme",
      type: "checkbox",
      label: "FSME-Impfung",
      defaultValue: false,
      required: true,
    },
    {
      name: "covid",
      type: "select",
      options: CovidVaccinationStates.map(state => ({
        label: state.name,
        value: state.slug
      })),
      label: "Corona-Impfung",
      defaultValue: "na",
      required: true,
    },
  ],
  label: "Impfungen",
  required: true
}

const Diseases: Field = {
  name: "diseases",
  type: "textarea",
  label: "Krankheiten",
  required: false
}

const HealthInsurance: Field = {
  name: "healthInsurance",
  type: "radio",
  options: InsuranceTypes.map(type => ({
    label: type.name,
    value: type.slug
  })),
  label: "Krankenversicherung",
  defaultValue: "gkv",
  required: true
}

const Swimmer: Field = {
  name: "swimmer",
  type: "checkbox",
  label: "Schwimmer:in",
  defaultValue: false,
  required: true
}

const LegalGuardian: Field = {
  name: "legalGuardian",
  type: "group",
  fields: [
    {
      name: "name",
      type: "text",
      label: "Name",
      required: false
    },
    {
      name: "phoneNumber",
      type: "text",
      label: "Telefonnummer",
      required: false
    }
  ],
  label: "Erziehungsberechtigte:r",
  required: false,
}

const Contacts: Field = {
  name: "contacts",
  type: "array",
  fields: [
    {
      name: "name",
      type: "text",
      label: "Name",
      required: true
    },
    {
      name: "phoneNumber",
      type: "text",
      label: "Telefonnummer",
      required: true
    }
  ],
  label: "Kontakte",
  required: false
}

const Presence: Field = {
  name: "presence",
  type: "group",
  fields: dateArray.map(date => ({
      name: String(date),
      type: "checkbox",
      label: `am ${date}.`,
      required: true,
      defaultValue: true
    })),
  label: "Anwesenheit",
  required: true
}

const Comments: Field = {
  name: "comments",
  type: "textarea",
  label: "Anmerkungen",
  required: false
}

const Juleica: Field = {
  name: "juleica",
  type: "group",
  fields: [
    {
      name: "number",
      type: "text",
      label: "Juleica-Nummer",
      required: false
    },
    {
      name: "terminates",
      type: "date",
      label: "Ablaufdatum",
      required: false,
      admin: {
        date: {
          pickerAppearance: "dayOnly",
          displayFormat: "dd.MM.yyyy"
        }
      },
    }
  ],
  label: "Juleica",
  required: false
}

const Clearance: Field = {
  name: "clearance",
  type: "group",
  fields: [
    {
      name: "idNumber",
      type: "text",
      label: "ID-Nummer",
      required: false
    },
    {
      name: "nami",
      type: "checkbox",
      label: "In NaMi eingetragen",
      required: false,
    }
  ],
  label: "Unbedenklichkeitsbescheinigung",
  required: false,
}

const Course: Field = {
  name: "course",
  type: "date",
  label: "2d/2e-Schulung",
  required: false,
  admin: {
    date: {
      pickerAppearance: "dayOnly",
      displayFormat: "dd.MM.yyyy"
    }
  }
}

const State: Field = {
  name: "state",
  type: "select",
  options: RegistrationStates.map(state => { return {
    label: state.name,
    value: state.slug
  }}),
  label: "Status",
  defaultValue: "new",
  required: true,
}

const ReceivedRegistration: Field = {
  name: "receivedRegistration",
  type: "checkbox",
  label: "Anmeldung abgegeben",
  defaultValue: false,
  required: true
}

const ReceivedLeaderInfo: Field = {
  name: "receivedLeaderInfo",
  type: "checkbox",
  label: "Zusatzblatt Leitende abgegeben",
  defaultValue: false,
  required: true,

}

const ReceivedPhotoPermission: Field = {
  name: "receivedPhotoPermission",
  type: "select",
  options: PhotoPermissionStates.map(state => { return {
    value: state.slug,
    label: state.name
  }}),
  label: "Fotoerlaubnis abgegeben",
  defaultValue: "no",
  required: true
}

const Review: Field = {
  name: "review",
  type: "group",
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "by",
          type: "text",
          label: "Eingesehen von",
          required: false
        },
        {
          name: "at",
          type: "date",
          label: "am",
          required: false,
          admin: {
            date: {
              pickerAppearance: "dayOnly",
              displayFormat: "dd.MM.yyyy"
            }
          }
        },
      ]
    },
    {
      name: "course",
      type: "checkbox",
      label: "2d / 2e",
      defaultValue: false,
      required: true
    },
    {
      name: "juleica",
      type: "checkbox",
      label: "Juleica",
      defaultValue: false,
      required: true
    },
    {
      name: "clearance",
      type: "checkbox",
      label: "Unbedenklichkeitsbescheinigung",
      defaultValue: false,
      required: true
    },
  ],
  label: "Überprüfung",
  required: true,
  access: {
    read: BevoOnlyFieldAccess,
    update: BevoOnlyFieldAccess
  }
}

const CancelledAt: Field = {
  name: "cancelledAt",
  type: "date",
  label: "Storniert am",
  required: false,
}

const LateRegistration: Field = {
  name: "lateRegistration",
  type: "checkbox",
  label: "Nachmeldung",
}

const StrandkorbCredit: Field = {
  name: "strandkorbCredit",
  type: "number",
  min: 0,
  max: 10,
  label: "Strandkorbguthaben",
  required: true
}

/*
const Location: Field = {
  name: "location",
  type: "select",
  options: Object.values(LocationObject).map(location => { return {
    value: location.slug,
    label: location.name
  }}),
  label: "Wo ist",
  required: true,
}
*/

const participantFields: Field[] = [
  Role,
  OrderId,
  {
    type: "row",
    fields: [FirstName, LastName]
  },
  {
    type: "row",
    fields: [BirthDate, Gender]
  },
  {
    type: "row",
    fields: [Email, PhoneNumber]
  },
  Address,
  {
    type: "row",
    fields: [Tribe, Level]
  },
  Food,
  Vaccinations,
  Diseases,
  HealthInsurance,
  Swimmer,
  LegalGuardian,
  Contacts,
  Presence,
  Comments,
  Juleica,
  Clearance,
  Course,
  ReceivedRegistration,
  ReceivedLeaderInfo,
  ReceivedPhotoPermission,
  Review,
  State,
  CancelledAt,
  LateRegistration,
  StrandkorbCredit
]

// @ts-ignore
const setCancelled: BeforeChangeHook = ({ data, operation, originalDoc }) => {
  if (operation !== "update") {
    return data
  }

  if (data.state === "cancelled" && originalDoc.state !== "cancelled") {
    data.cancelledAt = moment().tz("Europe/Berlin").toDate()
  }
  return data
}

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
    create: AdminAccess,
    read: ParticipantsAccess,
    update: ParticipantsAccess,
    delete: ParticipantsAccess,
  },
  hooks: {
    beforeValidate: [
      async ({ data, operation }) => {
        if (operation !== "create") {
          return data
        }
        const participant = data as TeilnehmerIn
        return {
          ...participant,
          level: participant.level ? participant.level : "none",
          receivedRegistration: false,
          receivedPhotoPermission: "no",
          receivedLeaderInfo: false,
          orderId: 0,
          review: {
            course: false,
            juleica: false,
            clearance: false
          },
          presence: Object.fromEntries(dateArray.map(date => [String(date), true])),
          strandkorbCredit: 10,
        }
      }
    ],
    beforeChange: [
      async ({ data, operation}) => {
        if (operation !== "create") {
          return data
        }
        console.log(data);
        // Generate unique order id
        let unique = false
        let orderId = Math.floor(Math.random() * (Math.floor(10000) - Math.ceil(1000))) + 1000;
        while (!unique) {
          const res = await payload.find({
            collection: "participants",
            limit: 1,
            where: {
              orderId: {
                equals: orderId
              }
            }
          })
          if (res.totalDocs === 0) {
            unique = true
          }
        }
        return {
          ...data,
          receivedRegistration: false,
          receivedLeaderInfo: false,
          receivedPhotoPermission: "no",
          orderId: orderId,
          review: {
            course: false,
            juleica: false,
            clearance: false
          },
          // for late registrations only
          state: "confirmed",
          lateRegistration: true,
          strandkorbCredit: 10,
        }
      },
      setCancelled
    ],
    afterChange: [
      sendRegistrationMail
    ]
  }
}

export default Participants
export { AdminAccess }












































