import {PayloadRequest} from 'payload/types';
import {Response} from 'express-serve-static-core';

const confirmBookingAPI = async (req: PayloadRequest, res: Response) => {
  const {token, id} = req.query as {token: string; id: string};

  const participant = await req.payload.find({
    collection: 'participants',
    limit: 1,
    where: {
      id: {
        equals: id,
      },
      confirmationToken: {
        equals: token,
      },
    },
  });

  if (participant.totalDocs === 1) {
    await req.payload.update({
      collection: 'participants',
      id: id,
      data: {
        ...participant.docs[0],
        state: 'confirmed',
      },
    });
    res.redirect('/confirmation-success');
  } else {
    res.redirect('/confirmation-error');
  }
};

export default confirmBookingAPI;
