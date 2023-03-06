import React, {useState} from 'react';
import {useForm} from 'antd/lib/form/Form';
import {Form, Input, Modal, Select} from 'antd';
import {Tribe, TribesWithDistrict} from '../utilitites/Tribes';
import Levels, {
  AccessAll,
  AccessKitchen,
  AccessStrandkorb,
} from '../utilitites/Levels';
import {Participantscontroller} from '../payload-types';

const CreateParticipantController: React.FC<{
  visible: boolean;
  complete: (values: Participantscontroller) => void;
  cancel: VoidFunction;
}> = ({visible, complete, cancel}) => {
  const defaultWidth: {width: number} = {width: 240};

  const [form] = useForm();

  return (
    <Modal
      title="Neue:n Nutzer:in anlegen"
      visible={visible}
      okText="Anlegen"
      cancelText="Abbrechen"
      onCancel={() => {
        form.resetFields();
        cancel();
      }}
      onOk={() => {
        form.validateFields().then(values => {
          form.resetFields();
          complete(values);
        });
      }}
    >
      <Form
        form={form}
        labelCol={{span: 8}}
        onFinish={complete}
        validateMessages={{
          required: 'Pflichtfeld',
        }}
        requiredMark={false}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{type: 'string', required: true}]}
        >
          <Input style={defaultWidth} />
        </Form.Item>
        <Form.Item
          name="email"
          label="E-Mail"
          rules={[{type: 'email', required: true}]}
        >
          <Input style={defaultWidth} type="email" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateParticipantController;
