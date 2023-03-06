import {NextApiHandler, NextApiRequest} from 'next';
import payload from 'payload';
import {Where} from 'payload/types';
import {User} from 'payload/auth';
import dayjs from 'dayjs';
import writeExcel from '../../utilitites/writeExcel';

const handler: NextApiHandler = async (req, res) => {
  const user = (req as unknown as NextApiRequest & {user: User}).user;

  if (!user) {
    console.log('Not logged in');
    res.status(401).json({error: 'Not logged in'});
  }

  console.log('Query: ', req.query);

  let query: Where = {};

  if (req.query.state) {
    query = {
      state: {
        equals: req.query.state,
      },
    };
  }

  const participants = await payload.find<'participants'>({
    collection: 'participants',
    overrideAccess: false,
    user: user,
    limit: 500,
    where: query,
    sort: 'lastName',
  });

  console.log(participants.docs);
  res.setHeader(
    'Content-disposition',
    `attachment; filename=BeLeWe-${dayjs().tz('Europe/Berlin')}.xlsx`
  );

  console.log('Set filename');
  res.setHeader(
    'Content-type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );

  console.log('Set content type');
  res.write(await writeExcel(participants.docs));

  console.log('Wrote file');

  res.end();

  console.log('Ended');
};

export default handler;
