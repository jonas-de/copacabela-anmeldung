import {Button, Col, message, Popconfirm, Row} from 'antd';
import React from 'react';
import {Participant} from '../../payload-types';
import defaultFetch from '../../utilitites/defaultFetch';
import {useRouter} from 'next/router';

const ParticipantDeletion: React.FC<{
  participant: Participant;
  isBevo: boolean;
}> = ({participant, isBevo}) => {
  const router = useRouter();

  const deleteParticipant = async () => {
    const res = await defaultFetch(
      `/api/participants/${participant.id}`,
      'DELETE',
      {}
    );
    if (res.ok) {
      await router.push(`/${participant.tribe}`);
    } else {
      message.error('Teilnehmer:in konnte nicht gelöscht werden');
    }
  };

  return (
    <Row gutter={8}>
      {isBevo && (
        <Col>
          <Popconfirm
            title="Wirklich löschen"
            okText="Ja"
            cancelText="Nein"
            onConfirm={deleteParticipant}
          >
            <Button danger>Endgültig löschen</Button>
          </Popconfirm>
        </Col>
      )}
    </Row>
  );
};

export default ParticipantDeletion;
