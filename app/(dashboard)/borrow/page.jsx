"use client";

import React from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Link from "next/link";
import axios from "axios";
import useSWR from "swr";
import Loading from "@/components/Loading";

const Borrow = () => {
  const fetcher = (url) =>
    axios
      .get(url, {
        headers: {
          Authorization: "Basic YWRtaW46VGhhbmhsYW0xMjM=",
        },
      })
      .then((res) => res.data);

  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/api/getallbranch`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  if (error) return "Lỗi khi tải dữ liệu.";
  if (isLoading) return <Loading />;

  // console.log(data);

  return (
    <>
      <div className="flex-1 style">
        <div className="grid xl:grid-cols-2 grid-cols-1 gap-5">
          {data
            ? data.map((item) => {
                return (
                  <Card bodyClass="p-0">
                    <div className=" h-[248px] w-full mb-6 ">
                      <img
                        src="/assets/images/all-img/post-1.png"
                        alt=""
                        className=" w-full h-full  object-cover"
                      />
                    </div>
                    <div className="px-6 pb-6">
                      <div className="flex justify-between mb-4">
                        <div>
                          <h5 className="card-title text-slate-900">
                            <Link href="#">{item.name}</Link>
                          </h5>
                        </div>
                        <Link href="#">
                          <span className="inline-flex leading-5 text-slate-500 dark:text-slate-400 text-sm font-normal">
                            <Icon
                              icon="heroicons-outline:calendar"
                              className="text-slate-400 dark:text-slate-400 ltr:mr-2 rtl:ml-2 text-lg"
                            />
                            10/02/2021
                          </span>
                        </Link>
                      </div>

                      <div className="card-text dark:text-slate-300 mt-4">
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit.
                        </p>
                        <div className="mt-4 space-x-4 rtl:space-x-reverse">
                          <Link
                            href={`/borrow/${item.id}`}
                            className="btn-link"
                          >
                            <Button>Chọn cơ sở</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })
            : ""}
        </div>
      </div>
    </>
  );
};

export default Borrow;
