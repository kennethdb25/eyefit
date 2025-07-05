import { useState, useEffect } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { ReportData } from "../../data/mockData";
import { ToastContainer, toast, Bounce } from "react-toastify";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  Col,
  Form,
  Row,
  Select,
  Divider,
  List,
  Skeleton,
  DatePicker,
  Space,
  Button,
} from "antd";
import { DatabaseOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

const Reports = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [reportDate, setReportDate] = useState([]);
  const [data, setData] = useState([]);

  const loadMoreData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    // fetch("/api/report/get-generated")
    //   .then((res) => res.json())
    //   .then((body) => {
    //     setData([...body.body] || []);
    //     setLoading(false);
    //   })
    //   .catch(() => {
    //     setLoading(false);
    //   });
  };
  useEffect(() => {
    loadMoreData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFinish = async (values) => {
    values.start = reportDate[0];
    values.end = reportDate[1];

    // const data = await fetch("/api/generate-rerpot", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(values),
    // });
    // const res = await data.json();
    // if (res.status === 201) {
    //   form.resetFields();
    //   toast.success("Report Generated Successfully", {
    //     position: "top-center",
    //     autoClose: 1000,
    //     hideProgressBar: false,
    //     closeOnClick: false,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //     theme: "light",
    //     transition: Bounce,
    //   });
    //   loadMoreData();
    // }
  };

  const onFinishFailed = (error) => {
    console.error(error);
  };

  const onChange = (value, dateString) => {
    setReportDate(dateString);
    console.log("Selected Time: ", value);
    console.log("Formatted Selected Time: ", dateString);
  };
  const onOk = (value) => {
    console.log("onOk: ", value);
  };

  const handleDownload = (filename) => {
    console.log(filename);
    // window.open(`/api/report/download-csv?filename=${filename}`, "_blank");
  };

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>REPORTS</h3>
      </div>
      <Box m="20px">
        <ToastContainer />
        <Box
          m="40px 0 0 0"
          height="75vh"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .name-column--cell": {
              color: colors.greenAccent[300],
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[700],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.primary[400],
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: colors.blueAccent[700],
            },
            "& .MuiCheckbox-root": {
              color: `${colors.greenAccent[200]} !important`,
            },
          }}
        >
          <Row>
            <Col span={12}>
              <Form
                form={form}
                labelCol={{
                  span: 24,
                }}
                layout="horizontal"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                style={{
                  width: "100%",
                }}
              >
                <Col xs={24} md={12} layout="vertical">
                  <Typography color={colors.greenAccent[500]}>
                    Please select a report:{" "}
                  </Typography>
                  <br></br>
                  <Form.Item
                    name="report"
                    labelCol={{
                      span: 24,
                    }}
                    wrapperCol={{
                      span: 24,
                    }}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Please select a report!",
                      },
                    ]}
                  >
                    <Select placeholder="Select a Report">
                      {ReportData.map((value, index) => (
                        <Select.Option key={index} value={value.value}>
                          {value.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12} layout="vertical">
                  <Typography color={colors.greenAccent[500]}>
                    Enter Date Range:{" "}
                  </Typography>
                  <br></br>
                  <Form.Item
                    name="date"
                    labelCol={{
                      span: 24,
                    }}
                    wrapperCol={{
                      span: 24,
                    }}
                    hasFeedback
                  >
                    <Space direction="vertical" size={12}>
                      <RangePicker
                        format="YYYY-MM-DD"
                        onChange={onChange}
                        onOk={onOk}
                      />
                    </Space>
                  </Form.Item>
                </Col>
                <Row
                  gutter={12}
                  style={{
                    display: "flex",
                    justifyContent: "start",
                    paddingTop: "20px",
                  }}
                >
                  <Button
                    icon={<DatabaseOutlined />}
                    style={{
                      backgroundColor: "green",
                      border: "1px solid #d9d9d9",
                    }}
                    type="primary"
                    htmlType="submit"
                  >
                    Generate Report
                  </Button>
                </Row>
              </Form>
            </Col>
            <Col span={12}>
              <Typography color={colors.greenAccent[500]}>
                Recently Generated Report:{" "}
              </Typography>
              <br></br>
              <div
                id="scrollableDiv"
                style={{
                  height: 600,
                  overflow: "auto",
                  padding: "0 16px",
                  border: "1px solid rgba(140, 140, 140, 0.35)",
                  backgroundColor: "f9f9f9",
                }}
              >
                <InfiniteScroll
                  dataLength={5}
                  style={{ color: colors.greenAccent[500] }}
                  loader={
                    <Skeleton
                      avatar
                      paragraph={{
                        rows: 1,
                      }}
                      active
                    />
                  }
                  endMessage={
                    <Divider plain>
                      <Typography color={colors.greenAccent[500]}>
                        {data.length > 0 ? "Nothing to follow" : null}
                      </Typography>
                    </Divider>
                  }
                  scrollableTarget="scrollableDiv"
                >
                  <List
                    dataSource={data}
                    renderItem={(item) => (
                      <List.Item
                        key={item.filePath}
                        style={{ color: colors.grey[100] }}
                      >
                        <List.Item.Meta
                          title={
                            <p style={{ color: colors.grey[100] }}>
                              {item.filePath.toUpperCase()}
                            </p>
                          }
                          description={
                            <p style={{ color: colors.grey[100] }}>
                              {new Date(item.created).toLocaleString()}
                            </p>
                          }
                        />
                        <div
                          style={{
                            textDecorationLine: "underline",
                            color: "blue",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            handleDownload(item.filePath);
                          }}
                        >
                          Download
                        </div>
                      </List.Item>
                    )}
                  />
                </InfiniteScroll>
              </div>
            </Col>
          </Row>
        </Box>
      </Box>
    </main>
  );
};

export default Reports;
