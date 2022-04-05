import { GetServerSideUserPropsContext, withUser } from '../../utilitites/Authentication';
import { getTribeForNumber, isValidTribeOrDistrict } from '../../utilitites/Tribes';
import { Where } from 'payload/types';
import payload from 'payload';
import { TeilnehmerIn } from '../../payload-types';
import React from 'react';
import Page from '../../components/navigation/Page';
import { Container } from 'react-bootstrap';
import { Tribe } from '../../utilitites/Tribes';
import StatsTable from '../../components/StatsTable';
import { Col, Row, Switch, Table, Tag } from 'antd';
import ImageHead from '../../components/ImageHead';
import Link from 'next/link';
import Levels, { compareLevelsWithRole, getLevelWithNone } from '../../utilitites/Levels';
import Image from 'next/image';

type PaymentStats = {
  name: string,
  woelflinge: number,
  jupfis: number,
  pfadis: number,
  rover: number,
  leader: number,
  helper: number,
  total: number
}

type PaymentAllStats = {
  total: PaymentStats,
  days: PaymentStats[]
}


const getServerSideProps = withUser( async (context: GetServerSideUserPropsContext) => {
  const tribe: number = Number(context.params!["tribe"])
  console.log(tribe);

  if (!isValidTribeOrDistrict(tribe)) {
    return { notFound: true }
  }

  if (tribe === 1312 || context.req.user.level !== "all") {
    return {
      notFound: true
    }
  }
  console.log(tribe);

  const participants = await payload.find<TeilnehmerIn>({
    collection: "participants",
    overrideAccess: false,
    user: context.req.user,
    limit: 500,
    sort: "lastName",
    where: {
      tribe: {
        equals: tribe
      }
    }
  })

  const stats: PaymentAllStats = {
    total: {
      name: "Insgesamt",
      woelflinge: 0,
      jupfis: 0,
      pfadis: 0,
      rover: 0,
      leader: 0,
      helper: 0,
      total: 0
    },
    days: [0, 1, 2, 3, 4, 5, 6, 7, 8].map<PaymentStats>((value) => ({
      name: value ===  1 ? "1 Tag" : `${value} Tage`,
      woelflinge: 0,
      jupfis: 0,
      pfadis: 0,
      rover: 0,
      leader: 0,
      helper: 0,
      total: 0
    }))
  }

  const accumulatedStats: PaymentAllStats = participants.docs.filter((tn) => tn.state !== "new").reduce((stats, tn) => {
    const presence = Object.values(tn.presence).filter((b) => b).length
    if (tn.role !== 'participant') {
      stats.total[tn.role] += 1
      stats.days[presence][tn.role] += 1
    } else if (tn.level !== "none") {
      stats.total[tn.level] += 1
      stats.days[presence][tn.level] += 1
    }
    stats.total.total += 1
    stats.days[presence].total += 1
    return stats
  }, stats)

  console.log(accumulatedStats);

  return { props: {
      stats: accumulatedStats,
      tribe: getTribeForNumber(tribe)
    }}
})

const CancelledOrders: React.FC<{ participants: TeilnehmerIn[] }> = ({ participants }) => (
  <Table
    title={() => (<h3>Stornierte Teilnehmer:innen</h3>)}
    dataSource={participants}
    pagination={false}
    rowKey="id"
    scroll={{ x: true }}
    summary={currentData => (
      <div style={{ fontWeight: "bold", padding: 8 }}>
        {`${currentData.length} stornierte Teilnehmer:innen`}
      </div>
    )}
  >
    <Table.Column
      title="Vorname"
      dataIndex="firstName"
      key="firstName"
      sorter={(a: TeilnehmerIn, b: TeilnehmerIn) => a.firstName.localeCompare(b.firstName)}
      render={ (name, record) => (
        <Link href={`/participants/${record.id}`}>{name}</Link>
      )}
    />
    <Table.Column
      title="Nachname"
      dataIndex="lastName"
      key="lastName"
      sorter={(a: TeilnehmerIn, b: TeilnehmerIn) => a.lastName.localeCompare(b.lastName)}
    />
    <Table.Column
      title="Stufe"
      dataIndex="level"
      key="level"
      sorter={(a: TeilnehmerIn, b: TeilnehmerIn) => {
        const compared = compareLevelsWithRole(a, b)
        return compared === 0
          ? a.lastName.localeCompare(b.lastName)
          : compared
      }}
      filters={Levels
        .map(level => ({ text: level.plural, value: level.slug }))
        .concat({ text: "Leiter:innen", value: "leader" })
        .concat({ text: "Helfer:in", value: "helper"})
      }
      filterMultiple={true}
      onFilter={(value, record: TeilnehmerIn) => {
        if (value === "leader" || value === "helper") {
          return record.role === value
        }
        return record.level === value && record.role === "participant"
      }}
      render={(slug, record: TeilnehmerIn) => {
        const level = getLevelWithNone(slug)
        if (record.role === "helper") {
          return (
            <Tag color="grey">Helfer:in</Tag>
          )
        }
        return (
          <>
            { record.role === "leader" && (
              <Image src="/images/Dpsg.png" width={16} height={16} alt={"Leiter:in"} />
            )}
            {" "}
            <Tag style={{ width: 62, textAlign: "center" }} color={level.color}>{level.singular}</Tag>
          </>
        )
      }} />
    <Table.Column
      title="Nachname"
      dataIndex="cancelledAt"
      key="cancelledAt"
      sorter={(a: TeilnehmerIn, b: TeilnehmerIn) => 0}
    />
  </Table>
)

const Payment: React.FC<{tribe: Tribe, stats: PaymentAllStats}> = ({tribe, stats}) => {
  return (
    <Page showLogin={true} loggedIn={true}>
      <Container fluid="md" className="ps-0 pe-0">
        <StatsTable title={`${tribe.name} - Zahldaten`} stats={[...stats.days, stats.total]} />
      </Container>
    </Page>
  )
}

export default Payment
export { getServerSideProps }
