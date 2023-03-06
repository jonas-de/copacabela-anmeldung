import React from 'react';
import type {AppProps} from 'next/app';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/App.css';

const MyApp = ({Component, pageProps}: AppProps): React.ReactElement => (
  <Component {...pageProps} />
);

export default MyApp;
