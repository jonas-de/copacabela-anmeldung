import React from 'react';
import Header from './Header';
import { Container } from 'react-bootstrap';
import { Col, Row } from 'antd';
import { AccessLevelText } from '../../utilitites/Levels';

export type PageProps = {
  level: AccessLevelText | "noUser"
  showLogin?: boolean
  loggedIn?: boolean
}

const Page: React.FC<PageProps> = ({ level, showLogin= true, children }) => (
  <>
    <Header level={level} showLogin={showLogin}/>
    <div className="mb-5 pb-5">
      { children }
    </div>
    <Row justify="center" align="middle" gutter={16} style={{ height: 28, position: "fixed", left: 0, bottom: 0, right: 0, background: "ghostwhite" }}>
      <Col><a href="https://dpsg1312.de/wordpress2/">Bezirk München-Isar ❤️</a></Col>
      <Col><a href="https://dpsg1312.de/wordpress2/impressum">Impressum</a></Col>
      <Col><a href="https://dpsg1312.de/wordpress2/datenschutzerklaerung">Datenschutz</a></Col>
    </Row>
  </>
)

export default Page
