import { GetServerSideUserPropsContext, withUser } from '../../utilitites/Authentication';
import React from 'react';

const getServerSideProps = withUser(async (context: GetServerSideUserPropsContext) => {
  return {
    redirect: {
      destination: context.req.user.tribe,
      permanent: false
    }
  }
})

const Participants: React.FC = () => (
  <div />
)

export default Participants
export { getServerSideProps }
