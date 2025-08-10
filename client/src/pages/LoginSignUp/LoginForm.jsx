import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Row, Col, Button, Typography } from "antd";
import { ToastContainer, toast, Bounce } from "react-toastify";
import {
  UserOutlined,
  LockOutlined,
  PoweroffOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Box, Link } from "@mui/material";
import useStyles from "./style";

const { Title } = Typography;

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
      body: JSON.stringify(values),
    });
    const res = await data.json();
    if (res.status === 201) {
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
    <Box className={classes.loginCard}>
      <ToastContainer />
      <Box alignItems="center">
        <Title level={2}>EYEFIT</Title>
      </Box>
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
        <Form.Item
          name="email"
          rules={[
            {
              message: "Email is required",
              required: true,
            },
            { whitespace: true },
            { type: "email", message: "Please enter a valid email" },
          ]}
          hasFeedback
        >
          <Input
            prefix={<UserOutlined style={{ marginRight: "10px" }} />}
            placeholder="Please enter your email address"
            style={{ borderRadius: "10px" }}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Password is required!",
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ marginRight: "10px" }} />}
            placeholder="Please enter your password"
            style={{ borderRadius: "10px" }}
          />
        </Form.Item>
        <Box>
          <Row gutter={8}>
            <Col xs={{ span: 24 }} md={{ span: 24 }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                {/* <Form.Item>
                  <Typography
                    onClick={showSignUpForm}
                    style={{ cursor: "pointer", color: "gray" }}
                  >
                    No Account? Register Here!
                  </Typography>
                </Form.Item> */}
                <Form.Item>
                  <Typography
                    component={Link}
                    style={{ textDecoration: "none", color: "gray" }}
                    href="/forgot-password"
                    sx={{ "&:hover": { cursor: "pointer" } }}
                  >
                    Forgot Password?
                  </Typography>
                </Form.Item>
              </div>
            </Col>
          </Row>
          <Form.Item>
            <div className={classes.loginDetails}>
              <Button
                htmlType="submit"
                // type="primary"
                style={{ backgroundColor: "blue", color: "white" }}
                icon={<PoweroffOutlined />}
                loading={
                  loadings[5] && {
                    icon: <SyncOutlined spin />,
                  }
                }
                onClick={() => enterLoading(5)}
              >
                <span style={{ fontSize: "16px" }}>LOGIN</span>
              </Button>
            </div>
          </Form.Item>
        </Box>
      </Form>
    </Box>
  );
};

export default LoginForm;
