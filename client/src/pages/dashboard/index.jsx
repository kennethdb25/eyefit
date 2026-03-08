import React, { useState, useEffect, useContext } from "react";
import { Form, Table, Tag, Button } from "antd";
import {
  BsBoxSeam, // Products
  BsCartCheckFill, // Orders
  BsPeopleFill, // Customers
  BsXCircleFill, // Cancelled
} from "react-icons/bs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import "./Dashboard.css";
import { LoginContext } from "../../context/LoginContext";
import moment from "moment";
import AddAccountModal from "../components/AddAccountModal";
import {
  ReloadOutlined,
  PlusOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { loginData } = useContext(LoginContext);
  const [summary, setSummary] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalCancelled: 0,
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [loadingButton, setLoadingButton] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch(
          `/api/analytics/summary?company=${loginData?.body?.company}`,
        );
        const data = await res.json();
        setSummary(data);
      } catch (error) {
        console.error("Error fetching summary:", error);
      }
    };

    if (loginData?.body?.company) {
      fetchSummary();
    }
  }, [loginData]);

  // ✅ Set default start and end date on mount
  useEffect(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // Format date in local time (YYYY-MM-DD)
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    setStartDate(formatDate(firstDay));
    setEndDate(formatDate(lastDay));
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      fetchOrders();
      fetchTopProducts();
    }
  }, [startDate, endDate]);

  const fetchOrders = async () => {
    try {
      let url = "/api/analytics/order?";
      const params = [];

      if (startDate && endDate) {
        params.push(`startDate=${startDate}&endDate=${endDate}`);
      }
      if (loginData?.body?.company) {
        params.push(`company=${loginData.body.company}`);
      }

      if (params.length > 0) {
        url += params.join("&");
      }

      const res = await fetch(url);
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchTopProducts = async () => {
    try {
      let url = "/api/analytics/top-products?";
      const params = [];

      if (startDate && endDate) {
        params.push(`startDate=${startDate}&endDate=${endDate}`);
      }

      if (loginData?.body?.company) {
        params.push(`company=${loginData.body.company}`);
      }

      params.push(`status=Completed`);

      if (params.length > 0) {
        url += params.join("&");
      }

      const res = await fetch(url);
      const data = await res.json();
      setTopProducts(data);
    } catch (error) {
      console.error("Error fetching top products:", error);
    }
  };

  const chartData = orders.map((order) => ({
    date: order.date,
    total: order.total,
    items: order.items,
  }));

  const fetchData = async () => {
    setLoading(true); // Start loading
    try {
      const res = await fetch(`/api/user/accounts`);
      const json = await res.json();
      setData(json.body || []); // assuming your API responds with { body: [...] }
    } catch (error) {
      console.error("Fetch failed:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const showAddModal = () => {
    form.resetFields();
    setIsEdit(false);
    setIsModalVisible(true);
  };

  const showEditModal = (record) => {
    console.log(record);
    form.setFieldsValue(record);
    setEditingRecord(record);
    setIsEdit(true);
    setIsModalVisible(true);
  };

  const onClose = () => {
    setEditingRecord();
    setIsEdit(false);
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: "User Id",
      dataIndex: "_id",
      key: "_id",
      className: "blue-text",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Contact",
      dataIndex: "contact",
      key: "contact",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Account Creation Date",
      dataIndex: "created",
      key: "created",
      render: (_, { created }) => (
        <>{moment(created).format("MMMM Do YYYY, h:mm:ss a")}</>
      ),
    },
    {
      title: "Account Status",
      dataIndex: "acctStatus",
      key: "acctStatus",
      render: (_, { acctStatus }) => (
        <>
          {acctStatus === "ACTIVE" ? (
            <Tag color="green">{acctStatus.toUpperCase()}</Tag>
          ) : acctStatus === "SUSPENDED" ? (
            <Tag color="orange">{acctStatus.toUpperCase()}</Tag>
          ) : (
            <Tag color="red">{acctStatus.toUpperCase()}</Tag>
          )}
        </>
      ),
    },
    {
      title: "User Type",
      dataIndex: "userType",
      key: "userType",
      render: (_, { userType }) => (
        <>
          {userType === "ADMIN USER" ? (
            <Tag color="green">{userType.toUpperCase()}</Tag>
          ) : (
            <Tag color="orange">{userType.toUpperCase()}</Tag>
          )}
        </>
      ),
      filters: [
        {
          text: "ADMIN USER",
          value: "ADMIN USER",
        },
        {
          text: "BUSINESS USER",
          value: "BUSINESS USER",
        },
      ],
      onFilter: (value, record) => record.userType.indexOf(value) === 0,
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
              onClick={() => showEditModal(record)}
            >
              VIEW
            </button>
            {/* <Popconfirm
                  title="Delete Product"
                  description="Are you sure to delete this product?"
                  onConfirm={() => confirm()}
                  onCancel={() => cancel()}
                  okText="Yes"
                  cancelText="No"
                >
                  <button className="delete-button">DELETE</button>
                </Popconfirm> */}
          </div>
        </>
      ),
    },
  ];

  const activeCount = data.filter(
    (item) => item.acctStatus === "ACTIVE",
  ).length;
  const suspendedCount = data.filter(
    (item) => item.acctStatus === "SUSPENDED",
  ).length;
  const blockedCount = data.filter(
    (item) => item.acctStatus === "BLOCKED",
  ).length;

  const onConfirm = () => {
    form.submit();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {loginData.body.userType === "ADMIN USER" ? (
        <>
          <main className="main-container">
            <div className="main-title">
              <h3>SETTING</h3>
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
                      backgroundColor: "green",
                      padding: "10px 15px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      color: "white",
                    }}
                  >
                    <strong>Active: {activeCount}</strong>
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
                    <strong>Suspended: {suspendedCount}</strong>
                  </div>
                  <div
                    style={{
                      backgroundColor: "red",
                      padding: "10px 15px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      color: "white",
                    }}
                  >
                    <strong>Blocked: {blockedCount}</strong>
                  </div>
                </div>
                <div className="action-buttons">
                  <Button
                    icon={<DatabaseOutlined style={{ fontSize: "16px" }} />}
                    // onClick={() => showAddModal()}
                    type="primary"
                    style={{ marginBottom: 16 }}
                  >
                    Generate Report
                  </Button>
                  <Button
                    icon={<PlusOutlined style={{ fontSize: "16px" }} />}
                    onClick={() => showAddModal()}
                    type="primary"
                    style={{ marginBottom: 16 }}
                  >
                    Add User
                  </Button>
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

            {/* Add User Modal */}
            <AddAccountModal
              visible={isModalVisible}
              onClose={onClose}
              onConfirm={onConfirm}
              form={form}
              fetchData={fetchData} // Pass the fetchData function to the modal for re}
              isEdit={isEdit}
              editingRecord={editingRecord}
              setIsModalVisible={setIsModalVisible}
              loadingButton={loadingButton}
              setLoadingButton={setLoadingButton}
            />
          </main>
        </>
      ) : (
        <>
          <main className="main-container">
            <div className="main-title">
              <h3>DASHBOARD</h3>
            </div>
            {loginData?.body?.userType !== "ADMIN USER" ? (
              <div className="main-cards">
                <div className="card">
                  <div className="card-inner">
                    <h3>PRODUCTS</h3>
                    <BsBoxSeam className="card_icon" />
                  </div>
                  <h1>{summary.totalProducts}</h1>
                </div>

                <div className="card">
                  <div className="card-inner">
                    <h3>ORDERS</h3>
                    <BsCartCheckFill className="card_icon" />
                  </div>
                  <h1>{summary.totalOrders}</h1>
                </div>

                <div className="card">
                  <div className="card-inner">
                    <h3>CUSTOMERS</h3>
                    <BsPeopleFill className="card_icon" />
                  </div>
                  <h1>{summary.totalCustomers}</h1>
                </div>

                <div className="card">
                  <div className="card-inner">
                    <h3>CANCELLED</h3>
                    <BsXCircleFill className="card_icon" />
                  </div>
                  <h1>{summary.totalCancelled}</h1>
                </div>
              </div>
            ) : null}

            {loginData?.body?.userType !== "ADMIN USER" ? (
              <div className="dashboard">
                <div className="dashboard-header">
                  <h1>Order Analytics Dashboard</h1>
                  <div className="filters">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
                {/* Charts */}
                <div className="charts">
                  <div className="chart">
                    <h2>Total Sales Over Time</h2>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="total"
                          stroke="#8884d8"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="chart">
                    <h2>Items Sold Over Time</h2>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="items" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="chart">
                    <h2>Top Selling Product</h2>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={topProducts}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip dataKey="brand" />
                        <Legend />
                        <Bar dataKey="totalQuantity" fill="#ff8042" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="table-container">
                  <div className="order-details">
                    <h2>TOTAL SALES PER DAY</h2>
                  </div>
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th className="table-head-dashboard">Date</th>
                        <th className="table-head-dashboard">Total</th>
                        <th className="table-head-dashboard">
                          Total Items Sold
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {chartData.map((row, i) => (
                        <tr key={i}>
                          <td className="table-data-dashboard">{row.date}</td>
                          <td className="table-data-dashboard">{`Php ${row.total}.00`}</td>
                          <td className="table-data-dashboard">{row.items}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}
          </main>
        </>
      )}
    </>
  );
}
