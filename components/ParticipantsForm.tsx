import { ColProps, Divider, Form, FormInstance } from 'antd';
import {
  Address,
  Comments, ContactData,
  Contacts, CovidVaccination, Diseases, EatingBehaviourSelection, FoodIntolerances,
  HealthInsurance, LeaderInformation, Membership,
  Personal, RegisterButton,
  RoleSelection, Swimmer, Vaccinations
} from './ParticipantsFormComponents';
import { useState } from 'react';
import { hasLegalAge, ParticipantRoles } from '../collections/Participants';
import { EatingBehaviour } from '../utilitites/Wording';

const ParticipantsForm: React.FC = () => {

  const layout: ColProps = { span: 8 }

  const [form] = Form.useForm()

  const [legalAge, setLegalAge] = useState(false)
  const [role, setRole] = useState("participant")

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
      onFinish={(values) => { console.log(values)}}
      initialValues={{
        role: ParticipantRoles[0].slug,
        food: {
          eatingBehaviour: EatingBehaviour[0].slug
        }
      }}
    >
      <RoleSelection roleChanged={(e) => setRole(e.target.value)} />
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
