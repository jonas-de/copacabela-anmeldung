import { ColProps, Divider, Form, FormInstance } from 'antd';
import {
  Address,
  Comments, ContactData,
  Contacts, CovidVaccination, Diseases, EatingBehaviourSelection, FoodIntolerances,
  HealthInsurance, LeaderInformation, Membership,
  Personal, RegisterButton,
  RoleSelection, Swimmer, Vaccinations
} from './ParticipantsFormComponents';
import React, { useState } from 'react';
import { EatingBehaviour } from '../utilitites/Wording';
import { hasLegalAge, ParticipantRoles } from '../utilitites/Persons';

const ParticipantsForm: React.FC = () => {

  const layout: ColProps = { span: 8 }
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

  const onBirthDateChange = () => setLegalAge(hasLegalAge(form.getFieldValue('birthDate')));

  const onSubmit = (values: any) => {
    values.birthDate = values.birthDate.toDate()
    console.log(values)
    fetch("/api/participants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(values)
    }).then(r => console.log(r))
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
          eatingBehaviour: EatingBehaviour[0].slug
        }
      }}
      onFinish={onSubmit}
    >
      <RoleSelection roleChanged={e => setRole(e.target.value)} />
      <Personal changeBirthDate={onBirthDateChange}/>
      <ContactData/>
      <Address />
      <Membership />
      { role === "leader" && <LeaderInformation form={form} />}
      <EatingBehaviourSelection />
      <FoodIntolerances />
      <CovidVaccination />
      <Vaccinations />
      <Diseases />
      <HealthInsurance />
      <Swimmer />
      <Contacts form={form} legalAge={legalAge} />
      <Comments />
      <RegisterButton />
    </Form>
  )
}

export default ParticipantsForm

/*













 */
