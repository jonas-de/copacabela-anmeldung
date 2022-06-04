import { TeilnehmerIn } from '../payload-types';

export interface Wording {
  slug: string,
  name: string
}

export type EatingBehaviour = Wording
export type Gender = Wording
export type RegistrationState = Wording & { color: string }
export type InsuranceType = Wording
export type CovidVaccinationState = Wording
export type Location = Wording & { color: string }

export type EatingText = "vegetarian" | "vegan" | "meat"

const EatingBehavioursObject: {
  vegetarian: EatingBehaviour,
  vegan: EatingBehaviour,
  meat: EatingBehaviour
} = {
  vegetarian: {
    slug: "vegetarian",
    name: "vegetarisch"
  },
  vegan: {
    slug: "vegan",
    name: "vegan"
  },
  meat: {
    slug: "meat",
    name: "Fleischesser:in"
  },
}

const EatingBehaviours: EatingBehaviour[] = Object.values(EatingBehavioursObject)


export type GendersText = "female" | "male" | "divers"

const GendersObject: { female: Gender, male: Gender, divers: Gender } = {
  female: {
    slug: "female",
    name: "weiblich"
  },
  male: {
    slug: "male",
    name: "männlich"
  },
  divers: {
    slug: "divers",
    name: "divers"
  },
}

const Genders: Gender[] = Object.values(GendersObject)


export type StateText = "new" | "confirmed" | "cancelled"


const RegistrationStatesObject: {
  new: RegistrationState,
  confirmed: RegistrationState,
  cancelled: RegistrationState
} = {
  new: {
    slug: "new",
    name: "Neu",
    color: "blue"
  },
  confirmed: {
    slug: "confirmed",
    name: "Bestätigt",
    color: "green"
  },
  cancelled: {
    slug: "cancelled",
    name: "Storniert",
    color: "red"
  }
}

const RegistrationStates: RegistrationState[] = Object.values(RegistrationStatesObject)

const compareRegistrationStates = (a: TeilnehmerIn, b: TeilnehmerIn) => {
  const Compare = {
    new: 0,
    confirmed: 1,
    cancelled: 2
  }
  const compared = Compare[a.state] - Compare[b.state]
  if (compared === 0) {
    return 0
  }
  return compared < 0 ? -1 : 1
}

export type InsuranceText = "gkv" | "pkv"

const InsuranceTypesObject: { gkv: InsuranceType, pkv: InsuranceType } = {
  gkv: {
    slug: "gkv",
    name: "Gesetzlich"
  },
  pkv: {
    slug: "pkv",
    name: "Privat"
  }
}

const InsuranceTypes: InsuranceType[] = Object.values(InsuranceTypesObject)


export type CovidText = "na" | "no" | "yes" | "boostered"

const CovidVaccinationStatesObject: {
  na: CovidVaccinationState,
  no: CovidVaccinationState,
  yes: CovidVaccinationState,
  boostered: CovidVaccinationState
} = {
  na: {
    slug: "na",
    name: "Keine Angabe"
  },
  no: {
    slug: "no",
    name: "Ungeimpft"
  },
  yes: {
    slug: "yes",
    name: "Geimpft"
  },
  boostered: {
    slug: "boostered",
    name: "Geboostert"
  }
}

export type LocationText = "home" | "onsite" | "offsite" | "backHome"

const LocationObject: {
  home: Location,
  onsite: Location,
  offsite: Location,
  backHome: Location
} = {
  home: {
    slug: "home",
    name: "Zuhause",
    color: "default"
  },
  onsite: {
    slug: "onsite",
    name: "Vor Ort",
    color: "success"
  },
  offsite: {
    slug: "offsite",
    name: "Offsite",
    color: "warning"
  },
  backHome: {
    slug: "backHome",
    name: "Abgereist",
    color: "error",
  }
}


export type PhotoPermissionText = "no" | "yes" | "never"

const PhotoPermissionStatesObject: { no: Wording, yes: Wording, never: Wording } = {
  no: {
    slug: "no",
    name: "Nein"
  },
  yes: {
    slug: "yes",
    name: "Ja"
  },
  never: {
    slug: "never",
    name: "Gibt keine ab"
  }
}

const PhotoPermissionStates: Wording[] = Object.values(PhotoPermissionStatesObject)


const CovidVaccinationStates: CovidVaccinationState[] = Object.values(CovidVaccinationStatesObject)


const getState = (slug: string): RegistrationState => {
  return RegistrationStatesObject[slug as StateText]
}

const getEatingBehaviour = (slug: string): EatingBehaviour => {
  return EatingBehavioursObject[slug as EatingText]
}

const getGender = (slug: string): Gender => {
  return GendersObject[slug as GendersText]
}

const getInsuranceType = (slug: string): InsuranceType => {
  return InsuranceTypesObject[slug as InsuranceText]
}

const getCovidVaccinationState = (slug: string): CovidVaccinationState => {
  return CovidVaccinationStatesObject[slug as CovidText]
}

const getPhotopermissionState = (slug: string): Wording => {
  return PhotoPermissionStatesObject[slug as PhotoPermissionText]
}

const getLocation = (slug: string): Wording => {
  return LocationObject[slug as LocationText]
}

export { EatingBehaviours, Genders, RegistrationStates, InsuranceTypes, CovidVaccinationStates,
  PhotoPermissionStates, LocationObject,
  getState, getEatingBehaviour, getGender, getInsuranceType, getCovidVaccinationState,
  getPhotopermissionState, compareRegistrationStates, getLocation
}
