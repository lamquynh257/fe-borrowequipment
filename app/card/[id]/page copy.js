"use client";
import React, { useState } from "react";
import useSWR from "swr";
import { Space, Table, Tag } from "antd";
import Link from "next/link";
import { useSession } from "next-auth/react";

const fetcher = (url) =>
  fetch(url, {
    headers: {
      Authorization: "Basic YWRtaW46VGhhbmhsYW0xMjM=",
    },
  }).then((res) => res.json());

export default function TenPhongBan({ params }) {
  const { data: session, status } = useSession();
  const [fullName, setFullName] = useState("");
  const { data, error, isLoading } = useSWR(
    `http://localhost:3001/api/finduserasp?user=${params.username}`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  if (error) return "An error has occurred.";
  if (isLoading) return "Loading...";
  // console.log(data);
  return (
    <>
      <div className="h-full bg-white p-8 bg-[url('/background/bg.png')]">
        <div className=" rounded-lg shadow-xl pb-8">
          <div className="w-full h-[170px] ">
            <img
              // src="https://vojislavd.com/ta-template-demo/assets/img/profile-background.jpg"
              src="/background/bg.jpeg"
              className="w-full h-full rounded-tl-lg rounded-tr-lg object-cover"
            />
          </div>
          <div className="flex flex-col items-center -mt-20">
            <img
              src="/avatar/avatar1.jpg"
              className="w-40 h-40 border-4 border-white rounded-full "
            />
            <div className="flex items-center space-x-2 mt-2">
              <p className="text-2xl font-bold">
                {data?.user.displayName.replace(/\s*\([^)]*\)\s*/, "")}
              </p>
              <span className="bg-blue-500 rounded-full p-1" title="Verified">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-gray-100 h-2.5 w-2.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="4"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </span>
            </div>
            <p className="text-gray-700">{data?.user.chucvu}</p>
            <p className="text-sm ">Đại học Nguyễn Tất Thành</p>
          </div>
          <div className="flex-1 flex flex-col items-center lg:items-end justify-end px-8 mt-2">
            <div className="flex items-center space-x-4 mt-2">
              {/* <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-gray-100 px-4 py-2 rounded text-sm space-x-2 transition duration-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                </svg>
                <span>Connect</span>
              </button>
              <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-gray-100 px-4 py-2 rounded text-sm space-x-2 transition duration-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Message</span>
              </button> */}
            </div>
          </div>
          {/* button  */}
          <div className="flex flex-row justify-center items-center">
            <button className="bg-[#174581] text-white font-bold py-2 px-4 rounded-lg">
              Lưu danh bạ
            </button>
            <button className="bg-[#174581] text-white font-bold py-2 px-4 rounded-lg ml-2">
              Trao đổi liên hệ
            </button>
          </div>
          {/* icon  */}
          <section className="mt-10">
            <div className="flex flex-row justify-center items-center">
              <div className="flex flex-col items-center justify-center mr-2 ">
                <div className="flex flex-col justify-center hover:scale-110 cursor-pointer">
                  <img
                    src="/icon/phone.png"
                    style={{ width: "59px", height: "59px" }}
                  />
                </div>
                <div className="name-icon items-center">Phone</div>
              </div>
              <div className="flex flex-col items-center justify-center m-2 ">
                <div className="flex flex-col justify-center hover:scale-110">
                  <img
                    src="/icon/sms.png"
                    style={{ width: "59px", height: "59px" }}
                  />
                </div>
                <div className="name-icon items-center">SMS</div>
              </div>
              <div className="flex flex-col items-center justify-center m-2 ">
                <div className="flex flex-col justify-center hover:scale-110">
                  <img
                    src="/icon/mail.png"
                    style={{ width: "59px", height: "59px" }}
                  />
                </div>
                <div className="name-icon items-center">Email</div>
              </div>
              <div className="flex flex-col items-center justify-center ml-2 ">
                <div className="flex flex-col justify-center hover:scale-110">
                  <img
                    src="/icon/website.png"
                    style={{ width: "59px", height: "59px" }}
                  />
                </div>
                <div className="name-icon items-center">Website</div>
              </div>
            </div>
            <div className="flex flex-row justify-center items-center mt-2">
              <div className="flex flex-col items-center justify-center mr-2 ">
                <div className="flex flex-col justify-center hover:scale-110">
                  <img
                    src="/icon/address.png"
                    style={{ width: "59px", height: "59px" }}
                  />
                </div>
                <div className="name-icon items-center">Địa chỉ</div>
              </div>
              <div className="flex flex-col items-center justify-center m-2 ">
                <div className="flex flex-col justify-center hover:scale-110">
                  <img
                    src="/icon/fb.png"
                    style={{ width: "59px", height: "59px" }}
                  />
                </div>
                <div className="name-icon items-center">Facebook</div>
              </div>
              <div className="flex flex-col items-center justify-center m-2 ">
                <div className="flex flex-col justify-center hover:scale-110">
                  <img
                    src="/icon/zalo.png"
                    style={{ width: "59px", height: "59px" }}
                  />
                </div>
                <div className="name-icon items-center">Zalo</div>
              </div>
              <div className="flex flex-col items-center justify-center ml-2 ">
                <div className="flex flex-col justify-center hover:scale-110">
                  <img
                    src="/icon/tiktok.png"
                    style={{ width: "59px", height: "59px" }}
                  />
                </div>
                <div className="name-icon items-center">Tiktok</div>
              </div>
            </div>
            <div className="flex flex-row justify-center items-center mt-2">
              <div className="flex flex-col items-center justify-center mr-2 ">
                <div className="flex flex-col justify-center hover:scale-110">
                  <img
                    src="/icon/you.png"
                    style={{ width: "59px", height: "59px" }}
                  />
                </div>
                <div className="name-icon items-center">Youtube</div>
              </div>
              <div className="flex flex-col items-center justify-center m-2 ">
                <div className="flex flex-col justify-center hover:scale-110">
                  <img
                    src="/icon/insta.png"
                    style={{ width: "59px", height: "59px" }}
                  />
                </div>
                <div className="name-icon items-center">Instagram</div>
              </div>
              <div className="flex flex-col items-center justify-center m-2 ">
                <div className="flex flex-col justify-center hover:scale-110">
                  <img
                    src="/icon/mst.jpg"
                    style={{ width: "59px", height: "59px" }}
                  />
                </div>
                <div className="name-icon items-center">MST</div>
              </div>
              <div className="flex flex-col items-center justify-center ml-2 ">
                <div className="flex flex-col justify-center hover:scale-110">
                  <img
                    src="/icon/share.png"
                    style={{ width: "59px", height: "59px" }}
                  />
                </div>
                <div className="name-icon items-center">Chia sẻ</div>
              </div>
            </div>
          </section>
          <div className="flex justify-center mt-10">Danh Thiếp Thông Minh</div>
        </div>
      </div>
    </>
  );
}
