import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import { userStore } from "./userStore";
import axios from "axios";

export const storeZus = create(
  devtools(
    persist(
      (set, get) => ({
        ...userStore(set, get),
      }),
      {
        name: "zustand", // name of the item in the storage (must be unique)
        storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
        partialize: (state) => ({
          userState: state.userState,
        }), // persist only userStore
      }
    )
  )
);
