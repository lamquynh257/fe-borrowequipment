"use client";
import { Button, Modal, Form, Input } from "antd";
import { useSession } from "next-auth/react";

import { useState } from "react";
import Link from "next/link";
import useSWR, { useSWRConfig } from "swr";
import axios from "axios";
import Loading from "@/components/Loading";
import { storeZus } from "@/store/store";

export const UserPage = () => {
  const { data: session, status, update } = useSession();
  // console.log(session);
  const [editData, setEditData] = useState({});
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [file, setFile] = useState();
  const { mutate } = useSWRConfig();

  const userState = storeZus((state) => state.userState.data);
  const updateUser = storeZus((state) => state.updateUser);
  // console.log(userState);

  const handleEditClick = (row) => {
    // console.log(row)
    setEditData(session?.user);
    setEditModalVisible(true);
  };
  const handleEditSave = async (e) => {
    // e.preventDefault();
    // console.log(file);
    if (file == undefined) {
      const values = {
        id: userState.id,
        facebook: editData.facebook,
        tiktok: editData.tiktok,
        youtube: editData.youtube,
        instagram: editData.instagram,
        website: editData.website,
        address: editData.address,
      };
      updateUser(values);
      // await axios.put(
      //   `${process.env.NEXT_PUBLIC_BACKEND_API}/api/edituser`,
      //   {
      //     id: session?.user.id,
      //     facebook: editData.facebook,
      //     tiktok: editData.tiktok,
      //     youtube: editData.youtube,
      //     instagram: editData.instagram,
      //     website: editData.website,
      //     address: editData.address,
      //   },
      //   {
      //     headers: {
      //       Authorization: "Basic YWRtaW46VGhhbmhsYW0xMjM=",
      //       "Content-Type": "multipart/form-data",
      //     },
      //   }
      // );
      mutate(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/finduser?username=${userState?.username}`
      );
      setEditModalVisible(false);
    } else {
      const values = {
        id: userState.id,
        facebook: editData.facebook,
        tiktok: editData.tiktok,
        youtube: editData.youtube,
        instagram: editData.instagram,
        website: editData.website,
        address: editData.address,
        image: file,
      };
      updateUser(values);
      // await axios.put(
      //   `${process.env.NEXT_PUBLIC_BACKEND_API}/api/edituser`,
      //   {
      //     id: session?.user.id,
      //     facebook: editData.facebook,
      //     tiktok: editData.tiktok,
      //     youtube: editData.youtube,
      //     instagram: editData.instagram,
      //     website: editData.website,
      //     address: editData.address,
      //     image: file,
      //   },
      //   {
      //     headers: {
      //       Authorization: "Basic YWRtaW46VGhhbmhsYW0xMjM=",
      //       "Content-Type": "multipart/form-data",
      //     },
      //   }
      // );
      mutate(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/finduser?username=${userState?.username}`
      );
      setEditModalVisible(false);
    }
  };

  const fetcher = (url) =>
    axios
      .get(url, {
        headers: {
          Authorization: "Basic YWRtaW46VGhhbmhsYW0xMjM=",
        },
      })
      .then((res) => res.data);
  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/api/finduser?username=${userState?.username}`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  if (error) return <div>failed to load</div>;
  if (isLoading) return <Loading />;
  // console.log(data);

  return (
    <>
      {/* <Suspense fallback={<div>Loading.....</div>}> */}
      <div className="h-full w-full bg-white p-8">
        <div className="bg-white rounded-lg">
          <div className="w-full h-[180px]">
            <img
              // src="https://vojislavd.com/ta-template-demo/assets/img/profile-background.jpg"
              src="/background/bg.jpeg"
              className="w-full h-full rounded-tl-lg rounded-tr-lg object-cover"
            />
          </div>
          <div className="flex flex-col items-center -mt-20">
            <img
              src={`${process.env.NEXT_PUBLIC_BACKEND_API}/avatar/${userState?.image}`}
              className="w-40 h-40 border-4 border-white rounded-full "
            />
            <div className="flex items-center space-x-2 mt-2">
              <p className="text-2xl whitespace-nowrap">
                {userState?.name?.replace(/\s*\([^)]*\)\s*/, "")}
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
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={4}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </span>
            </div>
            <p className="text-gray-700">{userState?.chucvu}</p>
            <p className="text-sm text-gray-500">Đại học Nguyễn Tất Thành</p>
          </div>
          <div className="flex-1 flex flex-col items-center lg:items-end justify-end px-8 mt-2">
            <div className="flex items-center space-x-4 mt-2">
              <button
                onClick={handleEditClick}
                className="flex items-center justify-center whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-gray-100 px-4 py-2 rounded text-sm space-x-2 transition duration-100"
              >
                Chỉnh sửa
              </button>

              <Link
                href={`/card/${userState?.id}`}
                target="_blank"
                className="flex items-center justify-center whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-gray-100 px-4 py-2 rounded text-sm space-x-2 transition duration-100"
              >
                Xem danh thiếp
              </Link>
            </div>
          </div>
          <h4 className="text-xl text-gray-900 font-bold p-2 flex justify-center">
            Thông tin cá nhân
          </h4>
          <div className="p-2 mt-2">
            <div className="break-words mb-2">
              <span className="font-bold w-24">Phone:</span> {userState?.mobile}
            </div>

            <div className="break-words mb-2">
              <span className="font-bold w-24">Email:</span> {userState?.email}
            </div>
            <div className="break-words mb-2">
              <span className="font-bold w-24">Website:</span>{" "}
              {userState?.website}
            </div>
            <div className="break-words mb-2">
              <span className="font-bold w-24">Địa chỉ:</span>{" "}
              {userState?.address}
            </div>
            <div className="break-words mb-2">
              <span className="font-bold w-24">Facebook:</span>{" "}
              {userState?.facebook}
            </div>
            <div className="break-words mb-2">
              <span className="font-bold w-24">Zalo:</span> https://zalo.me/
              {userState?.mobile}
            </div>
            <div className="break-words mb-2">
              <span className="font-bold w-24">Tiktok:</span>{" "}
              {userState?.tiktok}
            </div>
            <div className="break-words mb-2">
              <span className="font-bold w-24">Youtube:</span>{" "}
              {userState?.youtube}
            </div>
            <div className="break-words mb-2">
              <span className="font-bold w-24">Instagram:</span>{" "}
              {userState?.instagram}
            </div>
          </div>
        </div>
      </div>

      {/* Modal sửa  */}
      <Modal
        title="Thay đổi thông tin"
        open={editModalVisible}
        bodyStyle={{ overflowY: "auto", maxHeight: "calc(100vh - 200px)" }}
        centered
        onCancel={() => {
          setEditModalVisible(false);
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setEditModalVisible(false);
            }}
          >
            Cancel
          </Button>,
          <Button
            key="save"
            className="bg-blue-700 text-white"
            onClick={() => handleEditSave()}
          >
            Save
          </Button>,
        ]}
      >
        <Form onFinish={handleEditSave} layout="vertical">
          {/* <Form.Item label="ID">
            <Input name="id" value={editData.id} disabled />
          </Form.Item> */}
          <Form.Item
            label="Tên"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên!",
              },
            ]}
          >
            <Input
              name="name"
              value={editData.name?.replace(/\s*\([^)]*\)\s*/, "")}
              disabled
              // onChange={(e) =>
              //   setEditData({
              //     ...editData,
              //     name: e.target.value,
              //   })
              // }
            />
          </Form.Item>
          <Form.Item label="Email">
            <Input
              name="email"
              value={editData.email}
              disabled
              // onChange={(e) =>
              //   setEditData({
              //     ...editData,
              //     email: e.target.value,
              //   })
              // }
            />
          </Form.Item>

          <Form.Item label="Facebook">
            <Input
              name="facebook"
              value={editData.facebook}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  facebook: e.target.value,
                })
              }
            />
          </Form.Item>
          <Form.Item label="Tiktok">
            <Input
              name="tiktok"
              value={editData.tiktok}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  tiktok: e.target.value,
                })
              }
            />
          </Form.Item>
          <Form.Item label="Youtube">
            <Input
              name="youtube"
              value={editData.youtube}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  youtube: e.target.value,
                })
              }
            />
          </Form.Item>
          <Form.Item label="Instagram">
            <Input
              name="instagram"
              value={editData.instagram}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  instagram: e.target.value,
                })
              }
            />
          </Form.Item>
          <Form.Item label="Website">
            <Input
              name="website"
              value={editData.website}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  website: e.target.value,
                })
              }
            />
          </Form.Item>
          <Form.Item label="Địa chỉ">
            <Input
              name="address"
              value={editData.address}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  address: e.target.value,
                })
              }
            />
          </Form.Item>
          <Form.Item label="Avatar">
            <input
              type="file"
              name="file"
              onChange={(e) => setFile(e.target.files?.[0])}
            />
          </Form.Item>
        </Form>
      </Modal>
      {/* </Suspense> */}
    </>
  );
};
export default UserPage;
