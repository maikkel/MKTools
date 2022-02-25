import { Button, Checkbox, Divider, Form, InputNumber, Select } from "antd";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import ColorPicker from "../../utils/ColorPicker";

interface ImageFormProps {
  formFields: Record<string, any>;
  setFormFields: Dispatch<SetStateAction<Record<string, any>>>;
  applyTools: (values: Record<string, any>) => void;
}

export default function ImageForm({
  formFields,
  setFormFields,
  applyTools,
}: ImageFormProps) {
  const [compLoaded, setCompLoaded] = useState<boolean>(false);
  const onChange = (changedValues: any, values: any) => {
    setFormFields(values);
  };

  const onFinish = (values: any) => {
    applyTools(values);
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
          labelCol={{ span: 9 }}
          wrapperCol={{ span: 15 }}
          initialValues={formFields}
          onValuesChange={onChange}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            name="square"
            valuePropName="checked"
            className="main-item"
          >
            <Checkbox>Make Square</Checkbox>
          </Form.Item>

          <Form.Item
            label="Fit type"
            name="squareFit"
            hidden={!formFields?.square}
          >
            <Select>
              <Select.Option value="cover">Cover</Select.Option>
              <Select.Option value="contain">Contain</Select.Option>
              <Select.Option value="fill">Fill</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Background"
            name="squareBackground"
            hidden={!formFields?.square || formFields?.squareFit !== "contain"}
          >
            <ColorPicker />
          </Form.Item>

          <Form.Item
            name="resize"
            valuePropName="checked"
            className="main-item"
          >
            <Checkbox>Resize</Checkbox>
          </Form.Item>

          <Form.Item
            label="Size in px"
            hidden={!formFields?.resize}
            className="double-input"
          >
            <Form.Item name="width">
              <InputNumber max="16000" />
            </Form.Item>
            <div className="spacer">x</div>
            <Form.Item name="height">
              <InputNumber max="16000" />
            </Form.Item>
          </Form.Item>

          <Form.Item
            label="Fit type"
            name="resizeFit"
            hidden={!formFields?.resize}
          >
            <Select>
              <Select.Option value="cover">Cover</Select.Option>
              <Select.Option value="contain">Contain</Select.Option>
              <Select.Option value="fill">Fill</Select.Option>
              <Select.Option value="inside">Inside</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Background"
            name="resizeBackground"
            hidden={!formFields?.resize || formFields?.resizeFit !== "contain"}
          >
            <ColorPicker />
          </Form.Item>

          <Divider />
          <Form.Item wrapperCol={{ span: 24 }}>
            <Button type="primary" htmlType="submit" block>
              Apply to all images
            </Button>
          </Form.Item>
        </Form>
      )}
    </>
  );
}
