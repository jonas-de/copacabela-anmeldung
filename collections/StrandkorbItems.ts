import {CollectionConfig} from 'payload/types';
import {Access} from 'payload/config';
import {
  isBevo,
  isStrandkorb,
  ParticipantsControllerUser,
} from './ParticipantsController';
import {TeilnehmendenverwalterIn} from '../payload-types';
import {AdminAccess} from './Participants';

const StrandkorbAccess: Access = ({
  req: {user},
}: {
  req: {user: ParticipantsControllerUser};
}): boolean => {
  return (
    user &&
    (user.collection === 'users' ||
      isBevo(user as TeilnehmendenverwalterIn) ||
      isStrandkorb(user as TeilnehmendenverwalterIn))
  );
};

const StrandkorbItems: CollectionConfig = {
  slug: 'strandkorb-items',
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Name',
      required: true,
    },
    {
      name: 'price',
      type: 'number',
      min: 0,
      max: 10,
      label: 'Preis',
      required: true,
    },
  ],
  labels: {
    singular: 'Strandkorbartikel',
    plural: 'Strandkorbartikel',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'price'],
  },
  access: {
    read: StrandkorbAccess,
    create: AdminAccess,
    update: AdminAccess,
    delete: AdminAccess,
  },
};

export default StrandkorbItems;
export {StrandkorbAccess};
