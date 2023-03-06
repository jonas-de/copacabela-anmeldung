export interface Level {
  slug: string;
  singular: string;
  plural: string;
  color: string;
  image: string;
}
export type LevelText = 'woelflinge' | 'jupfis' | 'pfadis' | 'rover';
export type AccessLevelText =
  | LevelText
  | 'all'
  | 'kitchen'
  | 'strandkorb'
  | 'bevo';
export type Levels = {
  woelflinge: Level;
  jupfis: Level;
  pfadis: Level;
  rover: Level;
};
const LevelsObject: Levels = {
  woelflinge: {
    slug: 'woelflinge',
    singular: 'Wölfling',
    plural: 'Wölflinge',
    color: 'orange',
    image: 'Dpsg.png',
  },
  jupfis: {
    slug: 'jupfis',
    singular: 'Jupfi',
    plural: 'Jupfis',
    color: 'geekblue',
    image: 'Dpsg.png',
  },
  pfadis: {
    slug: 'pfadis',
    singular: 'Pfadi',
    plural: 'Pfadis',
    color: 'green',
    image: 'Dpsg.png',
  },
  rover: {
    slug: 'rover',
    singular: 'Rover:in',
    plural: 'Rover:innen',
    color: 'red',
    image: 'Dpsg.png',
  },
};

const Levels: Level[] = Object.values(LevelsObject);

const None: Level = {
  slug: 'none',
  singular: 'Keine',
  plural: 'Keine',
  color: 'grey',
  image: 'Dpsg.png',
};

const LevelsWithNone: Level[] = Levels.concat(None);

const getLevel = (slug: string): Level => {
  return LevelsObject[slug as LevelText];
};

const getLevelWithNone = (slug: string): Level => {
  if (slug === 'none') {
    return None;
  }
  return getLevel(slug);
};

export {LevelsWithNone, getLevel, getLevelWithNone};
