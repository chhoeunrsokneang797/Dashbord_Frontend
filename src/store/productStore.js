import { create } from "zustand";
import React from "react";
import image1 from "../assets/image/shooes.jpg";
import image2 from "../assets/image/watch-3.jpg";
import image3 from "../assets/image/watch.jpg";
import image4 from "../assets/image/watch2.jpg";
export const productStore = create((set) => ({
  list: [
    {
      id: 1,
      name: "Mscebook 2022",
      des: "8RAM 256SSD 14",
      price: 18000,
      image: image1,
      wishlist: 1,
    },
    {
      id: 2,
      name: "Mscebook 2024",
      des: "16RAM 256SSD 14",
      price: 28000,
      image: image2,
      wishlist: 0,
    },
    {
      id: 3,
      name: "Mscebook 2024",
      des: "16RAM 256SSD 14-inch",
      price: 28000,
      image: image3,
      wishlist: 1,
    },
    {
      id: 4,
      name: "Mscebook 2024",
      des: "16RAM 256SSD 14-inch",
      price: 18000,
      image: image4,
      wishlist: 0,
    },
  ],

  handleWishlist: (param) => {
    set((pre) => {
      const indexProduct = pre.list?.findIndex((item) => item.id == param.id);
      pre.list[indexProduct].wishlist = !param.wishlist;
      return {
        list: pre.list,
      };
    });
  },
}));
