import React, { useState } from "react";
import { Card, Input, Button, Form, message, Typography } from "antd";
import useStyles from "./style";

const { Title, Paragraph } = Typography;

export default function ForgotPassword() {
  const classes = useStyles();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");

  const handleSendOtp = async () => {
    // try {
    //   await axios.post("/auth/forgot-password", { email });
    //   message.success("OTP sent to your email");
    //   setStep(2);
    // } catch (err) {
    //   message.error(err.response?.data?.message || "Error sending OTP");
    // }
  };

  const handleVerifyOtp = async () => {
    // try {
    //   const res = await axios.post("/auth/verify-otp", { email, otp });
    //   setToken(res.data.token);
    //   message.success("OTP verified!");
    //   setStep(3);
    // } catch (err) {
    //   message.error(err.response?.data?.message || "Invalid OTP");
    // }
  };

  const handleResetPassword = async () => {
    // try {
    //   await axios.post("/auth/reset-password", {
    //     token,
    //     newPassword: password,
    //   });
    //   message.success("Password reset successful!");
    //   setStep(1);
    //   setEmail("");
    //   setOtp("");
    //   setPassword("");
    // } catch (err) {
    //   message.error(err.response?.data?.message || "Failed to reset password");
    // }
  };

  return (
    <div className={classes.container}>
      <Card className={classes.card}>
        <Title level={3} className={classes.title}>
          Forgot Password
        </Title>
        <Paragraph className={classes.subtitle}>
          {step === 1 && "Enter your email to receive OTP."}
          {step === 2 && "Check your email and enter the OTP below."}
          {step === 3 && "Enter your new password."}
        </Paragraph>

        {step === 1 && (
          <Form
            layout="vertical"
            onFinish={handleSendOtp}
            className={classes.form}
          >
            <Form.Item label="Email" required>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={classes.inputField}
              />
            </Form.Item>
            <Button type="primary" htmlType="submit" className={classes.button}>
              Send OTP
            </Button>
          </Form>
        )}

        {step === 2 && (
          <Form
            layout="vertical"
            onFinish={handleVerifyOtp}
            className={classes.form}
          >
            <Form.Item label="OTP" required>
              <Input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter the OTP"
                className={classes.inputField}
              />
            </Form.Item>
            <Button type="primary" htmlType="submit" className={classes.button}>
              Verify OTP
            </Button>
          </Form>
        )}

        {step === 3 && (
          <Form
            layout="vertical"
            onFinish={handleResetPassword}
            className={classes.form}
          >
            <Form.Item label="New Password" required>
              <Input.Password
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className={classes.inputField}
              />
            </Form.Item>
            <Button type="primary" htmlType="submit" className={classes.button}>
              Reset Password
            </Button>
          </Form>
        )}
      </Card>
    </div>
  );
}
