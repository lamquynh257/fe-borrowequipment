import axios from "axios";

const cosoState = {
  data: [],
  loading: false,
  error: undefined,
};

export const cosoStore = (set, get) => ({
  cosoState,

  getCoso: async () => {
    // console.log(username, roleid);
    set(
      (state) => {
        state.cosoState.loading = true;
      },
      false,
      `coso/fetch_request`
    );

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/getallbranch`,

        {
          headers: {
            Authorization: "Basic YWRtaW46VGhhbmhsYW0xMjM=",
          },
        }
      );
      //   console.log(res.data);
      set(
        (state) => {
          state.cosoState.loading = false;
          state.cosoState.data = res.data;
        },
        false,
        `coso/fetch_success`
      );
    } catch (err) {
      set(
        (state) => {
          state.cosoState.loading = false;
          state.cosoState.error = err;
        },
        false,
        `coso/fetch_error`
      );
    }
  },
  createCoso: async (newUser) => {
    // console.log(newUser);
    set(
      (state) => {
        state.cosoState.loading = true;
      },
      false,
      "users/create_request"
    );

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/createuser`,
        {
          username: newUser.username,
          password: newUser.password,
          email: newUser.email,
          fullname: newUser.fullname,
          roleid: newUser.roleid,
          image: newUser.image,
        },
        {
          headers: {
            Authorization: "Basic YWRtaW46VGhhbmhsYW0xMjM=",
            "Content-Type": "multipart/form-data",
          },
        }
      );
      set(
        (state) => {
          state.cosoState.loading = false;
          state.cosoState.data = [res.data, ...state.cosoState.data];
        },
        false,
        "users/create_success"
      );
    } catch (err) {
      set(
        (state) => {
          state.cosoState.loading = false;
          state.cosoState.error = err;
        },
        false,
        "users/create_error"
      );
    }
  },
  updateCoso: async (values, avatar) => {
    // console.log(values, avatar);
    set(
      (state) => {
        state.cosoState.loading = true;
      },
      false,
      "users/update_request"
    );

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/edituser`,
        {
          username: values.username,
          password: values.password,
          fullname: values.fullname,
          image: avatar,
          roleid: values.roleid,
          id: values.id,
        },
        {
          headers: {
            Authorization: "Basic YWRtaW46VGhhbmhsYW0xMjM=",
            "Content-Type": "multipart/form-data",
          },
        }
      );
      set(
        (state) => {
          console.log(state);
          state.cosoState.loading = false;
          state.cosoState.data = state.cosoState.data;
        },
        false,
        "users/update_success"
      );
    } catch (err) {
      set(
        (state) => {
          state.cosoState.loading = false;
          state.cosoState.error = err;
        },
        false,
        "users/update_error"
      );
    }
  },
  deleteCoso: async (id) => {
    set(
      (state) => {
        state.cosoState.loading = true;
      },
      false,
      "users/delete_request"
    );

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/deleteuser?id=${id}`,

        {
          headers: {
            Authorization: "Basic YWRtaW46VGhhbmhsYW0xMjM=",
          },
        }
      );
      set(
        (state) => {
          state.cosoState.loading = false;
          state.cosoState.data = state.cosoState.data?.filter(
            (item) => item.id !== id
          );
        },
        false,
        "users/delete_success"
      );
    } catch (err) {
      set(
        (state) => {
          state.cosoState.loading = false;
          state.cosoState.error = err;
        },
        false,
        "users/delete_error"
      );
    }
  },
});
