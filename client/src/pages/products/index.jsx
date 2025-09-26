/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useContext, useEffect, useRef } from "react";
import { Form, Table, Tag, message, Button, Input, Space } from "antd";
import {
  ReloadOutlined,
  PlusOutlined,
  SearchOutlined,
  FilterFilled,
  EditOutlined,
} from "@ant-design/icons";
import AddProductModal from "../components/AddProductModal";
import GenerateReportModal from "../components/GenerateReportModal";
import { LoginContext } from "../../context/LoginContext";
import { DatabaseOutlined } from "@ant-design/icons";
import { FaBoxOpen, FaExclamationTriangle, FaBan } from "react-icons/fa";
import Papa from "papaparse";
import dayjs from "dayjs";
import moment from "moment";
import Highlighter from "react-highlight-words";
import "./product.css";

import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { Pagination } from "../components/Pagination/Pagination";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const Products = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isGenerateModalVisible, setGenerateModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [fileList, setFileList] = useState([]);

  const { loginData, setLoginData } = useContext(LoginContext);
  const [messageApi, contextHolder] = message.useMessage();
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const fetchData = async () => {
    setLoading(true); // Start loading
    try {
      const res = await fetch(
        `/api/product?company=${loginData?.body?.company}`
      );
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

  const normalizeProduct = (product) => {
    return {
      ...product,
      variants: product.variants.map((variant, idx) => ({
        color: variant.color,
        image: variant.images.map((img, i) => ({
          uid: img.publicId || `${idx}-${i}`,
          name: img.url.split("/").pop(),
          status: "done",
          url: img.url,
        })), // <-- just an array
      })),
    };
  };

  const showEditModal = (record) => {
    console.log(record);
    form.setFieldsValue(normalizeProduct(record));
    setEditingRecord(record);
    setIsEdit(true);
    setIsModalVisible(true);
  };

  const onClose = () => {
    setEditingRecord();
    setIsEdit(false);
    setIsModalVisible(false);
    setFileList([]);
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
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
      className: "blue-text",
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
    },
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
    },
    {
      title: "Stocks",
      dataIndex: "stocks",
      key: "stocks",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (_, { price }) => <>{`Php ${price}.00`}</>,
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => (
        <>
          {status === "In Stock" ? (
            <Tag color="green">{status.toUpperCase()}</Tag>
          ) : status === "Out of Stock" ? (
            <Tag color="orange">{status.toUpperCase()}</Tag>
          ) : (
            <Tag color="red">{status.toUpperCase()}</Tag>
          )}
        </>
      ),
      filters: [
        {
          text: "In Stock",
          value: "In Stock",
        },
        {
          text: "Out of Stock",
          value: "Out of Stock",
        },
        {
          text: "Discontinued",
          value: "Discontinued",
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
          <div className="action-buttons">
            <Button
              style={{
                backgroundColor: "#52c41a",
                borderColor: "#52c41a",
                color: "#fff",
              }}
              type="default"
              icon={<EditOutlined />}
              onClick={() => showEditModal(record)}
            >
              Edit
            </Button>
          </div>
        </>
      ),
    },
  ];

  const productFields = [
    { label: "Product ID", value: "_id" },
    { label: "Product Name", value: "productName" },
    { label: "Brand", value: "brand" },
    { label: "Model", value: "model" },
    { label: "Price", value: "price" },
    { label: "Stocks", value: "stocks" },
    { label: "Company", value: "company" },
    { label: "Rating", value: "rating" },
    { label: "Status", value: "status" },
    { label: "Created Date", value: "createdAt" },
  ];

  const handleGenerateReport = async ({ dateRange, fields }) => {
    try {
      let filteredData = [...data];

      if (!filteredData || filteredData.length === 0) {
        messageApi.info("No data available to generate report.");
        return;
      }

      // Filter by date range
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

      // Pick only selected fields
      const reportData = filteredData.map((item) => {
        const obj = {};
        fields.forEach((field) => {
          obj[field] = item[field] ?? ""; // fallback empty string if missing
        });
        return obj;
      });

      if (reportData.length === 0) {
        messageApi.info("No records found for the selected filters.");
        return;
      }

      // Convert to CSV
      const csv = Papa.unparse(reportData);

      // Trigger download
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${moment().format().split("T")[0]}-product-report.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };
  const inStockCount = data.filter((item) => item.status === "In Stock").length;
  const outOfStockCount = data.filter(
    (item) => item.status === "Out of Stock"
  ).length;
  const discontinuedCount = data.filter(
    (item) => item.status === "Discontinued"
  ).length;

  const onConfirm = () => {
    if (!loadingButton) {
      form.submit();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main className="main-container">
      {contextHolder}
      <div className="main-title">
        <h3>PRODUCTS</h3>
      </div>
      <div style={{ paddingTop: "20px", fontFamily: "sans-serif" }}>
        {/* Count Cards */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className="status-cards">
            <div className="status-card in-stock">
              <FaBoxOpen className="status-icon" />
              <strong>In Stock: {inStockCount}</strong>
            </div>
            <div className="status-card out-stock">
              <FaExclamationTriangle className="status-icon" />
              <strong>Out of Stock: {outOfStockCount}</strong>
            </div>
            <div className="status-card discontinued">
              <FaBan className="status-icon" />
              <strong>Discontinued: {discontinuedCount}</strong>
            </div>
          </div>
          <div className="action-buttons">
            <Button
              icon={<DatabaseOutlined style={{ fontSize: "16px" }} />}
              onClick={() => setGenerateModalVisible(true)}
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
              Add Product
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

      {/* Add Product Modal */}
      <AddProductModal
        visible={isModalVisible}
        onClose={onClose}
        onConfirm={onConfirm}
        form={form}
        fetchData={fetchData} // Pass the fetchData function to the modal for re}
        isEdit={isEdit}
        editingRecord={editingRecord}
        setIsModalVisible={setIsModalVisible}
        fileList={fileList}
        setFileList={setFileList}
        loadingButton={loadingButton}
        setLoadingButton={setLoadingButton}
      />

      <GenerateReportModal
        visible={isGenerateModalVisible}
        onClose={() => setGenerateModalVisible(false)}
        onGenerate={handleGenerateReport}
        availableFields={productFields}
      />
    </main>
  );
};

export default Products;
