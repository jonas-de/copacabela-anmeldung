import Error from 'next/error';
import React from 'react';

const ErrorPage: React.FC = () => (
  <Error statusCode={404} title="Seite konnte nicht gefunden werden" />
);

export default ErrorPage;
