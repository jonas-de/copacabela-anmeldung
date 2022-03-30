import {
  Button,
  Checkbox,
  Col,
  ColProps,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Tooltip
} from 'antd';
import React, { useState } from 'react';
import {
  CovidVaccinationStates,
  EatingBehaviours,
  Genders,
  InsuranceTypes
} from '../utilitites/Wording';
import {
  District,
  getTribeForNumber, TribesWithDistrict
} from '../utilitites/Tribes';
import Levels, { LevelsWithNone } from '../utilitites/Levels';
import { CloseOutlined, EnterOutlined } from '@ant-design/icons';
import { ParticipantRoles } from '../utilitites/Persons';
import { StoreValue } from 'rc-field-form/lib/interface';
import { FormInstance } from 'antd/es/form/Form';
import { ShouldUpdate } from 'rc-field-form/es/Field';
import deDE from 'antd/lib/date-picker/locale/de_DE';
import 'moment/locale/de';
import { Rule } from 'rc-field-form/es/interface';
import Image from 'next/image';
import { dateArray } from '../utilitites/Fees';

const defaultRules: Rule[] = [{ type: "string", required: true }]
const layoutNoLabel: ColProps = { offset: 8, span: 16 }
const defaultWidth: { width: number } = { width: 240}
const doubleWidth: { width: number, maxWidth: string} = { width: 488, maxWidth: "90%" }
const defaultGutter: [number, number] = [8, 24]

const updateOnBirthdateChange: ShouldUpdate = ({ prevValues, curValues }) => {
  console.log(prevValues.birthDate !== curValues.birthDate)
  return prevValues.birthDate !== curValues.birthDate
}

const Personal: React.FC<{ changeBirthDate: VoidFunction }> = ({ changeBirthDate }) => (
  <Form.Item label="Persönliches">
    <Input.Group>
      <Row gutter={defaultGutter}>
        <Col>
          <Form.Item name="firstName" label="Vorname" noStyle required rules={defaultRules}>
            <Input placeholder="Vorname" autoComplete="given-name" style={defaultWidth} />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item name="lastName" label="Nachname" noStyle required rules={defaultRules}>
            <Input placeholder="Nachname" autoComplete="family-name" style={defaultWidth} />
          </Form.Item>
        </Col>
      </Row>
    </Input.Group>
    <Input.Group style={{ marginTop: 24 }}>
      <Row gutter={defaultGutter}>
        <Col>
          <Form.Item name="birthDate" label="Geburtstag" noStyle required  rules={[{ type: "date", required: true }]}>
            <DatePicker
              autoComplete="bday"
              locale={deDE}
              placeholder="Geburtsdatum"
              showToday={false}
              style={defaultWidth}
              picker="date"
              format="DD.MM.YYYY"
              onChange={changeBirthDate}/>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item name="gender" label="Geschlecht" noStyle required rules={[{ required: true }]}>
            <Select placeholder="Geschlecht" style={defaultWidth}>
              { Genders.map(gender => (
                <Select.Option key={gender.slug} value={gender.slug}>{gender.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Input.Group>
  </Form.Item>
)
const Membership: React.FC<{ tribe?: number, role: string}> = ({ tribe, role }) => {

  const TribeSelection: () => React.ReactElement[] = () => {
    if (role === "helper") {
      return [(
        <Select.Option value={District.number} key={District.number}>
          <div style={{ alignItems: "center"}}>
            <Image className="pe-2" src={`/images/${District.image}`} width={35} height={32} alt={District.name}/>
            { District.name }
          </div>
        </Select.Option>
      )]
    }
    if (tribe !== undefined) {
      const tribeObject = getTribeForNumber(tribe)
      return [(
        <Select.Option value={tribeObject.number} key={tribeObject.number}>
          <div style={{ alignItems: "center"}}>
            <Image className="pe-2" src={`/images/${tribeObject.image}`} width={35} height={32} alt={tribeObject.name}/>
            { District.name }
          </div>
        </Select.Option>
      )]
    }
    return TribesWithDistrict
        .map(tribe => (
          <Select.Option key={tribe.number} value={tribe.number}>
            <div>
              <Image className="pe-2" src={`/images/${tribe.image}`} width={35} height={32}
                     alt={tribe.name}/>
              {tribe.name}
            </div>
          </Select.Option>
        ))
  }

  return (
    <Form.Item label="Stamm & Stufe" style={{ marginTop: -4 }} tooltip={ role === "leader" ? "Wähle deinen Stamm und die Stufe, die du leitest." : undefined}>
      <Input.Group>
        <Row gutter={defaultGutter}>
          <Col>
            <Form.Item name="tribe" label="Stamm" noStyle required rules={[{ type: "number", required: true }]}>
              <Select
                placeholder="Wählen..."
                showSearch
                style={defaultWidth}
                disabled={ role === "helper" || tribe !== undefined }
                filterOption={(inputValue, option) => {
                  const tribe = getTribeForNumber(option!.value as number)
                  return tribe.name.startsWith(inputValue) || String(tribe.number).startsWith(inputValue)
                }}
              >
                {TribeSelection()}
              </Select>
            </Form.Item>
          </Col>
          { role !== "helper" && (
            <Col>
              <Form.Item name="level" label="Stufe" noStyle required rules={defaultRules}>
                <Select placeholder="Wählen..." showSearch style={defaultWidth}>
                  { LevelsWithNone.map(level => (
                    <Select.Option key={level.slug} value={level.slug}>
                      { level.singular }
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          )}
        </Row>
      </Input.Group>
    </Form.Item>
  )
}

const Swimmer: React.FC = () => (
  <Form.Item name="swimmer" label="Schwimmer:in" required rules={[{ type: "boolean", required: true }]}>
    <Radio.Group>
      <Radio value={true}>Ja</Radio>
      <Radio value={false}>Nein</Radio>
    </Radio.Group>
  </Form.Item>
)

const Address: React.FC = () => (
  <Form.Item label="Adresse" >
    <Form.Item
      name={["address", "street"]}
      required
      rules={defaultRules}
      messageVariables={{ label: "Straße"}}
    >
      <Input
        placeholder="Straße & Hausnummer"
        autoComplete="street-address"
        style={doubleWidth}
      />
    </Form.Item>
    <Form.Item
      name={["address", "zipCode"]}
      label="Postleitzahl"
      noStyle
      required
      rules={[ { type: "number", min: 10000, max: 99999, required: true}]}
    >
      <InputNumber
        controls={false}
        placeholder="Postleitzahl"
        autoComplete="postal-code"
        style={{ width: 120, marginRight: 8, marginBottom: 4 }}
      />
    </Form.Item>
    <Form.Item
      name={["address", "city"]}
      label="Ort"
      noStyle
      required
      rules={defaultRules}>
      <Input
        placeholder="Ort"
        autoComplete="address-level2"
        style={{ width: 360, maxWidth: "90%", marginBottom: 4 }}
      />
    </Form.Item>
  </Form.Item>
)

const EatingBehaviourSelection: React.FC = () => (
  <Form.Item label="Essgewohnheiten" name={["food", "eatingBehaviour"]} required>
    <Select style={doubleWidth}>
      { EatingBehaviours.map(behaviour => (
        <Select.Option key={behaviour.slug} value={behaviour.slug}>{ behaviour.name }</Select.Option>
      ))}
    </Select>
  </Form.Item>
)

const FoodIntolerances: React.FC = () => (
  <Form.Item label="Unverträglichkeiten" name={["food", "intolerances"]} tooltip="Bitte gib hier deine Lebensmittelunverträglichkeiten und Allergien an. Diese Angaben sind für unsere Küche gedacht. Weitere Krankheiten von denen wir wissen sollten, kannst du weiter unten angeben.">
    <Input.TextArea style={doubleWidth} />
  </Form.Item>
)

const HealthInsurance: React.FC = () => (
  <Form.Item name="healthInsurance" label="Krankenversicherung" required rules={defaultRules}>
    <Radio.Group>
      { InsuranceTypes.map(insurance => (
        <Radio key={insurance.slug} value={insurance.slug}>
          { insurance.name }
        </Radio>
      ))}
    </Radio.Group>
  </Form.Item>
)

const Diseases: React.FC = () => (
  <Form.Item label="Krankheiten, ..." name="diseases" tooltip="Hier kannst du alle Krankenheiten und Medikamente angeben, die wir beachten müssen.">
    <Input.TextArea style={doubleWidth}/>
  </Form.Item>
)

const Vaccinations: React.FC = () => (
  <>
    <Form.Item name={["vaccinations", "tetanus"]} label="Tetanus-Impfung" required rules={[{ required: true, type: "boolean" }]}>
      <Radio.Group>
        <Radio value={true}>Ja</Radio>
        <Radio value={false}>Nein</Radio>
      </Radio.Group>
    </Form.Item>
    <Form.Item name={["vaccinations", "fsme"]} label="FSME-Impfung" required rules={[{ required: true, type: "boolean" }]}>
      <Radio.Group>
        <Radio value={true}>Ja</Radio>
        <Radio value={false}>Nein</Radio>
      </Radio.Group>
    </Form.Item>
  </>
)

const CovidVaccination: React.FC = () => (
  <Form.Item label="Corona-Impfstatus" name={["vaccinations", "covid"]} required rules={defaultRules} tooltip="Wir gehen davon aus, dass das Lager unter 2G / 2G Plus oder ähnlichen Bedingungen stattfindet. Um besser planen zu können, fragen wir bereits jetzt den Impfstatus (noch) auf freiwilliger Basis ab. Mehr dazu in den Teilnahmebedingungen">
    <Select style={doubleWidth}>
      { CovidVaccinationStates.map(state => (
        <Select.Option key={state.slug} value={state.slug}>
          { state.name }
        </Select.Option>
      ))}
    </Select>
  </Form.Item>
)

const ContactData: React.FC = () => (
  <Form.Item label="Kontaktdaten" tooltip="Wir benötigen deine Kontaktdaten zum einen zum Versenden der Anmeldung und zum anderen eventuell auch für eine mögliche Kontaktdatenverfolgung durch deutsche und/oder österreischische Behörden">
    <Input.Group>
      <Row gutter={defaultGutter}>
        <Col>
          <Form.Item name="email" label="E-Mail" noStyle required rules={[{ type: "email", required: true }]}>
            <Input type="email" autoComplete="email" placeholder="E-Mail" style={defaultWidth} />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item name="phoneNumber" noStyle>
            <Input type="tel" autoComplete="tel" placeholder={"Telefonnummer (optional)"} style={defaultWidth} />
          </Form.Item>
        </Col>
      </Row>
    </Input.Group>
  </Form.Item>
)

const LegalGuardian: React.FC<{ form: FormInstance }> = ({ form }) => (
  <Form.Item label="Erziehungsberechtigte:r">
    <Row gutter={defaultGutter}>
      <Col>
        <Form.Item name={["legalGuardian", "name"]} label="Name" noStyle rules={defaultRules} required>
          <Input type="name" placeholder="Name" style={defaultWidth} />
        </Form.Item>
      </Col>
      <Col>
        <Form.Item name={["legalGuardian", "phoneNumber"]} label="Telefonnummer" noStyle rules={defaultRules} required>
          <Input type="name" placeholder="Telefon" style={defaultWidth} />
        </Form.Item>
      </Col>
      <Col>
        <Tooltip
          title="Telefonnummer übernehmen"
          color="white"
          overlayInnerStyle={{
            color: "black",
            textAlign: "center"
          }}
        >
          <EnterOutlined onClick={() => form.setFields([
            { name: ["legalGuardian", "phoneNumber"], value: form.getFieldValue("phoneNumber")}
          ])}/>
        </Tooltip>
      </Col>
    </Row>
  </Form.Item>
)

const Contacts: React.FC<{ form: FormInstance, needsLegalGuardian: boolean }> = ({ form, needsLegalGuardian }) => {

  type FormListAdd = (defaultValue?: StoreValue, insertIndex?: number) => void

  const AddContactButton: React.FC<{ add: FormListAdd }> = ({ add }) => (
    <Form.Item style={{ marginTop: 8 }}>
      <Button type="dashed" onClick={add} style={doubleWidth}>
        Notfallkontakt hinzufügen
      </Button>
    </Form.Item>
  )

  const ContactRow: React.FC<{
    name: number | string,
    index: number,
    remove: (index: number) => void
  }> = ({ name, index, remove }) => (
    <Input.Group style={{ marginTop: 8 }}>
      <Row gutter={defaultGutter} align="middle">
        <Col>
          <Form.Item name={[name, "name"]} label="Name" noStyle rules={defaultRules}>
            <Input type="name" placeholder="Name" style={defaultWidth} />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item name={[name, "phoneNumber"]} label="Telefonnummer" noStyle rules={defaultRules}>
            <Input type="tel" placeholder="Telefonnummer" style={defaultWidth} />
          </Form.Item>
        </Col>
        <Col>
          <CloseOutlined onClick={() => remove(index)} />
        </Col>
      </Row>
    </Input.Group>
  )

  return (
    <Form.Item label="Kontakte" shouldUpdate={updateOnBirthdateChange}>
      <Form.List name="contacts">
        {(fields, { add, remove }) => (
          <>
            { fields.map(({ key, name }, index) => (
              <ContactRow key={key} name={name} index={index} remove={remove} />
            ))}
            { fields.length < 4 && <AddContactButton add={() => {
              add()
              console.log(form.getFieldValue("contacts"))
            }} /> }
          </>
        )}
      </Form.List>
    </Form.Item>
  )
}

const Presence: React.FC = () => (
  <Form.Item name="presence" label="Anwesenheit">
    <Checkbox.Group options={dateArray.map(date => ({
      label: `${String(date).padStart(2, "0")}.`,
      value: String(date)
    }))}>
    </Checkbox.Group>
  </Form.Item>
)

const Comments: React.FC = () => (
  <Form.Item name="comments" label="Anmerkungen">
    <Input.TextArea style={doubleWidth} />
  </Form.Item>
)

const RoleSelection: React.FC<{ roleChanged: (e: any) => void }> = ({ roleChanged }) => (
  <Form.Item name="role" label="Rolle" required rules={defaultRules}>
    <Radio.Group onChange={roleChanged}>
      {ParticipantRoles.map(role => (
        <Radio key={role.slug} value={role.slug}>{ role.name }</Radio>
      ))}
    </Radio.Group>
  </Form.Item>
)

const LeaderInformation: React.FC<{ form: FormInstance }> = ({ form }) => {

  const [nami, setNami] = useState(false)

  const updateNami = () => {
    form.resetFields(["clearance.id"])
    setNami(!nami)
  }

  return (
    <>
      <Form.Item label="Juleica">
        <Input.Group>
          <Row gutter={defaultGutter}>
            <Col>
              <Form.Item name={["juleica", "number"]} noStyle>
                <Input placeholder="Juleica-Nummer (optional)" style={defaultWidth} />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name={["juleica", "terminates"]} noStyle>
                <DatePicker
                  locale={deDE}
                  placeholder="Ablaufdatum"
                  showToday={false}
                  style={defaultWidth}
                  picker="date"
                  format="DD.MM.YYYY" />
              </Form.Item>
            </Col>
          </Row>
        </Input.Group>
      </Form.Item>
      <Form.Item label="Unbedenklichkeitsbescheinigung" tooltip="Die ID-Nummer ist die Nummer, die auf der Bestätigung der Einsichtnahme in das erweiterte Führungszeugnis durch das JIZ steht. Wenn du dein Führungszeugnis stattdessen durch das Bundesamt einsehen hast lassen, setze den Haken rechts.">
        <Input.Group>
          <Row gutter={defaultGutter}>
            <Col>
              <Form.Item name={["clearance", "idNumber"]} noStyle>
                <Input placeholder="ID-Nummer" style={defaultWidth} disabled={nami}/>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name={["clearance", "nami"]} style={{ marginBottom: 0 }} valuePropName="checked" initialValue={false}>
                <Checkbox onChange={updateNami}>Vom Bundesamt überprüft und in NaMi eingetragen</Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </Input.Group>
      </Form.Item>
      <Form.Item label="2d/2e-Schulung" name="course">
        <DatePicker
          locale={deDE}
          placeholder="Datum der Schulung (optional)"
          showToday={false}
          style={doubleWidth}
          picker="date"
          format="DD.MM.YYYY" />
      </Form.Item>
    </>
  )
}

const SubmitButton: React.FC<{ text: string}> = ({ text }) => (
  <Form.Item label=" ">
    <Button type="primary" htmlType="submit" style={doubleWidth}>{text}</Button>
  </Form.Item>
)

const FurtherInformation: React.FC = () => (
  <Form.Item label=" ">
    <p style={{ ...doubleWidth, textAlign: "center"}}>
      Du erhälst alle nötigen Dokumente per Mail. Bitte gib diese unterschrieben bei deinem Stamm ab.
    </p>
  </Form.Item>
)

const CancelButton: React.FC<{ onClick: VoidFunction}> = ({ onClick }) => (
  <Form.Item label=" ">
    <Button style={doubleWidth} onClick={onClick}>Abbrechen</Button>
  </Form.Item>
)

const Conditions: React.FC<{ isLeader: boolean }> = ({ isLeader}) => (
  <Form.Item label="Teilnahmebedingungen">
    <p style={{...doubleWidth, textAlign: "justify"}}>
      Ich erkläre mich mit allen folgenden Punkten einverstanden:<br style={{ marginTop: 8, marginBottom: 12 }}/>
      Maßnahmen, die vom örtlichen Arzt/ Ärztin für dringend notwendig gehalten werden, werden im gegebenen Fall ohne Rücksprache mit mir bei meinem Kind durchgeführt. Ich stelle die Leiter:innen und den Träger von jeglichen Haftungsansprüchen frei, die im Zusammenhang mit der vereinbarten und abgestimmten Einnahme von Medikamenten durch mein Kind entstehen. Ich habe zur Kenntnis genommen, dass die Leiter:innen in keiner Weise für eine solche Tätigkeit ausgebildet sind. Ich versichere ferner, dass mein Kind die angegebenen Medikamente schon mehrfach eingenommen hat (auch in Kombination mit den anderen genannten Medikamenten), ohne dass es hierbei zu unerwünschten Nebenwirkungen kam. Ich versichere weiterhin, dass die genannten Medikamente nach ärztlicher Auskunft keine lebensbedrohlichen Nebenwirkungen haben.<br style={{ marginBottom: 12 }}/>
      Des Weiteren stelle ich die Leiter:innen und den Träger von jeglichen Haftungsansprüchen frei, die im Zusammenhang mit Erste-Hilfe-Maßnahmen stehen.<br style={{ marginBottom: 12 }}/>
      Während des Lagers sind die Lagerregeln, geltenden Hygienevorschriften (folgen zu gegebener Zeit) sowie die Anweisungen der Leiter:innen jederzeit zu befolgen. Bei Verstößen kann die Lagerleitung die weitere Teilnahme untersagen. In diesem Fall kann der/die Teilnehmer:in in Absprache mit dem/der Erziehungsberechtigten entweder abgeholt werden (ein Betreten des Platzes ist dabei untersagt) oder allein mit öffentlichen Verkehrsmitteln nach Hause fahren.<br style={{ marginBottom: 12 }}/>
      Des Weiteren kann eine vorzeitige oder direkte Heimreise durch einen positiven Coronatest auf dem Lager oder bei fehlenden / ungültigen notwendigen Dokumenten (z.B. zertifizierter Test-/Impfnachweis) nötig sein. Die Kosten für eine vorzeitige oder direkte Heimreise sind in jedem Fall selbst zu tragen.<br style={{ marginBottom: 12 }}/>
      Außerdem geht die Lagerleitung derzeit davon aus und behält sich vor, dass das Lager unter 2G / 2G Plus oder ähnlichen Bedingungen stattfindet, wenn dies nach geltenden Bestimmungen in Deutschland oder Österreich bzw. bei der Einreise nach Österreich oder der Wiedereinreise nach Deutschland nötig ist oder von der Lagerleitung als sinnvoll empfunden wird. Die Lagerleitung behält sich außerdem vor, geltende gesetzliche Vorschriften um eigene Regelungen wie z.B. einer Testpflicht vor Abreise zu erweitern. Ich bin selbst dafür verantwortlich, die aufgestellten Bestimmungen einzuhalten, ansonsten ist eine Teilnahme am Lager nicht möglich. Sollte eine Teilnahme durch Quarantäne- oder Isolationsregeln nicht möglich sein, gelten die normalen Stornobedingungen. Die Lagerleitung empfiehlt den Abschluss einer Reiserücktrittsversicherung. Sollte sich die Lagerleitung dazu entscheiden, das Lager abzusagen, werden die gezahlten Beiträge bis auf unvermeidbare, bereits vorher angefallene Kosten bis zum Jahresende 2022 erstattet.<br style={{ marginBottom: 12 }}/>
      Teilnehmer:innen werden kürzere Strecken vor Ort möglicherweise mit dem Auto gefahren. Zudem schlafen Teilnehmer:innen unter Umständen nicht geschlechtergetrennt. Außerdem dürfen Teilnehmer:innen, welche bereits 16 Jahre alt sind, gemäß dem Jugendschutzgesetz unter Aufsicht gegebenenfalls alkoholische Getränke zu sich nehmen.<br style={{ marginBottom: 12 }}/>
      Die angegebenen Daten werden zur Durchführung des Lagers gespeichert, verarbeitet und spätestens 6 Monate nach der Abrechnung des Lagers oder nach dem Ablauf gesetzlicher Fristen zur Kontaktdatenverfolgung wieder gelöscht. Außerdem können die angegebenen Daten nach geltenden Auflagen zur Kontaktdatenverfolgung an deutsche und/oder österreichische Behörden weitergegeben werden.<br style={{ marginBottom: 12 }}/>
      { isLeader && (<strong>Als Leiter- oder Helfer:in erkläre ich mich außerdem mit allen weiteren Bedingungen einverstanden, die mir zusammen mit der Anmeldung zugeschickt werden.</strong>)}
    </p>
   </Form.Item>
)

export {
  Personal,
  Membership,
  Swimmer,
  Address,
  EatingBehaviourSelection,
  FoodIntolerances,
  HealthInsurance,
  Diseases,
  Vaccinations,
  CovidVaccination,
  ContactData,
  LegalGuardian,
  Contacts,
  RoleSelection,
  Presence,
  Comments,
  LeaderInformation,
  SubmitButton,
  CancelButton,
  Conditions,
  FurtherInformation
}
