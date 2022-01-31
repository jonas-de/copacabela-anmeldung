import { ColProps, Form, message, Modal } from 'antd';
import React, { useState } from 'react';
import { hasLegalAge, ParticipantRoles } from '../utilitites/Persons';
import { EatingBehaviours } from '../utilitites/Wording';
import {
  Address,
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
  Personal,
  RoleSelection,
  Swimmer,
  Vaccinations
} from './ParticipantsFormComponents';

export const ManualParticipantForm: React.FC<{
  tribe?: number,
  visible: boolean,
  cancel: VoidFunction,
  complete: (values: any) => void
}> = ({ tribe, visible, cancel, complete }) => {

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

  return (
    <Modal
      title="Neue:r Teilnehmer:in"
      visible={visible}
      onOk={() => {
        form.validateFields()
          .then(values => {
            if (role !== "participant" && !hasLegalAge(values.birthDate)) {
              message.error("Als Leiter- oder Helfer:in muss man 18 Jahre alt sein.")
                 .then()
              return
            }
            values.birthDate = values.birthDate.toDate()
            complete(values)
          })
      }}
      onCancel={() => {
        form.resetFields()
        cancel()
      }}
      okText="Anmelden"
      cancelText="Abbrechen"
      width={1000}
    >
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
          tribe,
          role: ParticipantRoles[0].slug,
          food: {
            eatingBehaviour: EatingBehaviours[0].slug
          }
        }}
      >
        <RoleSelection roleChanged={e => updateRole(e.target.value)} />
        <Personal changeBirthDate={onBirthDateChange}/>
        <ContactData/>
        <Address />
        <Membership tribe={tribe} role={role} />
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
      </Form>
    </Modal>
  )
}
