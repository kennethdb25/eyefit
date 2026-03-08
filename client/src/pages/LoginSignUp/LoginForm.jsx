import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography } from "antd";
import { ToastContainer, toast, Bounce } from "react-toastify";
import {
  UserOutlined,
  LockOutlined,
  PoweroffOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Box, Link } from "@mui/material";
import useStyles from "./style";

const LoginForm = (props) => {
  const classes = useStyles();
  const history = useNavigate();
  const [loadings, setLoadings] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const { showSignUpForm, LoginValidation } = props;

  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
    setTimeout(() => {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 2000);
  };

  const onFinish = async (values) => {
    const data = await fetch("/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(values),
    });
    const res = await data.json();
    if (res.success) {
      LoginValidation();
      toast.success("Please wait...", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      setTimeout(() => {
        let arry = res.result.userEmail.tokens;
        let lastElement = arry[arry.length - 1];
        localStorage.setItem("accountToken", lastElement.token);
        window.location.reload();
        setTimeout(() => {
          history("/home");
        }, 1000);
      }, 3000);
    } else {
      toast.error(res.body, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };
  const onFinishFailed = async (error) => {
    console.log("Failed:", error);
  };

  return (
    <Box className={classes.loginContainer}>
      <ToastContainer />
      <Box className={classes.loginCard}>
        <div className="text-center mb-6">
          <img
            src="/icon.png"
            alt="icon_sidebar"
            style={{ width: "150px", height: "150px", margin: "0 auto" }}
          />
        </div>
        <Form
          name="basic"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          className={classes.Form}
        >
          {/* Email */}
          <Form.Item
            name="email"
            rules={[
              { message: "Email is required", required: true },
              { whitespace: true },
              { type: "email", message: "Please enter a valid email" },
            ]}
            hasFeedback
          >
            <Input
              size="large"
              prefix={<UserOutlined style={{ marginRight: "10px" }} />}
              placeholder="Email address"
              className={classes.inputField}
            />
          </Form.Item>

          {/* Password */}
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Password is required!" }]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined style={{ marginRight: "10px" }} />}
              placeholder="Password"
              className={classes.inputField}
            />
          </Form.Item>

          {/* Forgot Password */}
          <Box className={classes.forgotWrapper}>
            <Typography
              component={Link}
              href="/forgot-password"
              style={{ textDecoration: "none", color: "#1976d2" }}
            >
              Forgot Password?
            </Typography>
          </Box>

          {/* Login Button */}
          <Form.Item>
            <div className={classes.loginDetails}>
              <Button
                type="primary"
                size="large"
                shape="round"
                icon={<PoweroffOutlined />}
                loading={loadings[5] && { icon: <SyncOutlined spin /> }}
                onClick={() => enterLoading(5)}
                className={classes.loginButton}
                htmlType="submit"
              >
                LOGIN
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Box>
    </Box>
  );
};

export default LoginForm;
