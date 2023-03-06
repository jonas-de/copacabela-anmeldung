import React from 'react';
import Header from './Header';
import {Col, Row} from 'react-bootstrap';

export type PageProps = {
  loggedIn: boolean;
  showLogin?: boolean;
  children?: React.ReactNode;
};

const Page: React.FC<PageProps> = ({loggedIn, showLogin = true, children}) => (
  <>
    <Header loggedIn={loggedIn} showLogin={showLogin} />
    <div className="mb-5 pb-5">{children}</div>
    <Row
      className="justify-content-center text-center g-4"
      style={{
        height: 28,
        position: 'fixed',
        left: 0,
        bottom: 0,
        right: 0,
        background: 'ghostwhite',
      }}
    >
      <Col>
        <a href="https://dpsg1312.de/wordpress2/">Bezirk München-Isar ❤️</a>
      </Col>
      <Col>
        <a href="https://dpsg1312.de/wordpress2/impressum">Impressum</a>
      </Col>
      <Col>
        <a href="https://dpsg1312.de/wordpress2/datenschutzerklaerung">
          Datenschutz
        </a>
      </Col>
    </Row>
  </>
);

export default Page;
