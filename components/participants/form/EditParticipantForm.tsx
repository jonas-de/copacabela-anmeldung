import {ColProps, Form, message} from 'antd';
import {
  Address,
  CancelButton,
  Comments,
  ContactData,
  Diseases,
  FoodIntolerances,
  HealthInsurance,
  LeaderInformation,
  Membership,
  Personal,
  SubmitButton,
} from './ParticipantsFormComponents';
import React from 'react';
import {hasLegalAge} from '../../../utilitites/Persons';
import {Participant} from '../../../payload-types';
import defaultFetch from '../../../utilitites/defaultFetch';
import {useRouter} from 'next/router';
import {dateSelectionToObject} from '../../../utilitites/Fees';
import {Dayjs} from 'dayjs';
import dayjstz from '../../../utilitites/dayjstz';

const EditParticipantsForm: React.FC<{
  participant: Participant;
  onCancel: VoidFunction;
}> = ({participant, onCancel}) => {
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

  const [form] = Form.useForm();
  const router = useRouter();

  const onSubmit = async (values: {
    presence: string[];
    birthDate: Dayjs;
    juleica: {terminates: Dayjs} | null;
  }) => {
    if (!hasLegalAge(values.birthDate)) {
      message.error('Du musst min. 18 Jahre alt sein.');
      return;
    }

    const res = await defaultFetch(
      `/api/participants/${participant.id}`,
      'PUT',
      {
        ...values,
        presence: dateSelectionToObject(values.presence),
        birthDate: values.birthDate.toDate(),
        juleica: values.juleica
          ? {
              ...values.juleica,
              terminates: values.juleica.terminates
                ? values.juleica.terminates.toDate()
                : undefined,
            }
          : undefined,
      }
    );
    if (res.status === 200) {
      router.reload();
    } else {
      message.error(res.statusText);
    }
  };

  return (
    <Form
      size="large"
      className="p-2"
      labelCol={layout}
      labelAlign="right"
      colon={false}
      requiredMark={false}
      form={form}
      validateMessages={validateMessages}
      initialValues={{
        ...participant,
        address: {
          ...participant.address,
          zipCode: Number(participant.address.zipCode),
        },
        tribe: Number(participant.tribe),
        birthDate: dayjstz.tz(participant.birthDate),
        juleica: participant.juleica
          ? {
              ...participant.juleica,
              terminates: participant.juleica.terminates
                ? dayjstz.tz(participant.juleica.terminates)
                : undefined,
            }
          : undefined,
      }}
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
      <SubmitButton text="Änderung speichern" />
      <CancelButton
        onClick={() => {
          form.resetFields();
          onCancel();
        }}
      />
    </Form>
  );
};

export default EditParticipantsForm;
