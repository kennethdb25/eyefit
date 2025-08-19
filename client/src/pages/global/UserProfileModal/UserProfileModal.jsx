import { useState, useContext } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Avatar, Typography, Descriptions } from "antd";
import {
  UserOutlined,
  PoweroffOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { LoginContext } from "../../../context/LoginContext";

const { Title } = Typography;

const UserProfileModal = ({ user, isVisible, onClose, setData }) => {
  const history = useNavigate();
  const [loadings, setLoadings] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const { loginData, setLoginData } = useContext(LoginContext);

  const handleLogout = async () => {
    let token = localStorage.getItem("accountToken");
    const res = await fetch("/api/user/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        Accept: "application/json",
      },
      credentials: "include",
    });

    const data = await res.json();

    if (data.success) {
      setData(false);
      setTimeout(() => {
        localStorage.removeItem("accountToken");
        history("/");
        setLoginData(null);
        setData(true);
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
      handleLogout();
    }, 2000);
  };

  return (
    <>
      {
        <Modal
          title="USER PROFILE"
          open={isVisible}
          onCancel={onClose}
          footer={[
            <Button type="primary" key="close" onClick={onClose}>
              CLOSE
            </Button>,
            <Button
              type="primary"
              icon={<PoweroffOutlined />}
              danger
              key="close"
              onClick={() => enterLoading(5)}
              loading={
                loadings[5] && {
                  icon: <SyncOutlined spin />,
                }
              }
            >
              LOGOUT
            </Button>,
          ]}
          centered
        >
          <ToastContainer />
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <Avatar size={100} icon={<UserOutlined />} />
            <Title level={4} style={{ marginTop: 12 }}>
              {user?.name.toUpperCase() || "John Doe"}
            </Title>
          </div>

          <Descriptions
            bordered
            size="middle"
            column={1}
            labelStyle={{ fontWeight: "bold", width: 200 }}
          >
            <Descriptions.Item label="Contact Number">
              {user?.contact || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {user?.email || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Address">
              {user?.address || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="User Type">
              {user?.user.toUpperCase() || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Account Status">
              {user?.acctStatus || "N/A"}
            </Descriptions.Item>
          </Descriptions>
        </Modal>
      }
    </>
  );
};

export default UserProfileModal;
