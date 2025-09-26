/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useContext, useEffect } from "react";
import { Table, Tag, message, Button } from "antd";
import {
  ReloadOutlined,
  DatabaseOutlined,
  FilterFilled,
  EyeOutlined,
} from "@ant-design/icons";
import { FaTruck, FaCheckCircle } from "react-icons/fa";
import { LoginContext } from "../../context/LoginContext";
import moment from "moment";
import ViewDeliveryModal from "../components/ViewDeliveryModal";
import Papa from "papaparse";
import dayjs from "dayjs";
import GenerateReportModal from "../components/GenerateReportModal";
import { Pagination } from "../components/Pagination/Pagination";
import "./delivery.css";

const Delivery = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerateModalVisible, setGenerateModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { loginData, setLoginData } = useContext(LoginContext);
  const [messageApi, contextHolder] = message.useMessage();

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
    setSelectedOrder(record);
    setIsModalOpen(true);
  };

  const columns = [
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
      title: "Address",
      dataIndex: ["order", "user", "address"],
      key: ["order", "user", "address"],
      sName: "blue-text",
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
      filterIcon: (filtered) => (
        <FilterFilled
          style={{
            color: filtered ? "#ffffff" : "#ffffff", // always white
          }}
        />
      ),
      // onFilter: (value, record) => record.status.includes(value),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <div className="action-buttons flex gap-3">
            {/* View Button */}
            <Button
              style={{
                backgroundColor: "#52c41a",
                borderColor: "#52c41a",
                color: "#fff",
              }}
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => handleOpenModal(record)}
            >
              View
            </Button>
          </div>
        </>
      ),
    },
  ];

  const deliveryFields = [
    { label: "Delivery ID", value: "_id" },
    { label: "Customer Name", value: "order.user.name" },
    { label: "Customer Address", value: "order.user.address" },
    { label: "Customer Gender", value: "order.user.gender" },
    { label: "Customer Email", value: "order.user.email" },
    { label: "Customer Contact", value: "order.user.contact" },
    { label: "Products", value: "products" },
    { label: "Company", value: "order.company" },
    { label: "Status", value: "status" },
    { label: "Total Payment", value: "order.total" },
    { label: "Shipped-Out Date", value: "shippedOutDate" },
  ];
  // Helper to get nested value
  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((acc, key) => acc && acc[key], obj);
  };

  const handleGenerateReport = ({ dateRange, fields }) => {
    let filteredData = [...data];

    if (!filteredData || filteredData.length === 0) {
      messageApi.info("No data available to generate report.");
      return;
    }
    // Filter by date
    if (dateRange && dateRange.length === 2) {
      const [start, end] = dateRange;
      filteredData = filteredData.filter((item) => {
        const shippedOutDate = dayjs(item.shippedOutDate);
        return (
          shippedOutDate?.isSameOrAfter(start, "day") &&
          shippedOutDate?.isSameOrBefore(end, "day")
        );
      });
    }

    // Make sure we have fields
    if (!fields || fields.length === 0) {
      messageApi.info("Please select at least one field for the report.");
      return;
    }
    // Build rows based on selected fields
    let reportData = [];
    filteredData.forEach((item) => {
      if (Array.isArray(item?.order?.products)) {
        item?.order?.products.forEach((p) => {
          const row = {};
          fields.forEach((data) => {
            const value = getNestedValue(item, data);
            if (data === "products") {
              row["Product Brand"] = p.product?.brand || "";
              row["Product Model"] = p.product?.model || "";
              row["Price"] = p.product?.price || 0;
              row["Quantity"] = p.quantity || 0;
            } else {
              row[data] = value;
            }
          });
          reportData.push(row);
        });
      } else {
        // fallback if no products
        const row = {};
        fields.forEach((field) => {
          row[field] = getNestedValue(item, field);
        });
        reportData.push(row);
      }
    });

    if (reportData.length === 0) {
      messageApi.info("No records found for the selected filters.");
      return;
    }

    // Convert to CSV
    const csv = Papa.unparse(reportData);

    // Download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `${moment().format().split("T")[0]}-delivery-report.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
        <h3>DELIVERY</h3>
      </div>
      <div style={{ paddingTop: "20px", fontFamily: "sans-serif" }}>
        {/* Count Cards */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className="status-cards">
            <div className="status-card shipped">
              <FaTruck className="status-icon" />
              <strong>Shipped: {shippedCount}</strong>
            </div>
            <div className="status-card completed">
              <FaCheckCircle className="status-icon" />
              <strong>Completed: {completedCount}</strong>
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
              icon={<DatabaseOutlined style={{ fontSize: "16px" }} />}
              onClick={() => setGenerateModalVisible(true)}
              type="primary"
              style={{ marginBottom: 16 }}
            >
              Generate Report
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
          className="custom-table"
          dataSource={data}
          columns={columns}
          loading={loading}
          pagination={Pagination({ data: data })}
          rowKey="_id"
        />
      </div>
      <ViewDeliveryModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedOrder={selectedOrder}
      />

      <GenerateReportModal
        visible={isGenerateModalVisible}
        onClose={() => setGenerateModalVisible(false)}
        onGenerate={handleGenerateReport}
        availableFields={deliveryFields}
      />
    </main>
  );
};

export default Delivery;
