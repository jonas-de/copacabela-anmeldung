import {Button, Container, Nav, Navbar} from 'react-bootstrap';
import React from 'react';
import {useRouter} from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

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
            <Image
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
      </Container>
    </Navbar>
  );
};

export default Header;
