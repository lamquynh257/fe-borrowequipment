"use client";
import React, { Fragment, useEffect } from "react";
import useSWR from "swr";
import axios from "axios";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import { Tab, Disclosure, Transition } from "@headlessui/react";
import CurrentBorrow from "./currentborrow";
import RecoveredBorow from "./recoveredborrow";
import Loading from "@/components/Loading";
const buttons = [
  {
    title: "Đang thực hiện",
    icon: "heroicons-outline:home",
  },
  {
    title: "Đã trả",
    icon: "heroicons-outline:user",
  },
];
const fetcher = (url) =>
  axios
    .get(url, {
      headers: {
        Authorization: "Basic YWRtaW46VGhhbmhsYW0xMjM=",
      },
    })
    .then((res) => res.data);

const TabAccrodain = ({ params }) => {
  useEffect(() => {
    localStorage.setItem("chooseBranch", params.id);
  }, []);

  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/api/getallbranch`,
    fetcher
  );
  if (error) return "Lỗi khi tải dữ liệu.";
  if (isLoading) return <Loading />;

  const newBranch = data.filter((item) => item.id === parseInt(params.id));

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card title={`Chi nhánh hiện tại: ${newBranch[0].name}`}>
        <Tab.Group>
          <Tab.List className="lg:space-x-8 md:space-x-4 space-x-0 rtl:space-x-reverse">
            {buttons.map((item, i) => (
              <Tab as={Fragment} key={i}>
                {({ selected }) => (
                  <button
                    className={` inline-flex items-start text-sm font-medium mb-7 capitalize bg-white dark:bg-slate-800 ring-0 foucs:ring-0 focus:outline-none px-2 transition duration-150 before:transition-all before:duration-150 relative before:absolute
                     before:left-1/2 before:bottom-[-6px] before:h-[1.5px]
                      before:bg-primary-500 before:-translate-x-1/2
              
              ${
                selected
                  ? "text-primary-500 before:w-full"
                  : "text-slate-500 before:w-0 dark:text-slate-300"
              }
              `}
                  >
                    <span className="text-base relative top-[1px] ltr:mr-1 rtl:ml-1">
                      <Icon icon={item.icon} />
                    </span>
                    {item.title}
                  </button>
                )}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <div className="text-slate-600 dark:text-slate-400 text-sm font-normal">
                <CurrentBorrow params={params} />
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div className="text-slate-600 dark:text-slate-400 text-sm font-normal">
                <RecoveredBorow params={params} />
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </Card>
    </div>
  );
};

export default TabAccrodain;
