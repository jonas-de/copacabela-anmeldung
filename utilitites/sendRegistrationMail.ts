import {AfterChangeHook} from 'payload/dist/collections/config/types';
import {Participant} from '../payload-types';
import fs from 'fs';
import payload from 'payload';

const mustache = require('mustache');

const generateMailText = (name: string, id: string, token: string): string => {
  try {
    const mail = fs.readFileSync('mails/Registration.html');

    const url = `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/confirm?token=${token}&id=${id}`;

    return mustache.render(mail.toString(), {
      name,
      confirm_link: url,
      preview: `Hallo ${name}, bestätige jetzt deine Anmeldung zum BeLeWe.`,
    });
  } catch (error) {
    console.error(error);
    return "Couldn't read mail template";
  }
};

const sendRegistrationMail: AfterChangeHook<Participant> = async ({
  doc,
  req,
  operation,
}) => {
  if (operation !== 'create' || req.query['mail'] === 'false') {
    return;
  }

  const message = {
    from: 'Anmeldung BeLeWe <belewe@dpsg1312.de>',
    to: doc.email,
    subject: 'Deine Anmeldung zum BeLeWe',
    html: generateMailText(doc.firstName, doc.id, doc.confirmationToken),
  };
  await payload.sendEmail(message);
};

export default sendRegistrationMail;
