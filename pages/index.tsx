import React from 'react';
import {Container, Row as BSRow} from 'react-bootstrap';
import {useTimer} from 'react-timer-hook';
import {GetServerSideUserPropsContext} from '../utilitites/Authentication';
import Page from '../components/layout/Page';
import {AccessLevelText, getAccessLevelForHeader} from '../utilitites/Levels';
import {Button} from 'antd';
import Image from 'next/image';

const getServerSideProps = (context: GetServerSideUserPropsContext) => {
  return {
    props: {
      accessLevel:
        context.req.user !== undefined
          ? getAccessLevelForHeader(context.req.user)
          : 'noUser',
    },
  };
};

const CountdownView: React.FC = () => {
  const {seconds, minutes, hours, days} = useTimer({
    expiryTimestamp: new Date(2022, 5, 4, 8),
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
          <strong>Schön wars!️</strong>
        </h1>
      )}
    </>
  );
};

const page: React.FC<{accessLevel: AccessLevelText | 'noUser'}> = ({
  accessLevel,
}) => {
  return (
    <Page level={accessLevel} showLogin={true}>
      <Container className="pt-4 pb-4">
        <BSRow className="justify-content-center">
          <Image
            src={'/images/Copacabela.png'}
            width={200}
            height={200}
            alt={'CopacaBeLa-Logo'}
          />
        </BSRow>
        <BSRow className="text-center pt-4 pb-4">
          {/* <ParticipantsForm /> */}
          <CountdownView />
        </BSRow>
        <BSRow className="text-center justify-content-center pt-4 pb-4">
          <span style={{fontSize: 16, color: 'gray'}}>
            Unser{' '}
            <a href="https://dpsg1312.de/wordpress2/wp-content/uploads/2022/05/Coronaschutzkonzept.pdf">
              Corona-
            </a>{' '}
            und{' '}
            <a href="https://dpsg1312.de/wordpress2/wp-content/uploads/2022/05/Schutzkonzept_final.pdf">
              allgemeines Schutzkonzept
            </a>{' '}
            findest du ab sofort auf unserer Bezirkshomepage:
          </span>
          <Button
            style={{width: 200, marginTop: 16}}
            href="https://dpsg1312.de/wordpress2/copacabela-2"
          >
            dpsg1312.de
          </Button>
        </BSRow>
      </Container>
    </Page>
  );
};

export default page;
export {getServerSideProps};
