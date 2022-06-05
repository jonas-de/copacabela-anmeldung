import { GetServerSideUserPropsContext, withUser } from '../../utilitites/Authentication';
import React, { useState } from 'react';
import payload from 'payload';
import { TeilnehmerIn } from '../../payload-types';
import { Button, Divider, message } from 'antd';
import { Container } from 'react-bootstrap';
import Page from '../../components/layout/Page';
import { getTribeForNumber, Tribe } from '../../utilitites/Tribes';
import ParticipantData from '../../components/participants/ParticipantData';
import ParticipantConfirmations, {
  ConfirmOrderButton
} from '../../components/participants/ParticipantConfirmations';
import { CloseOutlined, EditOutlined, RedoOutlined } from '@ant-design/icons';
import EditParticipantsForm from '../../components/participants/form/EditParticipantForm';
import { StateText } from '../../utilitites/Wording';
import defaultFetch from '../../utilitites/defaultFetch';
import { useRouter } from 'next/router';
import ImageHead from '../../components/layout/ImageHead';
import BevoConfirmations from '../../components/participants/BevoConfirmations';
import { AccessLevelText, getAccessLevelForHeader } from '../../utilitites/Levels';

const getServerSideProps = withUser(async (context: GetServerSideUserPropsContext) => {

  try {
    const participant = await payload.findByID<TeilnehmerIn>({
      collection: "participants",
      id: context.params!.id as string,
      overrideAccess: false,
      user: context.req.user
    })

    return {
      props: {
        participant,
        tribe: getTribeForNumber(Number(participant.tribe)),
        accessLevel: getAccessLevelForHeader(context.req.user),
      }
    }
  } catch {}

  return {
    notFound: true
  }
})

const Participants: React.FC<{
  participant: TeilnehmerIn,
  tribe: Tribe,
  accessLevel: AccessLevelText,
}> = ({ participant, tribe, accessLevel }) => {

  const router = useRouter()
  const [showEdit, setShowEdit] = useState(false)

  const isComplete = (): boolean => {
    if (participant.role !== "participant" && !participant.receivedLeaderInfo) {
      return false
    }
    return !(!participant.receivedRegistration || participant.receivedPhotoPermission === "no");
  }

  const updateState = async (state: StateText) => {
    const res = await defaultFetch(`/api/participants/${participant.id}`, "PUT", {
      state: state
    })
    if (res.status === 200) {
      router.reload()
    } else {
      message.error(res.statusText)
    }
  }

  const extra: React.ReactNode = (
    <>
      { participant.state === "new" && (
        <ConfirmOrderButton
          condition={isComplete}
          confirm={() => updateState('confirmed')}
          text="Anmeldung bestätigen"
        />
      )}
      { /*
      { participant.state !== "new" && (
          <Button style={{margin: 8}} icon={<RedoOutlined />} onClick={() => updateState("new")}>
            Zurücksetzen
          </Button>
      )}
      */ }
      { participant.state === "confirmed" && (
          <Button style={{margin: 8}} danger icon={<CloseOutlined />} onClick={() => updateState("cancelled")}>Stornieren</Button>
      )}
      {accessLevel === "bevo" &&
        <Button style={{margin: 8}} icon={<EditOutlined />} onClick={() => setShowEdit(true)}>Bearbeiten</Button>}
    </>
  )

  const overview: React.ReactNode = (
    <>
      <ImageHead image={tribe.image}
                 text={`${participant.firstName} ${participant.lastName}`}/>
      <ParticipantData extra={extra} participant={participant} tribe={tribe} isBevo={accessLevel === "bevo"}/>
      <Divider orientation="left">Dokumente</Divider>
      <ParticipantConfirmations participant={participant} isBevo={accessLevel === "bevo"} />
      { accessLevel === "bevo" && participant.role !== "participant" && (
        <>
          <Divider orientation="left">BeVos</Divider>
          <BevoConfirmations participant={participant} />
        </>
      )}
    </>
  )

  const editPage: React.ReactNode = (
    <EditParticipantsForm participant={participant} onCancel={() => setShowEdit(false)} />
  )

  return (
    <Page level={accessLevel} showLogin={true}>
      <Container fluid="md" className="ps-0 pe-0">
        { showEdit ? editPage : overview}
      </Container>
    </Page>
  )
}
export default Participants
export { getServerSideProps }
