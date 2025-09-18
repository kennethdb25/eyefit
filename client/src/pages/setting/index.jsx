/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from "react";
import { Form, Table, Tag, message, Button, Popconfirm } from "antd";
import { ReloadOutlined, PlusOutlined } from "@ant-design/icons";
import { LoginContext } from "../../context/LoginContext";
import { DatabaseOutlined } from "@ant-design/icons";
import moment from "moment";
import AddAccountModal from "../components/AddAccountModal";

const Setting = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [loadingButton, setLoadingButton] = useState(false);

  const { loginData, setLoginData } = useContext(LoginContext);

  const fetchData = async () => {
    setLoading(true); // Start loading
    try {
      const res = await fetch(`/api/user/accounts`);
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
    console.log(record);
    form.setFieldsValue(record);
    setEditingRecord(record);
    setIsEdit(true);
    setIsModalVisible(true);
  };

  const onClose = () => {
    setEditingRecord();
    setIsEdit(false);
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: "User Id",
      dataIndex: "_id",
      key: "_id",
      className: "blue-text",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Contact",
      dataIndex: "contact",
      key: "contact",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Account Creation Date",
      dataIndex: "created",
      key: "created",
      render: (_, { created }) => (
        <>{moment(created).format("MMMM Do YYYY, h:mm:ss a")}</>
      ),
    },
    {
      title: "Account Status",
      dataIndex: "acctStatus",
      key: "acctStatus",
      render: (_, { acctStatus }) => (
        <>
          {acctStatus === "ACTIVE" ? (
            <Tag color="green">{acctStatus.toUpperCase()}</Tag>
          ) : acctStatus === "SUSPENDED" ? (
            <Tag color="orange">{acctStatus.toUpperCase()}</Tag>
          ) : (
            <Tag color="red">{acctStatus.toUpperCase()}</Tag>
          )}
        </>
      ),
    },
    {
      title: "User Type",
      dataIndex: "userType",
      key: "userType",
      render: (_, { userType }) => (
        <>
          {userType === "ADMIN USER" ? (
            <Tag color="green">{userType.toUpperCase()}</Tag>
          ) : (
            <Tag color="orange">{userType.toUpperCase()}</Tag>
          )}
        </>
      ),
      filters: [
        {
          text: "ADMIN USER",
          value: "ADMIN USER",
        },
        {
          text: "BUSINESS USER",
          value: "BUSINESS USER",
        },
      ],
      onFilter: (value, record) => record.userType.indexOf(value) === 0,
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
              VIEW
            </button>
            {/* <Popconfirm
                title="Delete Product"
                description="Are you sure to delete this product?"
                onConfirm={() => confirm()}
                onCancel={() => cancel()}
                okText="Yes"
                cancelText="No"
              >
                <button className="delete-button">DELETE</button>
              </Popconfirm> */}
          </div>
        </>
      ),
    },
  ];

  const activeCount = data.filter(
    (item) => item.acctStatus === "ACTIVE"
  ).length;
  const suspendedCount = data.filter(
    (item) => item.acctStatus === "SUSPENDED"
  ).length;
  const blockedCount = data.filter(
    (item) => item.acctStatus === "BLOCKED"
  ).length;

  const onConfirm = () => {
    form.submit();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>SETTING</h3>
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
              <strong>Active: {activeCount}</strong>
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
              <strong>Suspended: {suspendedCount}</strong>
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
              <strong>Blocked: {blockedCount}</strong>
            </div>
          </div>
          <div className="action-buttons">
            <Button
              icon={<DatabaseOutlined style={{ fontSize: "16px" }} />}
              // onClick={() => showAddModal()}
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
              Add User
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

      {/* Add User Modal */}
      <AddAccountModal
        visible={isModalVisible}
        onClose={onClose}
        onConfirm={onConfirm}
        form={form}
        fetchData={fetchData} // Pass the fetchData function to the modal for re}
        isEdit={isEdit}
        editingRecord={editingRecord}
        setIsModalVisible={setIsModalVisible}
        loadingButton={loadingButton}
        setLoadingButton={setLoadingButton}
      />
    </main>
  );
};

export default Setting;
