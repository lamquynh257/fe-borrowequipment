import axios from "axios";

const userState = {
  data: {},
  loading: false,
  error: undefined,
};

export const userStore = (set, get) => ({
  userState,
  getUser: async (username) => {
    // console.log(username, roleid);
    set(
      (state) => {
        state.userState.loading = true;
      },
      false,
      `users/fetch_request`
    );

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/finduser?username=${username}`,

        {
          headers: {
            Authorization: "Basic YWRtaW46VGhhbmhsYW0xMjM=",
          },
        }
      );
      // console.log(res);
      set(
        (state) => {
          state.userState.loading = false;
          state.userState.data = res.data;
        },
        false,
        `users/fetch_success`
      );
    } catch (err) {
      set(
        (state) => {
          state.userState.loading = false;
          state.userState.error = err;
        },
        false,
        `users/fetch_error`
      );
    }
  },
  createUser: async (newUser) => {
    // console.log(newUser);
    set(
      (state) => {
        state.userState.loading = true;
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
          state.userState.loading = false;
          state.userState.data = [res.data, ...state.userState.data];
        },
        false,
        "users/create_success"
      );
    } catch (err) {
      set(
        (state) => {
          state.userState.loading = false;
          state.userState.error = err;
        },
        false,
        "users/create_error"
      );
    }
  },
  updateUser: async (values, avatar) => {
    // console.log(values);
    set(
      (state) => {
        state.userState.loading = true;
      },
      false,
      "users/update_request"
    );

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/edituser`,
        {
          id: values.id,
          facebook: values.facebook,
          tiktok: values.tiktok,
          youtube: values.youtube,
          instagram: values.instagram,
          website: values.website,
          address: values.address,
          image: values.image,
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
          // console.log(res);
          state.userState.loading = false;
          if (state.userState.data.username === res.data.username) {
            state.userState.data = res.data;
          }
        },
        false,
        "users/update_success"
      );
    } catch (err) {
      set(
        (state) => {
          state.userState.loading = false;
          state.userState.error = err;
        },
        false,
        "users/update_error"
      );
    }
  },
  deleteUser: async (id) => {
    set(
      (state) => {
        state.userState.loading = true;
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
          state.userState.loading = false;
          state.userState.data = state.userState.data?.filter(
            (item) => item.id !== id
          );
        },
        false,
        "users/delete_success"
      );
    } catch (err) {
      set(
        (state) => {
          state.userState.loading = false;
          state.userState.error = err;
        },
        false,
        "users/delete_error"
      );
    }
  },
});
