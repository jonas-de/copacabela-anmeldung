import { GetServerSideUserPropsContext } from '../utilitites/Authentication';
import React from 'react';
import Header from '../components/layout/Header';
import { Container, Row } from 'react-bootstrap';
import { Button, Form, Input, message } from 'antd';
import { useRouter } from 'next/router';
import defaultFetch from '../utilitites/defaultFetch';

const getServerSideProps = (context: GetServerSideUserPropsContext) => {
  if (context.req.user || !context.query.token) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    }
  }
  return {
    props: {
      token: context.query.token
    }
  }
}

const ResetPWPage: React.FC<{ token: string }> = ({ token }) => {

  const router = useRouter()

  const reset = async (values: any) => {
    if (values.password === undefined) {
      await message.error("Gib ein neues Passwort ein")
    } else {
      const res = await defaultFetch("api/participantscontroller/reset-password", "POST", {
          password: values.password,
          token
      })
      if (res.ok) {
        await router.replace("/login")
      } else {
        await message.error("Passwort konnte nicht zurückgesetzt werden.")
      }
    }
  }

  const ResetPasswordForm: React.FC = () => (
    <Form
      labelCol={{ span: 8}}
      wrapperCol={{ span: 16 }}
      colon={false}
      onFinish={reset}
    >
      <Form.Item label="Neues Passwort" name="password">
        <Input.Password style={{ width: 240 }} />
      </Form.Item>
      <Form.Item label=" ">
        <Button type="primary" style={{ width: 240 }} htmlType="submit">Passwort zurücksetzen</Button>
      </Form.Item>
    </Form>
  )

  return (
    <>
      <Header showLogin={false} loggedIn={false} />
      <Container>
        <Row className="p-4">
          <ResetPasswordForm />
        </Row>
      </Container>
    </>
  )
}

export default ResetPWPage
export { getServerSideProps }
