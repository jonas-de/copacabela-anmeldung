import { ColProps, Form, message } from 'antd';
import {
  Address,
  Comments, Conditions,
  ContactData,
  Contacts,
  CovidVaccination,
  Diseases,
  EatingBehaviourSelection,
  FoodIntolerances, FurtherInformation,
  HealthInsurance,
  LeaderInformation,
  LegalGuardian,
  Membership,
  Personal,
  RoleSelection,
  SubmitButton,
  Swimmer,
  Vaccinations
} from './ParticipantsFormComponents';
import React, { useState } from 'react';
import { EatingBehaviours } from '../utilitites/Wording';
import { hasLegalAge, ParticipantRoles } from '../utilitites/Persons';
import defaultFetch from '../utilitites/defaultFetch';

const ParticipantsForm: React.FC = () => {

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

  const [legalAge, setLegalAge] = useState(false)
  const [role, setRole] = useState("participant")
  const updateRole = (role: string) => {
    setRole(role)
    if (role === "helper") {
      form.setFields([{
        name: "tribe",
        value: 1312
      }])
    }
  }

  const onBirthDateChange = () => setLegalAge(hasLegalAge(form.getFieldValue('birthDate')));

  const onSubmit = async (values: any) => {
    if (role !== "participant" && !hasLegalAge(values.birthDate)) {
      message.error("Als Leiter- oder Helfer:in musst du min. 18 Jahre alt sein.")
      return
    }
    values.birthDate = values.birthDate.toDate()
    console.log(values)
    const res = await defaultFetch("/api/participants", "POST", values)
    console.log(res.status)
    if (res.ok) {
      message.success("Erfolgreich angemeldet")
    } else {
      message.error(res.statusText)
    }
  }

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
        role: ParticipantRoles[0].slug,
        food: {
          eatingBehaviour: EatingBehaviours[0].slug
        }
      }}
      onFinish={onSubmit}
    >
      <RoleSelection roleChanged={e => updateRole(e.target.value)} />
      <Personal changeBirthDate={onBirthDateChange}/>
      <ContactData/>
      <Address />
      <Membership role={role} />
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
      <Comments />
      <Conditions isLeader={role !== "participant"}/>
      <SubmitButton text="Bedingungen bestätigen und Anmelden" />
      <FurtherInformation />
    </Form>
  )
}

export default ParticipantsForm
