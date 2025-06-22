import { useState } from "react";
import { Box } from "@mui/material";
import { Space, Drawer, Button, Form, message } from "antd";
import useStyles from "./style";
import LoginForm from "./LoginForm";
import SignUp from "./SignUp";
import { FormOutlined } from "@ant-design/icons";

const AccountLogin = (props) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const classes = useStyles();
  const { LoginValidation } = props;

  const onFinish = async (values) => {
    const data = await fetch("/api/registration", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const res = await data.json();

    if (res.status === 200) {
      message.success("Registration Successfully Completed");
      onClose();
      form.resetFields();
    } else {
      message.error(data.error);
    }
  };

  const showSignUpForm = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
    form.resetFields();
  };

  const width = window.innerWidth;
  return (
    <Box className={classes.loginContainer}>
      <LoginForm
        showSignUpForm={showSignUpForm}
        LoginValidation={LoginValidation}
      />
      <Drawer
        title="Sign Up"
        placement="left"
        onClose={onClose}
        open={visible}
        height="100%"
        width={width >= 450 ? 900 : 400}
        style={{ display: "flex", justifyContent: "center" }}
        extra={<Space></Space>}
        footer={[
          <div
            style={
              width >= 450
                ? { display: "flex", justifyContent: "flex-end" }
                : { display: "flex", justifyContent: "flex-start" }
            }
          >
            <Button type="primary" onClick={() => form.submit()}>
              <FormOutlined style={{ marginTop: "1px" }} /> CONFIRM REGISTRATION
            </Button>
          </div>,
        ]}
      >
        <SignUp form={form} onFinish={onFinish} />
      </Drawer>
    </Box>
  );
};

export default AccountLogin;
