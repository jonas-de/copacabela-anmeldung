import React from 'react';
import { Button, DatePicker, Form, Input, message, Radio } from 'antd';
import deDE from 'antd/lib/date-picker/locale/de_DE';
import { Rule } from 'rc-field-form/es/interface';
import moment from 'moment';
import defaultFetch from '../utilitites/defaultFetch';
import { TeilnehmerIn } from '../payload-types';
import { useRouter } from 'next/router';

const BevoConfirmations: React.FC<{ participant: TeilnehmerIn }> = ({ participant }) => {

  const boolRules: Rule[] = [{ type: "boolean", required: true }]
  const defaultWidth: { width: number } = { width: 240}


  const onSubmit = async (values: any) => {
    values.review.at = values.review.at.toDate()
    const res = await defaultFetch(`/api/participants/${participant.id}`, "PUT", values)
    if (res.status === 200) {
      await message.success("Gespeichert")
    } else {
      await message.error(res.statusText)
    }
  }

  return (
    <Form
      style={{ padding: 4 }}
      labelCol={{ sm: 10, md: 8, lg: 6, xl: 5, xxl: 4 }}
      labelAlign="left"
      requiredMark={false}
      initialValues={{
        review: {
          ...participant.review,
          at: moment(participant.review.at)
        }
      }}
      validateMessages={{
        required: "Pflichtfeld"
      }}
      onFinish={onSubmit}
    >
      <Form.Item
        name={["review", "by"]}
        label="Eingesehen von"
        rules={[{ type: "string", required: true }]}
      >
        <Input style={defaultWidth} />
      </Form.Item>
      <Form.Item
        name={["review", "at"]}
        label="Eingesehen am"
        rules={[{ type: "date", required: true }]}
      >
        <DatePicker
          locale={deDE}
          picker="date"
          format="DD.MM.YYYY"
          style={defaultWidth}
        />
      </Form.Item>
      <Form.Item name={["review", "course"]} label="2d / 2e" rules={boolRules}>
        <Radio.Group>
          <Radio value={true}>Ja</Radio>
          <Radio value={false}>Nein</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item name={["review", "juleica"]} label="juleica" rules={boolRules}>
        <Radio.Group>
          <Radio value={true}>Ja</Radio>
          <Radio value={false}>Nein</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        name={["review", "clearance"]}
        label="Unbedenklichkeitsbescheinigung"
        rules={boolRules}
      >
        <Radio.Group>
          <Radio value={true}>Ja</Radio>
          <Radio value={false}>Nein</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item wrapperCol={{ sm: { offset: 10 }, md: { offset: 8 }, lg: { offset: 6 }, xl: { offset: 5 }, xxl: { offset: 4 } }}>
        <Button type="primary" htmlType="submit" style={defaultWidth}>Einsicht speichern</Button>
      </Form.Item>
    </Form>
  )
}

export default BevoConfirmations
