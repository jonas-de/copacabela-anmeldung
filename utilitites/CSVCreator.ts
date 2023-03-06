import {Participant} from '../payload-types';
import {getRoleName} from './Persons';
import {getLevelWithNone} from './Levels';
import {
  getCovidVaccinationState,
  getEatingBehaviour,
  getGender,
  getInsuranceType,
  getLocation,
  getPhotopermissionState,
  getState,
} from './Wording';
import {getTribeForNumber} from './Tribes';
import moment from 'moment-timezone';

const Fields = {
  firstName: {
    slug: 'firstName',
    title: 'Vorname',
    head: '"Vorname"',
    toText: (tn: Participant) => `"${tn.firstName}"`,
  },
  lastName: {
    slug: 'lastName',
    title: 'Nachname',
    head: '"Nachname"',
    toText: (tn: Participant) => `"${tn.lastName}"`,
  },
  orderId: {
    slug: 'orderId',
    title: 'Bestellnummer',
    head: '"Bestellnummer"',
    toText: (tn: Participant) => `"${tn.orderId}"`,
  },
  tribe: {
    slug: 'tribe',
    title: 'Stamm',
    head: '"Stamm"',
    toText: (tn: Participant) =>
      `"${getTribeForNumber(Number(tn.tribe)).name}"`,
  },
  role: {
    slug: 'role',
    title: 'Rolle',
    head: '"Rolle"',
    toText: (tn: Participant) => `"${getRoleName(tn.role)}"`,
  },
  level: {
    slug: 'level',
    title: 'Stufe',
    head: '"Stufe"',
    toText: (tn: Participant) => `"${getLevelWithNone(tn.level).singular}"`,
  },
  state: {
    slug: 'state',
    title: 'Status',
    head: '"Status"',
    toText: (tn: Participant) => `"${getState(tn.state).name}"`,
  },
  lateRegistration: {
    slug: 'lateRegistration',
    title: 'Buchungsart',
    head: '"Buchungsart"',
    toText: (tn: Participant) => {
      if (tn.lateRegistration !== undefined) {
        return tn.lateRegistration ? '"Nachmeldung"' : '"Normal"';
      } else {
        return '"Normal"';
      }
    },
  },
  cancelDate: {
    slug: 'cancelDate',
    title: 'Stornierungsdatum',
    head: '"Stornierungsdatum"',
    toText: (tn: Participant) => {
      if (tn.cancelledAt !== undefined) {
        return `"${moment(tn.cancelledAt)
          .tz('Europe/Berlin')
          .format('DD.MM.YYYY')}"`;
      } else {
        return '""';
      }
    },
  },
  birthDate: {
    slug: 'birthDate',
    title: 'Geburtstag',
    head: '"Geburtstag"',
    toText: (tn: Participant) =>
      `"${moment(tn.birthDate).tz('Europe/Berlin').format('DD.MM.YYYY')}"`,
  },
  gender: {
    slug: 'gender',
    title: 'Geschlecht',
    head: '"Geschlecht"',
    toText: (tn: Participant) => `"${getGender(tn.gender).name}"`,
  },
  email: {
    slug: 'email',
    title: 'E-Mail',
    head: '"E-Mail"',
    toText: (tn: Participant) => `"${tn.email}"`,
  },
  phoneNumber: {
    slug: 'phoneNumber',
    title: 'Telefonnummer',
    head: '"Telefonnummer"',
    toText: (tn: Participant) => `"${tn.phoneNumber || ''}"`,
  },
  address: {
    slug: 'address',
    title: 'Adresse',
    head: '"Straße";"Postleitzahl";"Ort"',
    toText: (tn: Participant) => {
      return `"${tn.address.street}";"${tn.address.zipCode}";"${tn.address.city}"`;
    },
  },
  eatingBehaviour: {
    slug: 'eatingBehaviour',
    title: 'Essverhalten',
    head: '"Essverhalten"',
    toText: (tn: Participant) =>
      `"${getEatingBehaviour(tn.food.eatingBehaviour).name}"`,
  },
  intolerances: {
    slug: 'intolerances',
    title: 'Unverträglichkeiten',
    head: '"Unverträglichkeiten"',
    toText: (tn: Participant) => `"${tn.food.intolerances || ''}"`,
  },
  tetanus: {
    slug: 'tetanus',
    title: 'Tetanus-Impfung',
    head: '"Tetanus-Impfung"',
    toText: (tn: Participant) => (tn.vaccinations.tetanus ? '"Ja"' : '"Nein"'),
  },
  covid: {
    slug: 'covid',
    title: 'Corona-Impfung',
    head: '"Corona-Impfung"',
    toText: (tn: Participant) =>
      `"${getCovidVaccinationState(tn.vaccinations.covid).name}"`,
  },
  fsme: {
    slug: 'fsme',
    title: 'FSME-Impfung',
    head: '"FSME-Impfung"',
    toText: (tn: Participant) => (tn.vaccinations.fsme ? '"Ja"' : '"Nein"'),
  },
  diseases: {
    slug: 'diseases',
    title: 'Krankheiten',
    head: '"Krankheiten"',
    toText: (tn: Participant) => `"${tn.diseases || ''}"`,
  },
  healthInsurance: {
    slug: 'healthInsurance',
    title: 'Krankenversicherung',
    head: '"Krankenversicherung"',
    toText: (tn: Participant) =>
      `"${getInsuranceType(tn.healthInsurance).name}"`,
  },
  swimmer: {
    slug: 'swimmer',
    title: 'Schwimmer:in',
    head: '"Schwimmer:in"',
    toText: (tn: Participant) => (tn.swimmer ? '"Ja"' : '"Nein"'),
  },
  firstContact: {
    slug: 'firstContact',
    title: '1. Notfallkontakt',
    head: '"Notfallkontakt"',
    toText: (tn: Participant) => {
      if (tn.legalGuardian !== undefined) {
        return `"${tn.legalGuardian.name || ''}: ${
          tn.legalGuardian.phoneNumber || ''
        }"`;
      }
      if (tn.contacts !== undefined && tn.contacts[0] !== undefined) {
        return `"${tn.contacts[0].name || ''}: ${
          tn.contacts[0].phoneNumber || ''
        }"`;
      }
    },
  },
  presencePerDay: {
    slug: 'presencePerDay',
    title: 'Anwesenheit per Tag',
    head: '"04.";"05.";"06.";"07.";"08.";"09.";"10.";"11."',
    toText: (tn: Participant) => {
      return Object.values(tn.presence)
        .map(present => (present ? '"Ja"' : '"Nein"'))
        .join(';');
    },
  },
  presence: {
    slug: 'presence',
    title: 'Anwesenheit in Tagen',
    head: '"Anwesenheit (Tage)"',
    toText: (tn: Participant) => {
      return `"${
        Object.values(tn.presence).filter(present => present).length
      }"`;
    },
  },
  location: {
    slug: 'location',
    title: 'Ort',
    head: 'Ort',
    toText: (tn: Participant) => {
      return `"${getLocation(tn.location).name}"`;
    },
  },
  comments: {
    slug: 'comments',
    title: 'Anmerkungen',
    head: '"Anmerkungen"',
    toText: (tn: Participant) => `"${tn.comments || ''}"`,
  },
  juleica: {
    slug: 'juleica',
    title: 'Juleica',
    head: '"Juleica";"Juleica Ablauf"',
    toText: (tn: Participant) => {
      const info = [tn.juleica?.number || ''];
      if (tn.juleica?.terminates !== undefined) {
        info.push(
          moment(tn.juleica.terminates).tz('Europe/Berlin').format('DD.MM.YYYY')
        );
      } else {
        info.push('');
      }
      return info.map(elem => `"${elem}"`).join(';');
    },
  },
  clearance: {
    slug: 'clearance',
    title: 'Unbedenklichkeitsbescheinigung',
    head: '"UB-ID";""NaMi"',
    toText: (tn: Participant) => {
      const info = [tn.clearance?.idNumber || ''];
      if (tn.clearance?.nami !== undefined) {
        info.push(tn.clearance.nami ? 'In NaMi' : '');
      } else {
        info.push('');
      }
      return info.map(elem => `"${elem}"`).join(';');
    },
  },
  course2d2e: {
    slug: 'course2d2e',
    title: '2d2e-Schulung',
    head: '"2d2e-Schulung"',
    toText: (tn: Participant) => {
      if (tn.course !== undefined) {
        return `"${moment(tn.course)
          .tz('Europe/Berlin')
          .format('DD.MM.YYYY')}"`;
      } else {
        return '""';
      }
    },
  },
  registration: {
    slug: 'registration',
    title: 'Anmeldung',
    head: '"Anmeldung"',
    toText: (tn: Participant) => (tn.receivedRegistration ? '"Ja"' : '"Nein"'),
  },
  photoPermission: {
    slug: 'photoPermission',
    title: 'Fotoerlaubnis',
    head: '"Fotoerlaubnis"',
    toText: (tn: Participant) =>
      `"${getPhotopermissionState(tn.receivedPhotoPermission).name}"`,
  },
  leaderInfo: {
    slug: 'leaderInfo',
    title: 'Leitendeninfos',
    head: '"Leitendeninfos"',
    toText: (tn: Participant) => (tn.receivedLeaderInfo ? '"Ja"' : '"Nein"'),
  },
};

const BevoFields = {
  checked2d2e: {
    slug: 'checked2d2e',
    title: 'Einsicht 2d/2e',
    head: '"Einsicht 2d/2e"',
    toText: (tn: Participant) => (tn.review.course ? '"Ja"' : '"Nein"'),
  },
  checkedClearance: {
    slug: 'checkedClearance',
    title: 'Einsicht UB',
    head: '"Einsicht UB"',
    toText: (tn: Participant) => (tn.review.clearance ? '"Ja"' : '"Nein"'),
  },
  checkedJuleica: {
    slug: 'checkedJuleica',
    title: 'Einsicht Juleica',
    head: '"Einsicht Juleica"',
    toText: (tn: Participant) => (tn.review.juleica ? '"Ja"' : '"Nein"'),
  },
};

const generateCSVLine = (tn: Participant, fields: string[]): string => {
  return fields
    .map(field => {
      return {...Fields, ...BevoFields}[field]!.toText(tn);
    })
    .join(';');
};

const generateCSV = (tns: Participant[], fields: string[]): string => {
  const headLine = fields
    .map(field => {
      return {...Fields, ...BevoFields}[field]!.head;
    })
    .join(';');

  const tnLines = tns.map(tn => generateCSVLine(tn, fields));
  return [headLine, ...tnLines].join('\n');
};

export default generateCSV;
export {Fields, BevoFields};
