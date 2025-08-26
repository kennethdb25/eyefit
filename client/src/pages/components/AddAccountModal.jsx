/* eslint-disable react-hooks/exhaustive-deps */
import { Modal, Form, Input, Select, Button, message } from "antd";

const { Option } = Select;

const AddAccountModal = ({
  visible,
  onClose,
  onConfirm,
  form,
  fetchData,
  isEdit,
  editingRecord,
}) => {
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    console.log(isEdit);

    if (!isEdit) {
      const newData = await fetch("/api/user/registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const res = await newData.json();

      if (res.success) {
        messageApi.success("Account Added Successfully");
        form.resetFields();
        onClose();
        fetchData();
      } else {
        messageApi.error(res?.error);
      }
    } else {
      const data = await fetch(
        `/api/user/account/edit?userId=${editingRecord._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );
      const res = await data.json();

      if (res.success) {
        messageApi.success("Account Updated Successfully");
        form.resetFields();
        onClose();
        fetchData();
      } else {
        messageApi.error(res?.error);
      }
    }
  };

  const onFinishFailed = async (error) => {
    console.log(error);
  };

  return (
    <Modal
      title={isEdit ? "Edit Account" : "Add New Account"}
      open={visible}
      onCancel={() => onClose()}
      footer={[
        <Button key="cancel" onClick={() => onClose()}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={() => onConfirm()}>
          {isEdit ? "Update Account" : "Add New Account"}
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
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        style={{
          width: "100%",
        }}
      >
        <Form.Item
          name="firstName"
          label="First Name"
          rules={[
            { required: true, message: "Please enter the first name" },
            { max: 40, message: "Name can not exceed 40 characters" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="middleName"
          label="Middle Name"
          rules={[{ max: 40, message: "Brand can not exceed 40 characters" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[
            { required: true, message: "Please enter the last name" },
            { max: 40, message: "Model can not exceed 40 characters" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="address"
          label="Address"
          rules={[
            { required: true, message: "Please enter the Address" },
            { max: 100, message: "Model can not exceed 100 characters" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please enter the email" },
            { max: 40, message: "Model can not exceed 40 characters" },
          ]}
        >
          <Input />
        </Form.Item>

        {!isEdit && (
          <Form.Item
            label="Password"
            name="password"
            hidden={isEdit ? true : false}
            labelCol={{
              span: 24,
            }}
            wrapperCol={{
              span: 24,
            }}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
              { whitespace: true },
              {
                min: 8,
                message: "Password must be at least 8 characters",
              },
              {
                max: 26,
                message: "Password cannot be longer than 26 characters",
              },
              {
                pattern:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,26}$/,
                message:
                  "Must contain 1 uppercase, 1 lowercase, 1 number, and 1 special character.",
              },
            ]}
          >
            <Input.Password placeholder="********" />
          </Form.Item>
        )}

        {!isEdit && (
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            hidden={isEdit ? true : false}
            labelCol={{
              span: 24,
              //offset: 2
            }}
            wrapperCol={{
              span: 24,
              //offset: 2
            }}
            hasFeedback
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: "Confirm Password is required!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject("Passwords does not matched.");
                },
              }),
            ]}
          >
            <Input.Password placeholder="********" />
          </Form.Item>
        )}

        <Form.Item
          name="contact"
          label="Contact"
          rules={[
            { required: true, message: "Please enter the contact" },
            { max: 40, message: "Model can not exceed 40 characters" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="company"
          label="Company"
          rules={[{ max: 100, message: "Model can not exceed 100 characters" }]}
        >
          <Input disabled={isEdit ? true : false} />
        </Form.Item>

        <Form.Item
          name="acctStatus"
          label="Account Status"
          rules={[{ message: "Please select status" }]}
          hidden={isEdit ? false : true}
        >
          <Select placeholder="Select status">
            <Option value="ACTIVE">ACTIVE</Option>
            <Option value="SUSPENDED">SUSPEND</Option>
            <Option value="BLOCKED">BLOCK</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="userType"
          label="User Type"
          rules={[{ required: true, message: "Please select account type" }]}
        >
          <Select placeholder="Select status" disabled={isEdit ? true : false}>
            <Option value="ADMIN USER">ADMIN USER</Option>
            <Option value="BUSINESS USER">BUSINESS USER</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddAccountModal;
