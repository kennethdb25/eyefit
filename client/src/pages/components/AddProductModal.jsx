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
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";

const { Option } = Select;

const AddProductModal = ({ visible, onClose, onAdd }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (!fileList.length) {
        message.error("Please upload a product image");
        return;
      }

      // Assume backend expects image file; for now send just preview URL or file object
      const productData = {
        ...values,
        productImgFile: fileList[0].originFileObj, // send this to backend via FormData
      };

      onAdd(productData);
      form.resetFields();
      setFileList([]);
      onClose();
    });
  };

  return (
    <Modal
      title="Add New Product"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Add Product
        </Button>,
      ]}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          name="productName"
          label="Product Name"
          rules={[
            { required: true, message: "Please enter the product name" },
            { max: 40, message: "Name can not exceed 40 characters" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Product Image" required>
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
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>

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

        <Form.Item
          name="price"
          label="Price"
          rules={[{ required: true, message: "Please enter the price" }]}
        >
          <InputNumber min={0} prefix="Php" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="stocks"
          label="Stocks"
          rules={[{ required: true, message: "Please enter stock quantity" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="featured" label="Featured" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item
          name="rating"
          label="Rating"
          initialValue={4.5}
          rules={[
            { type: "number", min: 0, max: 5, message: "Rating must be 0–5" },
          ]}
        >
          <InputNumber step={0.1} min={0} max={5} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: "Please select status" }]}
        >
          <Select placeholder="Select status">
            <Option value="in-stock">In Stock</Option>
            <Option value="out-of-stock">Out of Stock</Option>
            <Option value="discontinued">Discontinued</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddProductModal;
