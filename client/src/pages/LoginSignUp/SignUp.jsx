import React from "react";
import { Form, Input, Radio, Row, Col, Typography } from "antd";
import "./style.css";

const { Text } = Typography;
const SignUp = (props) => {
  const { form, onFinish } = props;

  return (
    <>
      <Form
        form={form}
        labelCol={{
          span: 8,
        }}
        layout="horizontal"
        onFinish={onFinish}
        autoComplete="off"
        style={{
          width: "100%",
        }}
      >
        <Row>
          {/* <Col xs={{ span: 0 }} md={{ span: 4 }}></Col> */}
          <Col xs={{ span: 24 }} md={{ span: 24 }}>
            <Row gutter={12}>
              <Col xs={{ span: 24 }} md={{ span: 8 }} layout="vertical">
                <Form.Item
                  label="First Name"
                  name="firstName"
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
                      message: "Please input your first name!",
                    },
                    {
                      pattern: /^[a-zA-Z_ ]*$/,
                      message: "Numbers or special character are not allowed",
                    },
                  ]}
                >
                  <Input placeholder="Enter your first name" />
                </Form.Item>
              </Col>
              <Col xs={{ span: 24 }} md={{ span: 8 }}>
                <Form.Item
                  label="Middle Name"
                  name="middleName"
                  labelCol={{
                    span: 24,
                  }}
                  wrapperCol={{
                    span: 24,
                  }}
                  hasFeedback
                  rules={[
                    {
                      pattern: /^[a-zA-Z_ ]*$/,
                      message: "Numbers or special character are not allowed",
                    },
                    {
                      required: true,
                      message: "Please input your first name!",
                    },
                  ]}
                >
                  <Input placeholder="Enter your middle name" />
                </Form.Item>
              </Col>
              <Col xs={{ span: 24 }} md={{ span: 8 }}>
                <Form.Item
                  label="Last Name"
                  name="lastName"
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
                      message: "Please input your last name!",
                    },
                    {
                      pattern: /^[a-zA-Z_ ]*$/,
                      message: "Numbers or special character are not allowed",
                    },
                  ]}
                >
                  <Input placeholder="Enter your last name" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col xs={{ span: 24 }} md={{ span: 8 }}>
                <Form.Item
                  label="Student ID"
                  name="userId"
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
                      message: "Please input your student ID!",
                    },
                  ]}
                >
                  <Input placeholder="Enter your student ID" />
                </Form.Item>
              </Col>
              <Col xs={{ span: 24 }} md={{ span: 8 }}>
                <Form.Item
                  label="Contact Number"
                  name="contact"
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
                      message: "Please input your 11 digits mobile number!",
                    },
                    { whitespace: true },
                    {
                      min: 11,
                      message: "Contact Number must be at least 11 characters",
                    },
                    {
                      max: 11,
                      message:
                        "Contact Number cannot be longer than 11 characters",
                    },
                    {
                      pattern: /[0-9]/,
                      message: "Invalid Character",
                    },
                  ]}
                >
                  <Input placeholder="Enter your 11 digits mobile number" />
                </Form.Item>
              </Col>
              <Col xs={{ span: 24 }} md={{ span: 8 }}>
                <Form.Item
                  label="Gender"
                  name="gender"
                  labelCol={{
                    span: 24,
                    //offset: 2
                  }}
                  wrapperCol={{
                    span: 24,
                  }}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Please select your gender!",
                    },
                  ]}
                >
                  <Radio.Group style={{ width: "100%" }}>
                    <Radio value="Male">Male</Radio>
                    <Radio value="Female">Female</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col xs={{ span: 24 }} md={{ span: 24 }}>
                <Form.Item
                  label="Address"
                  name="address"
                  labelCol={{
                    span: 24,
                    //offset: 2
                  }}
                  wrapperCol={{
                    span: 24,
                  }}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Please enter your address!",
                    },
                  ]}
                >
                  <Input placeholder="House No./Street Name/Barangay/Municipality/Province" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col xs={{ span: 24 }} md={{ span: 8 }}>
                <Form.Item
                  label="Email"
                  name="email"
                  labelCol={{
                    span: 24,
                    //offset: 2
                  }}
                  wrapperCol={{
                    span: 24,
                  }}
                  hasFeedback
                  rules={[
                    {
                      type: "email",
                      required: true,
                      message: "Please enter a valid email",
                    },
                  ]}
                >
                  <Input placeholder="Enter your email" />
                </Form.Item>
              </Col>
              <Col xs={{ span: 24 }} md={{ span: 8 }}>
                <Form.Item
                  label="Password"
                  name="password"
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
              </Col>
              <Col xs={{ span: 24 }} md={{ span: 8 }}>
                <Form.Item
                  label="Confirm Password"
                  name="confirmPassword"
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
              </Col>
              <Col xs={{ span: 24 }} md={{ span: 24 }}>
                <div className="privacy-data">
                  <br />
                  <Text strong>Note: </Text>
                  <Text>
                    Thank you for choosing to sign up for our Eyefit Web
                    Application. We value your privacy and want to assure you
                    that we are committed to protecting the personal information
                    you provide.
                  </Text>
                </div>
              </Col>
            </Row>
          </Col>
          <Col xs={{ span: 0 }} md={{ span: 4 }}></Col>
        </Row>
      </Form>
    </>
  );
};

export default SignUp;
