import React from 'react';
import {Participant} from '../../payload-types';
import {Descriptions, Tag} from 'antd';
import {Tribe} from '../../utilitites/Tribes';
import {getGender, getInsuranceType, getState} from '../../utilitites/Wording';
import {getLevelWithNone} from '../../utilitites/Levels';
import Image from 'next/image';
import dayjstz from '../../utilitites/dayjstz';

export type ShowParticipantProps = {
  extra: React.ReactNode;
  participant: Participant;
  tribe: Tribe;
};

const ParticipantData: React.FC<ShowParticipantProps> = ({
  extra,
  participant,
  tribe,
}) => {
  const level = getLevelWithNone(participant.level);
  const state = getState(participant.state);
  const createdAt = (participant as Participant & {createdAt: string})[
    'createdAt'
  ];

  return (
    <Descriptions
      column={1}
      labelStyle={{
        background: 'GhostWhite',
        fontWeight: 'bold',
        textAlign: 'end',
      }}
      extra={extra}
      bordered
      style={{overflowX: 'auto'}}
    >
      <Descriptions.Item label="Status">
        <Tag style={{marginLeft: 16}} color={state.color}>
          {state.name}
        </Tag>
      </Descriptions.Item>
      <Descriptions.Item label="Vorname">
        {participant.firstName}
      </Descriptions.Item>
      <Descriptions.Item label="Nachname">
        {participant.lastName}
      </Descriptions.Item>
      <Descriptions.Item label="Bestellnummer">
        {participant.orderId}
      </Descriptions.Item>
      <Descriptions.Item label="Geburtsdatum">
        {dayjstz.tz(participant.birthDate).format('DD.MM.YYYY')}
      </Descriptions.Item>
      <Descriptions.Item label="Geschlecht">
        {getGender(participant.gender).name}
      </Descriptions.Item>
      <Descriptions.Item label="E-Mail">{participant.email}</Descriptions.Item>
      <Descriptions.Item label="Telefonnummer">
        {participant.phoneNumber || ''}
      </Descriptions.Item>
      <Descriptions.Item label="Adresse">
        {participant.address.street}
        <br />
        {`${participant.address.zipCode} ${participant.address.city}`}
      </Descriptions.Item>
      <Descriptions.Item label="Stamm">
        <Image
          src={`/images/${tribe.image}`}
          width={24}
          height={24}
          alt={tribe.name}
        />
        {` ${tribe.name}`}
      </Descriptions.Item>
      <Descriptions.Item label="Stufe">
        {<Tag color={level.color}>{level.singular}</Tag>}
      </Descriptions.Item>
      <Descriptions.Item label="Unverträglichkeiten">
        {participant.food.intolerances}
      </Descriptions.Item>
      <Descriptions.Item label="Krankheiten">
        {participant.diseases}
      </Descriptions.Item>
      <Descriptions.Item label="Krankenversicherung">
        {getInsuranceType(participant.healthInsurance).name}
      </Descriptions.Item>
      <Descriptions.Item label="Anmerkungen">
        {participant.comments}
      </Descriptions.Item>
      <Descriptions.Item label="Juleica">
        {participant.juleica?.number
          ? participant.juleica.number
          : 'keine Juleica'}
        {participant.juleica?.terminates
          ? `\tgültig bis ${dayjstz
              .tz(participant.juleica.terminates)
              .format('DD.MM.YYYY')}`
          : ''}
      </Descriptions.Item>
      <Descriptions.Item label="Unbedenklichkeitsbescheinigung">
        {participant.clearance &&
          (participant.clearance.nami
            ? 'In NaMi eingetragen'
            : participant.clearance.idNumber ||
              'Keine Unbedenklichkeitsbescheinigung')}
      </Descriptions.Item>
      {createdAt && (
        <Descriptions.Item label="Anmeldezeitpunkt">
          {dayjstz.tz(createdAt).format('DD.MM.YYYY HH:mm')}
        </Descriptions.Item>
      )}
    </Descriptions>
  );
};

export default ParticipantData;
