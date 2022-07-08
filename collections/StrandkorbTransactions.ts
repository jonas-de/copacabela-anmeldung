import {CollectionConfig} from 'payload/types';
import {StrandkorbAccess} from './StrandkorbItems';
import {AdminAccess} from './Participants';
import payload from 'payload';
import {Strandkorbartikel, TeilnehmerIn} from '../payload-types';
import {APIError} from 'payload/errors';
import {getState} from '../utilitites/Wording';

const StrandkorbTransactions: CollectionConfig = {
  slug: 'strandkorb-transactions',
  fields: [
    {
      name: 'participant',
      type: 'relationship',
      relationTo: 'participants',
      required: true,
      maxDepth: 0,
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
    },
  ],
  labels: {
    singular: 'Strandkorbtransaktion',
    plural: 'Strandkorbtransaktionen',
  },
  access: {
    read: AdminAccess,
    create: StrandkorbAccess,
    update: () => false,
    delete: AdminAccess,
  },
  hooks: {
    beforeValidate: [
      async ({data, operation}) => {
        if (operation !== 'create') {
          return data;
        }

        const participant = await payload.findByID<TeilnehmerIn>({
          collection: 'participants',
          id: data!.participant,
        });

        if (participant.state !== 'confirmed') {
          throw new APIError(
            `Ungültiger TN-Status (${getState(participant.state).name})`
          );
        }

        // check items amount & that there is enough money, then update balance
        const items = await payload.find<Strandkorbartikel>({
          collection: 'strandkorb-items',
          limit: 50,
          where: {
            id: {
              in: Object.keys(data!.cart).join(','),
            },
          },
        });
        const cartValue = items.docs
          .map(item => item.price * data!.cart[item.id])
          .reduce((a, b) => a + b, 0);

        if (participant.strandkorbCredit - cartValue < 0) {
          throw new APIError(
            `Zu wenig Guthaben (${participant.strandkorbCredit.toFixed(2)}€)`,
            400
          );
        }
        return {
          participant: participant.id,
          amount: cartValue,
        };
      },
    ],
    afterChange: [
      async ({doc, operation}) => {
        if (operation !== 'create') {
          return;
        }

        const participant = await payload.findByID<TeilnehmerIn>({
          collection: 'participants',
          id: doc.participant,
          depth: 0,
        });

        await payload.update<TeilnehmerIn>({
          collection: 'participants',
          id: participant.id,
          data: {
            strandkorbCredit: participant.strandkorbCredit - doc.amount,
          },
        });
      },
    ],
    afterDelete: [
      async ({doc}) => {
        const participant = await payload.findByID<TeilnehmerIn>({
          collection: 'participants',
          id: doc.participant,
          depth: 0,
        });

        await payload.update<TeilnehmerIn>({
          collection: 'participants',
          id: participant.id,
          data: {
            strandkorbCredit: participant.strandkorbCredit + doc.amount,
          },
        });
      },
    ],
  },
};

export default StrandkorbTransactions;
