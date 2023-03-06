import {Response} from 'express-serve-static-core';
import {PayloadRequest, Where} from 'payload/types';
import writeExcel from '../writeExcel';

export default async function handleDownload(
  req: PayloadRequest,
  res: Response<Buffer | {error: string}>
) {
  if (!req.user) {
    res.status(401).json({error: 'Not authenticated'});
    return;
  }

  let where: Where = {};
  if (req.query.state) {
    where = {
      state: {
        equals: req.query.state,
      },
    };
  }

  const participants = await req.payload.find<'participants'>({
    collection: 'participants',
    where,
    limit: 0,
  });

  const excelBlob = (await writeExcel(participants.docs)) as unknown as Blob;
  const arrayBuffer = await excelBlob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  res.attachment('participants.xlsx');
  res.send(buffer);
}
