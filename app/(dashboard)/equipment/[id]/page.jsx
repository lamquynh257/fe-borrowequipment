"use client";
import { Tabs } from "antd";

import Loading from "@/components/Loading";
import axios from "axios";
import React from "react";
import useSWR from "swr";
import useDarkmode from "@/hooks/useDarkMode";

const { TabPane } = Tabs;
function Detail({ params }) {
  //   console.log("param", params.id);

  const [isDark] = useDarkmode();

  const fetcher = (url) =>
    axios
      .get(url, {
        headers: {
          Authorization: "Basic YWRtaW46VGhhbmhsYW0xMjM=",
        },
      })
      .then((res) => res.data);
  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/api/findequipment?id=${params.id}`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  if (error) return "Lỗi khi tải dữ liệu.";
  if (isLoading) return <Loading />;
  console.log(data);
  return (
    <div>
      <Tabs defaultActiveKey="pc" type="card" style={{ width: "100%" }}>
        <TabPane tab="Thông tin chung" key="pc">
          <div
            className={`${
              isDark ? "dark" : "light"
            }  flex h-full w-full flex-col md:flex-row`}
          >
            <div className="left-col md:w-[33%] md:pr-4">
              <div className="box box-primary">
                <div className="box-body">
                  <table className="table table-striped table-hover">
                    <tbody>
                      <tr>
                        <td>
                          <b>Tên máy</b>
                        </td>
                        <td>
                          <span
                            className="badge"
                            style={{ backgroundColor: "#03ba20" }}
                          >
                            {data?.name}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <b>Trạng thái</b>
                        </td>
                        <td>{data?.status}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Số lượng</b>
                        </td>
                        <td>{data?.quantity}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Số lần cho mượn</b>
                        </td>
                        <td>{data?.usenum}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Thời gian cho mượn</b>
                        </td>
                        <td>{data?.usetime}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Phân loại</b>
                        </td>
                        <td>{data?.typeinfo.name}</td>
                      </tr>

                      <tr>
                        <td>
                          <b>Chi nhánh</b>
                        </td>
                        <td>
                          <span
                            className="label"
                            style={{
                              backgroundColor: "#FFF",
                              color: "#ff0000",
                              border: "1px solid #ff0000",
                              padding: "5px",
                            }}
                          >
                            {data?.branchinfo.name}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="right-col md:w-[66%] md:pl-4">
              <div className="">
                <div className="box box-primary">
                  <div className="box-header">
                    <h3 className="box-title">Credentials</h3>
                    <div className="pull-right box-tools">
                      <button
                        type="button"
                        className="btn btn-default btn-sm btn-flat"
                        data-widget="collapse"
                        data-toggle="tooltip"
                        title
                        data-original-title="Collapse"
                      >
                        <i className="fa fa-minus" />
                      </button>
                    </div>
                  </div>
                  <div className="box-body">
                    <div className="table-responsive">
                      <table className="table table-striped table-hover table-bordered">
                        <thead>
                          <tr>
                            <th>Type</th>
                            <th>Username</th>
                            <th>Password</th>
                            <th className="text-right" />
                          </tr>
                        </thead>
                        <tbody />
                      </table>
                    </div>
                    There are no credentials to display.{"{"}" "{"}"}
                  </div>
                </div>
                <div className="box box-primary">
                  <div className="box-header">
                    <h3 className="box-title">Assigned Licenses</h3>
                    <div className="pull-right box-tools">
                      <button
                        type="button"
                        className="btn btn-default btn-sm btn-flat"
                        data-widget="collapse"
                        data-toggle="tooltip"
                        title
                        data-original-title="Collapse"
                      >
                        <i className="fa fa-minus" />
                      </button>
                    </div>
                  </div>
                  <div className="box-body">
                    <div className="table-responsive">
                      <table className="table table-striped table-hover table-bordered">
                        <thead>
                          <tr>
                            <th>Tag</th>
                            <th>Category</th>
                            <th>Name</th>
                            <th className="text-right" />
                          </tr>
                        </thead>
                        <tbody />
                      </table>
                    </div>
                    VK7JG-NPHTM-C97JM-9MPGT-3V66T
                  </div>
                </div>
                <div className="box box-primary">
                  <div className="box-header">
                    <h3 className="box-title">Notes</h3>
                    <div className="pull-right box-tools">
                      <button
                        type="button"
                        className="btn btn-default btn-sm btn-flat"
                        data-widget="collapse"
                        data-toggle="tooltip"
                        title
                        data-original-title="Collapse"
                      >
                        <i className="fa fa-minus" />
                      </button>
                    </div>
                  </div>
                  <div className="box-body" />
                </div>
              </div>
            </div>
          </div>
        </TabPane>
        {/* ////////////////////// Edit user ////////////////////////// */}
        <TabPane tab="Edit" key="edit">
          Edit
        </TabPane>
      </Tabs>
    </div>
  );
}

export default Detail;
