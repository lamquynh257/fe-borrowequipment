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
  // useEffect(() => {
  //   if (user.roleid === "sinhvien") {
  //     router.push("/user");
  //   }
  // }, [user]);
  return (
    <div className="space-y-5">
      <Card>
        <div className="grid xl:grid-cols-4 lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5 place-content-center">
          <div className="flex space-x-4 h-full items-center rtl:space-x-reverse">
            <div className="flex-none">
              <div className="h-20 w-20 rounded-full">
                <img
                  src="/assets/images/all-img/main-user.png"
                  alt=""
                  className="w-full h-full"
                />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-medium mb-2">
                <span className="block font-light">Good evening,</span>
                <span className="block">Nguyễn Thành Lâm</span>
              </h4>
              <p className="text-sm dark:text-slate-300">Welcome to Website</p>
            </div>
          </div>
          <GroupChart5 />
        </div>
      </Card>
      <div className="grid grid-cols-12 gap-5">
        <div className="lg:col-span-4 col-span-12 space-y-5">
          <Card title="Các chi nhánh">
            <div className="max-w-[90%] mx-auto mt-2">
              <CardSlider />
            </div>
          </Card>
        </div>
        <div className="lg:col-span-8 col-span-12">
          <div className="space-y-5 bank-table">
            <Card title="Đang cho mượn">
              <div className="legend-ring4">Nội dung</div>
            </Card>
            <Card title="Tất cả">
              <div className="legend-ring4">Nội dung</div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankingPage;
