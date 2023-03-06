import {Dayjs} from 'dayjs';
import dayjstz from './dayjstz';

const getAge = (birthDate: Dayjs) => {
  const start = dayjstz('14.04.2023', 'DD.MM.YYYY');
  return start.diff(birthDate, 'years');
};

const hasLegalAge = (birthDate: Dayjs | undefined) => {
  if (birthDate === undefined) {
    return false;
  }
  return getAge(birthDate) >= 18;
};

export {getAge, hasLegalAge};
