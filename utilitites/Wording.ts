export interface Wording {
  slug: string,
  name: string
}

export type Food = Wording
export type Gender = Wording
export type RegistrationState = Wording & { color: string }
export type InsuranceType = Wording
export type CovidVaccinationState = Wording

const EatingBehaviour: Food[] = [
  {
    slug: "vegetarian",
    name: "vegetarisch"
  },
  {
    slug: "vegan",
    name: "vegan"
  },
  {
    slug: "meat",
    name: "Fleischesser:in"
  },
]

const Genders: Gender[] = [
  {
    slug: "female",
    name: "weiblich"
  },
  {
    slug: "male",
    name: "männlich"
  },
  {
    slug: "divers",
    name: "divers"
  },
]

const RegistrationStates: RegistrationState[] = [
  {
    slug: "new",
    name: "Neu",
    color: "blue"
  },
  {
    slug: "confirmed",
    name: "Bestätigt",
    color: "green"
  },
  {
    slug: "cancelled",
    name: "Storniert",
    color: "red"
  }
]

const InsuranceTypes: InsuranceType[] = [
  {
    slug: "gkv",
    name: "Gesetzlich"
  },
  {
    slug: "pkv",
    name: "Privat"
  }
]

const CovidVaccinationStates: CovidVaccinationState[] = [
  {
    slug: "na",
    name: "Keine Angabe"
  },
  {
    slug: "no",
    name: "Ungeimpft"
  },
  {
    slug: "yes",
    name: "Geimpft"
  },
  {
    slug: "boostered",
    name: "Geboostert"
  }
]

const getStateForSlug = (slug: string): RegistrationState => {
  // @ts-ignore
  return RegistrationStates.find(state => state.slug == slug)
}

export { EatingBehaviour, Genders, RegistrationStates, InsuranceTypes, CovidVaccinationStates, getStateForSlug }
