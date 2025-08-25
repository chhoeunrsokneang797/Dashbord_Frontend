import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import React, { useEffect, useState } from "react";
import { request } from "../../util/request";
import { dataClient } from "../../util/helper";
import MainPage from "../../layout/MainPage";

const CategoryPage = () => {
  const [formRef] = Form.useForm();
  const [state, setSate] = useState({
    list: [],
    total: 0,
    loading: false, // Initial loading state is false
    open: false,
  });

  const [validate, setValidate] = useState({});

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    setSate((p) => ({ ...p, loading: true })); // Set loading to true when fetching
    let query_param = "?page=1";
    if (filter.search !== null && filter.search !== "") {
      query_param += "&search=" + filter.search;
    }
    if (filter.status !== null && filter.status !== "") {
      query_param += "&status=" + filter.status;
    }
    // localhost:8000/api/role?page=1&search=admin&status=0 // query parameter
    const res = await request("categories" + query_param, "get");
    if (res && !res.error) {
      setSate((pre) => ({
        ...pre,
        total: res.total,
        list: res.list,
        loading: false, // Set loading to false on success
      }));
    } else {
      setSate((pre) => ({ ...pre, loading: false })); // Set loading to false on error
      message.error("Failed to fetch categories.");
    }
  };

  const handleOpneNew = () => {
    formRef.resetFields();
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
      status: item.status,
    };

    let url = "categories";
    let method = "post";

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
    } else {
      const errorMessage =
        res?.message || res?.errors?.general || "An error occurred.";
      message.error(errorMessage);
      setValidate(res?.errors || {});
    }
    setSate((p) => ({ ...p, loading: false }));
  };

  const handleDelete = async (data) => {
    Modal.confirm({
      title: "Are you sure you want to delete this item?",
      content: "This action cannot be undone.",
      onOk: async () => {
        setSate((p) => ({ ...p, loading: true }));
        const res = await request("categories/" + data.id, "delete");
        if (res && !res.error) {
          message.success(res.message);
          getList();
        } else {
          message.error(res?.message || "Failed to delete.");
        }
        setSate((p) => ({ ...p, loading: false }));
      },
    });
  };

  const handleEdit = async (data) => {
    formRef.setFieldsValue({
      ...data,
      id: data.id,
    });
    setSate((pre) => ({
      ...pre,
      open: true,
    }));
  };

  // Add a state for the filter values
  const [filter, setFilter] = useState({
    search: "",
    status: "",
  });

  const handleFilter = () => {
    getList();
  };

  const columns = [
    {
      key: "name",
      title: "Name",
      dataIndex: "name",
    },
    {
      key: "description",
      title: "Description",
      dataIndex: "description",
    },
    {
      key: "created_at",
      title: "Created At",
      dataIndex: "created_at",
      render: (value) => dataClient(value),
    },
    {
      key: "status",
      title: "Status",
      dataIndex: "status",
      render: (value) =>
        value === 1 ? ( // Use strict equality check
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">In Active</Tag>
        ),
    },
    {
      key: "action",
      title: "Action",
      dataIndex: "id",
      align: "center",
      render: (data) => (
        <Space>
          <Button type="primary" onClick={() => handleEdit(data)}>
            Edit
          </Button>
          <Button danger type="primary" onClick={() => handleDelete(data)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <MainPage loading={state.loading}>
      <div>
        <div className="main-page-header flex justify-between py-3">
          <Space>
            <div>Total: {state.list.length}</div>
            <Input.Search
              placeholder="Search"
              onChange={(e) =>
                setFilter((p) => ({
                  ...p,
                  search: e.target.value,
                }))
              }
              allowClear
            />
            <Select
              placeholder="Select Status"
              style={{ width: 120 }}
              allowClear={true}
              onChange={(value) =>
                setFilter((p) => ({
                  ...p,
                  status: value,
                }))
              }
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
            <Button type="primary" onClick={handleFilter}>
              Filter
            </Button>
          </Space>
          <div>
            <Button type="primary" onClick={handleOpneNew}>
              New
            </Button>
          </div>
        </div>
        <Table dataSource={state.list} columns={columns} />
      </div>
      <Modal
        title={formRef.getFieldValue("id") ? "Update Role" : "New Role"}
        open={state.open}
        onCancel={handleCloseModal}
        footer={null}
      >
        <Form layout="vertical" onFinish={onFinish} form={formRef}>
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label="Role Name"
            validateStatus={validate.name ? "error" : ""}
            help={validate.name?.[0]}
            rules={[
              {
                required: true,
                message: "Field name required",
              },
            ]}
          >
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            validateStatus={validate.description ? "error" : ""}
            help={validate.description?.[0]}
            rules={[
              {
                required: true,
                message: "Field description required",
              },
            ]}
          >
            <Input.TextArea placeholder="Description" />
          </Form.Item>
          <Form.Item
            name="status"
            label="Role Status"
            rules={[
              {
                required: true,
                message: "Please select a status",
              },
            ]}
          >
            <Select
              placeholder="Select Status"
              options={[
                { label: "Active", value: 1 },
                { label: "In Active", value: 0 },
              ]}
            />
          </Form.Item>
          <div style={{ textAlign: "right" }}>
            <Space>
              <Button onClick={handleCloseModal}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {formRef.getFieldValue("id") ? "Update" : "Save"}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </MainPage>
  );
};

export default CategoryPage;
