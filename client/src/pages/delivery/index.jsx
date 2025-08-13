/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from "react";
import { Form, Table, Tag, message, Button, Popconfirm } from "antd";
import { ReloadOutlined, PlusOutlined } from "@ant-design/icons";
import { LoginContext } from "../../context/LoginContext";
import moment from "moment";
import ViewDeliveryModal from "../components/ViewDeliveryModal";

const Delivery = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { loginData, setLoginData } = useContext(LoginContext);

  const fetchData = async () => {
    setLoading(true); // Start loading
    try {
      const res = await fetch(
        `/api/delivery?company=${loginData?.body?.company}`
      );
      const json = await res.json();
      setData(json.body || []); // assuming your API responds with { body: [...] }
    } catch (error) {
      console.error("Fetch failed:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleOpenModal = (record) => {
    console.log(record);
    setSelectedOrder(record);
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: "Order Id",
      dataIndex: ["order", "_id"],
      key: ["order", "_id"],
      className: "blue-text",
    },
    {
      title: "Customer Id",
      dataIndex: ["order", "user", "_id"],
      key: ["order", "user", "_id"],
      className: "blue-text",
    },
    {
      title: "Name",
      dataIndex: ["order", "user", "name"],
      key: ["order", "user", "name"],
    },
    {
      title: "Email",
      dataIndex: ["order", "user", "email"],
      key: ["order", "user", "email"],
    },
    {
      title: "Contact Number",
      dataIndex: ["order", "user", "contact"],
      key: ["order", "user", "contact"],
    },
    {
      title: "Shipped Date",
      dataIndex: "shippedOutDate",
      key: "shippedOutDate",
      render: (_, { shippedOutDate }) => {
        return moment(shippedOutDate).format("LL");
      },
    },
    // {
    //   title: "Price",
    //   dataIndex: "price",
    //   key: "price",
    // },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => (
        <>
          {status === "Cancelled" ? (
            <Tag color="red">{status.toUpperCase()}</Tag>
          ) : status === "Shipped" ? (
            <Tag color="blue">{status.toUpperCase()}</Tag>
          ) : status === "Pending" || status === "pending" ? (
            <Tag color="purple">{status.toUpperCase()}</Tag>
          ) : status === "Completed" ? (
            <Tag color="green">{status.toUpperCase()}</Tag>
          ) : (
            <Tag color="orange">{status.toUpperCase()}</Tag>
          )}
        </>
      ),
      filters: [
        {
          text: "Completed",
          value: "Completed",
        },
        {
          text: "Shipped",
          value: "Shipped",
        },
        {
          text: "Processing",
          value: "Processing",
        },
        {
          text: "Pending",
          value: "Pending",
        },
      ],
      onFilter: (value, record) => record.status.indexOf(value) === 0,
      filterSearch: true,
      // onFilter: (value, record) => record.status.includes(value),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <div className="action-buttons">
            <button
              className="edit-button"
              onClick={() => handleOpenModal(record)}
            >
              VIEW
            </button>
          </div>
        </>
      ),
    },
  ];

  const shippedCount = data.filter((item) => item.status === "Shipped").length;
  const completedCount = data.filter(
    (item) => item.status === "Completed"
  ).length;

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>DELIVERY</h3>
      </div>
      <div style={{ paddingTop: "20px", fontFamily: "sans-serif" }}>
        {/* Count Cards */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "start",
              gap: "10px",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                backgroundColor: "blue",
                padding: "10px 15px",
                borderRadius: "8px",
                fontSize: "14px",
                color: "white",
              }}
            >
              <strong>Shipped:{shippedCount} </strong>
            </div>
            <div
              style={{
                backgroundColor: "green",
                padding: "10px 15px",
                borderRadius: "8px",
                fontSize: "14px",
                color: "white",
              }}
            >
              <strong>Completed:{completedCount} </strong>
            </div>
          </div>
          <div className="action-buttons">
            {/* <Button
                    icon={<PlusOutlined style={{ fontSize: "16px" }} />}
                    onClick={() => showAddModal()}
                    type="primary"
                    style={{ marginBottom: 16 }}
                  >
                    Add Product
                  </Button> */}
            <Button
              icon={<ReloadOutlined style={{ fontSize: "16px" }} />}
              onClick={fetchData}
              loading={loading}
              type="default"
              style={{ marginBottom: 16 }}
            >
              Refresh Data
            </Button>
          </div>
        </div>
      </div>
      <div className="main-content">
        <Table
          dataSource={data}
          columns={columns}
          loading={loading}
          rowKey="_id"
        />
      </div>
      <ViewDeliveryModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedOrder={selectedOrder}
      />
    </main>
  );
};

export default Delivery;
