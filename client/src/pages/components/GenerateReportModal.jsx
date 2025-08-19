import { useState } from "react";
import { Modal, DatePicker, Checkbox, Button, Form, message } from "antd";

const { RangePicker } = DatePicker;

const GenerateReportModal = ({
  visible,
  onClose,
  onGenerate,
  availableFields,
}) => {
  const [form] = Form.useForm();
  const [selectedFields, setSelectedFields] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  const handleGenerate = () => {
    form
      .validateFields()
      .then((values) => {
        const payload = {
          dateRange: values.dateRange || [],
          fields: selectedFields,
        };
        onGenerate(payload);
        form.resetFields();
        setSelectedFields([]);
        onClose();
      })
      .catch((error) => {
        console.log(error);
        messageApi.error(error.errorFields[0].errors[0]);
      });
  };

  return (
    <Modal
      title="Generate Report"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="generate" type="primary" onClick={handleGenerate}>
          Generate
        </Button>,
      ]}
    >
      {contextHolder}
      <Form form={form} layout="vertical">
        {/* Date Range */}
        <Form.Item
          label="Select Date Range"
          name="dateRange"
          rules={[{ required: true, message: "Please select a date range" }]}
        >
          <RangePicker style={{ width: "100%" }} />
        </Form.Item>

        {/* Field Selection */}
        <Form.Item label="Select Fields to Include">
          <Checkbox.Group
            options={availableFields}
            value={selectedFields}
            onChange={setSelectedFields}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default GenerateReportModal;
