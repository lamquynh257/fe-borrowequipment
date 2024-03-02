"use client";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import HashLoader from "react-spinners/HashLoader";
import Link from "next/link";
import axios from "axios";

export default function TenPhongBan({ params }) {
  // console.log(params);
  const fetcher = (url) =>
    axios
      .get(url, {
        headers: {
          Authorization: "Basic YWRtaW46VGhhbmhsYW0xMjM=",
        },
      })
      .then((res) => res.data);
  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/api/finduserbyid?id=${params.id}`,
    fetcher
  );
  if (error) return "An error has occurred.";
  if (isLoading)
    return (
      <HashLoader
        color="#36d7b7"
        className="min-h-screen flex items-center justify-center m-auto"
      />
    );
  // console.log(data);

  const downloadVCard = () => {
    // Tạo một đối tượng Blob từ dữ liệu VCARD
    const blob = new Blob([data?.vCardData], {
      type: "text/vcard;charset=utf-8",
    });
    // Tạo một URL dữ liệu từ Blob
    const dataUrl = URL.createObjectURL(blob);

    // Tạo một thẻ a và thiết lập các thuộc tính
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = data?.name + ".vcf";

    // Thêm thẻ a vào body và kích hoạt sự kiện nhấp chuột để tải xuống
    document.body.appendChild(a);
    a.click();

    // Xóa thẻ a sau khi đã nhấp chuột để tải xuống
    document.body.removeChild(a);
  };

  return (
    <>
      <div className="h-full flex justify-center items-center shadow-sm bg-white  bg-[url('/background/bg.jpg')]">
        <div className=" rounded-lg shadow-xl pb-8 w-full md:w-[500px] bg-white md:p-1">
          <div className="w-full h-[170px] ">
            <img
              // src="https://vojislavd.com/ta-template-demo/assets/img/profile-background.jpg"
              src="/background/bg.jpeg"
              className="w-full h-full rounded-tl-lg rounded-tr-lg object-cover"
            />
          </div>
          <div className="flex flex-col items-center -mt-20">
            <img
              src={`${process.env.NEXT_PUBLIC_BACKEND_API}/avatar/${data?.image}`}
              className="w-40 h-40 border-4 border-white rounded-full "
            />
            <div className="flex items-center space-x-2 mt-2">
              <p className="text-2xl font-bold">
                {data?.name.replace(/\s*\([^)]*\)\s*/, "")}
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
                    strokeWidth="4"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </span>
            </div>
            <p className="text-gray-700">{data?.chucvu}</p>
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
            <button
              onClick={downloadVCard}
              className="bg-[#174581] text-white font-bold py-2 px-4 rounded-lg"
            >
              Lưu danh bạ
            </button>
            <a
              href={"https://danhthiep.ntt.edu.vn"}
              className="bg-[#174581] text-white font-bold py-2 px-4 rounded-lg ml-2"
            >
              Trang chủ
            </a>
          </div>
          {/* icon  */}
          <section className="mt-10 mx-auto ">
            <div className="flex flex-row justify-center items-center space-x-7 mb-10">
              <div className="flex flex-col items-center justify-center  ">
                <div className="flex flex-col justify-center hover:scale-110 cursor-pointer">
                  <a href={`tel:${data?.mobile}`}>
                    <img
                      src="/icon/phone.png"
                      style={{ width: "59px", height: "59px" }}
                    />
                  </a>
                </div>
                <div className="name-icon items-center mt-2">Phone</div>
              </div>
              <div className="flex flex-col items-center justify-center ">
                <div className="flex flex-col justify-center hover:scale-110">
                  <a href={`sms:${data?.mobile}`}>
                    <img
                      src="/icon/sms.png"
                      style={{ width: "59px", height: "59px" }}
                    />
                  </a>
                </div>
                <div className="name-icon items-center mt-2">SMS</div>
              </div>
              <div className="flex flex-col items-center justify-center  ">
                <div className="flex flex-col justify-center hover:scale-110">
                  <a href={`mailto:${data?.email}`}>
                    <img
                      src="/icon/mail.png"
                      style={{ width: "59px", height: "59px" }}
                    />
                  </a>
                </div>
                <div className="name-icon items-center mt-2">Email</div>
              </div>
              <div className="flex flex-col items-center justify-center  ">
                <div className="flex flex-col justify-center hover:scale-110">
                  <a href={`${data?.website}`} target="_blank">
                    <img
                      src="/icon/website.png"
                      style={{ width: "59px", height: "59px" }}
                    />
                  </a>
                </div>
                <div className="name-icon items-center mt-2">Website</div>
              </div>
            </div>
            <div className="flex flex-row justify-center items-center  space-x-6 mb-10">
              <div className="flex flex-col items-center justify-center ">
                <div className="flex flex-col justify-center hover:scale-110">
                  <a href={`${data?.address}`} target="_blank">
                    <img
                      src="/icon/address.png"
                      style={{ width: "59px", height: "59px" }}
                    />
                  </a>
                </div>
                <div className="name-icon items-center mt-2">Địa chỉ</div>
              </div>
              <div className="flex flex-col items-center justify-center fixed-width ">
                <div className="flex flex-col justify-center hover:scale-110">
                  <a href={`${data?.facebook}`} target="_blank">
                    <img
                      src="/icon/fb.png"
                      style={{ width: "59px", height: "59px" }}
                    />
                  </a>
                </div>
                <div className="name-icon items-center mt-2 break-words">
                  Facebook
                </div>
              </div>
              <div className="flex flex-col items-center justify-center ">
                <div className="flex flex-col justify-center hover:scale-110">
                  <a href={`https://zalo.me/${data?.mobile}`}>
                    <img
                      src="/icon/zalo.png"
                      style={{ width: "59px", height: "59px" }}
                    />
                  </a>
                </div>
                <div className="name-icon items-center mt-2">Zalo</div>
              </div>
              <div className="flex flex-col items-center justify-center  ">
                <div className="flex flex-col justify-center hover:scale-110">
                  <a href={`${data?.tiktok}`}>
                    <img
                      src="/icon/tiktok.png"
                      style={{ width: "59px", height: "59px" }}
                    />
                  </a>
                </div>
                <div className="name-icon items-center mt-2">Tiktok</div>
              </div>
            </div>
            <div className="flex flex-row justify-center items-center space-x-5 ">
              <div className="flex flex-col items-center justify-center ">
                <div className="flex flex-col justify-center hover:scale-110">
                  <a href={`${data?.youtube}`}>
                    <img
                      src="/icon/you.png"
                      style={{ width: "59px", height: "59px" }}
                    />
                  </a>
                </div>
                <div className="name-icon items-center mt-2">Youtube</div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="flex flex-col justify-center hover:scale-110">
                  <a href={`${data?.instagram}`}>
                    <img
                      src="/icon/insta.png"
                      style={{ width: "59px", height: "59px" }}
                    />
                  </a>
                </div>
                <div className="name-icon items-center mt-2">Instagram</div>
              </div>
              <div className="flex flex-col items-center justify-center ">
                <div className="flex flex-col justify-center hover:scale-110">
                  <img
                    src="/icon/share.png"
                    style={{ width: "59px", height: "59px" }}
                  />
                </div>
                <div className="name-icon items-center mt-2">Chia sẻ</div>
              </div>
              <div className="flex flex-col items-center justify-center m-2 ">
                <div
                  className="flex flex-col justify-center rounded-none"
                  style={{ width: "59px", height: "59px" }}
                >
                  {/* <img
                    src="/icon/mst.jpg"
                    style={{ width: "59px", height: "59px" }}
                  /> */}
                </div>
                {/* <div className="name-icon items-center">MST</div> */}
              </div>
            </div>
          </section>

          <div className="flex justify-center mt-10">Danh Thiếp Thông Minh</div>
        </div>
      </div>
    </>
  );
}
