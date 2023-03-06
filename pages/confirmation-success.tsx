import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import defaultFetch from '../utilitites/defaultFetch';
import Page from '../components/layout/Page';
import {Container} from 'react-bootstrap';
import {Result, Spin} from 'antd';

const ConfirmPage: React.FC = () => {
  return (
    <Page loggedIn={false} showLogin={false}>
      <Container fluid="md">
        <Result status="success" title="Anmeldung bestätigt" />
      </Container>
    </Page>
  );
};

export default ConfirmPage;
