import {CollectionConfig, Field, Where} from 'payload/types';
import {TribesWithDistrict} from '../utilitites/Tribes';
import {
  Genders,
  InsuranceTypes,
  RegistrationStates,
} from '../utilitites/Wording';
import {Participant, Participantscontroller} from '../payload-types';
import {LevelsWithNone} from '../utilitites/Levels';
import {Access} from 'payload/config';
import payload from 'payload';
import sendRegistrationMail from '../utilitites/sendRegistrationMail';
import {BeforeChangeHook} from 'payload/dist/globals/config/types';
import registrationAllowed from '../utilitites/registrationAllowed';
import dayjstz from '../utilitites/dayjstz';
import generator from 'generate-password';

const OrderId: Field = {
  name: 'orderId',
  type: 'number',
  label: 'Bestellnummer',
  required: true,
  index: true,
};

const FirstName: Field = {
  name: 'firstName',
  type: 'text',
  label: 'Vorname',
  required: true,
};

const LastName: Field = {
  name: 'lastName',
  type: 'text',
  label: 'Nachname',
  required: true,
};

const BirthDate: Field = {
  name: 'birthDate',
  type: 'date',
  label: 'Geburtsdatum',
  admin: {
    date: {
      pickerAppearance: 'dayOnly',
      displayFormat: 'dd.MM.yyyy',
    },
  },
  required: true,
};

const Gender: Field = {
  name: 'gender',
  type: 'select',
  options: Genders.map(gender => {
    return {
      label: gender.name,
      value: gender.slug,
    };
  }),
  label: 'Geschlecht',
  required: true,
};

const Email: Field = {
  name: 'email',
  type: 'email',
  label: 'E-Mail',
  required: true,
};

const PhoneNumber: Field = {
  name: 'phoneNumber',
  type: 'text',
  label: 'Telefonnummer',
  required: false,
};

const Address: Field = {
  name: 'address',
  type: 'group',
  fields: [
    {
      name: 'street',
      type: 'text',
      label: 'Straße & Hausnummer',
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'zipCode',
          type: 'text',
          label: 'Postleitzahl',
          validate: value => {
            const num = Number(value);
            if (!Number.isNaN(num) && num >= 10000 && num <= 99999) {
              return true;
            }
            return 'Keine gültige Postleitzahl';
          },
          required: true,
          admin: {
            width: '33%',
          },
        },
        {
          name: 'city',
          type: 'text',
          label: 'Ort',
          required: true,
          admin: {
            width: '66%',
          },
        },
      ],
    },
  ],
  label: 'Adresse',
};

const Tribe: Field = {
  name: 'tribe',
  type: 'select',
  options: TribesWithDistrict.map(tribe => ({
    label: tribe.name,
    value: String(tribe.number),
  })),
  label: 'Stamm',
  required: true,
};

const Level: Field = {
  name: 'level',
  type: 'select',
  options: LevelsWithNone.map(level => ({
    label: level.singular,
    value: level.slug,
  })),
  label: 'Stufe',
  required: true,
};

const Food: Field = {
  name: 'food',
  type: 'group',
  fields: [
    {
      name: 'intolerances',
      type: 'textarea',
      label: 'Unverträglichkeiten',
      required: false,
    },
  ],
  label: 'Essen',
};

const Diseases: Field = {
  name: 'diseases',
  type: 'textarea',
  label: 'Krankheiten',
  required: false,
};

const HealthInsurance: Field = {
  name: 'healthInsurance',
  type: 'radio',
  options: InsuranceTypes.map(type => ({
    label: type.name,
    value: type.slug,
  })),
  label: 'Krankenversicherung',
  defaultValue: 'gkv',
  required: true,
};

const Comments: Field = {
  name: 'comments',
  type: 'textarea',
  label: 'Anmerkungen',
  required: false,
};

const Juleica: Field = {
  name: 'juleica',
  type: 'group',
  fields: [
    {
      name: 'number',
      type: 'text',
      label: 'Juleica-Nummer',
      required: false,
    },
    {
      name: 'terminates',
      type: 'date',
      label: 'Ablaufdatum',
      required: false,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd.MM.yyyy',
        },
      },
    },
  ],
  label: 'Juleica',
};

const Clearance: Field = {
  name: 'clearance',
  type: 'group',
  fields: [
    {
      name: 'idNumber',
      type: 'text',
      label: 'ID-Nummer',
      required: false,
    },
    {
      name: 'nami',
      type: 'checkbox',
      label: 'In NaMi eingetragen',
      required: false,
    },
  ],
  label: 'Unbedenklichkeitsbescheinigung',
};

const State: Field = {
  name: 'state',
  type: 'select',
  options: RegistrationStates.map(state => {
    return {
      label: state.name,
      value: state.slug,
    };
  }),
  label: 'Status',
  defaultValue: 'new',
  required: true,
};

const CancelledAt: Field = {
  name: 'cancelledAt',
  type: 'date',
  label: 'Storniert am',
  required: false,
};

const ConfirmationToken: Field = {
  name: 'confirmationToken',
  type: 'text',
  label: 'Bestätigungs-Token',
  required: true,
};

const participantFields: Field[] = [
  OrderId,
  {
    type: 'row',
    fields: [FirstName, LastName],
  },
  {
    type: 'row',
    fields: [BirthDate, Gender],
  },
  {
    type: 'row',
    fields: [Email, PhoneNumber],
  },
  Address,
  {
    type: 'row',
    fields: [Tribe, Level],
  },
  Food,
  Diseases,
  HealthInsurance,
  Comments,
  Juleica,
  Clearance,
  State,
  CancelledAt,
  ConfirmationToken,
];

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const setCancelled: BeforeChangeHook = ({data, operation, originalDoc}) => {
  if (operation !== 'update') {
    return data;
  }

  if (data.state === 'cancelled' && originalDoc.state !== 'cancelled') {
    data.cancelledAt = dayjstz().tz('Europe/Berlin').toDate();
  }
  return data;
};

const Participants: CollectionConfig = {
  slug: 'participants',
  fields: participantFields,
  labels: {
    singular: 'Teilnehmer:in',
    plural: 'Teilnehmende',
  },
  admin: {
    useAsTitle: 'firstName',
    defaultColumns: ['firstName', 'lastName', 'tribe', 'level', 'state'],
  },
  access: {
    create: registrationAllowed,
  },
  hooks: {
    beforeValidate: [
      async ({data, operation}) => {
        if (operation !== 'create') {
          return data;
        }
        const participant = data as Participant;
        return {
          ...participant,
          receivedRegistration: false,
          receivedPhotoPermission: 'no',
          receivedLeaderInfo: false,
          orderId: 0,
          confirmationToken: 'token',
        };
      },
    ],
    beforeChange: [
      async ({data, operation}) => {
        if (operation !== 'create') {
          return data;
        }
        // Generate unique order id
        let unique = false;
        const orderId =
          Math.floor(Math.random() * (Math.floor(10000) - Math.ceil(1000))) +
          1000;
        while (!unique) {
          const res = await payload.find({
            collection: 'participants',
            limit: 1,
            where: {
              orderId: {
                equals: orderId,
              },
            },
          });
          if (res.totalDocs === 0) {
            unique = true;
          }
        }
        return {
          ...data,
          receivedRegistration: false,
          receivedLeaderInfo: false,
          receivedPhotoPermission: 'no',
          orderId: orderId,
          confirmationToken: generator.generate({
            length: 64,
            numbers: true,
            uppercase: false,
          }),
        };
      },
      setCancelled,
    ],
    afterChange: [sendRegistrationMail],
  },
};

export default Participants;
