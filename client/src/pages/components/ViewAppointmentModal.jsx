import { Modal, Form, Input, Button, Select, Row, Col } from "antd";
import moment from "moment";
import { FaTimes, FaCheck, FaBan } from "react-icons/fa";
import "./design.css";

const { Option } = Select;

const inputStyle = {
  color: "#000", // darker text
  backgroundColor: "#f5f5f5", // light gray background
  fontWeight: "500",
};

const ViewAppointmentModal = ({
  isVisible,
  onClose,
  appointment,
  handleUpdateStatus,
}) => {
  return (
    <Modal
      title="APPOINTMENT DETAILS"
      open={isVisible}
      width={1200}
      onCancel={onClose}
      footer={[
        <Button
          key="cancel"
          className="modal-btn cancel-btn"
          onClick={onClose}
          icon={<FaTimes />}
        >
          Cancel
        </Button>,
        <Button
          key="reject"
          hidden={
            appointment?.status === "Rejected" ||
            appointment?.status === "Accepted"
          }
          className="modal-btn reject-btn"
          onClick={() => handleUpdateStatus("Rejected", appointment?._id)}
          icon={<FaBan />}
        >
          Reject
        </Button>,
        <Button
          key="accept"
          hidden={
            appointment?.status === "Rejected" ||
            appointment?.status === "Accepted"
          }
          className="modal-btn accept-btn"
          onClick={() => handleUpdateStatus("Accepted", appointment?._id)}
          icon={<FaCheck />}
        >
          Accept
        </Button>,
      ]}
    >
      <Form layout="vertical">
        <Row>
          <Col xs={{ span: 24 }} md={{ span: 24 }}>
            <Row gutter={12}>
              <Col xs={{ span: 24 }} md={{ span: 12 }} layout="vertical">
                <Form.Item label="Customer Name">
                  <Input
                    value={appointment?.customerName}
                    disabled
                    style={inputStyle}
                  />
                </Form.Item>
              </Col>
              <Col xs={{ span: 24 }} md={{ span: 12 }} layout="vertical">
                <Form.Item label="Address">
                  <Input
                    value={appointment?.address}
                    disabled
                    style={inputStyle}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={12}>
              <Col xs={{ span: 24 }} md={{ span: 8 }} layout="vertical">
                <Form.Item label="Gender">
                  <Select value={appointment?.gender} disabled>
                    <Option value="Male">Male</Option>
                    <Option value="Female">Female</Option>
                    <Option value="Other">Other</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={{ span: 24 }} md={{ span: 8 }} layout="vertical">
                <Form.Item label="Age">
                  <Input value={appointment?.age} disabled style={inputStyle} />
                </Form.Item>
              </Col>
              <Col xs={{ span: 24 }} md={{ span: 8 }} layout="vertical">
                <Form.Item label="Created At">
                  <Input
                    value={moment(appointment?.createdAt).format("LL")}
                    disabled
                    style={inputStyle}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col xs={{ span: 24 }} md={{ span: 24 }} layout="vertical">
                <Form.Item label="Order">
                  <Input
                    value={appointment?.order}
                    disabled
                    style={inputStyle}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col xs={{ span: 24 }} md={{ span: 12 }} layout="vertical">
                <Form.Item label="Date">
                  <Input
                    value={moment(appointment?.date).format("LL")}
                    disabled
                    style={inputStyle}
                  />
                </Form.Item>
              </Col>
              <Col xs={{ span: 24 }} md={{ span: 12 }} layout="vertical">
                <Form.Item label="Time">
                  <Input
                    value={appointment?.time}
                    disabled
                    style={inputStyle}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col xs={{ span: 24 }} md={{ span: 12 }} layout="vertical">
                <Form.Item label="Status">
                  <Input
                    value={appointment?.status}
                    disabled
                    style={inputStyle}
                  />
                </Form.Item>
              </Col>
              <Col xs={{ span: 24 }} md={{ span: 12 }} layout="vertical">
                <Form.Item label="Company">
                  <Input
                    value={appointment?.company}
                    disabled
                    style={inputStyle}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ViewAppointmentModal;
