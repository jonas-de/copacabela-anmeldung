import { TeilnehmerIn } from '../payload-types';
import { getRoleName } from './Persons';
import { getLevelWithNone } from './Levels';
import { getGender, getState } from './Wording';
import { getTribeForNumber } from './Tribes';

const attributes = ["firstName", "lastName", "role", "level", "state", "birthDate", "gender", "email", ]

const generateCSVLine = (tn: TeilnehmerIn): string => {
  const line = [tn.firstName, tn.lastName, tn.orderId]

  line.push(getTribeForNumber(Number(tn.tribe)).name)
  line.push(getRoleName(tn.role))
  line.push(getLevelWithNone(tn.level).singular)
  line.push(getState(tn.state).name)
  line.push(tn.birthDate)
  line.push(getGender(tn.gender).name)
  line.push(tn.email)
  // Presence
  Object.values(tn.presence).forEach((present) => {
    line.push(present ? "Ja" : "Nein")
  })
  line.push(Object.values(tn.presence).filter((present) => present).length)

  // @ts-ignore
  if (tn.lateRegistration !== undefined) {
    // @ts-ignore
    line.push(tn.lateRegistration ? "Nachmeldung" : "Normal")
  } else {
    line.push("Normal")
  }

  if (tn.role !== "participant") {
    if (tn.juleica) {
      line.push(tn.juleica.number ?? "")
      line.push(tn.juleica.terminates ?? "")
    } else {
      line.push("")
      line.push("")
    }
    if (tn.clearance) {
      line.push(tn.clearance.idNumber ?? "")
      if (tn.clearance.nami !== undefined) {
        line.push(tn.clearance.nami ? "In NaMi" : "")
      } else {
        line.push("")
      }
    }
  } else {
    line.push("")
    line.push("")
    line.push("")
    line.push("")
  }
  return line.map((value) => `"${value}"`).join(";")
}

const generateCSV = (tns: TeilnehmerIn[]): string => {
  const head = [
    "Vorname",
    "Nachname",
    "Bestellnummer",
    "Stamm",
    "Rolle",
    "Stufe",
    "Status",
    "Geburtsdatum",
    "Geschlecht",
    "E-Mail",
    "04.",
    "05.",
    "06.",
    "07.",
    "08.",
    "09.",
    "10.",
    "11.",
    "Anwesenheit",
    "Buchungsart",
    "Juleica",
    "Juleica Ablauf",
    "Unbedenklichkeits-ID",
    "NaMi",
  ]

  const headLine = head.join(";")
  const tnLines = tns.map((tn) => generateCSVLine(tn))
  console.log( [headLine, ...tnLines].join("\n"));
  return [headLine, ...tnLines].join("\n")
}

export default generateCSV
