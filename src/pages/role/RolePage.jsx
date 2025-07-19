import React, { useState, useEffect } from "react"; // Added useEffect for potential future use or initial data loading
import { Button, Input, message, Space, Modal, Table } from "antd"; // Added Table for a more robust display of data, removed unnecessary import of Spin, Popconfirm from the previous thought process.
import '@ant-design/v5-patch-for-react-19'; // Keep this if you are using Ant Design v5 with React 19+

const RolePage = () => {
  // Using an object for state with multiple properties
  const [dataState, setDataState] = useState({
    list: [], // This will be the source of truth for our displayed data
    list1: [ // Keeping list1 as a static initial data source if needed elsewhere, otherwise consider merging into 'list'
      {
        id: "1", // Changed ID to string for consistency with input values
        name: "Growth IT",
        group: "IT",
      },
      {
        id: "2",
        name: "IT Manager Assistant",
        group: "IT",
      },
      {
        id: "3",
        name: "IT Manager",
        group: "Admin",
      },
      {
        id: "4",
        name: "Developer",
        group: "IT",
      },
      {
        id: "5",
        name: "Backend Developer",
        group: "TeamWork",
      },
    ],
    loading: false, // For future loading states (e.g., fetching from API)
    // total: 0, // Removed total as it's directly derived from list.length
    searchTerm: "", // New state for search input
  });

  // State for the current role being edited/added
  const [currentRole, setCurrentRole] = useState({
    id: "",
    name: "",
    group: "",
  });

  // State to manage whether we are in edit mode or adding a new role
  const [isEditMode, setIsEditMode] = useState(false);
  // State to store the original ID when editing
  const [originalEditId, setOriginalEditId] = useState(null);

  // useEffect to populate 'list' with 'list1' on initial mount
  // This simulates fetching initial data.
  useEffect(() => {
    setDataState((prev) => ({
      ...prev,
      list: dataState.list1, // Initialize 'list' with data from 'list1'
    }));
  }, []); // Empty dependency array ensures this runs only once on mount
  // Handles input changes for the role form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentRole((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const onClickNew = () => {
    // Clear the form fields for a new entry
    setCurrentRole({
      id: "",
      name: "",
      group: "",
    });
    setIsEditMode(false); // Ensure we are in "add new" mode
    setOriginalEditId(null); // Clear any previous edit ID
    // message.info("Ready to add a new role."); // Optional: provide feedback
  };

  const onSave = () => {
    // Trim values to handle accidental spaces
    const trimmedRole = {
      id: currentRole.id.trim(),
      name: currentRole.name.trim(),
      group: currentRole.group.trim(),
    };

    // Validation checks
    if (!trimmedRole.id) {
      message.warning("Please fill in the ID.");
      return;
    }
    if (!trimmedRole.name) {
      message.warning("Please fill in the Name.");
      return;
    }
    if (!trimmedRole.group) {
      message.warning("Please fill in the Group.");
      return;
    }
    // Check for ID uniqueness (only when adding or if ID changed during edit)
    const isIdExist = dataState.list.some(
      (item) => item.id === trimmedRole.id && item.id !== originalEditId
    );
    if (isIdExist) {
      message.warning(`ID '${trimmedRole.id}' already exists.`);
      return;
    }
    if (!isEditMode) {
      // Add new record
      setDataState((prev) => ({
        ...prev,
        list: [...prev.list, trimmedRole],
      }));
      message.success("Role inserted successfully!");
    } else {
      // Update existing record
      const updatedList = dataState.list.map((item) =>
        item.id === originalEditId
          ? { ...item, name: trimmedRole.name, group: trimmedRole.group } // Update only name and group, ID cannot be changed in edit mode based on your current logic
          : item
      );
      setDataState((prev) => ({
        ...prev,
        list: updatedList,
      }));
      message.success("Role updated successfully!");
    }

    // Clear the form fields after successful submission/update
    setCurrentRole({
      id: "",
      name: "",
      group: "",
    });
    setIsEditMode(false); // Exit edit mode
    setOriginalEditId(null); // Reset original edit ID
  };
  const onClear = () => {
    setCurrentRole({
      id: "",
      name: "",
      group: "",
    });
    setIsEditMode(false); // Exit edit mode
    setOriginalEditId(null); // Reset original edit ID
    message.info("Form cleared.");
  };

  const onDelete = (itemToDelete) => {
    Modal.confirm({
      title: "Confirm Deletion",
      content: `Are you sure you want to remove "${itemToDelete.name}" (ID: ${itemToDelete.id})?`,
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        const newList = dataState.list.filter(
          (data) => data.id !== itemToDelete.id
        ); // Use !== for strict comparison
        setDataState((prev) => ({
          ...prev,
          list: newList,
        }));
        message.success("Role deleted successfully!");
        // Clear form if the deleted item was currently being edited
        if (originalEditId === itemToDelete.id) {
          onClear();
        }
      },
      onCancel() {
        message.info("Deletion cancelled.");
      },
    });
  };

  const onEdit = (itemToEdit) => {
    setCurrentRole({
      id: itemToEdit.id,
      name: itemToEdit.name,
      group: itemToEdit.group,
    });
    setOriginalEditId(itemToEdit.id); // Store the ID of the item being edited
    setIsEditMode(true); // Set to edit mode
  };

  // Filtered list for display based on search term
  const filteredList = dataState.list.filter((item) =>
    item.name.toLowerCase().includes(dataState.searchTerm.toLowerCase()) ||
    item.group.toLowerCase().includes(dataState.searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(dataState.searchTerm.toLowerCase())
  );

  // Define columns for Ant Design Table
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id.localeCompare(b.id), // Enable sorting by ID
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name), // Enable sorting by Name
    },
    {
      title: "Group",
      dataIndex: "group",
      key: "group",
      sorter: (a, b) => a.group.localeCompare(b.group), // Enable sorting by Group
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => ( // Use underscore for unused first argument (text)
        <Space size="small">
          <Button type="primary" onClick={() => onEdit(record)}>
            Edit
          </Button>
          <Button danger type="primary" onClick={() => onDelete(record)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center w-full mb-4">
        <Space>
          <div>
            <h2 className="text-lg md:text-xl font-semibold">
              Roles Total: {filteredList.length}
            </h2>
          </div>
          <div className="flex-1 min-w-72">
            <Input.Search
              size="large"
              allowClear
              placeholder="Search by ID, Name, or Group"
              enterButton
              value={dataState.searchTerm}
              onChange={(e) =>
                setDataState((prev) => ({ ...prev, searchTerm: e.target.value }))
              }
            />
          </div>
        </Space>
        <div className="ml-3"> {/* Use ml-3 instead of pl-3 for left margin */}
          <Button type="primary" onClick={onClickNew}>
            NEW ROLE
          </Button>
        </div>
      </div>

      <div className="p-5 bg-blue-100 rounded-lg shadow-md mb-6"> {/* Adjusted background and styling */}
        <Space wrap size="middle"> {/* Added wrap for responsiveness, and size for consistent spacing */}
          <Input
            name="id" // Added name prop for consistent handling
            disabled={isEditMode} // Disable ID input when editing
            placeholder="ID"
            value={currentRole.id}
            onChange={handleInputChange}
            style={{ width: 150 }} // Set a fixed width
          />
          <Input
            name="name" // Added name prop
            placeholder="Name"
            value={currentRole.name}
            onChange={handleInputChange}
            style={{ width: 200 }}
          />
          <Input
            name="group" // Added name prop
            placeholder="Group"
            value={currentRole.group}
            onChange={handleInputChange}
            style={{ width: 200 }}
          />
          <Button onClick={onClear}>
            Clear
          </Button>
          <Button type="primary" onClick={onSave}>
            {isEditMode ? "Update Role" : "Save New Role"}
          </Button>
        </Space>
      </div>

      {/* Use Ant Design Table for displaying data */}
      <div className="mt-3">
        <Table
          dataSource={filteredList} // Use the filtered list
          columns={columns}
          rowKey="id" // Crucial for unique keys for each row
          pagination={{
            pageSize: 10, // Items per page
            showSizeChanger: true, // Allow changing page size
            pageSizeOptions: ['5', '10', '20', '50'], // Options for page size
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`, // Display total
          }}
          locale={{
            emptyText: filteredList.length === 0 && dataState.searchTerm ? (
              <div className="text-center text-gray-500 py-10">No matching roles found.</div>
            ) : (
              <div className="text-center text-gray-500 py-10">No roles added yet. Click "NEW ROLE" to add one.</div>
            ),
          }}
        />
      </div>
    </>
  );
};

export default RolePage;