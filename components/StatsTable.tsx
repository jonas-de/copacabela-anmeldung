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
    <Table.Column dataIndex="leader" title="Leiter:innen" />
    <Table.Column dataIndex="total" title="Insgesamt" />
  </Table>
);

export default StatsTable;
