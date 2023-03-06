import dayjstz from './dayjstz';

const registrationAllowed = () => {
  return dayjstz()
    .tz('Europe/Berlin')
    .isBefore(dayjstz('2023-04-01', 'YYYY-MM-DD'));
};

export default registrationAllowed;
