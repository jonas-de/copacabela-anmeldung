import React from 'react';
import Header from '../Header';

export type PageProps = {
  showLogin?: boolean
  loggedIn?: boolean
}

const Page: React.FC<PageProps> = ({ showLogin= true, loggedIn= false, children }) => (
  <>
    <Header showLogin={showLogin} loggedIn={loggedIn} />
    { children }
  </>
)

export default Page
