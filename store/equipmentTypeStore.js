import axios from "axios";

const equipmentTypeState = {
  data: [],
  loading: false,
  error: undefined,
};

export const equipmentTypeStore = (set, get) => ({
  equipmentTypeState,

  getEquipmentType: async () => {
    // console.log(username, roleid);
    set(
      (state) => {
        state.equipmentTypeState.loading = true;
      },
      false,
      `equipmentType/fetch_request`
    );

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/getallequipmenttype`,

        {
          headers: {
            Authorization: "Basic YWRtaW46VGhhbmhsYW0xMjM=",
          },
        }
      );
      //   console.log(res.data);
      set(
        (state) => {
          state.equipmentTypeState.loading = false;
          state.equipmentTypeState.data = res.data;
        },
        false,
        `equipmentType/fetch_success`
      );
    } catch (err) {
      set(
        (state) => {
          state.equipmentTypeState.loading = false;
          state.equipmentTypeState.error = err;
        },
        false,
        `equipmentType/fetch_error`
      );
    }
  },
  // createCoso: async (newUser) => {
  //   // console.log(newUser);
  //   set(
  //     (state) => {
  //       state.equipmentType.loading = true;
  //     },
  //     false,
  //     "users/create_request"
  //   );

  //   try {
  //     const res = await axios.post(
  //       `${process.env.NEXT_PUBLIC_BACKEND_API}/api/createuser`,
  //       {
  //         username: newUser.username,
  //         password: newUser.password,
  //         email: newUser.email,
  //         fullname: newUser.fullname,
  //         roleid: newUser.roleid,
  //         image: newUser.image,
  //       },
  //       {
  //         headers: {
  //           Authorization: "Basic YWRtaW46VGhhbmhsYW0xMjM=",
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );
  //     set(
  //       (state) => {
  //         state.equipmentType.loading = false;
  //         state.equipmentType.data = [res.data, ...state.equipmentType.data];
  //       },
  //       false,
  //       "users/create_success"
  //     );
  //   } catch (err) {
  //     set(
  //       (state) => {
  //         state.equipmentType.loading = false;
  //         state.equipmentType.error = err;
  //       },
  //       false,
  //       "users/create_error"
  //     );
  //   }
  // },
  // updateCoso: async (values, avatar) => {
  //   // console.log(values, avatar);
  //   set(
  //     (state) => {
  //       state.equipmentType.loading = true;
  //     },
  //     false,
  //     "users/update_request"
  //   );

  //   try {
  //     await axios.put(
  //       `${process.env.NEXT_PUBLIC_BACKEND_API}/api/edituser`,
  //       {
  //         username: values.username,
  //         password: values.password,
  //         fullname: values.fullname,
  //         image: avatar,
  //         roleid: values.roleid,
  //         id: values.id,
  //       },
  //       {
  //         headers: {
  //           Authorization: "Basic YWRtaW46VGhhbmhsYW0xMjM=",
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );
  //     set(
  //       (state) => {
  //         console.log(state);
  //         state.equipmentType.loading = false;
  //         state.equipmentType.data = state.equipmentType.data;
  //       },
  //       false,
  //       "users/update_success"
  //     );
  //   } catch (err) {
  //     set(
  //       (state) => {
  //         state.equipmentType.loading = false;
  //         state.equipmentType.error = err;
  //       },
  //       false,
  //       "users/update_error"
  //     );
  //   }
  // },
  // deleteCoso: async (id) => {
  //   set(
  //     (state) => {
  //       state.equipmentType.loading = true;
  //     },
  //     false,
  //     "users/delete_request"
  //   );

  //   try {
  //     await axios.delete(
  //       `${process.env.NEXT_PUBLIC_BACKEND_API}/api/deleteuser?id=${id}`,

  //       {
  //         headers: {
  //           Authorization: "Basic YWRtaW46VGhhbmhsYW0xMjM=",
  //         },
  //       }
  //     );
  //     set(
  //       (state) => {
  //         state.equipmentType.loading = false;
  //         state.equipmentType.data = state.equipmentType.data?.filter(
  //           (item) => item.id !== id
  //         );
  //       },
  //       false,
  //       "users/delete_success"
  //     );
  //   } catch (err) {
  //     set(
  //       (state) => {
  //         state.equipmentType.loading = false;
  //         state.equipmentType.error = err;
  //       },
  //       false,
  //       "users/delete_error"
  //     );
  //   }
  // },
});
