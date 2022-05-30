import { TeilnehmendenverwalterIn, TeilnehmerIn } from '../payload-types';
import { compareRoles } from './Persons';

export interface Level {
  slug: string,
  singular: string,
  plural: string,
  color: string,
  image: string
}
export type LevelText = "woelflinge" | "jupfis" | "pfadis" | "rover"
export type AccessLevelText = LevelText | "all" | "kitchen" | "strandkorb" | "bevo"
export type Levels = { woelflinge: Level, jupfis: Level, pfadis: Level, rover: Level }
const LevelsObject: Levels = {
  woelflinge: {
    slug: "woelflinge",
    singular: "Wölfling",
    plural: "Wölflinge",
    color: "orange",
    image: "Dpsg.png"
  },
  jupfis: {
    slug: "jupfis",
    singular: "Jupfi",
    plural: "Jupfis",
    color: "geekblue",
    image: "Dpsg.png"
  },
  pfadis: {
    slug: "pfadis",
    singular: "Pfadi",
    plural: "Pfadis",
    color: "green",
    image: "Dpsg.png"
  },
  rover: {
    slug: "rover",
    singular: "Rover:in",
    plural: "Rover:innen",
    color: "red",
    image: "Dpsg.png"
  }
}

const Levels: Level[] = Object.values(LevelsObject)

const AccessAll: Level = {
  slug: "all",
  singular: "Alle",
  plural: "Alle",
  color: "cyan",
  image: "Dpsg.png"
}

const AccessKitchen: Level = {
  slug: "kitchen",
  singular: "Küche",
  plural: "Küche",
  color: "purple",
  image: "Dpsg.png"
}

const AccessStrandkorb: Level = {
  slug: "strandkorb",
  singular: "Strandkorb",
  plural: "Strandkorb",
  color: "magenta",
  image: "Dpsg.png"
}


const AccessLevels: Level[] = Levels
  .concat(AccessAll)
  .concat(AccessKitchen)
  .concat(AccessStrandkorb)

const None: Level = {
  slug: "none",
  singular: "Keine",
  plural: "Keine",
  color: "grey",
  image: "Dpsg.png"
}

const LevelsWithNone: Level[] = Levels.concat(None)

const isValidLevel = (level: string): boolean => {
  return Object.keys(LevelsObject).includes(level)
}

const isValidAccessLevel = (level: string): boolean => {
  return level === "all" || level === "kitchen" || level === "strandkorb" || isValidLevel(level)
}

const isValidLevelWithNone = (level: string): boolean => {
  return level === "none" || isValidLevel(level)
}

const getLevel = (slug: string): Level => {
  return LevelsObject[slug as LevelText]
}

const getAccessLevel = (slug: string): Level => {
  if (slug === "all") {
    return AccessAll
  }
  if (slug === "kitchen") {
    return AccessKitchen
  }

  if (slug === "strandkorb") {
    return AccessStrandkorb
  }
  return getLevel(slug)
}

const getAccessLevelForHeader = (user: TeilnehmendenverwalterIn): AccessLevelText => {
  if (user.tribe === "1312" && user.level === "all") {
    return "bevo"
  }
  return user.level
}

const getLevelWithNone = (slug: string): Level => {
  if (slug === "none") {
    return None
  }
  return getLevel(slug)
}

const compareLevelsWithRole = (a: TeilnehmerIn, b: TeilnehmerIn): number => {
  const roles = compareRoles(a, b)
  if (roles !== 0) {
    return roles
  }
  const Compare = {
    woelflinge: 0,
    jupfis: 1,
    pfadis: 2,
    rover: 3,
    none: 4
  }
  const compared = Compare[a.level] - Compare[b.level]
  if (compared === 0) {
    return 0
  }
  return compared < 0 ? -1 : 1
}

export default Levels
export { AccessLevels, LevelsWithNone, AccessKitchen, AccessStrandkorb, AccessAll, isValidLevel, isValidAccessLevel, isValidLevelWithNone,
  getLevel, getAccessLevel, getLevelWithNone, compareLevelsWithRole, getAccessLevelForHeader
}
