import { GetServerSideUserPropsContext } from '../utilitites/Authentication';
import React, { useState } from 'react';
import Header from '../components/Header';
import { Container, Row } from 'react-bootstrap';
import { Button, Form, Input, message } from 'antd';
import { useRouter } from 'next/router';

const getServerSideProps = (context: GetServerSideUserPropsContext) => {
  if (context.req.user) {
    return {
      redirect: {
        destination: context.query["redirect"] || "/",
        permanent: false
      }
    }
  }
  return { props: { redirect: context.query["redirect"] || "/" }}
}

const LoginPage: React.FC<{ redirect: string }> = ({ redirect }) => {

  const router = useRouter()
  const [state, setState] = useState("login")

  const login = async (values: any) => {
    if (values.username === undefined || values.password === undefined) {
      await message.error("Zugangsdaten fehlen")
    } else {
      const res = await fetch('api/participantscontroller/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.username,
          password: values.password,
        })
      })
      if (res.ok) {
        await router.replace(redirect)
      } else {
        await message.error("Anmeldefehler")
      }
    }
  }

  const resetPw = async (values: any) => {
    if (values.username === undefined) {
      await message.error("Gib deine E-Mailadresse an")
      return
    }
    const res = await fetch("/api/participantscontroller/forgot-password", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: values.username,
      }),
    })
    if (res.ok) {
      message.info("Eine E-Mail zum Zurücksetzen deines Passworts wurde verschickt")
        .then()
      setState("login")
    } else {
      message.error(res.statusText)
    }
  }

  const forgotPw = () => {
    setState("reset")
  }

  const ResetPasswordForm: React.FC = () => (
    <Form
      labelCol={{ span: 8}}
      wrapperCol={{ span: 16 }}
      colon={false}
      onFinish={resetPw}
      >
      <Form.Item label="E-Mail" name="username">
        <Input type="email" style={{ width: 240 }} />
      </Form.Item>
      <Form.Item label=" ">
        <Button type="primary" style={{ width: 240 }} htmlType="submit">Passwort zurücksetzen</Button>
      </Form.Item>
      <Form.Item label=" ">
        <Button type="default" style={{ width: 240 }} onClick={() => setState("login")}>Anmelden</Button>
      </Form.Item>
    </Form>
  )

  const LoginForm: React.FC = () => (
    <Form
      labelCol={{ span: 8}}
      wrapperCol={{ span: 16 }}
      colon={false}
      onFinish={login}
    >
      <Form.Item label="E-Mail" name="username" rules={[{type: "email", message: "Gib eine gültige E-Mailadresse an"}]}>
        <Input type="email" style={{ width: 240 }}/>
      </Form.Item>
      <Form.Item label="Passwort" name="password">
        <Input.Password style={{ width: 240 }}/>
      </Form.Item>
      <Form.Item label=" ">
        <Button type="primary" size="large" style={{ width: 240 }} htmlType="submit">
          Anmelden
        </Button>
      </Form.Item>
      <Form.Item label=" ">
        <Button type="default" size="large" style={{ width: 240 }} onClick={forgotPw}>
          Passwort vergessen
        </Button>
      </Form.Item>
    </Form>
    )

    return (
    <>
      <Header showLogin={false} loggedIn={false} />
      <Container>
        <Row className="p-4">
          { state == "login" ? <LoginForm/> : <ResetPasswordForm/>}
        </Row>
      </Container>
    </>
  )
}

export default LoginPage
export { getServerSideProps }
