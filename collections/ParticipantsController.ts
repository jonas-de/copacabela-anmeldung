import {CollectionConfig, Where} from 'payload/types';
import {TribesWithDistrict} from '../utilitites/Tribes';
import {AccessLevels} from '../utilitites/Levels';
import {TeilnehmendenverwalterIn, User} from '../payload-types';
import {Access} from 'payload/config';
import payload from 'payload';
import fs from 'fs';
import {PayloadRequest} from 'payload/dist/express/types';

const mustache = require('mustache');

export type ParticipantsControllerUser = (TeilnehmendenverwalterIn | User) & {
  collection: string;
};

const isBevo = (user: TeilnehmendenverwalterIn): boolean => {
  return user.tribe === '1312' && user.level === 'all';
};

const isStrandkorb = (user: TeilnehmendenverwalterIn): boolean => {
  return user.tribe === '1312' && user.level === 'strandkorb';
};

const isStavo = (user: TeilnehmendenverwalterIn): boolean => {
  return user.tribe !== '1312' && user.level === 'all';
};

const canCreate = (user: TeilnehmendenverwalterIn): boolean => {
  return isBevo(user) || isStavo(user);
};

const isCreationAllowed = (req: PayloadRequest): boolean => {
  const user = req.user as ParticipantsControllerUser;
  if (!user) {
    return false;
  }
  if (user.collection === 'users') {
    return true;
  }
  const controller = user as TeilnehmendenverwalterIn;
  const {tribe, level} = req.body;
  if (isBevo(controller)) {
    if (tribe !== 1312) {
      return level !== 'kitchen';
    }
    return level !== 'all';
  }
  if (isStavo(controller)) {
    return (
      tribe === Number(controller.tribe) &&
      level !== 'all' &&
      level !== 'kitchen'
    );
  }
  return false;
};

const ParticipantsControllerQuery = (user: ParticipantsControllerUser) => {
  if (!user) {
    return false;
  }
  if (user.collection === 'users') {
    return true;
  }
  const participantController = user as TeilnehmendenverwalterIn;
  const query: Where = {};
  // BeVos can access all tribe users & district level accesses
  if (
    participantController.tribe === '1312' &&
    participantController.level === 'all'
  ) {
    query.or = [
      {tribe: {not_equals: '1312'}},
      {and: [{tribe: {equals: '1312'}}, {level: {not_equals: 'all'}}]},
    ];
    return query;
  }

  // StaVos can access their tribe but not themself
  if (
    participantController.tribe !== '1312' &&
    participantController.level === 'all'
  ) {
    query.tribe = {
      equals: participantController.tribe,
    };
    query.level = {
      not_equals: 'all',
    };
    return query;
  }

  query.tribe = {
    equals: 'no',
  };

  query.level = {
    equals: 'no',
  };
  return query;
};

const ParticipantsControllerAccess: Access = ({
  req: {user},
}: {
  req: {user: ParticipantsControllerUser};
}) => ParticipantsControllerQuery(user);

const ParticipantsController: CollectionConfig = {
  slug: 'participantscontroller',
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Name',
      required: true,
    },
    {
      name: 'tribe',
      type: 'select',
      options: TribesWithDistrict.map(tribe => ({
        label: tribe.name,
        value: String(tribe.number),
      })),
      label: 'Zugriffsbereich',
      required: true,
      access: {
        update: ({req: {user}}) => user !== null && user.collection === 'users',
      },
    },
    {
      name: 'level',
      type: 'select',
      options: AccessLevels.map(level => ({
        label: level.plural,
        value: level.slug,
      })),
      label: 'Stufe',
      required: true,
      access: {
        update: ({req: {user}}) => user !== null && user.collection === 'users',
      },
    },
  ],
  labels: {
    singular: 'Teilnehmendenverwalter:in',
    plural: 'Teilnehmendenverwaltende',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'tribe', 'level'],
    disableDuplicate: true,
  },
  access: {
    read: ParticipantsControllerAccess,
    create: ({req}) => {
      return isCreationAllowed(req);
    },
    update: ParticipantsControllerAccess,
    delete: ParticipantsControllerAccess,
  },
  hooks: {
    beforeValidate: [
      async ({data, operation, req}) => {
        if (operation === 'create' && data) {
          const res = await payload.find({
            collection: 'participantscontroller',
            where: {
              and: [
                {
                  tribe: {
                    equals: data.tribe,
                  },
                },
                {
                  level: {
                    equals: data.level,
                  },
                },
              ],
            },
            limit: 1,
          });
          if (
            req!.user !== null &&
            req!.user.collection !== 'users' &&
            res.totalDocs > 0
          ) {
            return {};
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
        if (operation === 'create') {
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
        const name: string = (user as TeilnehmendenverwalterIn).name;
        const url = `${
          process.env.PAYLOAD_PUBLIC_SERVER_URL
        }/reset-password?token=${token || ''}`;

        try {
          const file = fs.readFileSync('mails/Password.html');
          return mustache.render(file.toString(), {
            preview: `Hallo ${name}, du erhälst diese Mail, weil du im CopacaBeLa-Anmeldetool dein Passwort zurücksetzen willst oder dir ein Account angelegt wurde.`,
            image_link: `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/images/Copacabela-100.png`,
            name,
            reset_link: url,
          });
        } catch (error) {
          console.error(error);
          return "Couldn't load e-mail template";
        }
      },
      generateEmailSubject: () => {
        return 'Neues Passwort für das CopacaBeLa-Anmeldetool';
      },
    },
  },
};

export default ParticipantsController;
export {canCreate, isBevo, isStrandkorb};
