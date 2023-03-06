import {CollectionConfig} from 'payload/types';
import {Participantscontroller} from '../payload-types';
import payload from 'payload';
import fs from 'fs';

const mustache = require('mustache');

const ParticipantsController: CollectionConfig = {
  slug: 'participantscontroller',
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Name',
      required: true,
    },
  ],
  labels: {
    singular: 'Teilnehmendenverwalter:in',
    plural: 'Teilnehmendenverwaltende',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email'],
    disableDuplicate: true,
  },
  hooks: {
    beforeValidate: [
      async ({data, operation, req}) => {
        if (operation === 'create' && data) {
          if (!req?.user) {
            return data;
          }

          const generator = require('generate-password');
          return {
            ...data,
            password: generator.generate({
              length: 32,
              numbers: true,
              symbols: true,
              lowercase: true,
              uppercase: true,
            }),
          };
        }
      },
    ],
    afterChange: [
      async ({doc, req, operation}) => {
        const {totalDocs} = await payload.find<'participantscontroller'>({
          collection: 'participantscontroller',
        });

        if (operation === 'create' && totalDocs > 1) {
          await payload.forgotPassword({
            collection: 'participantscontroller',
            data: {
              email: doc.email,
            },
            req,
          });
        }
      },
    ],
  },
  auth: {
    cookies: {
      secure: true,
    },
    forgotPassword: {
      generateEmailHTML: args => {
        if (!args) {
          return 'Invalid parameters for email generation';
        }
        const {user, token} = args;
        const name: string = (user as Participantscontroller).name;
        const url = `${
          process.env.PAYLOAD_PUBLIC_SERVER_URL
        }/reset-password?token=${token || ''}`;

        try {
          const file = fs.readFileSync('mails/Password.html');
          return mustache.render(file.toString(), {
            preview: `Hallo ${name}, du erhälst diese Mail, weil du im BeLeWe-Anmeldetool dein Passwort zurücksetzen willst oder dir ein Account angelegt wurde.`,
            name,
            reset_link: url,
          });
        } catch (error) {
          console.error(error);
          return "Couldn't load e-mail template";
        }
      },
      generateEmailSubject: () => {
        return 'Neues Passwort für das BeLeWe-Anmeldetool';
      },
    },
  },
};

export default ParticipantsController;
