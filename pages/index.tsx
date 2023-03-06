import React from 'react';
import {Container, Row as BSRow} from 'react-bootstrap';
import {useTimer} from 'react-timer-hook';
import {GetServerSideUserPropsContext} from '../utilitites/Authentication';
import Page from '../components/layout/Page';
import {AccessLevelText, getAccessLevelForHeader} from '../utilitites/Levels';
import registrationAllowed from '../utilitites/registrationAllowed';
import RegistrationClosed from '../components/RegistrationClosed';
import ParticipantsForm from '../components/participants/form/ParticipantsForm';

const getServerSideProps = (context: GetServerSideUserPropsContext) => {
  return {
    props: {
      loggedIn: context.req.user !== undefined,
    },
  };
};

const CountdownView: React.FC = () => {
  const {seconds, minutes, hours, days} = useTimer({
    expiryTimestamp: new Date(2023, 4, 14, 16),
    autoStart: true,
  });
  return (
    <>
      {(seconds !== 0 || minutes !== 0 || hours !== 0 || days !== 0) && (
        <span
          style={{
            fontSize: 32,
            fontWeight: 'bold',
            fontFamily: 'monospace,sans-serif',
          }}
        >
          noch
          <br />
          {days} {days === 1 ? 'Tag' : 'Tage'}
          <br />
          {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:
          {String(seconds).padStart(2, '0')}
        </span>
      )}
      {seconds === 0 && minutes === 0 && hours === 0 && days === 0 && (
        <h1>
          <strong>Das wars...️</strong>
        </h1>
      )}
    </>
  );
};

const page: React.FC<{loggedIn: boolean}> = ({loggedIn}) => {
  return (
    <Page loggedIn={loggedIn} showLogin={true}>
      <Container className="pt-4 pb-4">
        <BSRow className="text-center pt-4 pb-4">
          <h1>Anmeldung zum Bezirksleitendenwochende</h1>
          <h3 className="text-secondary">14. - 16.04.2023</h3>
        </BSRow>
        <BSRow className="pt-4 pb-4">
          {registrationAllowed() && <ParticipantsForm />}
        </BSRow>
        <BSRow className="text-center pt-4 pb-4">
          {!registrationAllowed() && <RegistrationClosed />}
        </BSRow>
      </Container>
    </Page>
  );
};

export default page;
export {getServerSideProps};
