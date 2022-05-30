import React from 'react';
import { Container, Row as BSRow } from 'react-bootstrap';
import Countdown from "react-countdown";
import { GetServerSideUserPropsContext } from '../utilitites/Authentication';
import Page from '../components/layout/Page';
import Closed from '../components/RegistrationClosed';
import { AccessLevelText, getAccessLevelForHeader } from '../utilitites/Levels';
import { Button } from 'antd';
import Image from 'next/image';

const getServerSideProps = (context: GetServerSideUserPropsContext) => {
  return {
    props: {
      accessLevel: context.req.user !== undefined ? getAccessLevelForHeader(context.req.user) : "noUser"
    }
  }
}

const CountdownView: React.FC = () => {


  const renderer = ({ days, hours, minutes, seconds, completed }: {days: number, hours: number, minutes: number, seconds: number, completed: boolean}) => {
    if (completed) {
      // Render a completed state
      return <h1><strong>Das CopacaBeLa läuft 🎉🏕️</strong></h1>;
    } else {
      // Render a countdown
      return <span style={{ fontSize: 32, fontWeight: "bold", fontFamily: "monospace"}}>noch<br />{days} {days === 1 ? "Tag" : "Tage"}<br />{String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}</span>;
    }
  }

  // @ts-ignore
  return <Countdown date={Date.parse("2022-06-04 08:00")} renderer={renderer} />
}

// @ts-ignore
const page: React.FC<{ accessLevel: AccessLevelText | "noUser"}> = ({ accessLevel }) => {

  return (
    <Page level={accessLevel} showLogin={true}>
      <Container className="pt-4 pb-4">
        <BSRow className="justify-content-center">
          <Image src={"/images/Copacabela.png"} width={200} height={200} alt={"CopacaBeLa-Logo"} />
        </BSRow>
        <BSRow className="pt-2 pb-4 text-center">
          <h5>vom 04. - 11. Juni 2022 im Scout Camp Austria</h5>
        </BSRow>
        <BSRow className="text-center pt-4 pb-4">
          { /* <ParticipantsForm /> */ }
          <CountdownView />
        </BSRow>
        <BSRow className="text-center justify-content-center pt-4 pb-4">
          <span style={{ fontSize: 16, color: "gray" }}>
            Unser <a href="https://dpsg1312.de/wordpress2/wp-content/uploads/2022/05/Coronaschutzkonzept.pdf">Corona-</a> und <a href="https://dpsg1312.de/wordpress2/wp-content/uploads/2022/05/Schutzkonzept_final.pdf">allgemeines Schutzkonzept</a> findest du ab sofort auf unserer Bezirkshomepage:
          </span>
          <Button style={{ width: 200, marginTop: 16}} href="https://dpsg1312.de/wordpress2/copacabela-2">dpsg1312.de</Button>
        </BSRow>
      </Container>
    </Page>
  )
}

export default page
export { getServerSideProps }
