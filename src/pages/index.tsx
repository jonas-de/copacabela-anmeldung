import React from 'react';
import {
  Form,
  Layout,
  Input,
  Select,
  DatePicker,
  Switch,
  Radio,
  Row,
  Col,
  InputNumber, Checkbox
} from 'antd';
import { Navbar, Container, Row as BSRow, Button } from 'react-bootstrap';
import { EatingBehaviour, Genders } from '../utilitites/Wording';
import Tribes, { TribesWithDistrict } from '../utilitites/Tribes';
import Levels from '../utilitites/Levels';
import Header from '../components/Header'
import { GetServerSideUserPropsContext } from '../utilitites/Authentication';
import { Contacts } from '../components/ParticipantsFormComponents';
import ParticipantsForm from '../components/ParticipantsForm';
import { hasLegalAge } from '../utilitites/Persons';

const getServerSideProps = (context: GetServerSideUserPropsContext) => {
  return {
    props: {
      loggedIn: context.req.user !== undefined
    }
  }
}

// @ts-ignore
const page: React.FC = ({ loggedIn }) => {
  return (
    <>
      <Header showLogin={true} loggedIn={loggedIn}/>
      <Container className="pt-4 pb-4">
        <BSRow className="text-center">
          <h2>Anmeldung zum CopacaBela</h2>
        </BSRow>
        <BSRow className="pb-4 text-center">
          <h5>vom 04. - 10. Juni im Scoutcamp Austria</h5>
        </BSRow>
        <BSRow>
          <ParticipantsForm />
        </BSRow>
      </Container>
    </>
  )
}

export default page
export { getServerSideProps }
