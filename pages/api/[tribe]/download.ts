import { NextApiHandler, NextApiRequest } from 'next';
import { isValidTribeOrDistrict } from '../../../utilitites/Tribes';
import { TeilnehmendenverwalterIn, TeilnehmerIn } from '../../../payload-types';
import payload from 'payload';
import { Where } from 'payload/types';
import CSVCreator from '../../../utilitites/CSVCreator';

const handler: NextApiHandler = async (req, res) => {
  const tribe: number = Number(req.query.tribe)
  if (!isValidTribeOrDistrict(tribe)) {
    res.status(404).json({ error: "Not found" })
    return
  }
  // @ts-ignore
  const user: TeilnehmendenverwalterIn = req.user!

  if (!user) {
    res.status(401).json({ error: "Not logged in" })
  }

  // @ts-ignore
  if (user.collection === "participantscontroller" && user.level !== "all") {
    res.status(403).json({ error: "No access" })
  }

  const query: Where = user.tribe === "1312" ? {} : {
    tribe: {
      equals: user.tribe
    }
  }

  const participants = await payload.find<TeilnehmerIn>({
    collection: "participants",
    overrideAccess: false,
    user: user,
    where: query,
    limit: 500,
  })

  res.setHeader('Content-disposition', `attachment; filename=CopacaBeLa-${user.tribe}.csv`);
  res.setHeader('Content-type', 'application/csv');
  res.write(CSVCreator(participants.docs));
  res.end();
}

export default handler
