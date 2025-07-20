/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from "react";
import { Form, Table, Tag, message, Button, Popconfirm } from "antd";
import { ReloadOutlined, PlusOutlined } from "@ant-design/icons";
import AddProductModal from "../components/AddProductModal";
import { LoginContext } from "../../context/LoginContext";

const Products = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [fileList, setFileList] = useState([]);

  const { loginData, setLoginData } = useContext(LoginContext);

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

  const confirm = (e) => {
    console.log(e);
    message.success("Click on Yes");
  };
  const cancel = (e) => {
    console.log(e);
    message.error("Click on No");
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
            <Popconfirm
              title="Delete Product"
              description="Are you sure to delete this product?"
              onConfirm={() => confirm()}
              onCancel={() => cancel()}
              okText="Yes"
              cancelText="No"
            >
              <button className="delete-button">DELETE</button>
            </Popconfirm>
          </div>
        </>
      ),
    },
  ];

  const inStockCount = data.filter((item) => item.status === "In Stock").length;
  const outOfStockCount = data.filter(
    (item) => item.status === "Out of Stock"
  ).length;
  const discontinuedCount = data.filter(
    (item) => item.status === "Discontinued"
  ).length;

  const onConfirm = () => {
    // console.log("New Product:", product);
    // message.success("Product added successfully!");
    form.submit();
    // You can now POST to your backend or update state
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main className="main-container">
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
    </main>
  );
};

export default Products;
