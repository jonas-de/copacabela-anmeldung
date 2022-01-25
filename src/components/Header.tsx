import { Button, Container, Navbar, Nav } from 'react-bootstrap';
import React, { useState } from 'react';
import Image from 'next/image'
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
      style={{ background: "var(--dpsg-blue)" }}
      expand="sm"
    >
      <Container fluid="md">
        <Link prefetch={false} passHref href="/">
          <Navbar.Brand>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/Copacabela.png"
              width={30}
              height={30}
              className="-inline-block align-top"
              alt="CopacaBela-Logo"/>
            {" CopacaBela" }
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle/>
        <Container as={Navbar.Collapse}>
          <Nav>
            <Nav.Link href="/participants">Übersicht</Nav.Link>
          </Nav>
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
