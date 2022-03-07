import { GetServerSideUserPropsContext, withUser } from '../utilitites/Authentication';
import {
  isValidTribeOrDistrict,
  TribesWithDistrict
} from '../utilitites/Tribes';
import payload from 'payload';
import { TeilnehmerIn } from '../payload-types';
import Page from '../components/navigation/Page';
import React from 'react';
import { Container } from 'react-bootstrap';
import { List, Table } from 'antd';
import { getLevel } from '../utilitites/Levels';

type LevelStats = {
  name: string,
  woelflinge: number,
  jupfis: number,
  pfadis: number,
  rover: number,
  leader: number,
  total: number
}

type Stats = {
  intolerances: string[],
  behaviour: {
    vegan: LevelStats,
    vegetarian: LevelStats,
    meat: LevelStats
  },
  count: 0
}

const getServerSideProps = withUser( async (context: GetServerSideUserPropsContext) => {

  if (context.req.user.level !== "kitchen" && (context.req.user.tribe !== "1312" || context.req.user.level !== "all")) {
    return {
      notFound: true
    }
  }

  const participants = await payload.find<TeilnehmerIn>({
    collection: "participants",
    overrideAccess: false,
    user: context.req.user,
    limit: 500,
    sort: "lastName",
    depth: 0
  })

  const stats: Stats = {
    intolerances: [],
    behaviour: {
      vegan: { name: "Vegan", woelflinge: 0, jupfis: 0, pfadis: 0, rover: 0, leader: 0, total: 0 },
      vegetarian: { name: "Vegetarisch", woelflinge: 0, jupfis: 0, pfadis: 0, rover: 0, leader: 0, total: 0 },
      meat: { name: "Fleisch", woelflinge: 0, jupfis: 0, pfadis: 0, rover: 0, leader: 0, total: 0 }
    },
    count: 0
  }

  const accumulatedStats = participants.docs.filter(tn => tn.state !== "cancelled").reduce((stats, tn) => {
    stats.behaviour[tn.food.eatingBehaviour]
      [tn.role !== "participant" || tn.level === "none" ? "leader" : tn.level] += 1
    stats.behaviour[tn.food.eatingBehaviour].total += 1
    stats.count += 1

    if (tn.food.intolerances) {
      stats.intolerances.push(`${tn.role !== "participant" || tn.level === "none" ? "Leiter:in" : getLevel(tn.level).singular}: ${tn.food.intolerances}`)
    }

    return stats
  }, stats)

  return { props: {
      stats: accumulatedStats
    }}
})

const Statistics: React.FC<{ stats: Stats }> = ({ stats }) => {
  return (
    <Page showLogin={true} loggedIn={true}>
      <Container fluid="md" className="ps-0 pe-0">
        <h1 className="pt-2"><strong>Essverhalten</strong></h1>
        <div className="pt-2 pb-2">{stats.count} Teilnehmende</div>
        <Table
          pagination={false}
          rowKey="name"
          dataSource={Object.values(stats.behaviour)}
          scroll={{ x: true }}
          >
          <Table.Column title="Essverhalten" dataIndex="name" />
          <Table.Column title="Wölflinge" dataIndex="woelflinge" />
          <Table.Column title="Jupfis" dataIndex="jupfis" />
          <Table.Column title="Pfadis" dataIndex="pfadis" />
          <Table.Column title="Rover:innen" dataIndex="rover" />
          <Table.Column title="Leiter:innen" dataIndex="leader" />
          <Table.Column title="Insgesamt" dataIndex="total" />
        </Table>
        <h4 className="pt-4">Unverträglichkeiten</h4>
        <List bordered dataSource={stats.intolerances} renderItem={(item) => <List.Item>{item}</List.Item>} />
      </Container>
    </Page>
  )
}

export default Statistics
export { getServerSideProps }
