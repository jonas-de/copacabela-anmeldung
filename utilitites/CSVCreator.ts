import {TeilnehmerIn} from '../payload-types';
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
    toText: (tn: TeilnehmerIn) => `"${tn.firstName}"`,
  },
  lastName: {
    slug: 'lastName',
    title: 'Nachname',
    head: '"Nachname"',
    toText: (tn: TeilnehmerIn) => `"${tn.lastName}"`,
  },
  orderId: {
    slug: 'orderId',
    title: 'Bestellnummer',
    head: '"Bestellnummer"',
    toText: (tn: TeilnehmerIn) => `"${tn.orderId}"`,
  },
  tribe: {
    slug: 'tribe',
    title: 'Stamm',
    head: '"Stamm"',
    toText: (tn: TeilnehmerIn) =>
      `"${getTribeForNumber(Number(tn.tribe)).name}"`,
  },
  role: {
    slug: 'role',
    title: 'Rolle',
    head: '"Rolle"',
    toText: (tn: TeilnehmerIn) => `"${getRoleName(tn.role)}"`,
  },
  level: {
    slug: 'level',
    title: 'Stufe',
    head: '"Stufe"',
    toText: (tn: TeilnehmerIn) => `"${getLevelWithNone(tn.level).singular}"`,
  },
  state: {
    slug: 'state',
    title: 'Status',
    head: '"Status"',
    toText: (tn: TeilnehmerIn) => `"${getState(tn.state).name}"`,
  },
  lateRegistration: {
    slug: 'lateRegistration',
    title: 'Buchungsart',
    head: '"Buchungsart"',
    toText: (tn: TeilnehmerIn) => {
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
    toText: (tn: TeilnehmerIn) => {
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
    toText: (tn: TeilnehmerIn) =>
      `"${moment(tn.birthDate).tz('Europe/Berlin').format('DD.MM.YYYY')}"`,
  },
  gender: {
    slug: 'gender',
    title: 'Geschlecht',
    head: '"Geschlecht"',
    toText: (tn: TeilnehmerIn) => `"${getGender(tn.gender).name}"`,
  },
  email: {
    slug: 'email',
    title: 'E-Mail',
    head: '"E-Mail"',
    toText: (tn: TeilnehmerIn) => `"${tn.email}"`,
  },
  phoneNumber: {
    slug: 'phoneNumber',
    title: 'Telefonnummer',
    head: '"Telefonnummer"',
    toText: (tn: TeilnehmerIn) => `"${tn.phoneNumber || ''}"`,
  },
  address: {
    slug: 'address',
    title: 'Adresse',
    head: '"Straße";"Postleitzahl";"Ort"',
    toText: (tn: TeilnehmerIn) => {
      return `"${tn.address.street}";"${tn.address.zipCode}";"${tn.address.city}"`;
    },
  },
  eatingBehaviour: {
    slug: 'eatingBehaviour',
    title: 'Essverhalten',
    head: '"Essverhalten"',
    toText: (tn: TeilnehmerIn) =>
      `"${getEatingBehaviour(tn.food.eatingBehaviour).name}"`,
  },
  intolerances: {
    slug: 'intolerances',
    title: 'Unverträglichkeiten',
    head: '"Unverträglichkeiten"',
    toText: (tn: TeilnehmerIn) => `"${tn.food.intolerances || ''}"`,
  },
  tetanus: {
    slug: 'tetanus',
    title: 'Tetanus-Impfung',
    head: '"Tetanus-Impfung"',
    toText: (tn: TeilnehmerIn) => (tn.vaccinations.tetanus ? '"Ja"' : '"Nein"'),
  },
  covid: {
    slug: 'covid',
    title: 'Corona-Impfung',
    head: '"Corona-Impfung"',
    toText: (tn: TeilnehmerIn) =>
      `"${getCovidVaccinationState(tn.vaccinations.covid).name}"`,
  },
  fsme: {
    slug: 'fsme',
    title: 'FSME-Impfung',
    head: '"FSME-Impfung"',
    toText: (tn: TeilnehmerIn) => (tn.vaccinations.fsme ? '"Ja"' : '"Nein"'),
  },
  diseases: {
    slug: 'diseases',
    title: 'Krankheiten',
    head: '"Krankheiten"',
    toText: (tn: TeilnehmerIn) => `"${tn.diseases || ''}"`,
  },
  healthInsurance: {
    slug: 'healthInsurance',
    title: 'Krankenversicherung',
    head: '"Krankenversicherung"',
    toText: (tn: TeilnehmerIn) =>
      `"${getInsuranceType(tn.healthInsurance).name}"`,
  },
  swimmer: {
    slug: 'swimmer',
    title: 'Schwimmer:in',
    head: '"Schwimmer:in"',
    toText: (tn: TeilnehmerIn) => (tn.swimmer ? '"Ja"' : '"Nein"'),
  },
  firstContact: {
    slug: 'firstContact',
    title: '1. Notfallkontakt',
    head: '"Notfallkontakt"',
    toText: (tn: TeilnehmerIn) => {
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
    toText: (tn: TeilnehmerIn) => {
      return Object.values(tn.presence)
        .map(present => (present ? '"Ja"' : '"Nein"'))
        .join(';');
    },
  },
  presence: {
    slug: 'presence',
    title: 'Anwesenheit in Tagen',
    head: '"Anwesenheit (Tage)"',
    toText: (tn: TeilnehmerIn) => {
      return `"${
        Object.values(tn.presence).filter(present => present).length
      }"`;
    },
  },
  location: {
    slug: 'location',
    title: 'Ort',
    head: 'Ort',
    toText: (tn: TeilnehmerIn) => {
      return `"${getLocation(tn.location).name}"`;
    },
  },
  comments: {
    slug: 'comments',
    title: 'Anmerkungen',
    head: '"Anmerkungen"',
    toText: (tn: TeilnehmerIn) => `"${tn.comments || ''}"`,
  },
  juleica: {
    slug: 'juleica',
    title: 'Juleica',
    head: '"Juleica";"Juleica Ablauf"',
    toText: (tn: TeilnehmerIn) => {
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
    toText: (tn: TeilnehmerIn) => {
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
    toText: (tn: TeilnehmerIn) => {
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
    toText: (tn: TeilnehmerIn) => (tn.receivedRegistration ? '"Ja"' : '"Nein"'),
  },
  photoPermission: {
    slug: 'photoPermission',
    title: 'Fotoerlaubnis',
    head: '"Fotoerlaubnis"',
    toText: (tn: TeilnehmerIn) =>
      `"${getPhotopermissionState(tn.receivedPhotoPermission).name}"`,
  },
  leaderInfo: {
    slug: 'leaderInfo',
    title: 'Leitendeninfos',
    head: '"Leitendeninfos"',
    toText: (tn: TeilnehmerIn) => (tn.receivedLeaderInfo ? '"Ja"' : '"Nein"'),
  },
};

const BevoFields = {
  checked2d2e: {
    slug: 'checked2d2e',
    title: 'Einsicht 2d/2e',
    head: '"Einsicht 2d/2e"',
    toText: (tn: TeilnehmerIn) => (tn.review.course ? '"Ja"' : '"Nein"'),
  },
  checkedClearance: {
    slug: 'checkedClearance',
    title: 'Einsicht UB',
    head: '"Einsicht UB"',
    toText: (tn: TeilnehmerIn) => (tn.review.clearance ? '"Ja"' : '"Nein"'),
  },
  checkedJuleica: {
    slug: 'checkedJuleica',
    title: 'Einsicht Juleica',
    head: '"Einsicht Juleica"',
    toText: (tn: TeilnehmerIn) => (tn.review.juleica ? '"Ja"' : '"Nein"'),
  },
};

const generateCSVLine = (tn: TeilnehmerIn, fields: string[]): string => {
  return fields
    .map(field => {
      return {...Fields, ...BevoFields}[field]!.toText(tn);
    })
    .join(';');
};

const generateCSV = (tns: TeilnehmerIn[], fields: string[]): string => {
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
