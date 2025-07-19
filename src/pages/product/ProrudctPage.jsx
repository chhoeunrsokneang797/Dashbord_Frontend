import React, { useState } from "react";
import { countStore } from "../../store/countStor";
import { Button, Col, Row, Space } from "antd";
import { productStore } from "../../store/productStore";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

function ProrudctPage() {
  // Call the store directly as a hook to access its state and actions
  const { count, category, loading, indcrese, descrese, reset, update } =
    countStore();
  const { list, handleWishlist } = productStore();

  const onAddToBage = (item) => {
    console.log(item);
  };

  const onAddToWislist = () => {
    const param = {
      id:id,
      wishlist:wishlist,
    }
    handleWishlist(param);
  };
  return (
    <>
      <div
        style={{ border: "1px solid #ccc", padding: "15px", margin: "10px" }}
      >
        <h3>Counter Display Component</h3>
        <p>
          Current Count: <strong>{count}</strong>
        </p>
        <p>Loading Status: {loading ? "True" : "False"}</p>

        <h4>Categories:</h4>
        {category.length > 0 ? (
          <ul>
            {category.map((cat) => (
              <li key={cat.id}>
                ID: {cat.id}, Name: {cat.name}
              </li>
            ))}
          </ul>
        ) : (
          <p>No categories.</p>
        )}
        <Space>
          <Button onClick={() => indcrese()}>+</Button>
          <Button onClick={() => descrese()}>-</Button>
          <Button onClick={() => reset()}>reset</Button>
          <Button onClick={() => update(999)}>Update to (888)</Button>
        </Space>
      </div>

      <div>
        <h2>Product</h2>
        <Row>
          {list?.map((item) => (
            <Col key={item.id} xs={24} md={8} lg={6}>
              <div className="bg-gray-50 p-3 md:min-h-96 m-2 shadow-xl border border-gray-200">
                <div className="w-full md:min-h-80 bg-gray-500 mb-5">
                  <img
                    className="object-cover aspect-[400/400]"
                    src={item.image}
                    alt=""
                  />
                </div>
                <div className="flex gap-3">
                  <h2>Name:{item.name}</h2>
                  {item.wishlist ? (
                    <AiFillHeart onClick={onAddToWislist} size="20" />
                  ) : (
                    <AiOutlineHeart onClick={onAddToWislist} size="20" />
                  )}
                </div>

                <p>Description:{item.des}</p>
                <div className="mt-2 flex justify-end text-center gap-2">
                  <Button type="primary" onClick={() => onAddToBage(item)}>
                    Add to bage
                  </Button>
                  <Button type="primary" onClick={() => onAddToWislist(item)}>
                    Add to Wislist
                  </Button>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
}

export default ProrudctPage;
