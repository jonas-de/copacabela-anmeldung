import { ColProps, Form, message } from 'antd';
import {
  Address,
  CancelButton,
  Comments,
  ContactData,
  Contacts,
  CovidVaccination,
  Diseases,
  EatingBehaviourSelection,
  FoodIntolerances,
  HealthInsurance,
  LeaderInformation,
  LegalGuardian,
  Membership,
  Personal, Presence,
  RoleSelection,
  SubmitButton,
  Swimmer,
  Vaccinations
} from './ParticipantsFormComponents';
import React, { useState } from 'react';
import { hasLegalAge, ParticipantRoleText } from '../../../utilitites/Persons';
import { TeilnehmerIn } from '../../../payload-types';
import moment from 'moment';
import defaultFetch from '../../../utilitites/defaultFetch';
import { useRouter } from 'next/router';
import { dateSelectionToObject } from '../../../utilitites/Fees';

const EditParticipantsForm: React.FC<{ participant: TeilnehmerIn, onCancel: VoidFunction }> = ({ participant, onCancel }) => {

  const layout: ColProps = { sm: 10, md: 7, lg: 6, xl: 7, xxl: 8 }
  const validateMessages = {
    required: "${label} ist ein Pflichtfeld",
    date: {
      format: "Ungültiger Geburtstag (TT.MM.JJJJ)",
      parse: "Ungültiger Geburtstag (TT.MM.JJJJ)",
      invalid: "Ungültiger Geburtstag (TT.MM.JJJJ)"
    },
    number: {
      range: "Ungültige Postleitzahl"
    }
  }

  const [form] = Form.useForm()
  const router = useRouter()

  const onSubmit = async (values: any) => {

    console.log(values);

    /* * *
     * Allow helpers to be underage
     * * *
      if (role !== "participant" && !hasLegalAge(values.birthDate)) {
      message.error("Als Leiter- oder Helfer:in musst du min. 18 Jahre alt sein.")
      return
    }
    */

    const res = await defaultFetch(`/api/participants/${participant.id}`, "PUT", {
      ...values,
      presence: dateSelectionToObject(values.presence),
      birthDate: values.birthDate.toDate(),
      course: values.course ? values.course.toDate() : undefined,
      juleica: values.juleica ? {
        ...values.juleica,
        terminates: values.juleica.terminates ? values.juleica.terminates.toDate() : undefined
      } : undefined
    })
    if (res.status === 200) {
      router.reload()
    } else {
      message.error(res.statusText)
    }
  }

  const [legalAge, setLegalAge] = useState(hasLegalAge(moment(participant.birthDate)))
  const [role, setRole] = useState(participant.role)
  const updateRole = (role: string) => {
    setRole(role as ParticipantRoleText)
    if (role === "helper") {
      form.setFields([{
        name: "tribe",
        value: 1312
      }])
    }
  }

  const onBirthDateChange = () => setLegalAge(hasLegalAge(form.getFieldValue('birthDate')));

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
        presence: Object.entries(participant.presence).filter(([, val]) => val).map(([key]) => key),
        address: {
          ...participant.address,
          zipCode: Number(participant.address.zipCode)
        },
        tribe: Number(participant.tribe),
        birthDate: moment(participant.birthDate),
        juleica: participant.juleica ? {
          ...participant.juleica,
          terminates: participant.juleica.terminates ? moment(participant.juleica.terminates) : undefined
        } : undefined,
        course: participant.course ? moment(participant.course) : undefined
      }}
      onFinish={onSubmit}
    >
      <RoleSelection roleChanged={e => updateRole(e.target.value)} />
      <Personal changeBirthDate={onBirthDateChange}/>
      <ContactData/>
      <Address />
      <Membership role="participant" />
      { role !== "participant" && <LeaderInformation form={form} />}
      <EatingBehaviourSelection />
      <FoodIntolerances />
      <CovidVaccination />
      <Vaccinations />
      <Diseases />
      <HealthInsurance />
      <Swimmer />
      { !legalAge && <LegalGuardian form={form} /> }
      <Contacts form={form} needsLegalGuardian={!legalAge} />
      <Presence />
      <Comments />
      <SubmitButton text="Änderung speichern" />
      <CancelButton onClick={() => {
        form.resetFields()
        onCancel()
      }} />
    </Form>
  )
}

export default EditParticipantsForm
