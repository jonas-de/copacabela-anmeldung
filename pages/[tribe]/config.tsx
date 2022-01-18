import React from 'react';
import { GetServerSideUserPropsContext, withUser } from '../../utilitites/Authentication';
import Tribes, { getTribeForNumber, isValidTribeOrDistrict, Tribe } from '../../utilitites/Tribes';
import payload from 'payload';
import { TeilnehmendenverwalterIn } from '../../payload-types';
import { Where } from 'payload/types';
import Page from '../../components/navigation/Page';
import { Container } from 'react-bootstrap';
import TribeHead from '../../components/TribeHead';
import { Table } from 'antd';

const getServerSideProps = withUser(async (context: GetServerSideUserPropsContext) => {
  const tribe: number = Number(context.params!["tribe"])
  if (!isValidTribeOrDistrict(tribe)) {
    return {
      notFound: true
    }
  }
  if (tribe !== 1312) {

  }

  const query: Where = tribe === 1312 ? {} : {
    tribe: {
      equals: tribe
    }
  }

  const controller = await payload.find<TeilnehmendenverwalterIn>({
    collection: "participantscontroller",
    overrideAccess: true,
    user: context.req.user,
    limit: 500,
    where: query
  })

  return {
    props: {
      tribe: getTribeForNumber(tribe),
      controller: controller.docs
    }
  }
})

const Config: React.FC<{ tribe: Tribe, controller: TeilnehmendenverwalterIn[] }> = ({ tribe, controller }) => (
  <Page showLogin={true} loggedIn={true}>
    <Container fluid="md" className="ps-0 pe-0">
      <TribeHead tribe={tribe} />
      <Table dataSource={controller} style={{ overflowX: "auto" }} pagination={false} rowKey="id" >
        <Table.Column title="Name" dataIndex="name" key="name" sorter={true} />
      </Table>
    </Container>
  </Page>
)

export default Config
export { getServerSideProps }
