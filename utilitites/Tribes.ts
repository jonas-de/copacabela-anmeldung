export interface Tribe {
  name: string,
  number: number,
  image: string
}

/**
 * List of all tribes in Muenchen-Isar
 */
const Tribes: Tribe[] = [
  {
    name: "Heilig Engel",
    number: 131202,
    image: "Dpsg.png"
  },
  {
    name: "St. Severin",
    number: 131203,
    image: "Dpsg.png"
  },
  {
    name: "Maria Hilf",
    number: 131204,
    image: "Dpsg.png"
  },
  {
    name: "Pater Rupert Mayer",
    number: 131206,
    image: "Dpsg.png"
  },
  {
    name: "Maximilian Kolbe",
    number: 131207,
    image: "Dpsg.png"
  },
  {
    name: "St. Ansgar",
    number: 131208,
    image: "Dpsg.png"
  },
  {
    name: "Frieden Christi",
    number: 131209,
    image: "Dpsg.png"
  },
  {
    name: "Swapingo",
    number: 131210,
    image: "Swapingo.png"
  },
  {
    name: "St. Anna",
    number: 131212,
    image: "Dpsg.png"
  },
  {
    name: "St. Canisius",
    number: 131213,
    image: "Dpsg.png"
  },
  {
    name: "Hl. Kreuz",
    number: 131214,
    image: "Dpsg.png"
  },
]

const TribesWithDistrict: Tribe[] = Tribes.concat({
  name: "Bezirk",
  number: 1312,
  image: "Dpsg.png"
})

/**
 * Checks if the given number correspondents to a valid tribe from Muenchen-Isar
 * @param tribe number of a tribe to check
 */
const isValidTribe = (tribe: number) => {
  return tribe >= 131202 && tribe <= 131214 && tribe != 131205 && tribe != 131211
}

const isValidTribeOrDistrict = (tribe: number) => {
  return tribe == 1312 || isValidTribe(tribe)
}

const getTribeForNumber = (tribe: number): Tribe => {
  // @ts-ignore
  return  TribesWithDistrict.find(t => t.number == tribe)
}

export default Tribes
export { TribesWithDistrict, isValidTribe, isValidTribeOrDistrict, getTribeForNumber }
