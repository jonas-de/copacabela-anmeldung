import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link'
import { GetServerSideUserPropsContext, withUser } from '../../utilitites/Authentication';
import Tribes, {
  getTribeForNumber,
  isValidTribeOrDistrict,
  Tribe
} from '../../utilitites/Tribes';
import payload from 'payload';
import { TeilnehmerIn } from '../../payload-types';
import Page from '../../components/navigation/Page';
import { Col, Container, Row } from 'react-bootstrap';
import { Table, Tag } from 'antd';
import Levels, { getLevelForSlug } from '../../utilitites/Levels';
import { getStateForSlug } from '../../utilitites/Wording';
import Image from 'next/image'
import { Where } from 'payload/types';
import TribeHead from '../../components/TribeHead';

const getServerSideProps = withUser( async (context: GetServerSideUserPropsContext) => {
  const tribe: number = Number(context.params!["tribe"])
  if (!isValidTribeOrDistrict(tribe)) {
    return { notFound: true }
  }

  if (tribe === 1312 && context.req.user.access !== "1312") {
    return {
      props: {
        participants: [],
        tribe: getTribeForNumber(tribe)
      }
    }
  }

  const query: Where = tribe === 1312 ? {} : {
    tribe: {
      equals: tribe
    }
  }

  const participants = await payload.find<TeilnehmerIn>({
    collection: "participants",
    overrideAccess: true,
    user: context.req.user,
    limit: 500,
    where: query
  })
  return { props: {
    participants: participants.docs,
    tribe: getTribeForNumber(tribe)
  }}
})

const Participants: React.FC<{ participants: TeilnehmerIn[], tribe: Tribe }> = ({ participants, tribe }) => {
  return (
    <Page showLogin={true} loggedIn={true}>
      <Container fluid="md" className="ps-0 pe-0">
        <TribeHead tribe={tribe} />
        <Table dataSource={participants} style={{ overflowX: 'auto' }} pagination={false} rowKey="id">
          <Table.Column title="Vorname" dataIndex="firstName" key="firstName" sorter={true} />
          <Table.Column title="Nachname" dataIndex="lastName" key="lastName" sorter={true} />
          <Table.Column
            title="Stufe"
            dataIndex="level"
            key="level"
            sorter={true}
            filters={Levels.map(level => ({ text: level.plural, value: level.slug }))}
            onFilter={(value, record) => {
              // @ts-ignore
              return record.level == value
            }}
            render={slug => {
            const level = getLevelForSlug(slug)
            return (
              <Tag color={level.color}>{level.singular}</Tag>
            )
          }} />
          { tribe.number === 1312 && (
            <Table.Column
              title="Stamm"
              dataIndex="tribe"
              key="tribe"
              filters={Tribes.map(tribe => ({ text: tribe.name, value: tribe.number }))}
              onFilter={(value, record) => {
                // @ts-ignore
                return record.tribe == value
              }}
              render={tribe => (
              // @ts-ignore
                <Link href={`/${tribe}`}>{Tribes.find(t => t.number == tribe).name}</Link>
            )} />
          )}
          <Table.Column title="Status" dataIndex="state" key="state" render={slug => {
            const state = getStateForSlug(slug)
            return (
              <Tag color={state.color}>{state.name}</Tag>
            )
          }} />
        </Table>
      </Container>
    </Page>
  )
}

export default Participants
export { getServerSideProps }
