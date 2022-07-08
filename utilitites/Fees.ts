const dateArray = [4, 5, 6, 7, 8, 9, 10, 11];

const dateSelectionToObject = (arr: string[]) => {
  const obj: {[key: string]: boolean} = {};
  dateArray.forEach(date => {
    const dateString = String(date);
    obj[dateString] = arr.includes(dateString);
  });
  return obj;
};

const dateObjectToText = (obj: {[key: string]: boolean}) => {
  const entries = Object.entries(obj);
  if (entries.every(([, present]) => present)) {
    return 'Immer';
  }
  const texts: string[] = [];
  let currentText = '';
  let startDate = '';
  let currentlyPresent = false;
  let lastDate = '';

  entries.forEach(([date, isPresent]) => {
    if (!currentlyPresent && isPresent) {
      currentText += `${date.padStart(2, '0')}.`;
      startDate = date;
      currentlyPresent = true;
    } else if (currentlyPresent && !isPresent && lastDate === startDate) {
      texts.push(currentText);
      currentText = '';
      currentlyPresent = false;
    } else if (currentlyPresent && !isPresent) {
      currentText += ` - ${lastDate.padStart(2, '0')}.`;
      texts.push(currentText);
      currentText = '';
      currentlyPresent = false;
    }
    lastDate = date;
    // console.log(`${date}: ${currentlyPresent} | ${isPresent} | ${lastDate} | ${currentText}`);
  });
  if (startDate !== lastDate) {
    currentText += ` - ${lastDate.padStart(2, '0')}.`;
  }
  if (currentlyPresent) {
    texts.push(currentText);
  }
  const days = entries.filter(([, present]) => present).length;
  return texts.join(', ') + ` (${days} ${days === 1 ? 'Tag' : 'Tage'})`;
};

export {dateArray, dateSelectionToObject, dateObjectToText};
