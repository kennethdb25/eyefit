/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useContext, useEffect } from "react";
import { Form, Table, Tag, message, Button } from "antd";
import { ReloadOutlined, PlusOutlined } from "@ant-design/icons";
import AddProductModal from "../components/AddProductModal";
import GenerateReportModal from "../components/GenerateReportModal";
import { LoginContext } from "../../context/LoginContext";
import { DatabaseOutlined } from "@ant-design/icons";
import Papa from "papaparse";
import dayjs from "dayjs";
import moment from "moment";

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
  const [isEdit, setIsEdit] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [fileList, setFileList] = useState([]);

  const { loginData, setLoginData } = useContext(LoginContext);
  const [messageApi, contextHolder] = message.useMessage();

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

  const showEditModal = (record) => {
    form.setFieldsValue(record);
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
              EDIT
            </button>
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
        console.log(filteredData);
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
    form.submit();
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
              <strong>In Stock: {inStockCount}</strong>
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
              <strong>Out of Stock: {outOfStockCount}</strong>
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
