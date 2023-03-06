import {ColProps, Form, message, Result} from 'antd';
import {
  Address,
  Comments,
  Conditions,
  ContactData,
  Diseases,
  FoodIntolerances,
  FurtherInformation,
  HealthInsurance,
  LeaderInformation,
  Membership,
  Personal,
  SubmitButton,
} from './ParticipantsFormComponents';
import React, {useState} from 'react';
import {hasLegalAge} from '../../../utilitites/Persons';
import defaultFetch from '../../../utilitites/defaultFetch';
import {Dayjs} from 'dayjs';

const ParticipantsForm: React.FC = () => {
  const layout: ColProps = {sm: 10, md: 7, lg: 6, xl: 7, xxl: 8};
  const validateMessages = {
    required: '${label} ist ein Pflichtfeld',
    date: {
      format: 'Ungültiger Geburtstag (TT.MM.JJJJ)',
      parse: 'Ungültiger Geburtstag (TT.MM.JJJJ)',
      invalid: 'Ungültiger Geburtstag (TT.MM.JJJJ)',
    },
    number: {
      range: 'Ungültige Postleitzahl',
    },
  };

  const [registered, setRegistered] = useState(false);

  const [form] = Form.useForm();

  const onSubmit = async (values: {birthDate: Dayjs}) => {
    if (!hasLegalAge(values.birthDate)) {
      message.error('Du musst min. 18 Jahre alt sein.');
      return;
    }
    const res = await defaultFetch('/api/participants', 'POST', values);
    if (res.ok) {
      setRegistered(true);
    } else {
      message.error(res.statusText);
    }
  };

  const RegistrationForm: React.ReactElement = (
    <Form
      size="large"
      className="p-2"
      labelCol={layout}
      labelAlign="right"
      colon={false}
      requiredMark={false}
      form={form}
      validateMessages={validateMessages}
      onFinish={onSubmit}
    >
      <Personal />
      <ContactData />
      <Address />
      <Membership />
      <LeaderInformation form={form} />
      <FoodIntolerances />
      <Diseases />
      <HealthInsurance />
      <Comments />
      <Conditions />
      <SubmitButton text="Bedingungen bestätigen und Anmelden" />
      <FurtherInformation />
    </Form>
  );

  const Success: React.ReactElement = (
    <Result
      status="success"
      title="Erfolgreich angemeldet"
      subTitle="Du erhälst gleich eine E-Mail mit allen nötigen Dokumenten, die du bitte unterschrieben bei deinem Stamm abgibst"
    />
  );

  return <>{!registered ? RegistrationForm : Success}</>;
};

export default ParticipantsForm;
