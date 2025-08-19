import { Modal, Form, Input, Button, Select } from "antd";
import moment from "moment";

const { Option } = Select;

const inputStyle = {
  color: "#000", // darker text
  backgroundColor: "#f5f5f5", // light gray background
  fontWeight: "500",
};

const buttonStyle = {
  marginRight: "10px",
};

const ViewAppointmentModal = ({
  isVisible,
  onClose,
  appointment,
  handleUpdateStatus,
}) => {
  return (
    <Modal
      title="Appointment Details"
      open={isVisible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={() => onClose()} style={buttonStyle}>
          Cancel
        </Button>,
        <button
          key="reject"
          hidden={
            appointment?.status === "Rejected" ||
            appointment?.status === "Accepted"
              ? true
              : false
          }
          onClick={() => handleUpdateStatus("Rejected", appointment?._id)}
          style={{
            backgroundColor: "#ff4d4f",
            color: "#fff",
            border: "none",
            padding: "6px 16px",
            borderRadius: "4px",
            marginRight: "10px",
          }}
        >
          Reject
        </button>,
        <button
          key="accept"
          hidden={
            appointment?.status === "Rejected" ||
            appointment?.status === "Accepted"
              ? true
              : false
          }
          onClick={() => handleUpdateStatus("Accepted", appointment?._id)}
          style={{
            backgroundColor: "#52c41a",
            color: "#fff",
            border: "none",
            padding: "6px 16px",
            borderRadius: "4px",
          }}
        >
          Accept
        </button>,
      ]}
    >
      <Form layout="vertical">
        <Form.Item label="Customer Name">
          <Input
            value={appointment?.customerName}
            disabled
            style={inputStyle}
          />
        </Form.Item>

        <Form.Item label="Address">
          <Input value={appointment?.address} disabled style={inputStyle} />
        </Form.Item>

        <Form.Item label="Gender">
          <Select value={appointment?.gender} disabled>
            <Option value="Male">Male</Option>
            <Option value="Female">Female</Option>
            <Option value="Other">Other</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Age">
          <Input value={appointment?.age} disabled style={inputStyle} />
        </Form.Item>

        <Form.Item label="Order">
          <Input value={appointment?.order} disabled style={inputStyle} />
        </Form.Item>

        <Form.Item label="Date">
          <Input
            value={moment(appointment?.date).format("LL")}
            disabled
            style={inputStyle}
          />
        </Form.Item>

        <Form.Item label="Time">
          <Input value={appointment?.time} disabled style={inputStyle} />
        </Form.Item>

        <Form.Item label="Status">
          <Input value={appointment?.status} disabled style={inputStyle} />
        </Form.Item>

        <Form.Item label="Company">
          <Input value={appointment?.company} disabled style={inputStyle} />
        </Form.Item>

        <Form.Item label="Created At">
          <Input
            value={moment(appointment?.createdAt).format("LL")}
            disabled
            style={inputStyle}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ViewAppointmentModal;
