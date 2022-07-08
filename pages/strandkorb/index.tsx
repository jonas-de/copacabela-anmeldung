import React, {useState} from 'react';
import {
  GetServerSideUserPropsContext,
  withUser,
} from '../../utilitites/Authentication';
import {
  AccessLevelText,
  getAccessLevelForHeader,
} from '../../utilitites/Levels';
import Page from '../../components/layout/Page';
import {Button, Checkbox, Col, Form, Input, message, Row} from 'antd';
import {Container} from 'react-bootstrap';
import {SearchOutlined, UserOutlined} from '@ant-design/icons';
import defaultFetch from '../../utilitites/defaultFetch';
import {useRouter} from 'next/router';

const getServerSideProps = withUser(
  async (context: GetServerSideUserPropsContext) => {
    if (
      (context.req.user.level !== 'all' &&
        context.req.user.level !== 'strandkorb') ||
      context.req.user.tribe !== '1312'
    ) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        accessLevel: getAccessLevelForHeader(context.req.user),
      },
    };
  }
);

const Strandkorb: React.FC<{accessLevel: AccessLevelText}> = ({
  accessLevel,
}) => {
  const router = useRouter();

  const initalAutoSearch = (): boolean => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem('autoSearch') === 'true';
    }
    return false;
  };

  const [autoSearch, setAutoSearch] = useState(initalAutoSearch());
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const sanitizeInput = async (e: {target: {value: string}}) => {
    const sanitized = e.target.value.replace(/\D*/, '');
    setInput(sanitized);
    if (sanitized.length === 4) {
      setNotFound(false);
      if (autoSearch) {
        await searchParticipant(sanitized);
      }
    }
  };

  const updateAutoSearch = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('autoSearch', String(!autoSearch));
    }
    setAutoSearch(!autoSearch);
  };

  const searchParticipant = async (id: string) => {
    if (id.length !== 4) {
      return;
    }
    setNotFound(false);
    setLoading(true);

    const res = await defaultFetch(
      `/api/strandkorb/search?orderId=${id}`,
      'GET',
      undefined
    );
    setLoading(false);
    if (res.status === 404) {
      setNotFound(true);
    } else if (res.status === 200) {
      const body = await res.json();
      await router.push(`/strandkorb/${body.id}`);
    } else {
      message.error('Fehler beim Suchen');
    }
  };

  return (
    <Page level={accessLevel} showLogin={true}>
      <Container className="pt-4 pb-4">
        <Row style={{paddingTop: 16, paddingBottom: 16}} justify="center">
          <Col xs="auto">
            <h1>
              <strong>Strandkorb</strong>
            </h1>
          </Col>
        </Row>
        <Row style={{paddingBottom: 16}} justify="center">
          <UserOutlined style={{fontSize: 64}} />
        </Row>
        <Row style={{paddingBottom: 16}} justify="center">
          <Col xs="auto">
            <strong>Teilnehmer:in suchen</strong>
          </Col>
        </Row>
        <Row justify="center">
          <Col>
            <Form.Item
              validateStatus={notFound ? 'error' : undefined}
              help={notFound ? 'Ungültige Nummer' : undefined}
            >
              <Input
                size="large"
                type="text"
                maxLength={4}
                pattern="\d*"
                onChange={sanitizeInput}
                value={input}
                placeholder="0000"
                onKeyDown={async e => {
                  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                    e.preventDefault();
                  }
                  if (e.key === 'Enter' && input.length === 4) {
                    await searchParticipant(input);
                  }
                }}
                style={{
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                  width: 132,
                  letterSpacing: 16,
                  paddingInlineStart: 16,
                  caretColor: 'transparent',
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row style={{paddingTop: 4, paddingBottom: 16}} justify="center">
          <Col xs="auto" style={{color: 'gray'}}>
            4-stellige Bestellnummer
          </Col>
        </Row>
        {!autoSearch && (
          <Row style={{paddingTop: 16}} justify="center">
            <Col xs="auto">
              <Button
                size="large"
                type="primary"
                icon={<SearchOutlined />}
                loading={loading}
                onClick={() => searchParticipant(input)}
                disabled={input.length !== 4}
              >
                Suchen
              </Button>
            </Col>
          </Row>
        )}
        <Row style={{paddingTop: 4}} justify="center">
          <Col xs="auto">
            <Checkbox
              style={{color: 'gray'}}
              checked={autoSearch}
              onClick={updateAutoSearch}
            >
              Automatisch suchen
            </Checkbox>
          </Col>
        </Row>
      </Container>
    </Page>
  );
};

export default Strandkorb;
export {getServerSideProps};
