import React, { useState } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Image from "../assets/image/watch.jpg";
import ImageWatch from "../assets/image/girl.png";
import { Input, Layout, Menu, Space, theme } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
const { Content, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const items = [
  getItem("Dashbord", "/dashbord", <PieChartOutlined />),
  getItem("Customer", "/customer", <DesktopOutlined />),
  getItem("Proudct", "/proudct", <UserOutlined />),
  getItem("Role", "/role", <UserOutlined />, [
    getItem("About", "/about"),
    getItem("Team", "/team"),
    getItem("Files", "/files"),
  ]),
  getItem("Team", "sub2", <TeamOutlined />, [
    getItem("Team 1", "6"),
    getItem("Team 2", "8"),
  ]),
  getItem("Files", "9", <FileOutlined />),
];
const MainLayout = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
          onClick={(item) => navigate(item.key)}
        />
      </Sider>
      <Layout>
        <div className="w-full flex items-center justify-between sm:justify-center gap-3 flex-wrap p-3">
          <div to="/" className="order-1 w-36 sm:w-44 aspect-[7/2]">
            <Space>
              <img className="h-10 w-10 rounded-full" src={Image} alt="" />
              <div>
                <h2 className="text-sm md:text-xl">NIT</h2>
              </div>
              <div>Build IT Skill</div>
            </Space>
          </div>
          <div className="flex-1 min-w-72 order-5 sm:order-3">
            <Input.Search
              size="large"
              allowClear
              placeholder="Search ametava"
              enterButton
            />
          </div>
          <div className="hidden order-5 md:flex items-center justify-center bg-primary rounded-md px-3 gap-3">
            <h2 className="text-sm md:text-lg">Sok Neang</h2>
            <p>Admin</p>
            <img className="h-10 w-10" src={ImageWatch} alt="" />
          </div>
        </div>
        <Content style={{ margin: "0 16px" }}>
          <div
            style={{
              padding: 24,
              minHeight: 860,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
export default MainLayout;
