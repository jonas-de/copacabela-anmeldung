import {Participant} from '../payload-types';
import {getInsuranceType, getState} from './Wording';
import {getTribeForNumber} from './Tribes';
import {getLevelWithNone} from './Levels';
import writeXlsxFile, {Schema} from 'write-excel-file';

const writeExcel = async (participants: Participant[]) => {
  const schema: Schema<Participant> = [
    {
      column: 'Vorname',
      type: String,
      value: (participant: Participant) => participant.firstName,
    },
    {
      column: 'Nachname',
      type: String,
      value: (participant: Participant) => participant.lastName,
    },
    {
      column: 'Status',
      type: String,
      value: (participant: Participant) => getState(participant.state).name,
    },
    {
      column: 'Stamm',
      type: String,
      value: (participant: Participant) =>
        getTribeForNumber(Number(participant.tribe)).name,
    },
    {
      column: 'Stufe',
      type: String,
      value: (participant: Participant) =>
        getLevelWithNone(participant.level).plural,
    },
    {
      column: 'Geburtstag',
      type: Date,
      format: 'dd.mm.yyyy',
      value: (participant: Participant) => new Date(participant.birthDate),
    },
    {
      column: 'Geschlecht',
      type: String,
      value: (participant: Participant) => {
        switch (participant.gender) {
          case 'male':
            return 'M';
          case 'female':
            return 'W';
          case 'divers':
            return 'D';
          default:
            return '-';
        }
      },
    },
    {
      column: 'E-Mail',
      type: String,
      value: (participant: Participant) => participant.email,
    },
    {
      column: 'Telefonnummer',
      type: String,
      value: (participant: Participant) => participant.phoneNumber,
    },
    {
      column: 'Straße',
      type: String,
      value: (participant: Participant) => participant.address.street,
    },
    {
      column: 'PLZ',
      type: String,
      value: (participant: Participant) => participant.address.zipCode,
    },
    {
      column: 'Ort',
      type: String,
      value: (participant: Participant) => participant.address.city,
    },
    {
      column: 'Unverträglichkeiten',
      type: String,
      value: (participant: Participant) => participant.food.intolerances,
    },
    {
      column: 'Krankheiten',
      type: String,
      value: (participant: Participant) => participant.diseases,
    },
    {
      column: 'Versicherung',
      type: String,
      value: (participant: Participant) =>
        getInsuranceType(participant.healthInsurance).name,
    },
    {
      column: 'Kommentar',
      type: String,
      value: (participant: Participant) => participant.comments,
    },
    {
      column: 'Juleica',
      type: String,
      value: (participant: Participant) => participant.juleica?.number,
    },
    {
      column: 'Ablaufdatum',
      type: Date,
      format: 'dd.mm.yyyy',
      value: (participant: Participant) => {
        if (participant.juleica?.terminates) {
          return new Date(participant.juleica.terminates);
        }
        return undefined;
      },
    },
    {
      column: 'UB',
      type: String,
      value: (participant: Participant) => {
        if (participant.clearance?.nami) {
          return 'NAMI';
        }
        return participant.clearance?.idNumber;
      },
    },
    {
      column: 'Anmeldezeitpunkt',
      type: Date,
      format: 'dd.mm.yyyy',
      value: (participant: Participant) => new Date(participant.createdAt),
    },
    {
      column: 'Storniert',
      type: Date,
      format: 'dd.mm.yyyy',
      value: (participant: Participant) => {
        if (participant.cancelledAt) {
          return new Date(participant.cancelledAt);
        }
        return undefined;
      },
    },
  ];

  return writeXlsxFile<Participant>(participants, {
    schema,
    stickyColumnsCount: 2,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    buffer: true,
  });
};

export default writeExcel;
