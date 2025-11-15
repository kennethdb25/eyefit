/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useContext, useEffect, useRef } from "react";
import { Table, Tag, message, Button, Popconfirm, Input, Space } from "antd";
import {
  ReloadOutlined,
  DatabaseOutlined,
  SearchOutlined,
  FilterFilled,
  StopOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  FaTimesCircle,
  FaHourglassHalf,
  FaCogs,
  FaTruck,
  FaCheckCircle,
} from "react-icons/fa";
import { LoginContext } from "../../context/LoginContext";
import Highlighter from "react-highlight-words";
import moment from "moment";
import ViewOrderModal from "../components/ViewOrderModal";
import Papa from "papaparse";
import dayjs from "dayjs";
import GenerateReportModal from "../components/GenerateReportModal";
import { Pagination } from "../components/Pagination/Pagination";
import "./orders.css";

const Orders = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerateModalVisible, setGenerateModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { loginData, setLoginData } = useContext(LoginContext);
  const [messageApi, contextHolder] = message.useMessage();
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

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
    const validateStocks = selectedOrder?.products?.filter(
      (item) => item?.product?.status === "Out of Stock"
    );

    if (validateStocks?.length > 0 && status === "Processing") {
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
      const response = await fetch(`/api/orders/status/${id}`, {
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
    setSelectedOrder(record);
    setIsModalOpen(true);
  };

  const cancel = (e) => {
    console.log(e);
    message.error("Click on No");
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getNestedValueSearchProps = (record, dataIndex) => {
    if (Array.isArray(dataIndex)) {
      return dataIndex.reduce(
        (acc, key) => (acc && acc[key] !== undefined ? acc[key] : null),
        record
      );
    }
    return record[dataIndex];
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${
            Array.isArray(dataIndex) ? dataIndex.join(".") : dataIndex
          }`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 100 }}
          >
            Search
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              clearFilters && handleReset(clearFilters);
              setSearchText("");
              setSearchedColumn(null);
              confirm({ closeDropdown: true });
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) => {
      const text = getNestedValueSearchProps(record, dataIndex);
      return text
        ? text.toString().toLowerCase().includes(value.toLowerCase())
        : false;
    },
    render: (text, record) => {
      const value = getNestedValueSearchProps(record, dataIndex);

      return searchedColumn === JSON.stringify(dataIndex) ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={value ? value.toString() : ""}
        />
      ) : (
        value
      );
    },
  });

  const columns = [
    {
      title: "Name",
      dataIndex: ["user", "name"],
      key: "customer name",
      ...getColumnSearchProps(["user", "name"]),
    },
    {
      title: "Email",
      dataIndex: ["user", "email"],
      key: "customer email",
      ...getColumnSearchProps(["user", "email"]),
    },
    {
      title: "Address",
      dataIndex: ["user", "address"],
      key: ["user", "address"],
      sName: "blue-text",
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
        return moment(createdAt).format("LLL");
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

            {/* Cancel Button with Popconfirm */}
            <Popconfirm
              title="Update Order Status"
              description="Are you sure to cancel this Order?"
              onConfirm={() => handleUpdateStatus("Cancelled", record._id)}
              onCancel={() => cancel()}
              okText="Yes"
              cancelText="No"
            >
              <Button
                danger
                type="primary"
                icon={<StopOutlined />}
                hidden={
                  record?.status === "Shipped" ||
                  record?.status === "Cancelled" ||
                  record?.status === "Completed"
                }
              >
                Cancel
              </Button>
            </Popconfirm>
          </div>
        </>
      ),
    },
  ];

  const orderFields = [
    { label: "Order ID", value: "_id" },
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
      `${moment().format().split("T")[0]}-order-report.csv`
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
          <div className="status-cards">
            <div className="status-card cancelled">
              <FaTimesCircle className="status-icon" />
              <strong>Cancelled: {cancelledCount}</strong>
            </div>
            <div className="status-card order-pending">
              <FaHourglassHalf className="status-icon" />
              <strong>Pending: {pendingCount}</strong>
            </div>
            <div className="status-card processing">
              <FaCogs className="status-icon" />
              <strong>Processing: {processingCount}</strong>
            </div>
            <div className="status-card shipped">
              <FaTruck className="status-icon" />
              <strong>Shipped: {shippedCount}</strong>
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

      <ViewOrderModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedOrder={selectedOrder}
        handleUpdateStatus={handleUpdateStatus}
      />

      <GenerateReportModal
        visible={isGenerateModalVisible}
        onClose={() => setGenerateModalVisible(false)}
        onGenerate={handleGenerateReport}
        availableFields={orderFields}
      />
    </main>
  );
};

export default Orders;
