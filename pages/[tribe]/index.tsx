import React, {useState} from 'react';
import Link from 'next/link';
import {
  GetServerSideUserPropsContext,
  withUser,
} from '../../utilitites/Authentication';
import {
  getTribeForNumber,
  isValidTribeOrDistrict,
  Tribe,
  TribesWithDistrict,
} from '../../utilitites/Tribes';
import payload from 'payload';
import {TeilnehmerIn} from '../../payload-types';
import Page from '../../components/layout/Page';
import {Container} from 'react-bootstrap';
import {Button, Col, Row, Table, Tag} from 'antd';
import Levels, {
  AccessLevelText,
  compareLevelsWithRole,
  getAccessLevelForHeader,
  getLevelWithNone,
} from '../../utilitites/Levels';
import {
  compareRegistrationStates,
  getState,
  LocationObject,
  RegistrationStates,
} from '../../utilitites/Wording';
import Image from 'next/image';
import {Where} from 'payload/types';
import ImageHead from '../../components/layout/ImageHead';
import {handedInDocuments} from '../../utilitites/DocumentsToHandIn';
import DownloadConfig from '../../components/DownloadConfig';
import DocumentView from '../../components/DocumentView';
import LocationView from '../../components/LocationView';

const getServerSideProps = withUser(
  async (context: GetServerSideUserPropsContext) => {
    const tribe = Number(context.params!['tribe']);
    if (!isValidTribeOrDistrict(tribe)) {
      return {notFound: true};
    }

    if (
      (tribe === 1312 && context.req.user.tribe !== '1312') ||
      (tribe === 1312 &&
        context.req.user.tribe === '1312' &&
        context.req.user.level === 'kitchen')
    ) {
      return {
        props: {
          participants: [],
          tribe: getTribeForNumber(tribe),
        },
      };
    }

    const query: Where =
      tribe === 1312
        ? {}
        : {
            tribe: {
              equals: tribe,
            },
          };

    const participants = await payload.find<TeilnehmerIn>({
      collection: 'participants',
      overrideAccess: false,
      user: context.req.user,
      limit: 500,
      sort: 'lastName',
      where: query,
    });
    return {
      props: {
        participants: participants.docs,
        tribe: getTribeForNumber(tribe),
        accessLevel: getAccessLevelForHeader(context.req.user),
      },
    };
  }
);

const Participants: React.FC<{
  participants: TeilnehmerIn[];
  tribe: Tribe;
  accessLevel: AccessLevelText;
}> = ({participants, tribe, accessLevel}) => {
  /*
  const [showNew, setShowNew] = useState(false)
  const submitNew = async (values: any) => {
    const res = await defaultFetch("/api/participants?mail=false", "POST", values)
    if (res.ok) {
      message.success("Gespeichert, Seite neu laden zum Anzeigen")
      setShowNew(false)
    } else {
      message.error("Fehler beim Speichern")
    }
  }
   */

  const [showDownload, setShowDownload] = useState(false);

  /*
  const [showDocuments, setShowDocuments] = useState(false)
  const [showPresence, setShowPresence] = useState(false)
  const [showComments, setShowComments] = useState(false)
  */

  return (
    <Page level={accessLevel} showLogin={true}>
      <Container fluid="md" className="ps-0 pe-0">
        {/*
          <ManualParticipantForm
            tribe={tribe.number === 1312 ? undefined : tribe.number}
            visible={showNew}
            cancel={() => setShowNew(false)}
            complete={submitNew}
          />
          */}
        <DownloadConfig
          accessLevel={accessLevel}
          tribe={tribe.number}
          visible={showDownload}
          close={() => setShowDownload(false)}
        />
        <Table
          title={() => (
            <Row style={{alignItems: 'center'}}>
              <Col>
                <ImageHead image={tribe.image} text={tribe.name} />
              </Col>
              {/*
              <Col flex="auto">
                <Button icon={<PlusOutlined />} style={{ float: "right" }} onClick={() => setShowNew(true)} type="primary">Teilnehmer:in anlegen</Button>
              </Col>

              <Col style={{ marginLeft: "auto", paddingLeft: 32 }}>
                <Switch checked={showDocuments} onChange={() => { setShowDocuments(!showDocuments)}} />
                {" "}
                Abgegebene Dokumente
              </Col>
              <Col style={{ paddingLeft: 32 }}>
                <Switch checked={showPresence} onChange={() => { setShowPresence(!showPresence)}} />
                {" "}
                Anwesenheit
              </Col>
              <Col style={{ paddingLeft: 32 }}>
                <Switch checked={showComments} onChange={() => { setShowComments(!showComments)}} />
                {" "}
                Anmerkungen
              </Col>
              */}
            </Row>
          )}
          dataSource={participants}
          pagination={false}
          rowKey="id"
          scroll={{x: true}}
          summary={currentData => (
            <div style={{fontWeight: 'bold', padding: 8}}>
              {`${
                currentData.filter(tn => tn.state !== 'cancelled').length
              } Teilnehmer:innen`}
            </div>
          )}
        >
          <Table.Column
            title="Vorname"
            dataIndex="firstName"
            key="firstName"
            sorter={(a: TeilnehmerIn, b: TeilnehmerIn) =>
              a.firstName.localeCompare(b.firstName)
            }
            render={(name, record) => (
              <Link href={`/participants/${record.id}`}>{name}</Link>
            )}
          />
          <Table.Column
            title="Nachname"
            dataIndex="lastName"
            key="lastName"
            sorter={(a: TeilnehmerIn, b: TeilnehmerIn) =>
              a.lastName.localeCompare(b.lastName)
            }
          />
          <Table.Column
            title="Stufe"
            dataIndex="level"
            key="level"
            sorter={(a: TeilnehmerIn, b: TeilnehmerIn) => {
              const compared = compareLevelsWithRole(a, b);
              return compared === 0
                ? a.lastName.localeCompare(b.lastName)
                : compared;
            }}
            filters={Levels.map(level => ({
              text: level.plural,
              value: level.slug,
            }))
              .concat({text: 'Leiter:innen', value: 'leader'})
              .concat({text: 'Helfer:in', value: 'helper'})}
            filterMultiple={true}
            onFilter={(value, record: TeilnehmerIn) => {
              if (value === 'leader' || value === 'helper') {
                return record.role === value;
              }
              return record.level === value && record.role === 'participant';
            }}
            render={(slug, record: TeilnehmerIn) => {
              const level = getLevelWithNone(slug);
              if (record.role === 'helper') {
                return <Tag color="grey">Helfer:in</Tag>;
              }
              return (
                <>
                  {record.role === 'leader' && (
                    <Image
                      src="/images/Dpsg.png"
                      width={16}
                      height={16}
                      alt={'Leiter:in'}
                    />
                  )}{' '}
                  <Tag
                    style={{width: 62, textAlign: 'center'}}
                    color={level.color}
                  >
                    {level.singular}
                  </Tag>
                </>
              );
            }}
          />
          {tribe.number === 1312 && (
            <Table.Column
              title="Stamm"
              dataIndex="tribe"
              key="tribe"
              filters={TribesWithDistrict.map(tribe => ({
                text: tribe.name,
                value: tribe.number,
              }))}
              onFilter={(value, record: TeilnehmerIn) => {
                return record.tribe === value;
              }}
              render={tribe => (
                <Link href={`/${tribe}`}>
                  {getTribeForNumber(Number(tribe)).name}
                </Link>
              )}
            />
          )}
          <Table.Column
            title="Status"
            dataIndex="state"
            key="state"
            filters={RegistrationStates.map(state => ({
              text: state.name,
              value: state.slug,
            }))}
            filterMultiple={true}
            onFilter={(value, record: TeilnehmerIn) => {
              return record.state === value;
            }}
            sorter={(a: TeilnehmerIn, b: TeilnehmerIn) => {
              const compared = compareRegistrationStates(a, b);
              return compared === 0
                ? a.lastName.localeCompare(b.lastName)
                : compared;
            }}
            render={slug => {
              const state = getState(slug);
              return <Tag color={state.color}>{state.name}</Tag>;
            }}
          />
          <Table.Column
            title="Ort"
            dataIndex="location"
            key="location"
            filters={Object.values(LocationObject).map(loc => ({
              text: loc.name,
              value: loc.slug,
            }))}
            onFilter={(value, record: TeilnehmerIn) => {
              return record.location === value;
            }}
            render={(_, record: TeilnehmerIn) => {
              return (
                <LocationView tn={record} isBevo={accessLevel === 'bevo'} />
              );
            }}
          />
          <Table.Column
            title="Dokumente"
            key="documents"
            filters={[
              {text: 'Vollständig', value: 'all'},
              {text: 'Unvollständig', value: 'missing'},
            ]}
            filterMultiple={false}
            onFilter={(value, record: TeilnehmerIn) => {
              if (value === 'all') {
                return handedInDocuments(record).complete;
              } else {
                return !handedInDocuments(record).complete;
              }
            }}
            render={(_, record) => {
              return (
                <DocumentView tn={record} isBevo={accessLevel === 'bevo'} />
              );
            }}
          />
          {/*
          <Table.Column
            title="Buchungsart"
            dataIndex="lateRegistration"
            key="lateRegistration"
            filters={[{ text: "Normal", value: false }, { text: "Nachmeldung", value: true }]}
            filterMultiple={false}
            onFilter={(value, record: TeilnehmerIn) => {
              return record.lateRegistration === value
            }}
            render={(_, record)=> {
              return record.lateRegistration
                ? <Tag color="orange">Nachmeldung</Tag>
                : <Tag color="green">Normal</Tag>
            }} />
          { showPresence && (
          <Table.Column<TeilnehmerIn>
            title="Anwesenheit"
            key="presence"
            filters={[{ text: "Vollständig", value: "all" }, { text: "Unvollständig", value: "missing" }]}
            render={(_, record,) => {
              return dateObjectToText(record.presence)
            }} />
          )}
          { showComments && (
          <Table.Column<TeilnehmerIn>
            title="Anmerkungen"
            dataIndex="comments"
            key="comments"
          />
          )}
          */}
        </Table>
        {(accessLevel === 'all' || accessLevel === 'bevo') && (
          <Button onClick={() => setShowDownload(true)}>Download</Button>
        )}
      </Container>
    </Page>
  );
};

export default Participants;
export {getServerSideProps};
