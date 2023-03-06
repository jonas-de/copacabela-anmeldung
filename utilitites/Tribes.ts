export type TribeNumber =
  | 1312
  | 131202
  | 131203
  | 131204
  | 131206
  | 131207
  | 131208
  | 131209
  | 131210
  | 131212
  | 131213
  | 131214;

export interface Tribe {
  name: string;
  number: TribeNumber;
  image: string;
}

const TribesObject: {[key: string]: Tribe} = {
  131202: {
    name: 'Heilig Engel',
    number: 131202,
    image: 'Dpsg.png',
  },
  131203: {
    name: 'St. Severin',
    number: 131203,
    image: 'Dpsg.png',
  },
  131204: {
    name: 'Maria Hilf',
    number: 131204,
    image: 'Dpsg.png',
  },
  131206: {
    name: 'Pater Rupert Mayer',
    number: 131206,
    image: 'PRM.png',
  },
  131207: {
    name: 'Maximilian Kolbe',
    number: 131207,
    image: 'Maxko.png',
  },
  131208: {
    name: 'St. Ansgar',
    number: 131208,
    image: 'Ansgar.png',
  },
  131209: {
    name: 'Frieden Christi',
    number: 131209,
    image: 'FC.png',
  },
  131210: {
    name: 'Swapingo',
    number: 131210,
    image: 'Swapingo.png',
  },
  131212: {
    name: 'St. Anna',
    number: 131212,
    image: 'Dpsg.png',
  },
  131213: {
    name: 'St. Canisius',
    number: 131213,
    image: 'Canisius.png',
  },
};

const District: Tribe = {
  name: 'Bezirk',
  number: 1312,
  image: 'Bezirkslogo.jpg',
};

const Tribes: Tribe[] = Object.values(TribesObject);

const TribesWithDistrict: Tribe[] = Tribes.concat(District);

const getTribeForNumber = (tribe: number): Tribe => {
  if (tribe === 1312) {
    return District;
  }
  return TribesObject[String(tribe)];
};

export {TribesWithDistrict, District, getTribeForNumber};
