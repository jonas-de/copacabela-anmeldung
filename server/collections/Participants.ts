import { CollectionConfig, Field, Where } from 'payload/types';
import Tribes, { TribesWithDistrict } from '../../src/utilitites/Tribes';
import {
  CovidVaccinationStates,
  EatingBehaviour,
  Genders,
  InsuranceTypes,
  Wording
} from '../../src/utilitites/Wording';
import { TeilnehmendenverwalterIn, TeilnehmerIn, User } from '../../payload-types';
import { RegistrationStates } from '../../src/utilitites/Wording';
import Levels from '../../src/utilitites/Levels';
import ParticipantsController, { ParticipantsControllerUser } from './ParticipantsController';
import { Access } from 'payload/config';
import moment, { Moment } from 'moment';
import { PDFDocument } from 'pdf-lib';
const fs = require("fs")

import { ParticipantRoles } from '../../src/utilitites/Persons';

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
  required: true
}

const Level: Field = {
  name: "level",
  type: "select",
  options: Levels.map(level => ({
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
      options: EatingBehaviour.map(behaviour => ({
        label: behaviour.name,
        value: behaviour.slug
      })),
      label: "Essverhalten",
      defaultValue: EatingBehaviour[0].slug,
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
      required: true,
    },
    {
      name: "fsme",
      type: "checkbox",
      label: "FSME-Impfung",
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
  required: true
}

const Swimmer: Field = {
  name: "swimmer",
  type: "checkbox",
  label: "Schwimmer:in",
  required: true
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
  required: false // TODO
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
  required: false,
  admin: {
    condition: data => data.role !== "participant"
  }
}

const Clearance: Field = {
  name: "clearance",
  type: "group",
  fields: [
    {
      name: "id",
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
  admin: {
    condition: data => data.role !== "participant"
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

const Registration: Field = {
  name: "registration",
  type: "upload",
  relationTo: "registrationforms",
  label: "Anmeldung",
  required: false
}

const PhotoPermission: Field = {
  name: "photopermission",
  type: "upload",
  relationTo: "photopermissions",
  label: "Fotoerlaubnis",
  required: false
}

const participantFields: Field[] = [
  Role,
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
  Contacts,
  Comments,
  Juleica,
  Clearance,
  State,
  Registration,
  PhotoPermission
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
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        console.log(operation)
        if (operation === "create") {

          if (typeof window === undefined) {
            console.log("Server")
          }

          try {
            const pdfData = fs.readFileSync("Anmeldung.pdf")

            const pdf = await PDFDocument.load(pdfData)
            const form = pdf.getForm()
            const firstName = form.getTextField("Vorname")
            const gender = form.getRadioGroup("Geschlecht")
            const contacts = form.getTextField("Notfallkontakte")
            firstName.setText(doc.firstName)
            gender.select("m")
            const pdfBytes = await pdf.save()
            fs.writeFileSync("Anmeldetest.pdf", pdfBytes)
            console.log("success")
          } catch (error) {
            console.log(error)
          }




        }

      }
    ]
  }
}

export default Participants













































