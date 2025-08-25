import React, { useState } from "react";
import {
  LockOutlined,
  PhoneFilled,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, message, Upload } from "antd";
import { useNavigate } from "react-router-dom";
import { request } from "../util/request";
import UploadButton from "../components/button/UploadButton";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("password_confirmation", values.password_confirmation);
      formData.append("phone", values.phone || "");
      formData.append("address", values.address || "");
      // You should set a default type, e.g., 'user', if your backend expects it.
      // Do not append values.null.
      formData.append("type", "user"); 

      // Append the image file if it exists
      if (values.image && values.image.length > 0) {
        formData.append("image", values.image[0].originFileObj);
      }

      const res = await request("register", "post", formData);

      // Handle a successful response
      if (res.status === 201 || res.status === 200) {
        message.success("Account created successfully!");
        navigate("/login");
      } else {
        // This handles unexpected but non-error statuses
        message.error("Registration failed. Unexpected response from server.");
      }
    } catch (error) {
      console.error("Registration failed:", error);

      // Check for a validation error (status 422) from the server
      if (error.response && error.response.status === 422) {
        const errors = error.response.data.errors;
        const fieldErrors = Object.keys(errors).map((key) => ({
          name: key,
          errors: errors[key],
        }));
        form.setFields(fieldErrors);
        message.error("Please correct the validation errors below.");
      } else {
        // Handle all other types of errors
        message.error("Failed to create account. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };



  return (
    <div
      style={{
        width: 400,
        border: "1px solid gray",
        backgroundColor: "#EEE",
        padding: 25,
        margin: "auto",
        marginTop: 105,
        borderRadius: 10,
      }}
    >
      <h2 style={{ marginBottom: 10 }}>Register Your Account</h2>
      <Form
        form={form}
        name="register"
        initialValues={{ remember: true }}
        style={{ maxWidth: 360, paddingTop: 10 }}
        onFinish={onFinish}
      >
        <Form.Item
          name="name"
          rules={[{ required: true, message: "Please input your name!" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Name" />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Please input your Email!" },
            {
              type: "email",
              message: "The input is not a valid email address!",
            },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            { required: true, message: "Please input your Password!" },
            { min: 6, message: "Password must be at least 6 characters." },
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>
        <Form.Item
          name="password_confirmation"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Please confirm your password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Confirm Password"
          />
        </Form.Item>
        <Form.Item name="phone">
          <Input prefix={<PhoneFilled />} type="tel" placeholder="Phone" />
        </Form.Item>
        <Form.Item name="address">
          <Input.TextArea placeholder="Address" />
        </Form.Item>
        <Form.Item
          name="image"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            listType="picture-circle"
            fileList={fileList}
            onChange={handleChange}
            beforeUpload={() => false}
          >
            {fileList.length >= 1 ? null : <UploadButton/>}
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button block type="primary" htmlType="submit" loading={loading}>
            Register
          </Button>
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            Or <a href="/login">Login with an existing account</a>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterPage;