import React, { useState, useContext, useEffect } from "react";
import { Form, Table, Tag, message, Button, Popconfirm } from "antd";
import { ReloadOutlined, PlusOutlined } from "@ant-design/icons";
import { LoginContext } from "../../context/LoginContext";
import moment from "moment";
import ViewAppointmentModal from "../components/ViewAppointmentModal";

const Appointments = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataRecord, setDataRecord] = useState();

  const { loginData, setLoginData } = useContext(LoginContext);

  const fetchData = async () => {
    setLoading(true); // Start loading
    try {
      const res = await fetch(
        `/api/appointments?company=${loginData?.body?.company}`
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

    if (status === "Pending") {
      message.warning("Please select a valid status.");
      return;
    }

    try {
      const response = await fetch(`/api/appointments/${id}/status`, {
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
      setIsModalVisible(false);
      message.success(`Appointment ${status} successfully`);
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenUpdateModal = (record) => {
    setDataRecord(record);
    setIsModalVisible(true);
  };

  const cancel = (e) => {
    console.log(e);
    message.error("Click on No");
  };

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
      render: (_, { date }) => {
        return moment(date).format("LL");
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
      render: (_, record) => (
        <>
          <div className="action-buttons">
            <button
              className="edit-button"
              onClick={() => handleOpenUpdateModal(record)}
            >
              VIEW
            </button>
            <Popconfirm
              title="Update Appointment Status"
              description="Are you sure to reject this Appointment?"
              onConfirm={() => handleUpdateStatus("Rejected", record._id)}
              onCancel={() => cancel()}
              okText="Yes"
              cancelText="No"
            >
              <button className="delete-button">REJECT</button>
            </Popconfirm>
          </div>
        </>
      ),
    },
  ];

  const acceptedCount = data.filter(
    (item) => item.status === "Accepted"
  ).length;
  const pendingCount = data.filter((item) => item.status === "Pending").length;
  const rejectedCount = data.filter(
    (item) => item.status === "Rejected"
  ).length;

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>APPOINTMENTS</h3>
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
          <div className="action-buttons">
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

        {/* Modal */}
        <ViewAppointmentModal
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          appointment={dataRecord}
          handleUpdateStatus={handleUpdateStatus}
        />
      </div>
    </main>
  );
};

export default Appointments;
