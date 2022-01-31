import payload from 'payload';
import { TeilnehmendenverwalterIn, TeilnehmerIn } from '../payload-types';
import Levels from '../utilitites/Levels';
import Tribes from '../utilitites/Tribes';
import { CovidVaccinationStates, EatingBehaviours, InsuranceTypes } from '../utilitites/Wording';

// Load Chance
const chance = require('chance');

// Instantiate Chance so it can be used
const Chance = new chance();

// BeVo
payload.create<TeilnehmendenverwalterIn>({
  collection: "participantscontroller",
  data: {
    email: "bevo@dpsg1312.de",
    name: "Bezirks Vorstand",
    password: "1234",
    tribe: "1312",
    level: "all",
  },
  disableVerificationEmail: true
}).then(bevo => console.log(bevo))

// Referenten
Levels.forEach(level => {
  payload.create<TeilnehmendenverwalterIn>({
    collection: "participantscontroller",
    data: {
      email: `${level.plural}@dpsg1312.de`,
      name: "Bezirks " + level.plural,
      password: "1234",
      tribe: "1312",
      level: level.slug,
    }
  }).then()
})

// StaVos
Tribes.forEach(tribe => {
  payload.create<TeilnehmendenverwalterIn>({
    collection: "participantscontroller",
    data: {
      email: `${tribe.number}@dpsg1312.de`,
      name: "Stavo " + tribe.name,
      password: "1234",
      tribe: tribe.number,
      level: "all",
    },
    disableVerificationEmail: true
  }).then()
})

// LeiterInnen
Tribes.forEach(tribe => {
  Levels.forEach(level => {
    payload.create<TeilnehmendenverwalterIn>({
      collection: "participantscontroller",
      data: {
        email: `${level.slug}-${tribe.number}@dpsg1312.de`,
        name: tribe.name + level.plural,
        password: "1234",
        tribe: tribe.number,
        level: level.slug,
      },
      disableVerificationEmail: true
    }).then()
  })
})

// TeilnehmerInnen
for (let i = 0; i < 100; i = i+1) {
  payload.create<TeilnehmerIn>({
    collection: "participants",
    data: {
      role: "participant",
      gender: Chance.gender({ extraGenders: ['divers'] }).toLowerCase(),
      firstName: Chance.first(),
      lastName: Chance.last(),
      tribe: Tribes[Chance.natural({ min: 0, max: Tribes.length - 1 })].number,
      level: Levels[Chance.natural({ min: 0, max: Levels.length - 1 })].slug,
      birthDate: Chance.date(),
      swimmer: Chance.bool(),
      state: "new",
      email: Chance.email(),
      phoneNumber: Chance.phone(),
      address: {
        street: Chance.street(),
        zipCode: 80802,
        city: Chance.city()
      },
      food: {
        eatingBehaviour: EatingBehaviours[Chance.natural({ min: 0, max: EatingBehaviours.length - 1 })].slug,
        intolerances: Chance.paragraph({ sentences: 1 })
      },
      vaccinations: {
        tetanus: Chance.bool(),
        fsme: Chance.bool(),
        covid: CovidVaccinationStates[Chance.natural({ min: 0, max: CovidVaccinationStates.length - 1 })].slug
      },
      diseases: Chance.paragraph({ sentences: 1 }),
      healthInsurance: InsuranceTypes[Chance.bool() ? 0 : 1].slug


    }
  }).then()
}
