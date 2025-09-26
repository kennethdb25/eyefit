import React, { useState, useEffect, useContext } from "react";
import {
  Modal,
  Button,
  Form,
  Select,
  TimePicker,
  DatePicker,
  Tag,
  Space,
  message,
} from "antd";
import dayjs from "dayjs";
import { SettingOutlined } from "@ant-design/icons";
import { LoginContext } from "../../../context/LoginContext";

const AppointmentConfigModal = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const { loginData, setLoginData } = useContext(LoginContext);
  const [messageApi, contextHolder] = message.useMessage();

  // Map between numeric days and string labels
  const dayMap = {
    0: "sunday",
    1: "monday",
    2: "tuesday",
    3: "wednesday",
    4: "thursday",
    5: "friday",
    6: "saturday",
  };

  const dayMapReverse = Object.fromEntries(
    Object.entries(dayMap).map(([num, str]) => [str, Number(num)])
  );

  // Load config when modal opens
  const fetchConfig = async () => {
    try {
      const res = await fetch(
        `/api/appointment-config/${loginData?.body?.company}`
      );
      const data = await res.json();

      console.log(data);

      if (data.success && data.body) {
        form.setFieldsValue({
          workingDays: data.body.workingDays.map((d) => dayMap[d]), // convert numbers to strings
          workingHours: [
            dayjs(data?.body?.workingHours?.start, "HH:mm"),
            dayjs(data.body.workingHours.end, "HH:mm"),
          ],
        });
        setUnavailableDates(data.body.exceptions || []);
      } else {
        // Default values
        if (data.body !== null) {
          messageApi.error("Failed to load configuration");
        }
        form.setFieldsValue({
          workingDays: data.body.workingDays.map((d) => dayMap[d]), // convert numbers to strings
          workingHours: [
            dayjs(data.body.workingHours.start, "HH:mm"),
            dayjs(data.body.workingHours.end, "HH:mm"),
          ],
        });
        setUnavailableDates([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      console.log(values);
      setLoading(true);

      const res = await fetch("/api/appointment-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: loginData?.body?.company,
          workingDays: values.workingDays.map((d) => dayMapReverse[d]), // convert strings to numbers
          workingHours: {
            start: values.workingHours[0].format("HH:mm"),
            end: values.workingHours[1].format("HH:mm"),
          },
          exceptions: unavailableDates,
        }),
      });

      const data = await res.json();
      if (data.success) {
        messageApi.success("Configuration saved successfully!");
        setVisible(false);
      } else {
        messageApi.error("Error saving configuration");
      }
    } catch (err) {
      console.error(err);
      messageApi.error("Please check your inputs");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Button to open modal */}
      <Button
        type="primary"
        icon={<SettingOutlined />}
        style={{ margin: 0, paddingInline: "12px" }}
        onClick={() => {
          setVisible(true);
          fetchConfig();
        }}
      >
        Configure Appointments
      </Button>

      {/* Config Modal */}
      <Modal
        title="Appointment Configuration"
        open={visible}
        onCancel={() => setVisible(false)}
        onOk={handleSave}
        confirmLoading={loading}
      >
        {contextHolder}
        <Form form={form} layout="vertical">
          {/* Working Days */}
          <Form.Item
            name="workingDays"
            label="Working Days"
            rules={[{ required: true, message: "Please select working days" }]}
          >
            <Select mode="multiple" placeholder="Select working days">
              <Select.Option value="monday">Monday</Select.Option>
              <Select.Option value="tuesday">Tuesday</Select.Option>
              <Select.Option value="wednesday">Wednesday</Select.Option>
              <Select.Option value="thursday">Thursday</Select.Option>
              <Select.Option value="friday">Friday</Select.Option>
              <Select.Option value="saturday">Saturday</Select.Option>
              <Select.Option value="sunday">Sunday</Select.Option>
            </Select>
          </Form.Item>

          {/* Working Hours */}
          <Form.Item
            name="workingHours"
            label="Working Hours"
            rules={[{ required: true, message: "Please select working hours" }]}
          >
            <TimePicker.RangePicker format="HH:mm" />
          </Form.Item>

          {/* Unavailable Dates */}
          <Form.Item label="Unavailable Dates">
            <Space direction="vertical" style={{ width: "100%" }}>
              <DatePicker
                disabledDate={(current) =>
                  current && current < dayjs().startOf("day")
                }
                onChange={(date, dateString) => {
                  if (dateString) {
                    setUnavailableDates((prev) => [
                      ...new Set([...prev, dateString]),
                    ]);
                  }
                }}
              />

              <div>
                {unavailableDates.map((d, i) => (
                  <Tag
                    key={i}
                    closable
                    onClose={() =>
                      setUnavailableDates((prev) => prev.filter((x) => x !== d))
                    }
                    color="red"
                  >
                    {d}
                  </Tag>
                ))}
              </div>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AppointmentConfigModal;
