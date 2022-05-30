import React from 'react';
import { TeilnehmerIn } from '../../payload-types';
import { Descriptions, Table, Tag } from 'antd';
import { Tribe } from '../../utilitites/Tribes';
import moment from 'moment';
import { getRoleName, hasLegalAge } from '../../utilitites/Persons';
import {
  getCovidVaccinationState,
  getEatingBehaviour,
  getGender,
  getInsuranceType,
  getState
} from '../../utilitites/Wording';
import { getLevelWithNone } from '../../utilitites/Levels';
import Image from 'next/image';
import { dateObjectToText } from '../../utilitites/Fees';

export type ShowParticipantProps = {
  extra: React.ReactNode
  participant: TeilnehmerIn,
  tribe: Tribe
}

const ParticipantData: React.FC<ShowParticipantProps> = ({ extra, participant, tribe }) => {

  const level = getLevelWithNone(participant.level)
  const state = getState(participant.state)
  const createdAt = (participant as TeilnehmerIn & { createdAt: string })["createdAt"]

  return (
    <Descriptions
      column={1}
      labelStyle={{
        background: "GhostWhite",
        fontWeight: "bold",
        textAlign: "end"
      }}
      extra={extra}
      bordered
      style={{ overflowX: "auto" }}
    >
      <Descriptions.Item label="Rolle & Status">
        {getRoleName(participant.role)}
        <Tag style={{ marginLeft: 16 }} color={state.color}>{state.name}</Tag>
        <Tag style={{ marginLeft: 8 }} color={participant.lateRegistration ? "orange" : "green"}>
          {participant.lateRegistration ? "Nachmeldung" : "Normale Buchung"}
        </Tag>
      </Descriptions.Item>
      <Descriptions.Item label="Vorname">{participant.firstName}</Descriptions.Item>
      <Descriptions.Item label="Nachname">{participant.lastName}</Descriptions.Item>
      <Descriptions.Item label="Bestellnummer">{participant.orderId}</Descriptions.Item>
      <Descriptions.Item label="Geburtsdatum">{
        moment(participant.birthDate)
          .format("DD.MM.YYYY")
      }</Descriptions.Item>
      <Descriptions.Item label="Geschlecht">{getGender(participant.gender).name}</Descriptions.Item>
      <Descriptions.Item label="E-Mail">{participant.email}</Descriptions.Item>
      <Descriptions.Item label="Telefonnummer">{participant.phoneNumber || ""}</Descriptions.Item>
      <Descriptions.Item label="Adresse">
        {participant.address.street}<br/>
        {`${participant.address.zipCode} ${participant.address.city}`}
      </Descriptions.Item>
      <Descriptions.Item
        label="Stamm">
        <Image src={`/images/${tribe.image}`} width={24} height={24} alt={tribe.name}/>
        {` ${tribe.name}`}
      </Descriptions.Item>
      { participant.role !== "helper" && (
        <Descriptions.Item label="Stufe">{
            <Tag color={level.color}>{level.singular}</Tag>
        }</Descriptions.Item>
      )}
      <Descriptions.Item
        label="Essgewohnheiten">{getEatingBehaviour(participant.food.eatingBehaviour).name}</Descriptions.Item>
      <Descriptions.Item
        label="Unverträglichkeiten">{participant.food.intolerances}</Descriptions.Item>
      <Descriptions.Item
        label="Corona-Impfstatus">{getCovidVaccinationState(participant.vaccinations.covid).name}</Descriptions.Item>
      <Descriptions.Item
        label="Tetanus-Impfung">{participant.vaccinations.tetanus ? "Ja" : "Nein"}</Descriptions.Item>
      <Descriptions.Item
        label="FSME-Impfung">{participant.vaccinations.fsme ? "Ja" : "Nein"}</Descriptions.Item>
      <Descriptions.Item label="Krankheiten">{participant.diseases}</Descriptions.Item>
      <Descriptions.Item
        label="Krankenversicherung">{getInsuranceType(participant.healthInsurance).name}</Descriptions.Item>
      <Descriptions.Item label="Schwimmer:in">
        {participant.swimmer ? "Ja" : "Nein"}
      </Descriptions.Item>
      { !hasLegalAge(moment(participant.birthDate)) && (
        <Descriptions.Item label="Erziehungsberechtigte:r">
          <pre>{`${participant.legalGuardian!.name}\t${participant.legalGuardian!.phoneNumber}`}</pre>
        </Descriptions.Item>
      )}
      <Descriptions.Item label="Notfallkontakte">{
        <Table
          rowKey={"name"}
          dataSource={participant.contacts}
          showHeader={false}
          pagination={false}
          scroll={{ x: true }}
        >
          <Table.Column dataIndex={"name"} key={"name"}/>
          <Table.Column dataIndex={"phoneNumber"} key={"phoneNumber"}/>
        </Table>
      }</Descriptions.Item>
      <Descriptions.Item label="Anwesenheit">
        { dateObjectToText(participant.presence) }
      </Descriptions.Item>
      <Descriptions.Item label="Anmerkungen">{participant.comments}</Descriptions.Item>
      { participant.role !== "participant" && (
        <>
          <Descriptions.Item label="Juleica">
            { participant.juleica?.number ? participant.juleica.number : "keine Juleica" }
            {participant.juleica?.terminates ? `\tgültig bis ${moment(participant.juleica.terminates)
              .format("DD.MM.YYYY")}` : "" }
          </Descriptions.Item>
          <Descriptions.Item label="Unbedenklichkeitsbescheinigung">
            { participant.clearance && (
              participant.clearance.nami ? "In NaMi eingetragen" : (participant.clearance.idNumber || "Keine Unbedenklichkeitsbescheinigung")
            )}
          </Descriptions.Item>
          <Descriptions.Item label="2d/2e-Schulung">
            { participant.course ? moment(participant.course).format("DD.MM.YYYY") : "Keine 2d/2e-Schulung" }
          </Descriptions.Item>
        </>
      )}
      { createdAt && (
        <Descriptions.Item label="Anmeldezeitpunkt">
          { moment(createdAt).format("DD.MM.YYYY HH:mm")}
        </Descriptions.Item>
      )}
    </Descriptions>
  )
}

export default ParticipantData
