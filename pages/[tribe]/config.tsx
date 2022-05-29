import React, { useState } from 'react';
import Link from 'next/link';
import { GetServerSideUserPropsContext, withUser } from '../../utilitites/Authentication';
import {
  getTribeForNumber,
  isValidTribeOrDistrict,
  Tribe,
  TribesWithDistrict
} from '../../utilitites/Tribes';
import payload from 'payload';
import { TeilnehmendenverwalterIn } from '../../payload-types';
import { Where } from 'payload/types';
import Page from '../../components/layout/Page';
import { Container } from 'react-bootstrap';
import ImageHead from '../../components/layout/ImageHead';
import { Button, Col, message, Row, Table, Tag } from 'antd';
import { AccessLevels, getAccessLevel } from '../../utilitites/Levels';
import { canCreate, isBevo } from '../../collections/ParticipantsController';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import CreateParticipantController from '../../components/CreateParticipantController';
import defaultFetch from '../../utilitites/defaultFetch';
import { useRouter } from 'next/router';

const getServerSideProps = withUser(async (context: GetServerSideUserPropsContext) => {
  const tribe: number = Number(context.params!["tribe"])
  if (!isValidTribeOrDistrict(tribe)) {
    return {
      notFound: true
    }
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
      canCreate: canCreate(context.req.user),
      isBevo: isBevo(context.req.user),
      tribe: getTribeForNumber(tribe),
      controller: controller.docs
    }
  }
})

const Config: React.FC<{ tribe: Tribe, controller: TeilnehmendenverwalterIn[], canCreate: boolean, isBevo: boolean }> = ({ tribe, controller, canCreate, isBevo }) => {

  const router = useRouter()
  const [showNew, setShowNew] = useState(false)
  const submit = async (values: any) => {
    const res = await defaultFetch("/api/participantscontroller", "POST", values)
    if (res.ok) {
      router.reload()
    } else {
      message.error(res.statusText)
    }
  }

  const deleteUser = async (id: string) => {
    const res = await defaultFetch(`/api/participantscontroller/${id}`, "DELETE", {})
    if (res.ok) {
      router.reload()
    } else {
      message.error(res.statusText)
    }
  }

  return (
    <Page showLogin={true} loggedIn={true}>
      <Container fluid="md" className="ps-0 pe-0">
        <CreateParticipantController userTribe={tribe} visible={showNew} complete={submit} cancel={() => setShowNew(false)} />
        <Table
          title={() => (
            <Row style={{ alignItems: "center" }}>
              <Col>
                <ImageHead image={tribe.image} text={tribe.name} />
              </Col>
              { canCreate && (
                <Col flex="auto">
                  <Button icon={<PlusOutlined />} style={{ float: "right"}} onClick={() => setShowNew(true)} type="primary">Nutzer:in anlegen</Button>
                </Col>
              )
              }
            </Row>
          )}
          dataSource={controller}
          style={{ overflowX: "auto" }}
          pagination={false}
          rowKey="id" >
          <Table.Column
            title="Name"
            dataIndex="name"
            key="name"
            sorter={(a: TeilnehmendenverwalterIn, b: TeilnehmendenverwalterIn) => a.name.localeCompare(b.name)}
          />
          <Table.Column title="E-Mail" dataIndex="email" key="email" />
          { tribe.number === 1312 && (
            <Table.Column
              title="Zugriff"
              dataIndex="tribe"
              key="tribe"
              filters={TribesWithDistrict.map(t => ({
                text: t.name,
                value: String(t.number)
              }))}
              filterMultiple={false}
              render={num => (
                <Link href={`/${num}/config`}>{getTribeForNumber(Number(num)).name}</Link>
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
              const level = getAccessLevel(slug)
              return (
                <Tag style={{ width: 82, textAlign: "center" }} color={level.color}>{level.plural}</Tag>
              )
            }}
          />
          <Table.Column
            key="delete"
            render={(_, record: TeilnehmendenverwalterIn) => {
              return <DeleteOutlined style={{ color: "red" }} onClick={() => deleteUser(record.id)}/>
            }}
          />
        </Table>
      </Container>
    </Page>
  )
}

export default Config
export { getServerSideProps }
