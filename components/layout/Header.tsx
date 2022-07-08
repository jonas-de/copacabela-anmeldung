import {Button, Container, Nav, Navbar} from 'react-bootstrap';
import React from 'react';
import {useRouter} from 'next/router';
import Link from 'next/link';
import {AccessLevelText} from '../../utilitites/Levels';

export type HeaderProps = {
  level: AccessLevelText | 'noUser';
  showLogin: boolean;
};

const Header: React.FC<HeaderProps> = ({level, showLogin}: HeaderProps) => {
  const router = useRouter();
  return (
    <Navbar variant="dark" style={{background: 'var(--dpsg-blue)'}} expand="sm">
      <Container fluid="md">
        <Link prefetch={false} passHref href="/">
          <Navbar.Brand>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              style={{marginTop: -6}}
              src="/images/Copacabela-100.png"
              width={32}
              height={32}
              alt="CopacaBela-Logo"
            />
            {' CopacaBeLa'}
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle />
        <Container as={Navbar.Collapse}>
          {level !== 'noUser' && (
            <Nav>
              {level !== 'kitchen' && level !== 'strandkorb' && (
                <Nav.Link href="/participants">Übersicht</Nav.Link>
              )}
              {(level === 'all' || level === 'bevo') && (
                <Nav.Link href="/participants/config">Einstellungen</Nav.Link>
              )}
              {(level === 'bevo' || level === 'kitchen') && (
                <Nav.Link href="/food">Essverhalten</Nav.Link>
              )}
              {level === 'bevo' && <Nav.Link href="/stats">Statistik</Nav.Link>}
              {(level === 'bevo' || level === 'strandkorb') && (
                <Nav.Link href="/strandkorb">Strandkorb</Nav.Link>
              )}
            </Nav>
          )}
          {showLogin && (
            <Button
              variant={level !== 'noUser' ? 'outline-light' : 'primary'}
              style={{marginLeft: 'auto'}}
              onClick={async () => {
                if (level !== 'noUser') {
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
              {level !== 'noUser' ? 'Logout' : 'Login'}
            </Button>
          )}
        </Container>
      </Container>
    </Navbar>
  );
};

export default Header;
