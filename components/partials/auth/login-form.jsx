import React, { useState } from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import Checkbox from "@/components/ui/Checkbox";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { handleLogin } from "./store";
import { toast } from "react-toastify";
import { signIn, useSession } from "next-auth/react";
import { CircularProgress, LinearProgress } from "@mui/material";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import AdLogin from "@/app/api/adlogin/route";
import { storeZus } from "@/store/store";
const schema = yup
  .object({
    // email: yup.string().email("Invalid email").required("Email is Required"),
    username: yup.string().required("Không được để trống"),
    password: yup.string().required("Không được để trống"),
  })
  .required();
const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    username: "",
    password: "",
  });
  const getUser = storeZus((state) => state.getUser);

  const loginUser = async (e) => {
    setLoading(true);
    // console.log(data);
    e.preventDefault();

    const res = await AdLogin(data.username, data.password);
    // const auth = await signIn("credentials", {
    //   username: data.username,
    //   password: data.password,
    //   redirect: false,
    // });
    // console.log(res);
    if (res.message === "Đăng nhập không thành công") {
      setLoading(false);
      toast.error("Sai tên đăng nhập hoặc mật khẩu.", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      getUser(data.username);
      await signIn("credentials", {
        username: data.username,
        password: data.password,
        department: res.user.phongban,
        phone: res.user.mobile,
        email: res.user.emailAddress,
        fullname: res.user.displayName,
        redirect: false,
      });

      toast.success("Đăng nhập thành công.", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setTimeout(() => {
        // Lấy thông tin user theo quyền
        router.push("/");
      }, 800);
      router.refresh();
    }
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    //
    mode: "all",
  });
  const router = useRouter();

  const [checked, setChecked] = useState(false);

  return (
    <form onSubmit={loginUser} className="space-y-4 ">
      <Textinput
        name="username"
        label="Username"
        required
        // defaultValue={data.username}
        placeholder="Tên đăng nhập ..."
        register={register}
        error={errors?.username}
        value={data.username}
        onChange={(e) => {
          setData({ ...data, username: e.target.value });
        }}
      />
      <Textinput
        name="password"
        label="Password"
        type="password"
        required
        // defaultValue={data.password}
        placeholder="Mật khẩu ..."
        register={register}
        value={data.password}
        error={errors?.password}
        onChange={(e) => {
          setData({ ...data, password: e.target.value });
        }}
      />
      <div className="flex justify-between">
        <Checkbox
          value={checked}
          onChange={() => setChecked(!checked)}
          label="Keep me signed in"
        />
        <Link
          href="https://sso.ntt.edu.vn/ForgotPassword.aspx"
          className="text-sm text-slate-800 dark:text-slate-400 leading-6 font-medium"
        >
          Quên mật khẩu?{" "}
        </Link>
      </div>

      <button className="btn text-white block w-full text-center bg-indigo-600 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
        {loading ? (
          <Spin
            indicator={
              <LoadingOutlined
                style={{
                  fontSize: 24,
                }}
                spin
              />
            }
            className="text-white"
          />
        ) : (
          "Sign in"
        )}
      </button>
    </form>
  );
};

export default LoginForm;
