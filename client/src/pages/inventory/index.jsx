/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useContext, useEffect } from "react";
import { Table, Tag, Button, message } from "antd";
import { ReloadOutlined, DatabaseOutlined } from "@ant-design/icons";
import { LoginContext } from "../../context/LoginContext";
import moment from "moment";
import ViewInventoryModal from "../components/ViewInventoryModal";
import Papa from "papaparse";
import dayjs from "dayjs";
import GenerateReportModal from "../components/GenerateReportModal";
import { Pagination } from "../components/Pagination/Pagination";

const Inventory = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isGenerateModalVisible, setGenerateModalVisible] = useState(false);

  const { loginData, setLoginData } = useContext(LoginContext);
  const [messageApi, contextHolder] = message.useMessage();

  const fetchData = async () => {
    setLoading(true); // Start loading
    try {
      const res = await fetch(
        `/api/inventory?company=${loginData?.body?.company}`
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
      dataIndex: "orderId",
      key: "orderId",
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
          </div>
        </>
      ),
    },
  ];

  const inventoryFields = [
    { label: "Inventory ID", value: "_id" },
    { label: "Order ID", value: "orderId" },
    { label: "Customer Name", value: "user.name" },
    { label: "Customer Address", value: "user.address" },
    { label: "Customer Gender", value: "user.gender" },
    { label: "Customer Email", value: "user.email" },
    { label: "Customer Contact", value: "user.contact" },
    { label: "Products", value: "products" },
    { label: "Company", value: "company" },
    { label: "Status", value: "status" },
    { label: "Total Payment", value: "total" },
    { label: "Created Date", value: "createdAt" },
  ];

  // Helper to get nested value
  const getNestedValue = (obj, path) => {
    // console.log(obj);
    // console.log(path);
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
        const createdAt = dayjs(item.createdAt);
        return (
          createdAt?.isSameOrAfter(start, "day") &&
          createdAt?.isSameOrBefore(end, "day")
        );
      });
    } else {
      messageApi.error(`Please select a date range`);
      return;
    }

    // Make sure we have fields
    if (!fields || fields.length === 0) {
      messageApi.info("Please select at least one field for the report.");
      return;
    }
    // Build rows based on selected fields
    let reportData = [];
    filteredData.forEach((item) => {
      if (Array.isArray(item.products)) {
        item.products.forEach((p) => {
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
          console.log(field);
          row[field.label] = getNestedValue(item, field.value);
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
      `${moment().format().split("T")[0]}-inventory-report.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
        <h3>INVENTORY</h3>
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
          dataSource={data}
          columns={columns}
          loading={loading}
          pagination={Pagination({ data: data })}
          rowKey="_id"
        />
      </div>

      <ViewInventoryModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedOrder={selectedOrder}
      />

      <GenerateReportModal
        visible={isGenerateModalVisible}
        onClose={() => setGenerateModalVisible(false)}
        onGenerate={handleGenerateReport}
        availableFields={inventoryFields}
      />
    </main>
  );
};

export default Inventory;
