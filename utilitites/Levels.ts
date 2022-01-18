export interface Level {
  slug: string,
  singular: string,
  plural: string,
  color: string
}

const Levels: Level[] = [
  {
    slug: "woelflinge",
    singular: "Wölfling",
    plural: "Wölflinge",
    color: "orange"
  },
  {
    slug: "jupfis",
    singular: "Jupfi",
    plural: "Jupfis",
    color: "geekblue"
  },
  {
    slug: "pfadis",
    singular: "Pfadi",
    plural: "Pfadis",
    color: "green"
  },
  {
    slug: "rover",
    singular: "Rover:in",
    plural: "Rover:innen",
    color: "red"
  }
]

const AccessLevels: Level[] = Levels.concat({
  slug: "all",
  singular: "Alle",
  plural: "Alle",
  color: "grey"
})

const isValidLevel = (level: string): boolean => {
  return Levels.map(level => level.slug).includes(level)
}

const isValidAccessLevel = (level: string): boolean => {
  return AccessLevels.map(level => level.slug).includes(level)
}

const getLevelForSlug = (slug: string): Level => {
  // @ts-ignore
  return Levels.find(level => level.slug == slug)
}

const getAccessLevelForSlug = (slug: string): Level => {
  // @ts-ignore
  return AccessLevels.find(level => level.slug == slug)
}

export default Levels
export { AccessLevels, isValidLevel, getLevelForSlug, isValidAccessLevel, getAccessLevelForSlug }
