import { Button, Checkbox, Col, Form, message, Popconfirm, Row } from 'antd';
import React, { useState } from 'react';
import { useForm } from 'antd/lib/form/Form';
import { TeilnehmerIn } from '../payload-types';
import { PhotoPermissionText } from '../utilitites/Wording';
import defaultFetch from '../utilitites/defaultFetch';
import { useRouter } from 'next/router';

const ConfirmOrderButton: React.FC<{
  condition: () => boolean,
  confirm: VoidFunction,
  text: string
}> = ({ condition, confirm, text}) => {

  const [visible, setVisible] = useState(false)
  const onVisibilityChange = async (visible: boolean) => {
    if (!visible) {
      setVisible(visible)
      return
    }
    if (condition()) {
      await confirm()
    } else {
      setVisible(visible)
    }
  }

  return (
    <Popconfirm
      title="Trotz fehlender Dokumente bestätigen?"
      visible={visible}
      onVisibleChange={onVisibilityChange}
      onConfirm={confirm}
      onCancel={() => setVisible(false)}
      okText="Ja"
      cancelText="Nein"
    >
      <Button type="primary">{text}</Button>
    </Popconfirm>
  )
}

const ParticipantConfirmations: React.FC<{ participant: TeilnehmerIn, isBevo: boolean }> = ({ participant, isBevo}) => {

  console.log(participant)

  const router = useRouter()
  const [form] = useForm()
  const [photoPermission, setPhotoPermission] = useState<PhotoPermissionText>(participant.receivedPhotoPermission)
  const [confirmVisibility, setConfirmVisibility] = useState(false)

  const updateNoPhotoPermission = (value: boolean) => {
    if (value) {
      form.setFields([{ name: "photopermission", value: false }])
      console.log(form.getFieldValue("photopermission"));
      setPhotoPermission("never")
    } else {
      setPhotoPermission("no")
    }
  }
  const updatePhotoPermission = (value: boolean) => {
    if (photoPermission === "never") {
      return
    }
    setPhotoPermission(value ? "yes" : "no")
  }

  const onSubmit = async (values: any) => {
    delete values.photopermission
    console.log(values)
    const res = await defaultFetch(`/api/participants/${participant.id}`, "PUT", {
      ...values,
      receivedPhotoPermission: photoPermission
    })
    if (res.status !== 200) {
      message.error(res.statusText)
    } else {
      message.success("Gespeichert")
    }
  }

  const confirm = async () => {
    const values = {
      receivedRegistration: form.getFieldValue("receivedRegistration"),
      receivedLeaderInfo: form.getFieldValue("receivedLeaderInfo"),
      state: "confirmed"
    }
    if (participant.role === "participant") {
      delete values.receivedLeaderInfo
    }
    await onSubmit(values)
    router.reload()
  }

  const isComplete = (): boolean => {
    if (participant.role !== "participant" && !form.getFieldValue("receivedLeaderInfo")) {
      return false
    }
    return !(!form.getFieldValue("receivedRegistration") || photoPermission === "no");
  }

  const deleteParticipant = async () => {
    const res = await defaultFetch(`/api/participants/${participant.id}`, "DELETE", {})
    if (res.ok) {
      await router.push(`/${participant.tribe}`)
    } else {
      message.error("Teilnehmer:in konnte nicht gelöscht werden")
    }
  }

  return (
    <Form
      form={form}
      style={{ padding: 4}}
      onFinish={onSubmit}
      initialValues={{
        receivedRegistration: participant.receivedRegistration,
        receivedLeaderInfo: participant.receivedLeaderInfo,
        photopermission: participant.receivedPhotoPermission === "yes",
        noPhotopermission: participant.receivedPhotoPermission === "never"
      }}
    >
      <Form.Item name="receivedRegistration" valuePropName="checked">
        <Checkbox>Anmeldung abgegeben</Checkbox>
      </Form.Item>
      { participant.role !== "participant" && (
        <Form.Item name="receivedLeaderInfo" valuePropName="checked">
        <Checkbox>Information für Leiter:innen abgegeben</Checkbox>
        </Form.Item>
      )}
      <Form.Item name="photopermission" valuePropName="checked">
        <Checkbox onChange={(e) => updatePhotoPermission(e.target.checked)} disabled={photoPermission === "never"}>Fotoerlaubnis abgegeben</Checkbox>
      </Form.Item>
      <Form.Item name="noPhotopermission" valuePropName="checked">
        <Checkbox onChange={(e) => updateNoPhotoPermission(e.target.checked)}>Gibt keine Fotoerlaubnis ab</Checkbox>
      </Form.Item>
      <Form.Item>
        <Row gutter={8}>
          { participant.state === "new" && (
            <Col>
              <ConfirmOrderButton
                confirm={confirm}
                condition={isComplete}
                text="Speichern & Anmeldung bestätigen"
              />
            </Col>
          )}
          <Col>
            <Button
              type={participant.state !== "new" ? "primary" : "default"}
              htmlType="submit">Speichern</Button>
          </Col>
          { isBevo && (
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
      </Form.Item>
    </Form>
  )
}

export default ParticipantConfirmations
export { ConfirmOrderButton }
