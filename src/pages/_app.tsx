import React from 'react';
import type { AppProps } from 'next/app';
import '../styles/App.css'
import { ConfigProvider } from 'antd';
import deDE from 'antd/lib/locale/de_DE'

const MyApp = ({ Component, pageProps }: AppProps): React.ReactElement => (
  <Component {...pageProps} />
);

export default MyApp;
