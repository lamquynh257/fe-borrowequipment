"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import GroupChart5 from "@/components/partials/widget/chart/group-chart5";
import Link from "next/link";
import SimpleBar from "simplebar-react";
import { storeZus } from "@/store/store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import CardSlider from "@/components/partials/widget/CardSlider";
import Loading from "@/components/Loading";

// const CardSlider = dynamic(
//   () => import("@/components/partials/widget/CardSlider"),
//   {
//     ssr: false,
//   }
// );

const BankingPage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const user = storeZus((state) => state.userState.data);
  const router = useRouter();
  useEffect(() => {
    if (user.roleid === "sinhvien") {
      router.push("/user");
    }
    if (user.roleid === "admin") {
      router.push("/home");
    }
  }, [user]);
  return (
    <>
      <Loading />
    </>
  );
};

export default BankingPage;
