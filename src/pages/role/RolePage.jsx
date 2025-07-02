import { Button, Input, Space } from "antd";
import React, { useState } from "react";

const RolePage = () => {
  const [state, setState] = useState({
    list: [],
    list1: [
      {
        id: 1,
        name: "growth IT",
        group: "IT",
      },
      {
        id: 2,
        name: "IT Manageer Assistan",
        group: "IT",
      },
      {
        id: 3,
        name: "IT Manager",
        group: "Admin",
      },
      {
        id: 4,
        name: "Developer",
        group: "IT",
      },
      {
        id: 5,
        name: "Backend Developer",
        group: "TeamWork",
      },
    ],
    loading: false,
    total: 1000,
  });

  const [Role, setRole] = useState({
    id: "",
    name: "",
    group: "",
  });
  const onClickNew = () => {
    // body function execute
    // action create new record role
    const objRole = {
      id: 1,
      name: "Mobile Developer",
      group: "IT",
    };
    setState((p) => ({
      ...p, //Spread all existing items from the previous 'list' array
      list: [
        ...p.list, // Spread all existing items from the previous 'list' array
        objRole, // Add the new item to the end of the array
      ],
    }));
  };

  const onSave = () => {
    setState((p) => ({
      ...p, //Spread all existing items from the previous 'list' array
      list: [
        ...p.list, // Spread all existing items from the previous 'list' array
        Role, // Add the new item to the end of the array
      ],
    }));
  };
  return (
    <>
      <div className="flex justify-between items-center w-full">
        <Space>
          <div>
            <h2 className="text-sm md:text-md mb-1">
              Role total, {state.list.length}
            </h2>
          </div>
          <div className="flex-1 min-w-72 order-5 sm:order-3">
            <Input.Search
              size="large"
              allowClear
              placeholder="Search ametava"
              enterButton
            />
          </div>
        </Space>
        <div className="mt-6 pl-3">
          <Button type="primary" onClick={onClickNew}>
            NEW
          </Button>
        </div>
      </div>
      {/* <h1>
        {objRole.id} - {objRole.name}-{objRole.group}
      </h1> */}
      <div className="p-5 bg-pink-300">
        <Space>
          <Input
            placeholder="id"
            value={Role.id}
            onChange={(event) =>
              setRole((p) => ({ ...p, id: event.target.value }))
            }
          />
          <Input
            placeholder="name"
            value={Role.name}
            onChange={(event) =>
              setRole((p) => ({ ...p, name: event.target.value }))
            }
          />
          <Input
            placeholder="group"
            value={Role.group}
            onChange={(event) =>
              setRole((p) => ({ ...p, group: event.target.value }))
            }
          />
          <Button type="primary" onClick={onSave}>
            Save
          </Button>
        </Space>
      </div>

      {/* // it not data */}
      {state.list.length == 0 && <div className="text-center">No Record</div>}

      <div className="mt-3">
        {state.list.map((item, index) => (
          <div
            key={index}
            className="p-6 bg-gray-300 flex justify-between flex-col md:flex-row gap-3 mb-3 rounded"
          >
            <div>
              <Space>
                <div className="h-10 w-10 bg-gray-100 rounded-full"></div>
                <div>{item.id}</div>
                <div className="font-medium text-sm md:text-xl">
                  {item.name}
                </div>
                <div>{item.group}</div>
              </Space>
            </div>
            <div>
              <Space>
                <Button type="primary">EDTE</Button>
                <Button danger type="primary">
                  DELETE
                </Button>
              </Space>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default RolePage;
