import { create } from "zustand";
import React from "react";
import { persist, createJSONStorage } from "zustand/middleware";

// export const profileStore = create((set) => ({
// profile:{
//   id:"",
//   name:"Sokneang",
//   email:"adminnit@gmail.com",
//   image:ImageWatch,
//   address:"",
//   role:"Admin",
//   permission:null,
//   menu:null
// },// state
// }));

export const profileStore = create()(
  persist(
    (set, get) => ({
      profile: null,
      access_token: null,
      setProfile: (params) => set((pre) => ({ profile: params })),
      setAccessToken: (params) => set((pre) => ({ access_token: params })),
      logout: (params) => set((pre) => ({ profile: { profile: null } })),
    }),
    {
      name: "profile", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
