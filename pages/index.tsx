import React from 'react';
import { Container, Row as BSRow } from 'react-bootstrap';
import { GetServerSideUserPropsContext } from '../utilitites/Authentication';
import Page from '../components/layout/Page';
import Closed from '../components/RegistrationClosed';

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
    <Page loggedIn={loggedIn} showLogin={true}>
      <Container className="pt-4 pb-4">
        <BSRow className="text-center">
          <h2>Anmeldung zum CopacaBeLa</h2>
        </BSRow>
        <BSRow className="pb-4 text-center">
          <h5>vom 04. - 11. Juni 2022 im Scout Camp Austria</h5>
        </BSRow>
        <BSRow>
          { /* <ParticipantsForm /> */ }
          <Closed />
        </BSRow>
      </Container>
    </Page>
  )
}

export default page
export { getServerSideProps }
