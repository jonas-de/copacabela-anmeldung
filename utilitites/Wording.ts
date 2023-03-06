export interface Wording {
  slug: string;
  name: string;
}

export type Gender = Wording;
export type RegistrationState = Wording & {color: string};
export type InsuranceType = Wording;

const GendersObject: {female: Gender; male: Gender; divers: Gender} = {
  female: {
    slug: 'female',
    name: 'weiblich',
  },
  male: {
    slug: 'male',
    name: 'männlich',
  },
  divers: {
    slug: 'divers',
    name: 'divers',
  },
};

const Genders: Gender[] = Object.values(GendersObject);

export type RegistrationStateText = 'new' | 'confirmed' | 'cancelled';

const RegistrationStatesObject: {
  new: RegistrationState;
  confirmed: RegistrationState;
  cancelled: RegistrationState;
} = {
  new: {
    slug: 'new',
    name: 'Neu',
    color: 'blue',
  },
  confirmed: {
    slug: 'confirmed',
    name: 'Bestätigt',
    color: 'green',
  },
  cancelled: {
    slug: 'cancelled',
    name: 'Storniert',
    color: 'red',
  },
};

const getState = (slug: string): RegistrationState => {
  return RegistrationStatesObject[slug as RegistrationStateText];
};

const RegistrationStates: RegistrationState[] = Object.values(
  RegistrationStatesObject
);

export type InsuranceText = 'gkv' | 'pkv';

const InsuranceTypesObject: {gkv: InsuranceType; pkv: InsuranceType} = {
  gkv: {
    slug: 'gkv',
    name: 'Gesetzlich',
  },
  pkv: {
    slug: 'pkv',
    name: 'Privat',
  },
};

const InsuranceTypes: InsuranceType[] = Object.values(InsuranceTypesObject);

const getInsuranceType = (slug: string): InsuranceType => {
  return InsuranceTypesObject[slug as InsuranceText];
};

export {
  Genders,
  RegistrationStates,
  InsuranceTypes,
  getInsuranceType,
  getState,
};
