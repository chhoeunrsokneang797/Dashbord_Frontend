import {
  Button,
  Descriptions,
  Form,
  Input,
  message,
  Modal,
  notification,
  Select,
  Space,
  Spin,
  Table,
  Tag,
} from "antd";
import React, { useEffect, useState } from "react";
import { request } from "../../util/request";
import { dataClient } from "../../util/helper";
const RolePage = () => {
  const [formRef] = Form.useForm();
  const [state, setSate] = useState({
    list: [],
    total: 0,
    loading: false,
    open: false,
  });
  useEffect(() => {
    getList();
  }, []);
  const getList = async () => {
    setSate((p) => ({ ...p, loading: true }));
    const res = await request("categories", "get");
    // console.log(res); // array
    if (res) {
      setSate((pre) => ({
        ...pre,
        total: res.total,
        loading: false,
        list: res.list,
        loading: false,
      }));
    }
  };

  const handleOpneNew = () => {
    setSate((pre) => ({
      ...pre,
      open: true,
    }));
  };

  const handleCloseModal = () => {
    setSate((pre) => ({
      ...pre,
      open: false,
    }));
    formRef.resetFields();
  };

  const onFinish = async (item) => {
    const data = {
      name: item.name,
      description: item.description,
      created_at: item.created_at, // This is likely the source of your error
      status: item.status,
      test: "Test",
    };

    let url = "categories";
    let method = "post";

    // A cleaner, more reliable way to check for a value.
    // If `id` is a number or string, this is true.
    if (formRef.getFieldValue("id")) {
      url += "/" + formRef.getFieldValue("id");
      method = "put";
    }
    setSate((p) => ({ ...p, loading: true }));
    const res = await request(url, method, data);
    if (res && !res.error) {
      message.success(res.message);
      handleCloseModal();
      getList();
    }
  };

  const handleDelete = async (data) => {
    Modal.confirm({
      title: "Are you sure to remove",
      content: "Delete",
      onOk: async () => {
        setSate((p) => ({ ...p, loading: true }));
        const res = await request("categories/" + data.id, "delete");
        if (res && !res.error) {
          message.success(res.message);
          getList();
        }
      },
    });
  };

  const handleEdit = async (data) => {
    formRef.setFieldsValue({
      ...data, // data short
      id: data.id,
      // name: data.name,
      // description: data.description,  // writting overright
    });
    setSate((pre) => ({
      ...pre,
      open: true,
    }));
  };
  return (
    <Spin spinning={state.loading}>
      <div>
        <div className="main-page-header flex justify-between py-3">
          <Space>
            <div>Total{state.list.length}</div>
            <Input.Search placeholder="Search" />
          </Space>
          <div>
            <Button type="primary" onClick={handleOpneNew}>
              New
            </Button>
          </div>
        </div>
        <h1>{formRef.getFieldValue("id") + ""}</h1>
        <Modal
          title={formRef.getFieldValue("id") ? "Update Role" : "New Role"}
          open={state.open}
          onCancel={handleCloseModal}
          footer={null}
        >
          <Form layout="vertical" onFinish={onFinish} form={formRef}>
            <Form.Item name={"name"} label="Role Name">
              <Input placeholder="Name" />
            </Form.Item>
            <Form.Item name={"description"} label="Description">
              <Input.TextArea placeholder="Description" />
            </Form.Item>
            <Form.Item name={"created_at"} label="Created_at">
              <Input placeholder="created_at" />
            </Form.Item>
            <Form.Item name={"status"} label="Role Status">
              <Select
                placeholder="Select Status"
                options={[
                  {
                    label: "Active",
                    value: 1,
                  },
                  {
                    label: "In Active",
                    value: 0,
                  },
                ]}
              />
            </Form.Item>
            <div style={{ textAlign: "right" }}>
              <Space>
                <Button>Cancel</Button>
                <Button type="primary" htmlType="submit">
                  {formRef.getFieldValue("id") ? "Update" : "Save"}
                </Button>
              </Space>
            </div>
          </Form>
        </Modal>
        <Table
          dataSource={state.list}
          columns={[
            {
              key: "name",
              title: "Name",
              dataIndex: "name",
              // render:(value) =><Button>{value}</Button>// render button
            },
            {
              key: "description",
              title: "Description",
              dataIndex: "description",
            },
            {
              key: "created_at",
              title: "Created_At",
              dataIndex: "created_at",
              render: (value) => dataClient(value),
            },
            {
              key: "status",
              title: "Status",
              dataIndex: "status",
              render: (value) =>
                value ? (
                  <Tag color="green">Active</Tag>
                ) : (
                  <Tag color="red">In Active</Tag>
                ),
            },
            {
              key: "action",
              title: "Acton",
              dataIndex: "id",
              align: "center",
              render: (value, data) => (
                <Space>
                  <Button type="primary" onClick={() => handleEdit(data)}>
                    Edit
                  </Button>
                  <Button
                    danger
                    type="primary"
                    onClick={() => handleDelete(data)}
                  >
                    Delete
                  </Button>
                </Space>
              ),
            },
          ]}
        />
        {/* {state.list?.map((item, index) => (
        <div key={index}>
          <div>
            <button>Code:{item.code}</button>
            <br />
            <button>Name{item.name}</button>
            <br />
            <button>descripton:{item.description}</button>
            <br />
            <button>status{item.status}</button>
            <br />
            <button>Test:{item.test}</button>
          </div>
        </div>
      ))} */}
      </div>
    </Spin>
  );
};

export default RolePage;
