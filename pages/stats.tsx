import {
  GetServerSideUserPropsContext,
  withUser,
} from '../utilitites/Authentication';
import {TribesWithDistrict} from '../utilitites/Tribes';
import payload from 'payload';
import {TeilnehmerIn} from '../payload-types';
import Page from '../components/layout/Page';
import React from 'react';
import {Container} from 'react-bootstrap';
import StatsTable from '../components/StatsTable';
import {AccessLevelText, getAccessLevelForHeader} from '../utilitites/Levels';

type Stats = {
  name: string;
  woelflinge: number;
  jupfis: number;
  pfadis: number;
  rover: number;
  leader: number;
  helper: number;
  vegan: number;
  vegetarian: number;
  meat: number;
  total: number;
};

type AllStats = {
  total: Stats;
  [key: string]: Stats;
};

const getServerSideProps = withUser(
  async (context: GetServerSideUserPropsContext) => {
    if (context.req.user.tribe !== '1312' || context.req.user.level !== 'all') {
      return {
        notFound: true,
      };
    }

    const stats: AllStats = Object.fromEntries(
      TribesWithDistrict.map(tribe => [
        String(tribe.number),
        {
          name: tribe.name,
          woelflinge: 0,
          jupfis: 0,
          pfadis: 0,
          rover: 0,
          leader: 0,
          helper: 0,
          total: 0,
          vegan: 0,
          vegetarian: 0,
          meat: 0,
        },
      ]).concat([
        [
          'total',
          {
            name: 'Insgesamt',
            woelflinge: 0,
            jupfis: 0,
            pfadis: 0,
            rover: 0,
            leader: 0,
            helper: 0,
            total: 0,
            vegan: 0,
            vegetarian: 0,
            meat: 0,
          },
        ],
      ])
    );

    const participants = await payload.find<TeilnehmerIn>({
      collection: 'participants',
      overrideAccess: false,
      user: context.req.user,
      limit: 500,
      sort: 'lastName',
      depth: 0,
    });

    const accumulatedStats = participants.docs
      .filter(tn => tn.state !== 'cancelled')
      .reduce((stats, tn) => {
        if (tn.role !== 'participant') {
          stats.total[tn.role] += 1;
          stats[tn.tribe][tn.role] += 1;
        } else if (tn.level !== 'none') {
          stats.total[tn.level] += 1;
          stats[tn.tribe][tn.level] += 1;
        }
        stats.total.total += 1;
        stats.total[tn.food.eatingBehaviour] += 1;
        stats[tn.tribe].total += 1;
        return stats;
      }, stats);

    return {
      props: {
        stats: accumulatedStats,
        accessLevel: getAccessLevelForHeader(context.req.user),
      },
    };
  }
);

const Statistics: React.FC<{stats: AllStats; accessLevel: AccessLevelText}> = ({
  stats,
  accessLevel,
}) => {
  return (
    <Page showLogin={true} level={accessLevel}>
      <Container fluid="md" className="ps-0 pe-0">
        <StatsTable title="Statistiken" stats={stats} />
        <div className="pt-4 pb-4">{stats.total.helper} Helfende</div>
        <h4>Essverhalten</h4>
        <ul>
          <li>
            <strong>Vegan:</strong> {stats.total.vegan}
          </li>
          <li>
            <strong>Vegetarisch:</strong> {stats.total.vegetarian}
          </li>
          <li>
            <strong>Fleisch:</strong> {stats.total.meat}
          </li>
        </ul>
      </Container>
    </Page>
  );
};

export default Statistics;
export {getServerSideProps};
