import React, { useState, useContext, useEffect } from "react";
import { Form, Table, Tag, message, Button, Popconfirm } from "antd";
import { ReloadOutlined, PlusOutlined } from "@ant-design/icons";
import { LoginContext } from "../../context/LoginContext";
import moment from "moment";
import ViewAppointmentModal from "../components/ViewAppointmentModal";
import ViewOrderModal from "../components/ViewOrderModal";

const Orders = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { loginData, setLoginData } = useContext(LoginContext);
  const [messageApi, contextHolder] = message.useMessage();

  const fetchData = async () => {
    setLoading(true); // Start loading
    try {
      const res = await fetch(
        `/api/orders?company=${loginData?.body?.company}`
      );
      const json = await res.json();
      setData(json.body || []); // assuming your API responds with { body: [...] }
    } catch (error) {
      console.error("Fetch failed:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleUpdateStatus = async (status, id) => {
    setLoading(true);
    const validateStocks = selectedOrder.products.filter(
      (item) => item.product.status === "Out of Stock"
    );

    if (validateStocks.length > 0 && status === "Processing") {
      messageApi.warning("Some product are out of stock");
      setLoading(false);
      setIsModalOpen(false);
      return;
    }

    if (status === "Pending") {
      messageApi.warning("Please select a valid status.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/orders/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update status");
      }
      await fetchData();
      setIsModalOpen(false);
      messageApi.success(`Order ${status} successfully`);
    } catch (error) {
      messageApi.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (record) => {
    console.log(record);
    setSelectedOrder(record);
    setIsModalOpen(true);
  };

  const cancel = (e) => {
    console.log(e);
    message.error("Click on No");
  };

  const columns = [
    {
      title: "Order Id",
      dataIndex: "_id",
      key: "_id",
      className: "blue-text",
    },
    {
      title: "Customer Id",
      dataIndex: ["user", "_id"],
      key: ["user", "_id"],
      className: "blue-text",
    },
    {
      title: "Name",
      dataIndex: ["user", "name"],
      key: ["user", "name"],
    },
    {
      title: "Email",
      dataIndex: ["user", "email"],
      key: ["user", "email"],
    },
    {
      title: "Contact Number",
      dataIndex: ["user", "contact"],
      key: ["user", "contact"],
    },
    {
      title: "Order Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (_, { createdAt }) => {
        return moment(createdAt).format("LL");
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
            <Popconfirm
              title="Update Order Status"
              description="Are you sure to cancel this Order?"
              onConfirm={() => handleUpdateStatus("Cancelled", record._id)}
              onCancel={() => cancel()}
              okText="Yes"
              cancelText="No"
            >
              <button
                hidden={
                  record?.status === "Shipped" || record?.status === "Completed"
                    ? true
                    : false
                }
                className="delete-button"
              >
                CANCEL
              </button>
            </Popconfirm>
          </div>
        </>
      ),
    },
  ];

  const cancelledCount = data.filter(
    (item) => item.status === "Cancelled"
  ).length;
  const pendingCount = data.filter((item) => item.status === "Pending").length;
  const processingCount = data.filter(
    (item) => item.status === "Processing"
  ).length;
  const shippedCount = data.filter((item) => item.status === "Shipped").length;
  const completedCount = data.filter(
    (item) => item.status === "Completed"
  ).length;

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main className="main-container">
      {contextHolder}
      <div className="main-title">
        <h3>ORDERS</h3>
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
                backgroundColor: "red",
                padding: "10px 15px",
                borderRadius: "8px",
                fontSize: "14px",
                color: "white",
              }}
            >
              <strong>Cancelled: {cancelledCount}</strong>
            </div>
            <div
              style={{
                backgroundColor: "purple",
                padding: "10px 15px",
                borderRadius: "8px",
                fontSize: "14px",
                color: "white",
              }}
            >
              <strong>Pending: {pendingCount}</strong>
            </div>
            <div
              style={{
                backgroundColor: "orange",
                padding: "10px 15px",
                borderRadius: "8px",
                fontSize: "14px",
                color: "white",
              }}
            >
              <strong>Processing:{processingCount} </strong>
            </div>
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

      <ViewOrderModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedOrder={selectedOrder}
        handleUpdateStatus={handleUpdateStatus}
      />
    </main>
  );
};

export default Orders;
