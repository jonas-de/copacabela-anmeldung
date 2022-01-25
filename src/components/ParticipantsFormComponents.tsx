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
  EatingBehaviour,
  Genders,
  InsuranceTypes
} from '../utilitites/Wording';
import { getTribeForNumber, TribesWithDistrict } from '../utilitites/Tribes';
import Levels from '../utilitites/Levels';
import { CloseOutlined, EnterOutlined, PlusOutlined } from '@ant-design/icons';
import { ParticipantRoles } from '../utilitites/Persons';
import { FormListOperation } from 'antd/es/form/FormList';
import { StoreValue } from 'rc-field-form/lib/interface';
import { FormInstance } from 'antd/es/form/Form';
import { ShouldUpdate } from 'rc-field-form/es/Field';
import deDE from 'antd/lib/date-picker/locale/de_DE'
import 'moment/locale/de'
import { Rule } from 'rc-field-form/es/interface';

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
const Membership: React.FC = () => (
  <Form.Item label="Stamm & Stufe">
    <Input.Group>
      <Row gutter={defaultGutter}>
        <Col>
          <Form.Item name="tribe" label="Stamm" noStyle required rules={[{ type: "number", required: true }]}>
            <Select
              placeholder="Wählen..."
              showSearch
              style={defaultWidth}
              filterOption={(inputValue, option) => {
                const tribe = getTribeForNumber(option!.value as number)
                return tribe.name.startsWith(inputValue) || String(tribe.number).startsWith(inputValue)
              }}
            >
              {
                TribesWithDistrict.map(tribe => (
                  <Select.Option key={tribe.number} value={tribe.number}>
                    <img className="pe-2" src="images/Swapingo.png" width={35} height={32}/>
                    { tribe.name }
                  </Select.Option>
                ))
              }
            </Select>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item name="level" label="Stufe" noStyle required rules={defaultRules}>
            <Select placeholder="Wählen..." showSearch style={defaultWidth}>
              { Levels.map(level => (
                <Select.Option key={level.slug} value={level.slug}>
                  { level.singular }
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Input.Group>
  </Form.Item>
)

const Swimmer: React.FC = () => (
  <Form.Item name="swimmer" label="Schwimmer:in" required rules={[{ type: "boolean", required: true }]}>
    <Radio.Group>
      <Radio value={true}>Ja</Radio>
      <Radio value={false}>Nein</Radio>
    </Radio.Group>
  </Form.Item>
)

const Address: React.FC = () => (
  <Form.Item label="Adresse">
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
    <Input.Group>
      <Row gutter={defaultGutter}>
        <Col>
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
              style={{ width: 120 }}
            />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item name={["address", "city"]} label="Ort" noStyle required rules={defaultRules}>
            <Input
              placeholder="Ort"
              autoComplete="address-level2"
              style={{ width: 360 }}
            />
          </Form.Item>
        </Col>
      </Row>
    </Input.Group>
  </Form.Item>
)

const EatingBehaviourSelection: React.FC = () => (
  <Form.Item label="Essgewohnheiten" name={["food", "eatingBehaviour"]} required>
    <Select style={doubleWidth}>
      { EatingBehaviour.map(behaviour => (
        <Select.Option key={behaviour.slug} value={behaviour.slug}>{ behaviour.name }</Select.Option>
      ))}
    </Select>
  </Form.Item>
)

const FoodIntolerances: React.FC = () => (
  <Form.Item label="Unverträglichkeiten" name={["food", "intolerances"]}>
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
  <Form.Item label="Krankheiten, ..." name="healthInformation">
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
  <Form.Item label="Corona-Impfstatus" name={["vaccinations", "covid"]} required rules={defaultRules}>
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
  <Form.Item label="Kontaktdaten">
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

const Contacts: React.FC<{ form: FormInstance, legalAge: boolean }> = ({ form, legalAge }) => {

  type FormListAdd = (defaultValue?: StoreValue, insertIndex?: number) => void

  const AddContactButton: React.FC<{ add: FormListAdd }> = ({ add }) => (
    <Form.Item style={{ marginTop: 8 }}>
      <Button type="dashed" onClick={add} style={doubleWidth}>
        Notfallkontakt hinzufügen
      </Button>
    </Form.Item>
  )

  const RowActionButton: React.FC<{
    insert: VoidFunction,
    remove: VoidFunction,
    index: number
  }> = ({ insert, remove, index }) => {
    if (index === -1) {
      return (
        <Tooltip
          title="Telefonnummer übernehmen"
          color="white"
          overlayInnerStyle={{
            color: "black",
            textAlign: "center"
          }}
        >
          <EnterOutlined onClick={insert}/>
        </Tooltip>
      )
    }
    return <CloseOutlined onClick={remove} />
  }

  const ContactRow: React.FC<{
    name: number | string,
    index: number,
    ops: FormListOperation
  }> = ({ name, index, ops }) => (
    <Input.Group style={{ marginTop: 8 }}>
      <Row>
        { index === -1 ? "Erziehungsberechtigte:r" : `Notfallkontakt ${index+1}` }
      </Row>
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
          <RowActionButton
            insert={() => {
              ops.remove(0)
              ops.add({ name: "", phoneNumber: form.getFieldValue("phoneNumber") }, 0)
            }}
            remove={() => ops.remove(0)}
            index={index} />
        </Col>
      </Row>
    </Input.Group>
  )

  return (
    <Form.Item label="Kontakte" shouldUpdate={updateOnBirthdateChange}>
      <Form.List name="contacts">
        {(fields, ops) => (
          <>
            { !legalAge && <ContactRow name="legalGuardian" index={-1} ops={ops} />}
            { fields.map(({ key, name }, index) => (
              <ContactRow key={key} name={name} index={index} ops={ops} />
            ))}
            { fields.length < 4 && <AddContactButton add={ops.add} /> }
          </>
        )}
      </Form.List>
    </Form.Item>
  )
}


const Comments: React.FC = () => (
  <Form.Item name="comment" label="Anmerkungen">
    <Input.TextArea style={doubleWidth} />
  </Form.Item>
)

const RoleSelection: React.FC<{ roleChanged: (e: any) => void }> = ({ roleChanged }) => (
  <Form.Item name="role" label="Rolle" required rules={defaultRules}>
    <Radio.Group onChange={roleChanged}>
      { ParticipantRoles.map(role => (
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
      <Form.Item label="Unbedenklichkeitsbescheinigung">
        <Input.Group>
          <Row gutter={defaultGutter}>
            <Col>
              <Form.Item name={["clearance", "id"]} noStyle>
                <Input placeholder="ID-Nummer" style={defaultWidth} disabled={nami}/>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name={["clearance", "nami"]} style={{ marginBottom: 0 }}>
                <Checkbox onChange={updateNami}>In NaMi eingetragen</Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </Input.Group>
      </Form.Item>
    </>
  )
}

const RegisterButton: React.FC = () => (
  <Form.Item label=" ">
    <Button type="primary" htmlType="submit" style={doubleWidth}>Anmelden</Button>
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
  Contacts,
  RoleSelection,
  Comments,
  LeaderInformation,
  RegisterButton
}
