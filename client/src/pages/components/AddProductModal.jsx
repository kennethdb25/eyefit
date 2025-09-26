/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Modal,
  Form,
  Input,
  ColorPicker,
  Select,
  Switch,
  Button,
  Upload,
  message,
  Row,
  Col,
  theme,
} from "antd";
import { generate, presetPalettes, red, green } from "@ant-design/colors";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { useState, useContext, useEffect } from "react";
import { LoginContext } from "../../context/LoginContext";
import ColorInput from "./ColorInput/ColorInput";
import { MdCancel, MdAddCircleOutline, MdEdit } from "react-icons/md";

const { Option } = Select;
// ✅ Helper to build preset colors
function genPresets(presets = presetPalettes) {
  return Object.entries(presets).map(([label, colors]) => ({
    label,
    colors,
    key: label,
  }));
}

const AddProductModal = ({
  visible,
  onClose,
  onConfirm,
  form,
  fetchData,
  isEdit,
  editingRecord,
  // fileList,
  setFileList,
  loadingButton,
  setLoadingButton,
}) => {
  const { loginData, setLoginData } = useContext(LoginContext);
  const [messageApi, contextHolder] = message.useMessage();
  const { token } = theme.useToken();
  const presets = genPresets({
    primary: generate(token.colorPrimary),
    red,
    green,
  });

  const onFinish = async (values) => {
    console.log(isEdit);
    try {
      setLoadingButton(true);

      if (values.stocks === 0 && values.status === "In Stock") {
        messageApi.info("Invalid Input!");
        return;
      }

      const newData = new FormData();

      // top-level fields
      newData.append("productName", values.productName);
      newData.append("brand", values.brand);
      newData.append("model", values.model);
      newData.append("price", values.price);
      newData.append("stocks", values.stocks);
      newData.append("featured", values?.featured ? values?.featured : false);
      newData.append("status", values.status || "In Stock");
      newData.append("company", loginData.body.company);

      // ✅ handle variants
      const variants = values.variants.map((variant, idx) => {
        const imagesMeta = [];

        (variant.image || []).forEach((file) => {
          if (file.originFileObj) {
            newData.append(`variants[${idx}][images]`, file.originFileObj);
          }
          imagesMeta.push({
            uid: file.uid,
            name: file.name,
            url: file.url,
          });
        });

        return {
          color: variant.color,
          images: imagesMeta,
        };
      });
      newData.append("variants", JSON.stringify(variants));

      const url = isEdit
        ? `/api/product/edit?publicId=${editingRecord._id}`
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
      setLoadingButton(false);
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
        <Button
          key="cancel"
          onClick={() => onClose()}
          className="modal-btn cancel-btn"
          icon={<MdCancel />}
        >
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loadingButton}
          onClick={() => onConfirm()}
          className="modal-btn submit-btn"
          icon={isEdit ? <MdEdit /> : <MdAddCircleOutline />}
        >
          {isEdit ? "Update Product" : "Add New Product"}
        </Button>,
      ]}
    >
      {contextHolder}
      <Form
        form={form}
        labelCol={{ span: 8 }}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        style={{ width: "100%" }}
      >
        <Row>
          <Col xs={{ span: 24 }} md={{ span: 24 }}>
            {/* Product Name + Brand + Model */}
            <Row gutter={12}>
              <Col xs={{ span: 24 }} md={{ span: 8 }} layout="vertical">
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
              <Col xs={{ span: 24 }} md={{ span: 8 }} layout="vertical">
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
              <Col xs={{ span: 24 }} md={{ span: 8 }} layout="vertical">
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

            {/* Price + Stocks + Featured */}
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
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (value && value < 1) {
                          return Promise.reject("Stocks must be at least 1");
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <Input
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

            {/* Status Switch (only if editing) */}
            {isEdit && (
              <Row gutter={12}>
                <Col xs={{ span: 24 }} md={{ span: 8 }} layout="vertical">
                  <Form.Item
                    name="status"
                    label="Status"
                    valuePropName="checked"
                    getValueFromEvent={(checked) =>
                      checked
                        ? "Discontinued"
                        : form.getFieldValue("status") === "Out of Stock" ||
                          form.getFieldValue("stocks") === 0
                        ? "Out of Stock"
                        : "In Stock"
                    }
                    getValueProps={(value) => ({
                      checked: value === "Discontinued",
                    })}
                  >
                    <Switch
                      checkedChildren="Discontinued"
                      unCheckedChildren={
                        form.getFieldValue("status") === "Out of Stock" ||
                        form.getFieldValue("stocks") === 0
                          ? "Out of Stock"
                          : "In Stock"
                      }
                      disabled={form.getFieldValue("stocks") !== 0}
                    />
                  </Form.Item>
                </Col>
              </Row>
            )}

            {/* Dynamic Product Variants */}
            <Form.List
              name="variants"
              rules={[
                {
                  validator: async (_, variants) => {
                    if (!variants || variants.length < 1) {
                      return Promise.reject(
                        new Error(
                          "Please add at least one product image & color"
                        )
                      );
                    }
                  },
                },
              ]}
            >
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Row gutter={12} key={key} align="middle">
                      {/* Product Image */}
                      <Col
                        xs={{ span: 24 }}
                        md={{ span: 12 }}
                        layout="vertical"
                      >
                        <Form.Item
                          {...restField}
                          name={[name, "image"]}
                          valuePropName="fileList"
                          getValueFromEvent={(e) =>
                            Array.isArray(e) ? e : e?.fileList
                          }
                        >
                          <Upload
                            listType="picture-card"
                            maxCount={1} // or remove if multiple allowed
                            beforeUpload={() => false}
                          >
                            <div>
                              <PlusOutlined />
                              <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                          </Upload>
                        </Form.Item>
                      </Col>

                      {/* Color Variant */}
                      <Col
                        xs={{ span: 24 }}
                        md={{ span: 10 }}
                        layout="vertical"
                      >
                        <Form.Item
                          {...restField}
                          name={[name, "color"]}
                          label="Color Variant"
                          rules={[
                            {
                              required: true,
                              message: "Please select a color",
                            },
                          ]}
                          // ⚡ Make sure form stores HEX string instead of Color object
                          getValueFromEvent={(color) => color?.toHexString()}
                        >
                          <ColorPicker presets={presets} showText />
                        </Form.Item>
                      </Col>

                      {/* Remove Button */}
                      <Col
                        xs={{ span: 24 }}
                        md={{ span: 2 }}
                        style={{ marginTop: 30 }}
                      >
                        <Button danger onClick={() => remove(name)}>
                          Remove
                        </Button>
                      </Col>
                    </Row>
                  ))}

                  {/* Add Button */}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<UploadOutlined />}
                    >
                      Add Image & Color
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddProductModal;
