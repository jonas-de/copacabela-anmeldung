import React from 'react';
import Link from 'next/link'
import { GetServerSideUserPropsContext, withUser } from '../../utilitites/Authentication';
import Tribes, {
  getTribeForNumber,
  isValidTribeOrDistrict,
  Tribe,
  TribesWithDistrict
} from '../../utilitites/Tribes';
import payload from 'payload';
import { TeilnehmendenverwalterIn } from '../../../payload-types';
import { Where } from 'payload/types';
import Page from '../../components/navigation/Page';
import { Container } from 'react-bootstrap';
import TribeHead from '../../components/TribeHead';
import { Table, Tag } from 'antd';
import { AccessLevels, getAccessLevelForSlug } from '../../utilitites/Levels';

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
    overrideAccess: false,
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
        <Table.Column title="Name" dataIndex="name" key="name" sorter={(a, b) => a.name.localeCompare(b.name)} />
        <Table.Column title="E-Mail" dataIndex="email" key="email" />
        { tribe.number === 1312 && (
          <Table.Column
            title="Zugriff"
            dataIndex="tribe"
            key="tribe"
            sorter={true}
            filters={TribesWithDistrict.map(t => ({
              text: t.name,
              value: String(t.number)
            }))}
            render={num => (
                <Link href={`/${num}/config`}>{getTribeForNumber(num).name}</Link>
              )
            }
            onFilter={(value, record: TeilnehmendenverwalterIn) => record.tribe === String(value) }
            />
        )}
        <Table.Column
          title="Stufe"
          dataIndex="level"
          key="level"
          sorter={true}
          filters={AccessLevels.map(level => ({
            text: level.plural,
            value: level.slug
          }))}
          onFilter={(value, record: TeilnehmendenverwalterIn) => record.level === value}
          render={ slug => {
            const level = getAccessLevelForSlug(slug)
            return (
            <Tag color={level.color}>{level.singular}</Tag>
            )
          }}
          />
      </Table>
    </Container>
  </Page>
)

export default Config
export { getServerSideProps }
