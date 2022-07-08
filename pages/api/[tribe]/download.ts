import {NextApiHandler, NextApiRequest} from 'next';
import {isValidTribeOrDistrict} from '../../../utilitites/Tribes';
import {TeilnehmerIn} from '../../../payload-types';
import payload from 'payload';
import {Where} from 'payload/types';
import CSVCreator, {BevoFields} from '../../../utilitites/CSVCreator';
import {User} from 'payload/auth';

const handler: NextApiHandler = async (req, res) => {
  const tribe = Number(req.query.tribe);
  if (!isValidTribeOrDistrict(tribe)) {
    res.status(404).json({error: 'Not found'});
    return;
  }
  const user = (req as unknown as NextApiRequest & {user: User}).user;

  if (!user) {
    res.status(401).json({error: 'Not logged in'});
  }

  if (user.collection === 'participantscontroller' && user.level !== 'all') {
    res.status(403).json({error: 'No access'});
  }

  if (user.tribe !== '1312' && tribe !== Number(user.tribe)) {
    res.status(403).json({error: 'No access'});
  }

  let query: Where =
    user.tribe === '1312'
      ? {}
      : {
          tribe: {
            equals: user.tribe,
          },
        };
  if (user.tribe === '1312' && tribe !== Number(user.tribe)) {
    query = {
      tribe: {
        equals: `${tribe}`,
      },
    };
  }

  if (
    req.query.participants !== undefined &&
    req.query.participants !== 'all'
  ) {
    query = {
      ...query,
      state: {
        equals: req.query.participants,
      },
    };
  }
  let fields = (req.query.fields as string).split(',');
  if (user.tribe !== '1312' || user.level !== 'all') {
    fields = fields.filter(field => !Object.keys(BevoFields).includes(field));
  }

  const participants = await payload.find<TeilnehmerIn>({
    collection: 'participants',
    overrideAccess: false,
    user: user,
    where: query,
    limit: 500,
    sort: 'lastName',
  });

  res.setHeader(
    'Content-disposition',
    `attachment; filename=CopacaBeLa-${tribe}.csv`
  );
  res.setHeader('Content-type', 'application/csv');
  res.write(CSVCreator(participants.docs, fields));
  res.end();
};

export default handler;
