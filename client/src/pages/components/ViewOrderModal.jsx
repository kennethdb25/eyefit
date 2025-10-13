import {
  Modal,
  Button,
  Card,
  Row,
  Col,
  Tag,
  Typography,
  Image,
  Divider,
} from "antd";
import {
  MdClose,
  MdCancel,
  MdPlayCircleOutline,
  MdLocalShipping,
  MdCheckCircle,
} from "react-icons/md";

const { Title, Text } = Typography;

const buttonStyle = {
  marginRight: "10px",
};

const ViewOrderModal = (props) => {
  const { isModalOpen, setIsModalOpen, selectedOrder, handleUpdateStatus } =
    props;
  return (
    <>
      <Modal
        title="Order Details"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button
            key="close"
            onClick={() => setIsModalOpen(false)}
            className="modal-btn close-btn"
            icon={<MdClose />}
          >
            Close
          </Button>,

          <Button
            key="reject"
            hidden={
              selectedOrder?.status === "Completed" ||
              selectedOrder?.status === "Shipped" ||
              selectedOrder?.status === "Cancelled"
            }
            onClick={() => handleUpdateStatus("Cancelled", selectedOrder?._id)}
            className="modal-btn reject-btn"
            icon={<MdCancel />}
          >
            Cancel
          </Button>,

          <Button
            key="process"
            hidden={
              selectedOrder?.status === "Shipped" ||
              selectedOrder?.status === "Processing" ||
              selectedOrder?.status === "Cancelled" ||
              selectedOrder?.status === "Completed"
            }
            onClick={() => handleUpdateStatus("Processing", selectedOrder?._id)}
            className="modal-btn process-btn"
            icon={<MdPlayCircleOutline />}
          >
            Process
          </Button>,

          <Button
            key="shipped"
            hidden={
              selectedOrder?.status === "Shipped" ||
              selectedOrder?.status === "Pending" ||
              selectedOrder?.status === "Cancelled" ||
              selectedOrder?.status === "Completed"
            }
            onClick={() => handleUpdateStatus("Shipped", selectedOrder?._id)}
            className="modal-btn shipped-btn"
            icon={<MdLocalShipping />}
          >
            Shipped
          </Button>,

          <Button
            key="complete"
            hidden={
              selectedOrder?.status === "Pending" ||
              selectedOrder?.status === "Cancelled" ||
              selectedOrder?.status === "Completed"
            }
            onClick={() => handleUpdateStatus("Completed", selectedOrder?._id)}
            className="modal-btn complete-btn"
            icon={<MdCheckCircle />}
          >
            Complete
          </Button>,
        ]}
        width={900}
        style={{ top: 20 }}
      >
        {selectedOrder && (
          <div style={{ padding: "10px" }}>
            {/* Customer Info */}
            <Card
              style={{
                marginBottom: 20,
                borderRadius: 12,
                background: "#f9fafb",
              }}
              bodyStyle={{ padding: 20 }}
            >
              <Title level={4} style={{ marginBottom: 16 }}>
                Customer Information
              </Title>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Text strong>Name: </Text> {selectedOrder.user.name}
                </Col>
                <Col span={12}>
                  <Text strong>Order Id: </Text> {selectedOrder._id}
                </Col>
                <Col span={12}>
                  <Text strong>Contact: </Text> {selectedOrder.user.contact}
                </Col>
                <Col span={12}>
                  <Text strong>Email: </Text> {selectedOrder.user.email}
                </Col>
                <Col span={12}>
                  <Text strong>Status: </Text>
                  <>
                    {selectedOrder.status === "Cancelled" ? (
                      <Tag color="red">
                        {selectedOrder.status.toUpperCase()}
                      </Tag>
                    ) : selectedOrder.status === "Shipped" ? (
                      <Tag color="blue">
                        {selectedOrder.status.toUpperCase()}
                      </Tag>
                    ) : selectedOrder.status === "Pending" ||
                      selectedOrder.status === "pending" ? (
                      <Tag color="purple">
                        {selectedOrder.status.toUpperCase()}
                      </Tag>
                    ) : selectedOrder.status === "Completed" ? (
                      <Tag color="green">
                        {selectedOrder.status.toUpperCase()}
                      </Tag>
                    ) : (
                      <Tag color="orange">
                        {selectedOrder.status.toUpperCase()}
                      </Tag>
                    )}
                  </>
                </Col>
                <Col span={12}>
                  <Text strong>Payment Method: </Text>
                  {selectedOrder.paymentMethod || "Over the counter"}
                </Col>
                <Col span={24}>
                  <Text strong>Address: </Text> {selectedOrder.user.address}
                </Col>
                <Col span={24}>
                  <Text strong>Total: </Text> ₱{selectedOrder.total}
                </Col>
              </Row>
            </Card>

            {/* Product Section */}
            <Divider orientation="center">
              <Title level={4} style={{ margin: 0 }}>
                Product Information
              </Title>
            </Divider>
            <Row gutter={[16, 16]}>
              {selectedOrder.products.map((item, idx) => (
                <Col span={12} key={idx}>
                  <Card
                    hoverable
                    style={{ borderRadius: 12 }}
                    bodyStyle={{ padding: 16 }}
                  >
                    <Row gutter={12}>
                      <Col span={8}>
                        <Image
                          src={item.product?.variants[0]?.images[0]?.url}
                          alt={item.product.productName}
                          style={{
                            borderRadius: 8,
                            objectFit: "cover",
                            width: "100%",
                          }}
                        />
                      </Col>
                      <Col span={16}>
                        <Title level={5} style={{ margin: 0 }}>
                          {item.product.productName}
                        </Title>
                        <Text type="secondary">{item.product.brand}</Text>
                        <div style={{ marginTop: 8 }}>
                          <Text strong>Model: </Text> {item.product.model}
                        </div>
                        <div>
                          <Text strong>Price: </Text> ₱{item.product.price}
                        </div>
                        <div>
                          <Text strong>Quantity: </Text> {item.quantity}
                        </div>
                        <div>
                          <Text strong>Color Variant: </Text>
                          {item.color ? item.color.toUpperCase() : "TBA"}
                        </div>
                        <div>
                          <Text strong>Status: </Text>
                          <Tag
                            color={
                              item.product.status === "In Stock"
                                ? "green"
                                : "red"
                            }
                            style={{ marginLeft: 4 }}
                          >
                            {item.product.status}
                          </Tag>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </Modal>
    </>
  );
};

export default ViewOrderModal;
