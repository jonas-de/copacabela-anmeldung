import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
} from 'antd';
import React, {useState} from 'react';
import {Genders, InsuranceTypes} from '../../../utilitites/Wording';
import {
  getTribeForNumber,
  TribesWithDistrict,
} from '../../../utilitites/Tribes';
import {LevelsWithNone} from '../../../utilitites/Levels';
import {FormInstance} from 'antd/es/form/Form';
import deDE from 'antd/lib/date-picker/locale/de_DE';
import {Rule} from 'rc-field-form/es/interface';
import Image from 'next/image';

const defaultRules: Rule[] = [{type: 'string', required: true}];
const defaultWidth: {width: number} = {width: 240};
const doubleWidth: {width: number; maxWidth: string} = {
  width: 488,
  maxWidth: '90%',
};
const defaultGutter: [number, number] = [8, 24];

const Personal: React.FC = () => (
  <Form.Item label="Persönliches">
    <Input.Group>
      <Row gutter={defaultGutter}>
        <Col>
          <Form.Item
            name="firstName"
            label="Vorname"
            noStyle
            required
            rules={defaultRules}
          >
            <Input
              placeholder="Vorname"
              autoComplete="given-name"
              style={defaultWidth}
            />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            name="lastName"
            label="Nachname"
            noStyle
            required
            rules={defaultRules}
          >
            <Input
              placeholder="Nachname"
              autoComplete="family-name"
              style={defaultWidth}
            />
          </Form.Item>
        </Col>
      </Row>
    </Input.Group>
    <Input.Group style={{marginTop: 24}}>
      <Row gutter={defaultGutter}>
        <Col>
          <Form.Item
            name="birthDate"
            label="Geburtstag"
            noStyle
            required
            rules={[{type: 'date', required: true}]}
          >
            <DatePicker
              autoComplete="bday"
              locale={deDE}
              placeholder="Geburtsdatum"
              showToday={false}
              style={defaultWidth}
              picker="date"
              format="DD.MM.YYYY"
            />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            name="gender"
            label="Geschlecht"
            noStyle
            required
            rules={[{required: true}]}
          >
            <Select placeholder="Geschlecht" style={defaultWidth}>
              {Genders.map(gender => (
                <Select.Option key={gender.slug} value={gender.slug}>
                  {gender.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Input.Group>
  </Form.Item>
);
const Membership: React.FC<{tribe?: number}> = ({tribe}) => {
  const TribeSelection: () => React.ReactElement[] = () => {
    if (tribe !== undefined) {
      const tribeObject = getTribeForNumber(tribe);
      return [
        <Select.Option value={tribeObject.number} key={tribeObject.number}>
          <div style={{alignItems: 'center'}}>
            <Image
              className="pe-2"
              src={`/images/${tribeObject.image}`}
              width={35}
              height={32}
              alt={tribeObject.name}
            />
            {tribeObject.name}
          </div>
        </Select.Option>,
      ];
    }
    return TribesWithDistrict.map(tribe => (
      <Select.Option key={tribe.number} value={tribe.number}>
        <div>
          <Image
            className="pe-2"
            src={`/images/${tribe.image}`}
            width={35}
            height={32}
            alt={tribe.name}
          />
          {tribe.name}
        </div>
      </Select.Option>
    ));
  };

  return (
    <Form.Item
      label="Stamm & Stufe"
      style={{marginTop: -4}}
      tooltip="Wähle deinen Stamm und die Stufe, die du leitest."
    >
      <Input.Group>
        <Row gutter={defaultGutter}>
          <Col>
            <Form.Item
              name="tribe"
              label="Stamm"
              noStyle
              required
              rules={[{type: 'number', required: true}]}
            >
              <Select
                placeholder="Wählen..."
                showSearch
                style={defaultWidth}
                disabled={tribe !== undefined}
                filterOption={(inputValue, option) => {
                  const tribe = getTribeForNumber(option!.value as number);
                  return (
                    tribe.name.startsWith(inputValue) ||
                    String(tribe.number).startsWith(inputValue)
                  );
                }}
              >
                {TribeSelection()}
              </Select>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              name="level"
              label="Stufe"
              noStyle
              required
              rules={defaultRules}
            >
              <Select placeholder="Wählen..." showSearch style={defaultWidth}>
                {LevelsWithNone.map(level => (
                  <Select.Option key={level.slug} value={level.slug}>
                    {level.singular}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Input.Group>
    </Form.Item>
  );
};

const Address: React.FC = () => (
  <Form.Item label="Adresse">
    <Form.Item
      name={['address', 'street']}
      required
      rules={defaultRules}
      messageVariables={{label: 'Straße'}}
    >
      <Input
        placeholder="Straße & Hausnummer"
        autoComplete="street-address"
        style={doubleWidth}
      />
    </Form.Item>
    <Form.Item
      name={['address', 'zipCode']}
      label="Postleitzahl"
      noStyle
      required
      rules={[{type: 'number', min: 10000, max: 99999, required: true}]}
    >
      <InputNumber
        controls={false}
        placeholder="Postleitzahl"
        autoComplete="postal-code"
        style={{width: 120, marginRight: 8, marginBottom: 4}}
      />
    </Form.Item>
    <Form.Item
      name={['address', 'city']}
      label="Ort"
      noStyle
      required
      rules={defaultRules}
    >
      <Input
        placeholder="Ort"
        autoComplete="address-level2"
        style={{width: 360, maxWidth: '90%', marginBottom: 4}}
      />
    </Form.Item>
  </Form.Item>
);

const FoodIntolerances: React.FC = () => (
  <Form.Item
    label="Unverträglichkeiten"
    name={['food', 'intolerances']}
    tooltip="Bitte gib hier deine Lebensmittelunverträglichkeiten und Allergien an. Diese Angaben sind für unsere Küche gedacht. Weitere Krankheiten von denen wir wissen sollten, kannst du weiter unten angeben."
  >
    <Input.TextArea style={doubleWidth} />
  </Form.Item>
);

const HealthInsurance: React.FC = () => (
  <Form.Item
    name="healthInsurance"
    label="Krankenversicherung"
    required
    rules={defaultRules}
  >
    <Radio.Group>
      {InsuranceTypes.map(insurance => (
        <Radio key={insurance.slug} value={insurance.slug}>
          {insurance.name}
        </Radio>
      ))}
    </Radio.Group>
  </Form.Item>
);

const Diseases: React.FC = () => (
  <Form.Item
    label="Krankheiten, ..."
    name="diseases"
    tooltip="Hier kannst du alle Krankenheiten und Medikamente angeben, die wir beachten müssen."
  >
    <Input.TextArea style={doubleWidth} />
  </Form.Item>
);

const ContactData: React.FC = () => (
  <Form.Item
    label="Kontaktdaten"
    tooltip="Wir benötigen deine Kontaktdaten zum einen zum Versenden der Anmeldung und zum anderen eventuell auch für eine mögliche Kontaktdatenverfolgung durch deutsche und/oder österreischische Behörden"
  >
    <Input.Group>
      <Row gutter={defaultGutter}>
        <Col>
          <Form.Item
            name="email"
            label="E-Mail"
            noStyle
            required
            rules={[{type: 'email', required: true}]}
          >
            <Input
              type="email"
              autoComplete="email"
              placeholder="E-Mail"
              style={defaultWidth}
            />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item name="phoneNumber" noStyle>
            <Input
              type="tel"
              autoComplete="tel"
              placeholder={'Telefonnummer (optional)'}
              style={defaultWidth}
            />
          </Form.Item>
        </Col>
      </Row>
    </Input.Group>
  </Form.Item>
);

const Comments: React.FC = () => (
  <Form.Item name="comments" label="Anmerkungen">
    <Input.TextArea style={doubleWidth} />
  </Form.Item>
);

const LeaderInformation: React.FC<{form: FormInstance}> = ({form}) => {
  const [nami, setNami] = useState(false);

  const updateNami = () => {
    form.resetFields(['clearance.id']);
    setNami(!nami);
  };

  return (
    <>
      <Form.Item label="Juleica">
        <Input.Group>
          <Row gutter={defaultGutter}>
            <Col>
              <Form.Item name={['juleica', 'number']} noStyle>
                <Input
                  placeholder="Juleica-Nummer (optional)"
                  style={defaultWidth}
                />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name={['juleica', 'terminates']} noStyle>
                <DatePicker
                  locale={deDE}
                  placeholder="Ablaufdatum"
                  showToday={false}
                  style={defaultWidth}
                  picker="date"
                  format="DD.MM.YYYY"
                />
              </Form.Item>
            </Col>
          </Row>
        </Input.Group>
      </Form.Item>
      <Form.Item
        label="Unbedenklichkeitsbescheinigung"
        tooltip="Die ID-Nummer ist die Nummer, die auf der Bestätigung der Einsichtnahme in das erweiterte Führungszeugnis durch das JIZ steht. Wenn du dein Führungszeugnis stattdessen durch das Bundesamt einsehen hast lassen, setze den Haken rechts."
      >
        <Input.Group>
          <Row gutter={defaultGutter}>
            <Col>
              <Form.Item name={['clearance', 'idNumber']} noStyle>
                <Input
                  placeholder="ID-Nummer"
                  style={defaultWidth}
                  disabled={nami}
                />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                name={['clearance', 'nami']}
                style={{marginBottom: 0}}
                valuePropName="checked"
                initialValue={false}
              >
                <Checkbox onChange={updateNami}>
                  Vom Bundesamt überprüft und in NaMi eingetragen
                </Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </Input.Group>
      </Form.Item>
    </>
  );
};

const SubmitButton: React.FC<{text: string}> = ({text}) => (
  <Form.Item label=" ">
    <Button type="primary" htmlType="submit" style={doubleWidth}>
      {text}
    </Button>
  </Form.Item>
);

const FurtherInformation: React.FC = () => (
  <Form.Item label=" ">
    <p style={{...doubleWidth, textAlign: 'center'}}>
      Du erhälst gleich eine E-Mail mit einem Bestätigungslink. Deine Anmeldung
      ist erst gültig, wenn du deine Buchung über diesen Link bestätigt hast.
    </p>
  </Form.Item>
);

const CancelButton: React.FC<{onClick: VoidFunction}> = ({onClick}) => (
  <Form.Item label=" ">
    <Button style={doubleWidth} onClick={onClick}>
      Abbrechen
    </Button>
  </Form.Item>
);

const Conditions: React.FC = () => (
  <Form.Item label="Teilnahmebedingungen">
    <p style={{...doubleWidth, textAlign: 'justify'}}>
      Ich erkläre mich mit allen folgenden Punkten einverstanden:
      <br style={{marginTop: 8, marginBottom: 12}} />
      Sauuuuufeeennnnnnnnnn🍻🍻🍻🍻🍻
    </p>
  </Form.Item>
);

export {
  Personal,
  Membership,
  Address,
  FoodIntolerances,
  HealthInsurance,
  Diseases,
  ContactData,
  Comments,
  LeaderInformation,
  SubmitButton,
  CancelButton,
  Conditions,
  FurtherInformation,
};
