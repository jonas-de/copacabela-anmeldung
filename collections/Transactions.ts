import { CollectionConfig } from 'payload/types';
import payload from 'payload';
import { TeilnehmerIn } from '../payload-types';
import { APIError } from 'payload/errors';
import { BeforeValidateHook } from 'payload/dist/collections/config/types';
import { BevoOnlyAccess } from './Participants';
import { Access } from 'payload/config';

const Transactions: CollectionConfig = {
  slug: "transactions",
  fields: [
    {
      name: "participant",
      type: "relationship",
      relationTo: "participants",
      required: true
    },
    {
      name: "amount",
      type: "number",
      required: true,
    }
  ],
  access: {
    create: BevoOnlyAccess as Access,
    read: () => false,
    update: () => false,
    delete: () => false
  },
  hooks: {
    beforeValidate: [
      async ({ data, operation }) => {
        console.log(data);
        if (operation === "update") {
          throw new APIError("Transaktionen können nicht verändert werdeb", 405)
        }
        if (data === undefined) {
          throw new APIError("Daten der Anfrage fehlen", 400)
        }
        if (data.participant === undefined || String(data.participant).trim() === "") {
          throw new APIError("Ungültige Armband-ID", 400)
        }
        const amount = Number(data.amount)
        if (Number.isNaN(amount) || amount === 0) {
          throw new APIError("Ungültiger Betrag", 400)
        }
        const particpantsWithWristband = await payload.find<TeilnehmerIn>({
          collection: "participants",
          limit: 1,
          depth: 0,
          where: {
            wristband: {
              equals: data.participant
            }
          }
        })
        if (particpantsWithWristband.totalDocs !== 1) {
          throw new APIError("Ungültige Armband-ID", 400)
        }
        const participant = particpantsWithWristband.docs[0]
        if (participant.credit + amount < 0) {
          throw new APIError(`Zu wenig Guthaben (${participant.credit}€)`, 400)
        }
        return {
          participant: participant.id,
          amount: amount
        }
      }
    ],
    afterChange: [
      async ({ doc }) => {
        console.log(doc);

        const res = await payload.update<TeilnehmerIn>({
          collection: "participants",
          id: doc.participant.id,
          data: {
            credit: doc.participant.credit + doc.amount
          }
        })
        console.log(res);
      }
    ]
  }
}

export default Transactions
