import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import { userStore } from "./userStore";
import { cosoStore } from "./cosoStore";
import { equipmentTypeStore } from "./equipmentTypeStore";
import axios from "axios";

export const storeZus = create(
  devtools(
    persist(
      (set, get) => ({
        ...userStore(set, get),
        ...cosoStore(set, get),
        ...equipmentTypeStore(set, get),
      }),
      {
        name: "zustand", // name of the item in the storage (must be unique)
        storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
        partialize: (state) => ({
          userState: state.userState,
          cosoState: state.cosoState,
          equipmentTypeState: state.equipmentTypeState,
        }), // persist only userStore
      }
    )
  )
);

const equipType = async () => {
  await axios
    .get(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/api/getallequipmenttype`,

      {
        headers: {
          Authorization: "Basic YWRtaW46VGhhbmhsYW0xMjM=",
        },
      }
    )
    .then((res) =>
      storeZus.setState({
        equipmentTypeState: {
          data: res.data,
          loading: false,
        },
      })
    );
};

const coSo = async () => {
  await axios
    .get(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/api/getallbranch`,

      {
        headers: {
          Authorization: "Basic YWRtaW46VGhhbmhsYW0xMjM=",
        },
      }
    )
    .then((res) =>
      storeZus.setState({
        cosoState: {
          data: res.data,
          loading: false,
        },
      })
    );
};

equipType();
coSo();
