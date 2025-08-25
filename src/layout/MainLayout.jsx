import React, { useEffect, useState } from "react";
import {
  DesktopOutlined,
  PieChartOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import profile_image from "../assets/image/watch.jpg";
import { Input, Layout, Menu, Space, theme } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { profileStore } from "../store/profileStore";
const { Content, Sider } = Layout;
import { DownOutlined, SmileOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";
import connection from "../util/connection";
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
  getItem("POS", "/pos", <DesktopOutlined />),
  getItem("order", "/order", <DesktopOutlined />),
  getItem("Report", "/report", <TeamOutlined />, [
    getItem("Top Sale", "/report/top_sale"),
    getItem("Order", "/report/order"),
    getItem("Purchase", "/report/purchase"),
    getItem("Expense", "/report/expense"),
  ]),
  getItem("Customer", "/customer", <TeamOutlined />, [
    getItem("Customer", "/customer"),
    getItem("Customer type", "/customer type"),
  ]),
  getItem("Invetory", "/invetory", <TeamOutlined />, [
    getItem("Product", "/product"),
    getItem("Category", "/category"),
    getItem("Province", "/province"),
    getItem("Brand", "/brand"),
  ]),
  getItem("Purchase", "/purchase", <TeamOutlined />, [
    getItem("Purchase", "/purchase"),
    getItem("Supplier", "/supplier"),
  ]),
  getItem("Expens", "/expens", <TeamOutlined />, [
    getItem("Expens", "/expens"),
    getItem("Expens Type", "/Expens_type"),
  ]),
  getItem("Employee", "/employee", <TeamOutlined />, [
    getItem("Employee", "/employee"),
    getItem("Payroll", "/payroll"),
  ]),
  getItem("User", "/user", <TeamOutlined />, [
    getItem("User", "/user"),
    getItem("Role", "/role"),
    getItem("Permission", "/permission"),
  ]),
  getItem("Setting", "/setting", <TeamOutlined />, [
    getItem("Lang", "/lang"),
    getItem("Currency", "/currency"),
    getItem("Province", "/province"),
    getItem("Payment Method", "/payment_method"),
  ]),
];

const items_dropdown_profile = [
  {
    key: "1",
    label: "Change Profile",
    icon: <SmileOutlined />,
  },
  {
    key: "2",
    label: "Change Password",
    icon: <SmileOutlined />,
  },
  {
    key: "logout",
    label: "Logout",
    icon: <SmileOutlined />,
    danger: true,
  },
];
const MainLayout = () => {
  const { profile } = profileStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!profile) {
      navigate("login");
    }
  }, []);
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  if (!profile) {
    return null;
  }
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
              <img
                className="h-10 w-10 rounded-full"
                src={profile_image}
                alt=""
              />
              <div>
                <h2 className="text-sm md:text-xl">NIT</h2>
              </div>
              <div>Build IT Skill</div>
            </Space>
          </div>

          <div className="flex-1 min-w-50 order-5 sm:order-3">
            <Input.Search
              size="large"
              allowClear
              placeholder="Search ametava"
              enterButton
            />
          </div>
          <div>
            <Dropdown
              menu={{
                items: items_dropdown_profile,
                onClick: (item) => {
                  if (item.key === "logout") {
                    navigate("login");
                    Logout();
                  }
                },
              }}
            >
              <Space>
                <Space>
                  <div className="hidden order-5 md:flex items-center justify-center bg-primary rounded-md px-3 gap-3">
                    <h2 className="text-sm md:text-lg">{profile?.name}</h2>
                    <p>{profile?.role}</p>
                    <img
                      className="h-10 w-10"
                      src={connection.image_path + profile?.image}
                      alt=""
                    />
                  </div>
                </Space>
                <DownOutlined />
              </Space>
            </Dropdown>
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
