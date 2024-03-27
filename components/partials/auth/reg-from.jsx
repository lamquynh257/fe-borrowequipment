import React, { useState } from "react";
import { toast } from "react-toastify";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import Checkbox from "@/components/ui/Checkbox";
import { useDispatch, useSelector } from "react-redux";
import { handleRegister } from "./store";

const schema = yup
  .object({
    name: yup.string().required("Name is Required"),
    email: yup.string().email("Invalid email").required("Email is Required"),
    password: yup
      .string()
      .min(6, "Password must be at least 8 characters")
      .max(20, "Password shouldn't be more than 20 characters")
      .required("Please enter password"),
    // confirm password
    confirmpassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match"),
  })
  .required();

const RegForm = () => {
  const dispatch = useDispatch();

  const [checked, setChecked] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });
  const router = useRouter();
  const [data, setData] = useState({
    username: "",
    password: "",
  });
  // const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);

  const registerUser = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    });
    if (response.ok === true) {
      setLoading(true);
      // messageApi.open({
      //   type: "success",
      //   content: "Đăng ký thành công!",
      // });
      setTimeout(function () {
        router.push("/auth/login");
      }, 1500);
    } else {
      messageApi.open({
        type: "error",
        content: "Tài khoản đã được đăng ký!",
      });
    }
  };

  const onSubmit = (data) => {
    dispatch(handleRegister(data));
    setTimeout(() => {
      router.push("/");
    }, 1500);
  };
  return (
    <form onSubmit={registerUser} className="space-y-5 ">
      <Textinput
        name="username"
        label="Username"
        type="text"
        placeholder=" Enter your Username"
        register={register}
        error={errors.name}
        value={data.username}
        onChange={(e) => {
          setData({ ...data, username: e.target.value });
        }}
      />{" "}
      <Textinput
        name="password"
        label="passwrod"
        type="password"
        placeholder=" Enter your password"
        register={register}
        error={errors.password}
        value={data.password}
        onChange={(e) => {
          setData({ ...data, password: e.target.value });
        }}
      />
      <Checkbox
        label="You accept our Terms and Conditions and Privacy Policy"
        value={checked}
        onChange={() => setChecked(!checked)}
      />
      <button className="btn btn-dark block w-full text-center">
        Create an account
      </button>
    </form>
  );
};

export default RegForm;
