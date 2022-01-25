import moment, { Moment } from 'moment';
import { Wording } from './Wording';

const getAge = (birthDate: Moment) => {
  const belaStart = moment("04.06.2022", "DD.MM.YYYY")
  return belaStart.diff(birthDate, "years")
}

const hasLegalAge = (birthDate: Moment | undefined) => {
  if (birthDate === undefined) {
    return false
  }
  return getAge(birthDate) >= 18
}

export type ParticipantRole = Wording
const ParticipantRoles: ParticipantRole[] = [
  {
    slug: "participant",
    name: "Teilnehmer:in"
  },
  {
    slug: "leader",
    name: "Leiter:in"
  },
  {
    slug: "helper",
    name: "Helfer:in"
  }
]

export { getAge, hasLegalAge, ParticipantRoles }