import React from "react";
import { Table, Tag } from "antd";

const Appointments = () => {
  const dataSource = [
    {
      key: "1",
      customerName: "Juan Pedro",
      address: "Sulipan, Apalit, Pampanga",
      gender: "Male",
      age: 20,
      order: "Eyeglass Only",
      time: "9:00AM",
      date: "2025-06-30",
      status: "Pending",
    },
    {
      key: "2",
      customerName: "Ben Dimagiba",
      address: "Sampaloc, Apalit, Pampanga",
      gender: "Male",
      age: 17,
      order: "Check-up & Eyeglass",
      time: "2:00PM",
      date: "2025-06-20",
      status: "Accepted",
    },
    {
      key: "3",
      customerName: "Rhea Matulid",
      address: "Paligui, Apalit, Pampanga",
      gender: "Female",
      age: 62,
      order: "Check-up Only",
      time: "4:00PM",
      date: "2025-07-04",
      status: "Rejected",
    },
  ];

  const columns = [
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      className: "blue-text",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Order",
      dataIndex: "order",
      key: "order",
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
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
          {status === "Accepted" ? (
            <Tag color="green">{status.toUpperCase()}</Tag>
          ) : status === "Pending" ? (
            <Tag color="blue">{status.toUpperCase()}</Tag>
          ) : (
            <Tag color="red">{status.toUpperCase()}</Tag>
          )}
        </>
      ),
      filters: [
        {
          text: "Accepted",
          value: "Accepted",
        },
        {
          text: "Pending",
          value: "Pending",
        },
        {
          text: "Rejected",
          value: "Rejected",
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

  const acceptedCount = dataSource.filter(
    (item) => item.status === "Accepted"
  ).length;
  const pendingCount = dataSource.filter(
    (item) => item.status === "Pending"
  ).length;
  const rejectedCount = dataSource.filter(
    (item) => item.status === "Rejected"
  ).length;

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>APPOINTMENTS</h3>
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
            <strong>Accepted: {acceptedCount}</strong>
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
            <strong>Pending: {pendingCount}</strong>
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
            <strong>Rejected: {rejectedCount}</strong>
          </div>
        </div>
      </div>
      <div className="main-content">
        <Table dataSource={dataSource} columns={columns} />
      </div>
    </main>
  );
};

export default Appointments;
