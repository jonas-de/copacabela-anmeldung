import { AfterChangeHook } from 'payload/dist/collections/config/types';
import { TeilnehmerIn } from '../payload-types';
import fs from 'fs';
import { PDFDocument } from 'pdf-lib';
import moment, { Moment } from 'moment';
import { hasLegalAge } from './Persons';
import payload from 'payload';
import { getCovidVaccinationState, getGender } from './Wording';
import { getTribeForNumber } from './Tribes';
import { getLevelWithNone } from './Levels';

const mustache = require("mustache")

const generatePhotoPermission = async (name: string, birthDate: Moment): Promise<Uint8Array | null> => {
  try {
    const file = await fs.promises.readFile(`documents/photopermission/Fotoerlaubnis-CopacaBeLa-${hasLegalAge(birthDate) ? "ab18" : "u18"}.pdf`)
    const pdfDoc = await PDFDocument.load(file)
    const form = pdfDoc.getForm()
    const nameField = form.getTextField("Name")
    const birthDateField = form.getTextField("Geburtstag")
    nameField.setText(name)
    birthDateField.setText(birthDate.format("DD.MM.YYYY"))
    form.flatten()
    return await pdfDoc.save()
  } catch (error) {
    console.error(error)
    return null
  }
}

const generateRegistration = async (particpant: TeilnehmerIn): Promise<Uint8Array | null> => {
  try {

    // @ts-ignore
    const createdAt = particpant.createdAt ? moment(particpant.createdAt)
      .format("DD.MM.YYYY") : ""
    const data: string = `${createdAt}\t${particpant.orderId}`

    const { street, zipCode, city } = particpant.address
    const addressText = `${street}, ${zipCode} ${city}`

    const levelText = particpant.role === "helper" ? "Helfer:in" :
      `${getLevelWithNone(particpant.level).plural} ${particpant.role === "leader"
        ? "(Leiter:in)" : ""}`

    const contacts: string[] = []
    if (particpant.legalGuardian?.name || particpant.legalGuardian?.phoneNumber) {
      contacts.push(`Erziehungsberechtigte:r ${particpant.legalGuardian.name} ${particpant.legalGuardian.phoneNumber},`)
    }
    const contactList = contacts.concat(particpant.contacts?.map(({ name, phoneNumber}) => `${name} ${phoneNumber}`) || "")
    // const file = await fs.promises.readFile(`documents/registrations/Anmeldebogen-131213.pdf`)
    const file = await fs.promises.readFile(`documents/registrations/Anmeldung-${particpant.tribe}.pdf`)
    const pdfDoc = await PDFDocument.load(file)
    const form = pdfDoc.getForm()
    // Get & set fields
    const dataField = form.getTextField("Daten")
    dataField.setText(data)
    const firstNameField = form.getTextField("Vorname")
    firstNameField.setText(particpant.firstName)
    const lastNameField = form.getTextField("Nachname")
    lastNameField.setText(particpant.lastName)
    const birthDateField = form.getTextField("Geburtsdatum")
    birthDateField.setText(moment(particpant.birthDate).format("DD.MM.YYYY"))
    const genderField = form.getTextField("Geschlecht")
    genderField.setText(getGender(particpant.gender).name)
    const mailField = form.getTextField("EMail")
    mailField.setText(particpant.email)
    const phoneField = form.getTextField("Telefonnummer")
    phoneField.setText(particpant.phoneNumber)
    const addressField = form.getTextField("Adresse")
    addressField.setText(addressText)
    const tribeField = form.getTextField("Stamm")
    tribeField.setText(getTribeForNumber(Number(particpant.tribe)).name)
    const levelField = form.getTextField("Stufe")
    levelField.setText(levelText)
    const intolerancesField = form.getTextField("Lebensmittel")
    intolerancesField.setText(particpant.food.intolerances)
    const foodField = form.getRadioGroup("Essen")
    if (particpant.food.eatingBehaviour === "vegan") {
      foodField.select("vegan")
    } else if (particpant.food.eatingBehaviour === "meat") {
      foodField.select("Fleisch")
    }
    const insuranceField = form.getRadioGroup("Versicherung")
    insuranceField.select(particpant.healthInsurance === "gkv" ? "gesetzlich" : "privat")
    const tetanusField = form.getRadioGroup("Tetanus")
    tetanusField.select(particpant.vaccinations.tetanus ? "ja" : "nein")
    const fsmeField = form.getRadioGroup("FSME")
    fsmeField.select(particpant.vaccinations.fsme ? "ja" : "nein")
    const covidField = form.getTextField("Corona")
    covidField.setText(getCovidVaccinationState(particpant.vaccinations.covid).name)
    const swimmField = form.getRadioGroup("Schwimmt")
    swimmField.select(particpant.swimmer ? "ja" : "nein")
    const diseasesField = form.getTextField("Krankheiten")
    diseasesField.setText(particpant.diseases)
    const contactsField = form.getTextField("Notfallkontakte")
    contactsField.setText(contactList.join("\t"))
    const commentsField = form.getTextField("Anmerkungen")
    commentsField.setText(particpant.comments)

    form.flatten()
    return await pdfDoc.save()
  } catch (error) {
    console.error(error)
    return null
  }
}

const generateLeaderInfo = async (participant: TeilnehmerIn): Promise<Uint8Array | null> => {
  try {
    const file = await fs.promises.readFile("documents/Leitenden-Teilnahmebedingungen.pdf")
    const pdfDoc = await PDFDocument.load(file)
    const form = pdfDoc.getForm()
    // Get & set fields
    const juleicaField = form.getTextField("JuleicaNummer")
    const juleicaDateField = form.getTextField("JuleicaAblaufdatum")
    const idField = form.getTextField("IDNummer")
    const courseField = form.getTextField("2d2eDatum")
    juleicaField.setText(participant.juleica?.number || "")
    juleicaDateField.setText(participant.juleica?.terminates || "")
    idField.setText(participant.clearance?.nami ? "In NaMi eingetragen" : participant.clearance?.idNumber || "")
    courseField.setText(participant.course || "")
    form.flatten()
    return await pdfDoc.save()
  } catch (error) {
    console.error(error)
    return null
  }
}

const generateMailText = (name: string, isLeader: boolean): string => {
  try {
    const mail = fs.readFileSync("mails/Registration.html")
    return mustache.render(mail.toString(), {
      name,
      leader: isLeader ? `
        <li style="list-style-position: inside; margin-left: 5px;">
            Extrablatt für Leiter- und Helfer:innen
        </li>
      ` : "",
      preview: `Hallo ${name}, du hast dich erfolgreich zum CopacaBeLa vom 04.-11.06.2022 angemeldet.`,
      image_link: `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/images/Copacabela-100.png`,
    })
  } catch (error) {
    console.error(error)
    return "Couldn't read mail template"
  }
}

const sendRegistrationMail: AfterChangeHook<TeilnehmerIn> = async ({ doc, req, operation }) => {
  if (operation !== "create" || req.query["mail"] === "false") {
    return
  }

  const attachments: { filename: string, content: any, contentType: string }[] = []

  const registration = await generateRegistration(doc)
  if (registration != null) {
    attachments.push({
      filename: `Anmeldung-${doc.orderId}.pdf`,
      content: registration,
      contentType: "application/pdf"
    })
  }
  const photoPermission = await generatePhotoPermission(`${doc.firstName} ${doc.lastName}`, moment(doc.birthDate))
  if (photoPermission != null) {
    attachments.push({
      filename: `Fotoerlaubnis-${doc.orderId}.pdf`,
      content: photoPermission,
      contentType: "application/pdf"
    })
  }

  if (doc.role !== "participant") {
    const leaderInfo = await generateLeaderInfo(doc)
    if (leaderInfo != null) {
      attachments.push({
        filename: `Leitenden-Teilnahmebedingungen-${doc.orderId}.pdf`,
        content: leaderInfo,
        contentType: "application/pdf"
      })
    }
  }

  const message = {
    from: "CopacaBeLa Anmeldung <anmeldung@copacabela.de>",
    to: doc.email,
    subject: "Deine Anmeldung zum CopacaBeLa",
    html: generateMailText(doc.firstName, doc.role !== "participant"),
    attachments
  }
  await payload.sendEmail(message)
}

export default sendRegistrationMail
