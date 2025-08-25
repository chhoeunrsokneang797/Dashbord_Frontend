import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Image,
  Input,
  message,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Upload,
} from "antd";
import { request } from "../../util/request";
import { dataClient } from "../../util/helper";
import MainPage from "../../layout/MainPage";
import UploadButton from "../../components/button/UploadButton";
import ErrorBoundary from "antd/es/alert/ErrorBoundary";
import connection from "../../util/connection";

const BrandPage = () => {
  const [formRef] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [state, setSate] = useState({
    list: [],
    total: 0,
    loading: false,
    open: false,
  });

  const [validate, setValidate] = useState({});
  const [filter, setFilter] = useState({
    search: "",
    status: "",
  });

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    setSate((p) => ({ ...p, loading: true }));
    let query_param = "?page=1";
    if (filter.search) query_param += "&search=" + filter.search;
    if (filter.status) query_param += "&status=" + filter.status;

    const res = await request("brands" + query_param, "get");
    if (res && !res.error) {
      setSate((pre) => ({
        ...pre,
        total: res.total,
        list: res.list,
        loading: false,
      }));
    } else {
      setSate((pre) => ({ ...pre, loading: false }));
      message.error("Failed to fetch brands.");
    }
  };

  const handleOpenNew = () => {
    formRef.resetFields();
    setFileList([]);
    setValidate({});
    setSate((pre) => ({ ...pre, open: true }));
  };

  const handleCloseModal = () => {
    setSate((pre) => ({ ...pre, open: false }));
    formRef.resetFields();
    setFileList([]);
    setValidate({});
  };

  const onFinish = async (item) => {
    const formData = new FormData();
    formData.append("name", item.name);
    formData.append("code", item.code);
    formData.append("from_country", item.from_country);
    formData.append("status", item.status);

    // Get the file list from the form values.
    // const formFileList = item.image || [];

    // Case 1: A new image has been uploaded.
    // if (formFileList.length > 0 && formFileList[0].originFileObj) {
    //   // Append the new file object to the form data.
    //   formData.append("image", formFileList[0].originFileObj);
    // }
    // // Case 2: The image has been removed from the form.
    // else if (formFileList.length === 0 && formRef.getFieldValue("id")) {
    //   // Append a flag to tell the server to remove the image.
    //   formData.append("image_remove", true);
    // }

    if (item.image && item.image.file) {
      if (item.image.file.originFileObj) {
        formData.append("image", item.file.originFileObj);
      } else if (item.image.file?.status == "removed") {
        let image_remove = item.image.file?.name;
        formData.append("image_remove", image_remove);
      }
    }

    let url = "brands";
    let method = "post";

    if (formRef.getFieldValue("id") != undefined) {
      url += "/" + formRef.getFieldValue("id");
      method = "post";
      formData.append("_method", "PUT");
    }

    setSate((p) => ({ ...p, loading: true }));
    const res = await request(url, method, formData);

    if (res && !res.error) {
      message.success(res.message);
      handleCloseModal();
      getList();
    } else {
      const errorMessage =
        res?.message ||
        (res?.errors && Object.values(res.errors)[0][0]) ||
        "An error occurred.";
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
        const res = await request("brands/" + data.id, "delete");
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

  const handleEdit = (data) => {
    if (!data || !data.id) {
      message.error("Invalid item data for editing.");
      return;
    }

    // Set the file list with the existing image.
    const files = data.image
      ? [
          {
            uid: data.id,
            name: data.image,
            status: "done",
            url: connection.image_all_path + data.image,
          },
        ]
      : [];

    setFileList(files);

    // Set the form fields' values.
    formRef.setFieldsValue({
      ...data,
      image: files, // Set the image field on the form to the file list.
    });

    // Open the modal for editing.
    setSate((pre) => ({
      ...pre,
      open: true,
    }));
  };

  const handleFilter = () => getList();

  const columns = [
    { key: "name", title: "Name", dataIndex: "name" },
    { key: "code", title: "Code", dataIndex: "code" },
    { key: "from_country", title: "From Country", dataIndex: "from_country" },
    {
      key: "image",
      title: "Image",
      dataIndex: "image",
      render: (image) => (
        <Image
          src={`http://localhost:8000/storage/${image}`}
          width={80}
          alt=""
        />
      ),
    },
    {
      key: "created_at",
      title: "Created At",
      dataIndex: "created_at",
      render: (v) => dataClient(v),
    },
    {
      key: "status",
      title: "Status",
      dataIndex: "status",
      render: (value) =>
        value === "active" ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        ),
    },
    {
      key: "action",
      title: "Action",
      dataIndex: "id",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button danger type="primary" onClick={() => handleDelete(record)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const normFile = (e) => (Array.isArray(e) ? e : e?.fileList);

  return (
    <MainPage loading={state.loading}>
      <div>
        <div className="main-page-header flex justify-between py-3">
          <Space>
            <div>Total: {state.list?.length}</div>
            <Input.Search
              placeholder="Search"
              onChange={(e) =>
                setFilter((p) => ({ ...p, search: e.target.value }))
              }
              allowClear
            />
            <Select
              placeholder="Select Status"
              style={{ width: 120 }}
              allowClear
              onChange={(value) => setFilter((p) => ({ ...p, status: value }))}
              options={[
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ]}
            />
            <Button type="primary" onClick={handleFilter}>
              Filter
            </Button>
          </Space>
          <div>
            <Button type="primary" onClick={handleOpenNew}>
              New
            </Button>
          </div>
        </div>
        <Table dataSource={state.list} columns={columns} rowKey="id" />
      </div>

      <Modal
        title={formRef.getFieldValue("id") ? "Update Brand" : "New Brand"}
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
            label="Brand Name"
            validateStatus={validate.name ? "error" : ""}
            help={validate.name?.[0]}
            rules={[{ required: true, message: "Field name required" }]}
          >
            <Input placeholder="Name" />
          </Form.Item>

          <Form.Item
            name="code"
            label="Brand Code"
            validateStatus={validate.code ? "error" : ""}
            help={validate.code?.[0]}
            rules={[{ required: true, message: "Field code required" }]}
          >
            <Input placeholder="Code" />
          </Form.Item>

          <Form.Item
            name="from_country"
            label="From Country"
            validateStatus={validate.from_country ? "error" : ""}
            help={validate.from_country?.[0]}
            rules={[{ required: true, message: "Field from_country required" }]}
          >
            <Input placeholder="From Country" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Brand Status"
            rules={[{ required: true, message: "Please select a status" }]}
          >
            <Select
              placeholder="Select Status"
              options={[
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="image"
            label="Image"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[
              {
                required: !formRef.getFieldValue("id"),
                message: "Please upload an image!",
              },
            ]}
          >
            <ErrorBoundary fallback={<p></p>}>
              <Upload
                name="avatar"
                listType="picture-circle"
                fileList={fileList}
                maxCount={1}
                onChange={handleChange}
                beforeUpload={() => false}
              >
                <UploadButton />
              </Upload>
            </ErrorBoundary>
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

export default BrandPage;
