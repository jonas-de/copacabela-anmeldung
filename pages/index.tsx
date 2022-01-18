import React from 'react';
import { Form, Layout, Input, Select, DatePicker, Switch } from 'antd';
import { Navbar, Container, Row, Button } from 'react-bootstrap';
import { Genders } from '../utilitites/Wording';
import Tribes from '../utilitites/Tribes';
import Levels from '../utilitites/Levels';
import Header from '../components/Header'
import { GetServerSideUserPropsContext } from '../utilitites/Authentication';

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
        <Row>
          <h2>Melde dich jetzt zum CopacaBela an</h2>
        </Row>
        <Row className="pb-4">
          <h5>Vom 04. - 10. Juni im Scoutcamp Austria</h5>
        </Row>
        <Row>
          <Form size="large" className="p-2" labelCol={{ span: 3}} labelAlign="left" onFinish={() => { console.log("bruh")}}>
            <Form.Item name="gender" label="Geschlecht">
              <Select placeholder="Wählen..." style={{ width: 240 }}>
                { Genders.map(gender => (
                  <Select.Option key={gender.slug} value={gender.slug}>{gender.name}</Select.Option>
                ))}

              </Select>
            </Form.Item>
            <Form.Item name="firstName" label="Vorname">
              <Input placeholder="Baden" style={{ width: 240 }} />
            </Form.Item>
            <Form.Item name="lastName" label="Nachname">
              <Input placeholder="Powell"  style={{ width: 240 }} />
            </Form.Item>
            <Form.Item name="birthDate" label="Geburtsdatum">
              <DatePicker placeholder="01.01.2001" style={{ width: 240 }} format="DD.MM.YYYY" picker="date" />
            </Form.Item>
            <Form.Item name="tribe" label="Stamm">
              <Select
                showSearch
                style={{ width: 240 }}
                placeholder="Wählen..."
                >
                {
                  Tribes.map(tribe => (
                    <Select.Option key={tribe.number} value={tribe.number}>
                      <img className="pe-2" src="images/Swapingo.png" width={35} height={32}/>
                        { tribe.name }
                    </Select.Option>
                  ))
                }
              </Select>
            </Form.Item>
            <Form.Item name="level" label="Stufe">
              <Select
                showSearch
                style={{ width: 240 }}
                placeholder="Wählen..."
              >
                {
                  Levels.map(level => (
                    <Select.Option key={level.slug} value={level.slug}>
                      { level.singular }
                    </Select.Option>
                  ))
                }
              </Select>
            </Form.Item>
            <Form.Item name="swimmer" label="Schwimmer:in">
              <Switch />
            </Form.Item>
          </Form>
        </Row>
      </Container>
      </>
  )
}

export default page
export { getServerSideProps }
