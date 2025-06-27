import React, { useState } from "react";
import { Table, Tag, message } from "antd";
import "antd/dist/reset.css"; //
import AddProductModal from "../components/AddProductModal";

const Products = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const dataSource = [
    {
      key: "1",
      productName: "Stylish Eyeglasses",
      brand: "Hammer",
      model: "XS20S",
      stock: 20,
      price: "Php 2,999.00",
      status: "In Stock",
    },
    {
      key: "2",
      productName: "Indoor Sun Glasses",
      brand: "Crocs",
      model: "JK920A",
      stock: "9",
      price: "Php 1,999.00",
      status: "In Stock",
    },
    {
      key: "3",
      productName: "Indoor Sun Glasses",
      brand: "Nike",
      model: "NK220C",
      stock: "0",
      price: "Php 2,999.00",
      status: "Out of Stock",
    },
    {
      key: "4",
      productName: "Women Sun Glasses",
      brand: "Fly",
      model: "KJ2124H",
      stock: "0",
      price: "Php 999.00",
      status: "Discontinued",
    },
  ];

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
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
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
          text: "Available",
          value: "Available",
        },
        {
          text: "Out of Stock",
          value: "Out of Stocke",
        },
      ],
      onFilter: (value, record) => record.status.indexOf(value) === 0,
      filterSearch: true,
      // onFilter: (value, record) => record.status.includes(value),
    },
    {
      title: "Action",
      key: "action",
      render: () => (
        <>
          <div className="action-buttons">
            <button className="edit-button">EDIT</button>
            <button className="delete-button">DELETE</button>
          </div>
        </>
      ),
    },
  ];

  const inStockCount = dataSource.filter(
    (item) => item.status === "In Stock"
  ).length;
  const outOfStockCount = dataSource.filter(
    (item) => item.status === "Out of Stock"
  ).length;
  const discontinuedCount = dataSource.filter(
    (item) => item.status === "Discontinued"
  ).length;

  const handleAddProduct = (product) => {
    console.log("New Product:", product);
    message.success("Product added successfully!");
    // You can now POST to your backend or update state
  };

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
          <div>
            <button
              className="add-button"
              onClick={() => setIsModalVisible(true)}
            >
              ➕ <strong>Add Product</strong>
            </button>
          </div>
        </div>
      </div>
      <div className="main-content">
        <Table dataSource={dataSource} columns={columns} />
      </div>

      {/* Add Product Modal */}
      <AddProductModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onAdd={handleAddProduct}
      />
    </main>
  );
};

export default Products;
