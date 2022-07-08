import React from 'react';
import {Table} from 'antd';

const StatsTable: React.FC<{title: string; stats: object}> = ({
  title,
  stats,
}) => (
  <Table
    title={() => (
      <h1>
        <strong>{title}</strong>
      </h1>
    )}
    dataSource={Object.values(stats)}
    rowKey="name"
    pagination={false}
    scroll={{x: true}}
  >
    <Table.Column dataIndex="name" title="Stamm" />
    <Table.Column dataIndex="woelflinge" title="Wölflinge" />
    <Table.Column dataIndex="jupfis" title="Jupfis" />
    <Table.Column dataIndex="pfadis" title="Pfadis" />
    <Table.Column dataIndex="rover" title="Rover:innen" />
    <Table.Column
      title="Teilnehmer:innen"
      render={(
        val,
        record: {total: number; leader: number; helper: number}
      ) => {
        return <>{record.total - record.leader - record.helper}</>;
      }}
    />
    <Table.Column dataIndex="leader" title="Leiter:innen" />
    <Table.Column dataIndex="total" title="Insgesamt" />
  </Table>
);

export default StatsTable;
