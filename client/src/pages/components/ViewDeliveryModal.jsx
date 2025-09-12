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

const { Title, Text } = Typography;

const buttonStyle = {
  marginRight: "10px",
};

const ViewDeliveryModal = (props) => {
  const { isModalOpen, setIsModalOpen, selectedOrder } = props;
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
            style={buttonStyle}
          >
            Close
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
                  <Text strong>Name: </Text> {selectedOrder.order.user.name}
                </Col>
                <Col span={12}>
                  <Text strong>Order Id: </Text> {selectedOrder.order._id}
                </Col>
                <Col span={12}>
                  <Text strong>Contact: </Text>{" "}
                  {selectedOrder.order.user.contact}
                </Col>
                <Col span={12}>
                  <Text strong>Email: </Text> {selectedOrder.order.user.email}
                </Col>
                <Col span={12}>
                  <Text strong>Status: </Text>
                  <>
                    {selectedOrder.order.status === "Shipped" ? (
                      <Tag color="blue">
                        {selectedOrder.order.status.toUpperCase()}
                      </Tag>
                    ) : (
                      <Tag color="green">
                        {selectedOrder.order.status.toUpperCase()}
                      </Tag>
                    )}
                  </>
                </Col>
                {/* <Col span={12}>
                  <Text strong>Total: </Text> ₱{selectedOrder.order.total}
                </Col> */}

                <Col span={12}>
                  <Text strong>Payment Method: </Text>
                  {selectedOrder.order.paymentMethod || "Over the counter"}
                </Col>
                <Col span={24}>
                  <Text strong>Address: </Text>{" "}
                  {selectedOrder.order.user.address}
                </Col>
                <Col span={24}>
                  <Text strong>Total: </Text> ₱{selectedOrder.order.total}
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
              {selectedOrder.order.products.map((item, idx) => (
                <Col span={12} key={idx}>
                  <Card
                    hoverable
                    style={{ borderRadius: 12 }}
                    bodyStyle={{ padding: 16 }}
                  >
                    <Row gutter={12}>
                      <Col span={8}>
                        <Image
                          src={item.product.productImgURL}
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
                          <Text strong>Color Variant: </Text>{" "}
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

export default ViewDeliveryModal;
