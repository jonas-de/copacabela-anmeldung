export interface Wording {
  slug: string,
  name: string
}

export type Food = Wording
export type Gender = Wording
export type RegistrationState = Wording & { color: string }

const EatingBehaviour: Food[] = [
  {
    slug: "vegan",
    name: "vegan"
  },
  {
    slug: "vegetarian",
    name: "vegetarisch"
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

const getStateForSlug = (slug: string): RegistrationState => {
  // @ts-ignore
  return RegistrationStates.find(state => state.slug == slug)
}

export { EatingBehaviour, Genders, RegistrationStates, getStateForSlug }
