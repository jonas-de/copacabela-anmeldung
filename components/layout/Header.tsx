import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Link from 'next/link';

export type HeaderProps = {
  showLogin: boolean
  loggedIn: boolean
}

const Header: React.FC<HeaderProps> = ({ showLogin, loggedIn = false }: HeaderProps) => {
  const router = useRouter()
  return (
    <Navbar
      variant="dark"
      style={{ background: "var(--dpsg-blue)"}}
      expand="sm"
    >
      <Container fluid="md">
        <Link prefetch={false} passHref href="/">
          <Navbar.Brand>
            <img
              style={{ marginTop: -6}}
              src="/images/Copacabela-100.png"
              width={32}
              height={32}
              alt="CopacaBela-Logo"/>
            {" CopacaBeLa" }
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle/>
        <Container as={Navbar.Collapse}>
          { loggedIn && (
            <Nav>
              <Nav.Link href="/participants">Übersicht</Nav.Link>
              <Nav.Link href="/participants/config">Einstellungen</Nav.Link>
            </Nav>
          )}
          { showLogin && (
            <Button
              variant={ loggedIn ? "outline-light" : "primary" }
              style={{ marginLeft: "auto" }}
              onClick={async () => {
                if (loggedIn) {
                  await fetch("/api/participantscontroller/logout", {
                    method: "POST",
                    credentials: "include"
                  })
                  await router.push("/")
                } else {
                  await router.push("/login")
                }
              }}
            >
              { loggedIn ? "Logout" : "Login" }
            </Button>
          )}
        </Container>
      </Container>
    </Navbar>
  )
}

export default Header
