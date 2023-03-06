import {Checkbox, Form, Modal, Radio, Space} from 'antd';
import React from 'react';
import {BevoFields, Fields} from '../utilitites/CSVCreator';
import {AccessLevelText} from '../utilitites/Levels';

const DownloadConfig: React.FC<{
  accessLevel: AccessLevelText;
  tribe: number;
  visible: boolean;
  close: VoidFunction;
}> = ({accessLevel, tribe, visible, close}) => {
  const download = async (config: {
    participants: 'confirmed' | 'cancelled' | 'all';
    fields: string[];
  }) => {
    // download prompt
    const link = document.createElement('a');
    link.href = `/api/${tribe}/download?participants=${config.participants}&fields=${config.fields}`;
    link.click();
    link.remove();

    // close modal
    close();
  };

  const [form] = Form.useForm();

  return (
    <Modal
      title="TN-Liste herunterladen"
      visible={visible}
      onOk={() => form.validateFields().then(values => download(values))}
      onCancel={() => {
        form.resetFields();
        close();
      }}
      okText="Download"
      cancelText="Abbrechen"
    >
      <Form
        requiredMark={false}
        form={form}
        initialValues={{
          participants: 'confirmed',
          fields: Object.values(Fields)
            .slice(0, 6)
            .map(field => field.slug),
        }}
      >
        <Form.Item name="participants" required>
          <Radio.Group>
            <Radio value="confirmed">Nur Bestätigte</Radio>
            <Radio value="cancelled">Nur Stornierte</Radio>
            <Radio value="all">Alle</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Felder auswählen" />
        <Form.Item name="fields" required>
          <Checkbox.Group>
            <Space direction="vertical">
              {Object.values(Fields).map(field => (
                <Checkbox key={field.slug} value={field.slug}>
                  {field.title}
                </Checkbox>
              ))}
              {accessLevel === 'bevo' &&
                Object.values(BevoFields).map(field => (
                  <Checkbox key={field.slug} value={field.slug}>
                    {field.title}
                  </Checkbox>
                ))}
            </Space>
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DownloadConfig;
