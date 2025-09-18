/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Button,
  Upload,
  message,
  Row,
  Col,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState, useContext, useEffect } from "react";
import { LoginContext } from "../../context/LoginContext";
import ColorInput from "./ColorInput/ColorInput";

const { Option } = Select;

const AddProductModal = ({
  visible,
  onClose,
  onConfirm,
  form,
  fetchData,
  isEdit,
  editingRecord,
  fileList,
  setFileList,
  loadingButton,
  setLoadingButton,
}) => {
  const { loginData, setLoginData } = useContext(LoginContext);
  const [uploadChange, setUploadChange] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleUploadChange = ({ fileList }) => {
    setUploadChange(true);
    setFileList(fileList);
  };

  const onFinish = async (values) => {
    try {
      setLoadingButton(true); // disable button

      // your validation checks...
      if (
        (values.stocks === 0 && values.status === "In Stock") ||
        (values.stocks > 0 && values.status !== "In Stock")
      ) {
        messageApi.info("Invalid Input!");
        return;
      }

      const newData = new FormData();
      values.images?.fileList.forEach((file) => {
        newData.append("images", file.originFileObj);
      });

      newData.append("productName", values.productName);
      newData.append("brand", values.brand);
      newData.append("model", values.model);
      newData.append("price", values.price);
      newData.append("stocks", values.stocks);
      newData.append("featured", values?.featured ? values?.featured : true);
      newData.append("status", values.status);
      newData.append("company", loginData.body.company);
      newData.append("colors", JSON.stringify(values.colors || []));

      const url = isEdit
        ? `/api/product/edit?publicId=${editingRecord.productPublicId}`
        : "/api/product/add";

      const method = isEdit ? "PUT" : "POST";

      const data = await fetch(url, { method, body: newData });
      const res = await data.json();

      if (res.success) {
        messageApi.success(
          isEdit ? "Product Updated Successfully" : "Product Added Successfully"
        );
        form.resetFields();
        onClose();
        fetchData();
      }
    } finally {
      setLoadingButton(false); // re-enable button
    }
  };

  useEffect(() => {
    if (editingRecord) {
      // prefill the Upload component with existing image URL
      if (editingRecord.productImgURL) {
        setFileList([
          {
            uid: "-1",
            name: "existing_image.jpg",
            status: "done",
            url: editingRecord.productImgURL,
          },
        ]);
      }
    }
  }, [editingRecord]);

  return (
    <Modal
      title={isEdit ? "Edit Product" : "Add New Product"}
      open={visible}
      width={1200}
      onCancel={() => onClose()}
      footer={[
        <Button key="cancel" onClick={() => onClose()}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loadingButton}
          onClick={() => onConfirm()}
        >
          {isEdit ? "Update Product" : "Add New Product"}
        </Button>,
      ]}
    >
      {contextHolder}
      <Form
        form={form}
        labelCol={{
          span: 8,
        }}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        style={{
          width: "100%",
        }}
      >
        <Row>
          <Col xs={{ span: 24 }} md={{ span: 24 }}>
            <Row gutter={12}>
              <Col xs={{ span: 24 }} md={{ span: 12 }} layout="vertical">
                <Form.Item
                  name="productName"
                  label="Product Name"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the product name",
                    },
                    { max: 40, message: "Name can not exceed 40 characters" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={{ span: 24 }} md={{ span: 12 }} layout="vertical">
                <Form.Item label="Product Image" name="images" required>
                  <Upload
                    listType="picture"
                    beforeUpload={(file) => {
                      const isImage = file.type.startsWith("image/");
                      if (!isImage) {
                        message.error("You can only upload image files!");
                      }
                      return isImage ? false : Upload.LIST_IGNORE; // prevent auto-upload and ignore non-images
                    }}
                    accept="image/*"
                    fileList={fileList}
                    onChange={handleUploadChange}
                    maxCount={10}
                  >
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={12}>
              <Col xs={{ span: 24 }} md={{ span: 12 }} layout="vertical">
                <Form.Item
                  name="brand"
                  label="Brand"
                  rules={[
                    { required: true, message: "Please enter the brand" },
                    { max: 40, message: "Brand can not exceed 40 characters" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={{ span: 24 }} md={{ span: 12 }} layout="vertical">
                <Form.Item
                  name="model"
                  label="Model"
                  rules={[
                    { required: true, message: "Please enter the model" },
                    { max: 40, message: "Model can not exceed 40 characters" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col xs={{ span: 24 }} md={{ span: 8 }} layout="vertical">
                <Form.Item
                  name="price"
                  label="Price"
                  rules={[
                    { required: true, message: "Please enter the price" },
                  ]}
                >
                  <Input
                    prefix="Php"
                    style={{ width: "100%" }}
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                </Form.Item>
              </Col>
              <Col xs={{ span: 24 }} md={{ span: 8 }} layout="vertical">
                <Form.Item
                  name="stocks"
                  label="Stocks"
                  rules={[
                    { required: true, message: "Please enter stock quantity" },
                  ]}
                >
                  <Input
                    style={{ width: "100%" }}
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                </Form.Item>
              </Col>
              <Col xs={{ span: 24 }} md={{ span: 8 }} layout="vertical">
                <Form.Item
                  name="featured"
                  label="Featured"
                  valuePropName="checked"
                >
                  <Switch defaultChecked defaultValue={true} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col xs={{ span: 24 }} md={{ span: 8 }} layout="vertical">
                <Form.Item
                  name="colors"
                  label="Color Variant"
                  rules={[
                    {
                      required: true,
                      message: "Please add at least one color",
                    },
                  ]}
                >
                  <ColorInput />
                </Form.Item>
              </Col>
              <Col xs={{ span: 24 }} md={{ span: 8 }} layout="vertical">
                <Form.Item
                  name="status"
                  label="Status"
                  rules={[{ required: true, message: "Please select status" }]}
                >
                  <Select placeholder="Select status">
                    <Option value="In Stock">In Stock</Option>
                    <Option value="Out of Stock">Out of Stock</Option>
                    <Option value="Discontinued">Discontinued</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddProductModal;
