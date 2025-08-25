import React, { useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Flex, Spin } from "antd";
import { profileStore } from "../store/profileStore";
import { useNavigate } from "react-router-dom";
import { request } from "../util/request";

type LoginParams = {
  email: string;
  password: string;
};
const LoginPage = () => {
  const { setProfile, setAccessToken } = profileStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const onFinish = async (values) => {
    const param: LoginParams = {
      email: values.username, //"dara123@gmail.com",
      password: values.password, //"123456",
    };
    // alert(JSON.stringify(param));
    setLoading(true);
    try {
      const res = await request("login", "post", param);
      setLoading(false);
      console.log(res);
      if (res && !res.error) {
        setProfile({
          ...res.user?.profile,
          ...res.user,
        });
        navigate("/");
        setAccessToken(res.access_token);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Spin spinning={loading}>
      <div
        style={{
          width: 400,
          height: 400,
          border: "1px solid gray",
          backgroundColor: "#EEE",
          padding: 25,
          margin: "auto",
          marginTop: 155,
          borderRadius: 10,
        }}
      >
        <h2 style={{ marginBottom: 10 }}>Login</h2>
        <Form
          name="login"
          initialValues={{ remember: true }}
          style={{ maxWidth: 360, paddingTop: 10 }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your Username!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Flex justify="space-between" align="center">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <a href="">Forgot password</a>
            </Flex>
          </Form.Item>

          <Form.Item>
            <Button block type="primary" htmlType="submit" loading={loading}>
              Log in
            </Button>
            or
            <a className="pb-2" href="register">
              Register now!
            </a>
          </Form.Item>
        </Form>
      </div>
    </Spin>
  );
};
export default LoginPage;
