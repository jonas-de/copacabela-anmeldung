import {NextApiHandler, NextApiRequest} from 'next';
import {TeilnehmerIn} from '../../../payload-types';
import payload from 'payload';
import {User} from 'payload/auth';

const handler: NextApiHandler = async (req, res) => {
  const user = (req as unknown as NextApiRequest & {user: User}).user;

  if (!user) {
    res.status(401).json({error: 'Not logged in'});
  }

  if (user.collection === 'participantscontroller' && user.tribe !== '1312') {
    res.status(403).json({error: 'No access'});
  }

  if (user.level !== 'all' && user.level !== 'strandkorb') {
    res.status(403).json({error: 'No access'});
  }

  const participants = await payload.find<TeilnehmerIn>({
    collection: 'participants',
    overrideAccess: true,
    where: {
      orderId: {
        equals: req.query.orderId,
      },
    },
    limit: 1,
  });

  if (participants.totalDocs === 0) {
    res.status(404).json({error: 'Not found'});
  } else {
    res.status(200).json({id: participants.docs[0].id});
  }
};

export default handler;
