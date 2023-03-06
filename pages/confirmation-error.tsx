import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import defaultFetch from '../utilitites/defaultFetch';
import Page from '../components/layout/Page';
import {Container} from 'react-bootstrap';
import {Result, Spin} from 'antd';

const ConfirmPage: React.FC = () => (
  <Page loggedIn={false} showLogin={false}>
    <Container fluid="md">
      <Result
        status="error"
        title="Anmeldung konnte nicht bestätigt werden"
        subTitle="Der benutzte Link ist ungültig."
      />
    </Container>
  </Page>
);

export default ConfirmPage;
