import React, { useState } from 'react';
import { useForm } from 'antd/lib/form/Form';
import { Form, Input, Modal, Select } from 'antd';
import { Tribe, TribesWithDistrict } from '../utilitites/Tribes';
import Levels, { AccessAll, AccessKitchen } from '../utilitites/Levels';

const CreateParticipantController: React.FC<{
  userTribe: Tribe,
  visible: boolean,
  complete: (values: any) => void,
  cancel: VoidFunction
}> = ({ userTribe, visible, complete, cancel }) => {

  const defaultWidth: { width: number } = { width: 240}

  const [form] = useForm()
  const [tribe, setTribe] = useState(userTribe.number)
  const updateAccess = () => {
    console.log(form.getFieldValue("tribe"));
    setTribe(form.getFieldValue("tribe"))
  }

  const LevelOptions: () => React.ReactElement[] = () => {
    if (userTribe.number === 1312 && tribe === 1312) {
      return Levels.concat(AccessKitchen).map(level => (
        <Select.Option key={level.slug} value={level.slug}>{level.plural}</Select.Option>
      ))
    }
    if (userTribe.number === 1312) {
      return Levels.concat(AccessAll).map(level => (
        <Select.Option key={level.slug} value={level.slug}>{level.plural}</Select.Option>
      ))
    }
    return Levels.map(level => (
      <Select.Option key={level.slug} value={level.slug}>{level.plural}</Select.Option>
    ))
  }

  return (
    <Modal
      title="Neue:n Nutzer:in anlegen"
      visible={visible}
      okText="Anlegen"
      cancelText="Abbrechen"
      onCancel={() => {
        form.resetFields()
        cancel()
      }}
      onOk={() => {
        form.validateFields()
          .then(values => {
            form.resetFields()
            complete(values)
          })
      }}
    >
      <div style={{ paddingBottom: 24}}>
        Es kann jeweils nur ein:e Nutzer:in mit den gleichen Rechten geben.
      </div>
      <Form
        form={form}
        labelCol={{ span: 8 }}
        onFinish={complete}
        initialValues={{
          tribe
        }}
        validateMessages={{
          required: "Pflichtfeld"
        }}
        requiredMark={false}
      >
        <Form.Item name="name" label="Name" rules={[{ type: "string", required: true }]}>
          <Input style={defaultWidth} />
        </Form.Item>
        <Form.Item name="email" label="E-Mail" rules={[{ type: "email", required: true }]}>
          <Input style={defaultWidth} type="email" />
        </Form.Item>
        <Form.Item name="tribe" label="Zugriff" rules={[{ type: "number", required: true }]}>
          <Select style={defaultWidth} onChange={updateAccess} placeholder="Wählen..." disabled={userTribe.number !== 1312}>{
            userTribe.number === 1312
              ? (TribesWithDistrict.map(tribe => (
                <Select.Option key={tribe.number} value={tribe.number}>{tribe.name}</Select.Option>
              )))
              : <Select.Option value={userTribe.number}>{userTribe.name}</Select.Option>
          }</Select>
        </Form.Item>
        <Form.Item name="level" label="Stufe" rules={[{ type: "string", required: true }]}>
          <Select style={defaultWidth} placeholder={"Wählen..."}>
            {LevelOptions()}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateParticipantController
