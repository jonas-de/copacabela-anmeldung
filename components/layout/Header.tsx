import {Button, Container, Nav, Navbar} from 'react-bootstrap';
import React from 'react';
import {useRouter} from 'next/router';
import Link from 'next/link';

export type HeaderProps = {
  loggedIn: boolean;
  showLogin: boolean;
};

const Header: React.FC<HeaderProps> = ({loggedIn, showLogin}: HeaderProps) => {
  const router = useRouter();

  return (
    <Navbar variant="dark" style={{background: 'var(--dpsg-blue)'}} expand="sm">
      <Container fluid="md">
        <Link prefetch={false} passHref href="/">
          <Navbar.Brand>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              style={{marginTop: -6}}
              src="/images/Bezirkslogo.jpg"
              width={32}
              height={32}
              alt="Bezirkslogo"
            />
            <span style={{marginLeft: 8, textDecoration: 'none'}}>
              Bezirk München-Isar
            </span>
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle />
        <Container as={Navbar.Collapse}>
          {loggedIn && (
            <Nav>
              <Nav.Link href="/participants">Übersicht</Nav.Link>
              <Nav.Link href="/config">Einstellungen</Nav.Link>
            </Nav>
          )}
          {showLogin && (
            <Button
              variant={loggedIn ? 'outline-light' : 'primary'}
              style={{marginLeft: 'auto'}}
              onClick={async () => {
                if (loggedIn) {
                  await fetch('/api/participantscontroller/logout', {
                    method: 'POST',
                    credentials: 'include',
                  });
                  await router.push('/');
                } else {
                  await router.push('/login');
                }
              }}
            >
              {loggedIn ? 'Logout' : 'Login'}
            </Button>
          )}
        </Container>
      </Container>
    </Navbar>
  );
};

export default Header;
