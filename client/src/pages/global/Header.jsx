/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Badge,
  Drawer,
  List,
  Tag,
  Space,
  Button,
  Typography,
  message,
} from "antd";
import { BsPersonCircle, BsJustify } from "react-icons/bs";
import { BellOutlined, CheckOutlined } from "@ant-design/icons";
import "../../index.css";
import { LoginContext } from "../../context/LoginContext";
import UserProfileModal from "./UserProfileModal/UserProfileModal";

const { Text } = Typography;

function Header({ OpenSidebar, setData }) {
  const { loginData, setLoginData } = useContext(LoginContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [lastNotifId, setLastNotifId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true); // Start loading
    try {
      const res = await fetch(
        `/api/notification?company=${loginData?.body?.company}`
      );
      const json = await res.json();
      const newList = json.body;
      const unreadMessage = newList.filter(
        (item) => item.read === false
      ).length;
      if (unreadMessage.length > 0) {
        const latest = unreadMessage[0];
        if (latest?._id !== lastNotifId) {
          messageApi.info(latest?.message); // popup toast
          setLastNotifId(latest?._id);
        }
      }
      // console.log(json);
      // console.log(items);
      // if (json?.body?.length > items?.length) {
      //   // New notification detected
      //   const newNotif = json.body[json.body.length - 1];
      //   messageApi.info(newNotif.message); // popup toast
      // }
      setUnread(unreadMessage);
      setItems(newList); // assuming your API responds with { body: [...] }
    } catch (error) {
      console.error("Fetch failed:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const markAsRead = async (id) => {
    try {
      const res = await fetch(`/api/notification?notificationId=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await res.json();

      if (json.success) {
        messageApi.info("Redirecting to Orders Page. Mark As Read!"); // popup toast
      }
    } catch (error) {
      console.error("Fetch failed:", error);
    } finally {
      fetchData();
    }
  };

  const onNavigate = (path, id, readStatus) => {
    if (!readStatus) {
      navigate(path);
      markAsRead(id);
    } else {
      messageApi.info("Notification was read already!");
    }
  };

  const user = {
    name: loginData?.body.company || loginData?.body.userType,
    contact: loginData?.body.contact,
    email: loginData?.body.email,
    address: loginData?.body.address,
    user: loginData?.body?.userType,
    acctStatus: loginData?.body.acctStatus,
  };

  const markAllRead = async () => {
    setLoading(true); // Start loading
    try {
      const res = await fetch(
        `/api/notification/mark-as-read?company=${loginData?.body?.company}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const json = await res.json();
      if (json.success) {
        fetchData();
        setUnread(0);
      }
      console.log(json);
    } catch (error) {
      console.error("Fetch failed:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Poll every 10s
  useEffect(() => {
    if (loginData.body.company) {
      fetchData();
      const interval = setInterval(fetchData, 10000);
      return () => clearInterval(interval);
    }
  }, [loginData.body.company]);

  return (
    <header className="headers">
      {contextHolder}
      <div className="menu-icon">
        <BsJustify className="icon" onClick={OpenSidebar} />
      </div>
      <div className="header-left">{/* <BsSearch className="icon" /> */}</div>
      <div className="header-right">
        <Badge count={unread} size="small">
          <BellOutlined
            className="icon"
            onClick={() => setOpen(true)}
            style={{ fontSize: 20, cursor: "pointer", color: "white" }}
            aria-label="Open notifications"
            role="button"
          />
        </Badge>
        <BsPersonCircle
          className="icon"
          onClick={() => setIsModalVisible(true)}
        />
      </div>
      <UserProfileModal
        user={user}
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        setData={setData}
      />
      <Drawer
        title={
          <Space>
            <span>Notifications</span>
            <Tag>{unread}</Tag>
          </Space>
        }
        placement="right"
        width={580}
        onClose={() => {
          setOpen(false);
        }}
        open={open}
        extra={
          <Space>
            <Button icon={<CheckOutlined />} onClick={markAllRead}>
              Mark all as read
            </Button>
          </Space>
        }
      >
        <List
          dataSource={items}
          locale={{ emptyText: "No notifications yet" }}
          renderItem={(item) => (
            <List.Item
              style={{ alignItems: "start", cursor: "pointer" }}
              onClick={() => onNavigate(`/${item.path}`, item._id, item.read)}
            >
              <div style={{ width: "100%" }}>
                <Space
                  style={{ width: "100%", justifyContent: "space-between" }}
                >
                  <Space>
                    <Tag color={item.type === "New Order" ? "green" : "blue"}>
                      {item.type}
                    </Tag>
                    <Text strong>Order: {item.orderId}</Text>
                  </Space>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleString()
                      : new Date().toLocaleString()}
                  </Text>
                  <div style={{ color: "red" }}>
                    {item.read ? "" : "Unread"}
                  </div>
                </Space>

                {item.customerName && (
                  <div style={{ marginTop: 4, fontSize: 12 }}>
                    <Text type="secondary">Customer:</Text> {item.customerName}
                  </div>
                )}
                <div style={{ marginTop: 6 }}>{item.message}</div>
              </div>
            </List.Item>
          )}
        />
      </Drawer>
    </header>
  );
}

export default Header;
