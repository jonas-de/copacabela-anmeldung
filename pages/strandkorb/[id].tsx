import { GetServerSideUserPropsContext, withUser } from '../../utilitites/Authentication';
import { getTribeForNumber, isValidTribeOrDistrict, Tribe } from '../../utilitites/Tribes';
import { Where } from 'payload/types';
import payload from 'payload';
import { Strandkorbartikel, TeilnehmerIn } from '../../payload-types';
import { getRoleName } from '../../utilitites/Persons';
import {
  AccessLevelText,
  getAccessLevelForHeader,
  getLevelWithNone,
  Level
} from '../../utilitites/Levels';
import React, { useState } from 'react';
import Page from '../../components/layout/Page';
import { Container } from 'react-bootstrap';
import ImageHead from '../../components/layout/ImageHead';
import { Button, Col, List, message, Row, Space, Tag } from 'antd';
import { EuroOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import defaultFetch from '../../utilitites/defaultFetch';
import { useRouter } from 'next/router';
import Image from 'next/image';

const getServerSideProps = withUser( async (context: GetServerSideUserPropsContext) => {

  if (context.req.user.tribe !== "1312" || (context.req.user.level !== "all" && context.req.user.level !== "strandkorb")) {
    return {
      notFound: true
    }
  }

  const participant = await payload.findByID<TeilnehmerIn>({
    collection: "participants",
    id: context.params!["id"] as string,
  })

  const items = await payload.find({
    collection: "strandkorb-items",
    limit: 50,
    depth: 0,
  })

  return { props: {
      id: participant.id,
      tribe: getTribeForNumber(Number(participant.tribe)),
      firstName: participant.firstName,
      role: participant.role,
      level: getLevelWithNone(participant.level),
      credit: participant.strandkorbCredit,
      strandkorbItems: items.docs,
      accessLevel: getAccessLevelForHeader(context.req.user),
    }}
})

const StrandkorbPayment: React.FC<{
  id: string,
  tribe: Tribe,
  firstName: string,
  role: string,
  level: Level,
  credit: number,
  strandkorbItems: Strandkorbartikel[],
  accessLevel: AccessLevelText
}> = ({ id, tribe, firstName, role, level, credit, strandkorbItems, accessLevel }) => {

  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const [amounts, setAmounts] = useState(strandkorbItems.map(_ => 0))
  const updateAmounts = (index: number, increase: boolean) => {
    const newAmounts = [...amounts]
    if (increase) {
      newAmounts[index] += 1
    } else {
      newAmounts[index] -= 1
    }
    setAmounts(newAmounts)
  }

  const cartValue = strandkorbItems
    .map((item, index) => item.price * amounts[index])
    .reduce((a, b) => a + b, 0)

  const pay = async () => {
    setLoading(true)

    const cart: { [key: string]: number } = {}
    amounts.forEach((amount, index) => {
      if (amount > 0) {
        cart[strandkorbItems[index].id] = amount
      }
    })

    const res = await defaultFetch("/api/strandkorb-transactions", "POST", {
      participant: id,
      cart
    })
    const body = await res.json()
    if (res.ok) {
      await router.replace("/strandkorb")
      message.success(`${(credit - body.doc.amount).toFixed(2)}€ Restguthaben`)
    } else {
      setLoading(false)
      message.error(`Fehler: ${body.errors.map((e: { message: any; }) => e.message).join(",")}`)
    }
  }

  const back = () => router.replace("/strandkorb")

  return (
    <Page level={accessLevel} showLogin={true}>
      <Container className="pt-4 pb-4">
        <ImageHead image={tribe.image} text={firstName}>
          <>
            { role === "leader" && (
              <Image src="/images/Dpsg.png" width={16} height={16} alt={"Leiter:in"} />
            )}
            { role !== "helper" && (
              <Tag style={{ marginTop: 16, marginLeft: 8 }} color={level.color}>{level.singular}</Tag>
            )}
            { role === "helper" && (
              <Tag style={{ marginTop: 16 }} color="gray">Helfer:in</Tag>
            )}
            <span style={{ color: "gray" }}>{tribe.name}</span>
          </>
        </ImageHead>
        <Row>
          <Col>
            <List
              dataSource={strandkorbItems}
              renderItem={(item, index) => (
                <List.Item>
                  <Row style={{ width: "100%"}}>
                    <Col xs="auto"><strong>{item.name}</strong></Col>
                    <Col xs="auto" className="ps-2 pe-4 me-auto">{item.price.toFixed(2)}€</Col>
                    <Col style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        icon={<MinusOutlined />}
                        disabled={amounts[index] === 0}
                        onClick={() => updateAmounts(index, false)}
                      />
                      <strong className="ps-4 pe-4">{amounts[index]}</strong>
                      <Button
                        icon={<PlusOutlined />}
                        disabled={cartValue + item.price > credit}
                        onClick={() => updateAmounts(index, true)}
                      />
                    </Col>
                  </Row>
                </List.Item>
              )}
            />
          </Col>
        </Row>
        <Row className="pt-4">
          <strong>Guthaben: {credit.toFixed(2)}€</strong>
        </Row>
        <Row className="pt-2">
          <Button
            type="primary"
            icon={<EuroOutlined />}
            loading={loading}
            onClick={pay}
            disabled={cartValue === 0}
            style={{ width: 200 }}
          >
            {cartValue.toFixed(2)}€ bezahlen
          </Button>
        </Row>
        <Row className="pt-2">
          <Button
            type="dashed"
            onClick={back}
            style={{ width: 200 }}
          >
            Abbrechen
          </Button>
        </Row>
      </Container>
    </Page>
  )
}

export default StrandkorbPayment
export { getServerSideProps }
