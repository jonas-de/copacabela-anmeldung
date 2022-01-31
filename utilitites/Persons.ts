import moment, { Moment } from 'moment';
import { Wording } from './Wording';
import { TeilnehmerIn } from '../payload-types';

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
export type ParticipantRoleText = "participant" | "leader" | "helper"
export type ParticipantRole = Wording

const ParticipantRolesObject: {
  participant: ParticipantRole,
  leader: ParticipantRole,
  helper: ParticipantRole
} = {
  participant: {
    slug: "participant",
    name: "Teilnehmer:in"
  },
  leader: {
    slug: "leader",
    name: "Leiter:in"
  },
  helper: {
    slug: "helper",
    name: "Helfer:in"
  }
}

const ParticipantRoles: ParticipantRole[] = Object.values(ParticipantRolesObject)

const getRoleName = (slug: string): string => ParticipantRolesObject[slug as ParticipantRoleText].name

const compareRoles = (a: TeilnehmerIn, b: TeilnehmerIn): number => {
  const Compare = {
    participant: 0,
    leader: 1,
    helper: 2
  }
  if (a.role === b.role) {
    return 0
  }
  return Compare[a.role] < Compare[b.role] ? -1 : 1
}

export { getAge, hasLegalAge, getRoleName, compareRoles, ParticipantRoles }
