import React from "react";
import { Table, Tag } from "antd";
import "antd/dist/reset.css"; //

const Products = () => {
  const dataSource = [
    {
      key: "1",
      productName: "Stylish Eyeglasses",
      brand: "Hammer",
      model: "XS20S",
      stock: 20,
      price: "Php 2,999.00",
      status: "Available",
    },
    {
      key: "2",
      productName: "Indoor Sun Glasses",
      brand: "Crocs",
      model: "JK920A",
      stock: "9",
      price: "Php 1,999.00",
      status: "Available",
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
          {status === "Available" ? (
            <Tag color="green">{status.toUpperCase()}</Tag>
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
          text: "Not Available",
          value: "Not Available",
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

  const availableCount = dataSource.filter(
    (item) => item.status === "Available"
  ).length;
  const notAvailableCount = dataSource.filter(
    (item) => item.status === "Not Available"
  ).length;

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>PRODUCTS</h3>
      </div>
      <div style={{ paddingTop: "20px", fontFamily: "sans-serif" }}>
        {/* Count Cards */}
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
            <strong>Available: {availableCount}</strong>
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
            <strong>Not Available: {notAvailableCount}</strong>
          </div>
        </div>
      </div>
      <div className="main-content">
        <Table dataSource={dataSource} columns={columns} />
      </div>
    </main>
  );
};

export default Products;
