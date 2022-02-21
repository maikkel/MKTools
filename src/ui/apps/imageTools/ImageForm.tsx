import { Button, Checkbox, Form, Input, Select } from "antd";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

interface ImageFormProps {
  formFields: Record<string, any>;
  setFormFields: Dispatch<SetStateAction<Record<string, any>>>;
}

export default function ImageForm({
  formFields,
  setFormFields,
}: ImageFormProps) {
  const [compLoaded, setCompLoaded] = useState<boolean>(false);
  const onChange = (changedValues: any, values: any) => {
    setFormFields(values);
  };

  const onFinish = (values: any) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    setCompLoaded(true);
  }, []);

  return (
    <>
      {compLoaded && (
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={formFields}
          onValuesChange={onChange}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item name="resize" valuePropName="checked">
            <Checkbox>Resize</Checkbox>
          </Form.Item>
          <Form.Item label="Fit type" name="fit" hidden={!formFields.resize}>
            <Select>
              <Select.Option value="cover">Cover</Select.Option>
              <Select.Option value="contain">Contain</Select.Option>
              <Select.Option value="fill">Fill</Select.Option>
              <Select.Option value="inside">Inside</Select.Option>
              <Select.Option value="outside">Outside</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Size in px"
            hidden={!formFields?.resize}
            className="double-input"
          >
            <Form.Item name="width">
              <Input />
            </Form.Item>
            <div className="spacer">x</div>
            <Form.Item name="height">
              <Input />
            </Form.Item>
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            hidden={!formFields?.resize}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
            hidden={!formFields?.resize}
            wrapperCol={{ offset: 8, span: 16 }}
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      )}
    </>
  );
}
