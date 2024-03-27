"use client";

import { useEffect } from "react";
import useSWR, { useSWRConfig } from "swr";
import React, { useCallback, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { Delete, Edit } from "@mui/icons-material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { blue, green, purple } from "@mui/material/colors";
import useDarkMode from "@/hooks/useDarkMode";
import Chip from "@mui/material/Chip";
import FaceIcon from "@mui/icons-material/Face";
import { storeZus } from "@/store/store";
import axios from "axios";
import { toast } from "react-toastify";
import { Input, Modal, Popconfirm, Tag } from "antd";
import * as XLSX from "xlsx";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Icon from "@/components/ui/Icon";
import moment from "moment";
import { statusEquip } from "@/constant/status";
import { statusBorrow } from "@/constant/status";

const fetcher = (url) =>
  axios
    .get(url, {
      headers: {
        Authorization: "Basic YWRtaW46VGhhbmhsYW0xMjM=",
      },
    })
    .then((res) => res.data);

const BorrowItem = ({ params }) => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [modalConfirm, setModalConfirm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedEquipId, setSelectedEquipId] = useState(null);
  const [dataConfirm, setDataConfirm] = useState({});

  const [isDark] = useDarkMode();
  // console.log(isDark);
  const { mutate } = useSWRConfig();

  const { cosoState, equipmentTypeState } = storeZus((state) => state);
  const user = storeZus((state) => state.userState.data);

  // const getcoso = storeZus((state) => state.getCoso);
  // console.log(equipmentTypeState);
  // console.log(status);

  const theme = createTheme({
    palette: {
      mode: isDark ? "dark" : "light",
      primary: {
        main: blue[500],
      },
      secondary: {
        main: blue[500],
      },
      background: {
        default: isDark ? "rgb(30 41 59)" : "#fff",
        paper: isDark ? "rgb(30 41 59)" : "#fff",
      },
    },
  });

  const handleConfirm = async () => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/confirmborrow`,
        {
          id: dataConfirm.id, // id của borrow
          equipmentid: dataConfirm.equipmentid, //id của equipment
          quantity: 0,
          status: statusBorrow[1].name, // "Xác nhận mượn"
          equipmentstatus: statusEquip[2].name, // "Đang cho mượn"
          updatedby: user.username,
        },
        {
          headers: {
            Authorization: process.env.NEXT_PUBLIC_BACKEND_AUTHEN,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then(() => {
        setModalConfirm(false);
        toast.success("Sửa thành công.", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        mutate(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/getallborrow`);
      })
      .catch((e) => {
        setModalConfirm(false);

        toast.error("Sửa thất bại.", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    // console.log(values);
    // console.log("row:", row.original.id);
    if (!selectedEquipId && !selectedUserId) return exitEditingMode();
    axios
      .post(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/editborrow`,
        {
          id: values.id,
          equipmentid: selectedEquipId,
          userid: selectedUserId,
          note: values.note,
          updatedby: user.username,
        },
        {
          headers: {
            Authorization: process.env.NEXT_PUBLIC_BACKEND_AUTHEN,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then(() => {
        exitEditingMode(); //required to exit editing mode and close modal
        toast.success("Sửa thành công.", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        mutate(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/getallborrow`);
      })
      .catch((e) => {
        exitEditingMode(); //required to exit editing mode and close modal
        toast.error("Sửa thất bại.", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  const handleDelete = async (row) => {
    // console.log(row);
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/deleteequipment`,
        {
          id: row.original.id,
        },
        {
          headers: {
            Authorization: process.env.NEXT_PUBLIC_BACKEND_AUTHEN,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((r) => {
        toast.success("Xoá thành công.", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        mutate(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/getallequipment`);
      })
      .catch((err) => {
        toast.error("Xoá thất bại.", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };

  const getCommonEditTextFieldProps = useCallback(
    (cell) => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        onBlur: (event) => {
          const isValid =
            cell.column.id === "email"
              ? validateEmail(event.target.value)
              : cell.column.id === "age"
              ? validateAge(+event.target.value)
              : validateRequired(event.target.value);
          if (!isValid) {
            //set validation error for cell if invalid
            setValidationErrors({
              ...validationErrors,
              [cell.id]: `${cell.column.columnDef.header} is required`,
            });
          } else {
            //remove validation error for cell if valid
            delete validationErrors[cell.id];
            setValidationErrors({
              ...validationErrors,
            });
          }
        },
      };
    },
    [validationErrors]
  );

  // Lấy toàn bộ thiết bị
  const {
    data: allEquip,
    error: EquipEr,
    isLoading: equipLoading,
  } = useSWR(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/api/getallequipment`,
    fetcher
  );
  const {
    data: allUser,
    error: userEr,
    isLoading: userLoading,
  } = useSWR(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/alluser`, fetcher);
  // Lấy toàn bộ borrow
  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/api/getallborrow`,
    fetcher
    // {
    //   revalidateIfStale: false,
    //   revalidateOnFocus: false,
    //   revalidateOnReconnect: false,
    // }
  );
  if (EquipEr) return "Lỗi khi tải dữ liệu.";
  if (equipLoading) return <Loading />;
  if (userEr) return "Lỗi khi tải dữ liệu.";
  if (userLoading) return <Loading />;
  if (error) return "Lỗi khi tải dữ liệu.";
  if (isLoading) return <Loading />;

  const newAllEquip = allEquip.filter(
    (item) => item.branchname === parseInt(params.id)
  );
  // console.log(user);

  const newData = data.filter(
    (item) => item.userinfo.username === user.username
  );
  // Lấy toàn bộ user

  const columns = [
    // {
    //   accessorKey: "index",
    //   header: "#",
    //   Cell: ({ cell, row }) => {
    //     return <div>{parseInt(row.id) + 1}</div>;
    //   },
    //   // enableColumnActions: false,
    //   // enableEditing: false,
    //   // enableResizing: false,
    //   size: 50,
    //   Edit: ({ cell, column, table }) => <></>, //Ẩn khi edit
    // },
    {
      accessorKey: "id",
      header: "ID",
      size: 20,
      enableEditing: false,
    },

    {
      accessorFn: (row) => `${row.equipmentinfo.image}`,
      id: "image",
      header: "",
      size: 80,
      Cell: ({ cell }) => (
        <Stack direction="row" spacing={2}>
          <Avatar
            variant="square"
            alt=""
            src={`${process.env.NEXT_PUBLIC_BACKEND_API}/equipment/${cell.row.original.equipmentinfo?.image}`}
          />
        </Stack>
      ),

      Edit: ({ cell, column, table }) => <></>,
    },

    {
      accessorFn: (row) => `${row.equipmentinfo.name}`,
      id: "equipmentid",
      header: "Thiết bị mượn",
      size: 150,
      Cell: ({ cell }) => {
        const row = cell.getValue();
        // console.log(row);
        return <span>{cell.row.original.equipmentinfo?.name}</span>;
      },

      muiTableBodyCellEditTextFieldProps: {
        select: true, //change to select for a dropdown
        onChange: (event) => {
          const selectedEquipname = event.target.value; // Lấy username của mục đã chọn
          const selectedId = newAllEquip?.find(
            (user) => user.name === selectedEquipname
          ).id; // Tìm id tương ứng với equip đã chọn
          setSelectedEquipId(selectedId); // Lưu trữ ID được chọn vào state
          // console.log(selectedId); //
        },
        children: newAllEquip?.map((state) => (
          <MenuItem key={state.name} value={state.name}>
            {state.name} - {state.code}
          </MenuItem>
        )),
      },
    },

    // {
    //   accessorFn: (row) => `${row.userinfo.username}`,
    //   id: "userid",
    //   header: "Người mượn",
    //   size: 150,
    //   muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
    //     ...getCommonEditTextFieldProps(cell),
    //   }),
    //   Cell: ({ cell }) => {
    //     return <span>{cell.row.original.userinfo?.username}</span>;
    //   },

    //   muiTableBodyCellEditTextFieldProps: {
    //     select: true, //change to select for a dropdown
    //     onChange: (event) => {
    //       const selectedUsername = event.target.value; // Lấy username của mục đã chọn
    //       const selectedId = allUser.find(
    //         (user) => user.username === selectedUsername
    //       ).id; // Tìm id tương ứng với username đã chọn
    //       setSelectedUserId(selectedId); // Lưu trữ ID được chọn vào state
    //       // console.log(selectedId); //
    //     },
    //     children: allUser?.map((state) => (
    //       <MenuItem key={state.username} value={state.username}>
    //         {state.username}
    //       </MenuItem>
    //     )),
    //   },
    // },
    {
      accessorFn: (row) => `${moment(row.start).format("DD/MM/YYYY HH:mm:ss")}`,
      id: "start",
      header: "Ngày mượn",
      size: 150,
      Cell: ({ cell }) => (
        <>
          {moment.utc(cell.row.original?.start).format("DD/MM/YYYY HH:mm:ss")}
        </>
      ),
      enableEditing: false,
      Edit: ({ cell, column, table }) => <></>,
    },
    {
      accessorKey: "end",
      header: "Ngày trả",
      size: 150,
      Cell: ({ cell }) => (
        <>
          {cell.row.original?.end
            ? moment.utc(cell.row.original?.end).format("DD/MM/YYYY HH:mm:ss")
            : ""}
        </>
      ),
      Edit: ({ cell, column, table }) => <></>,
    },
    // {
    //   accessorKey: "usetime",
    //   header: "Thời gian mượn",
    //   size: 100,
    //   enableEditing: false,
    //   Edit: ({ cell, column, table }) => <></>,
    // },
    {
      accessorKey: "note",
      header: "Ghi chú",
      size: 100,
    },

    // {
    //   accessorFn: (row) => `${row.equipmentinfo?.status}`,
    //   id: "status",
    //   header: "Trạng thái",
    //   size: 150,
    //   Cell: ({ cell }) => {
    //     const row = cell.getValue();
    //     // console.log(row);
    //     return (
    //       <div>
    //         <Chip
    //           label={cell.row.original.equipmentinfo?.status}
    //           color="success"
    //           variant="outlined"
    //         />
    //       </div>
    //     );
    //   },

    //   Edit: ({ cell, column, table }) => <></>,
    // },
    {
      accessorKey: "status",
      header: "Trạng thái",
      size: 150,
      Cell: ({ cell }) => {
        const row = cell.getValue();
        // console.log(row);
        return (
          <div>
            <Chip label={cell.getValue()} color="success" variant="outlined" />
          </div>
        );
      },

      Edit: ({ cell, column, table }) => <></>,
    },

    {
      accessorKey: "createdby",
      header: "Người cho mượn",
      enableEditing: false,
      size: 120,
      Cell: ({ cell }) => {
        return (
          <div>
            <Chip
              label={cell.getValue()}
              color="primary"
              variant="outlined"
              icon={<FaceIcon />}
            />
          </div>
        );
      },
      enableEditing: false,
      Edit: ({ cell, column, table }) => <></>,
    },
  ];
  // useEffect(() => {
  //   localStorage.setItem("chooseBranch", params.id);
  // }, []);

  // console.log(allUser);

  // console.log(allUser);

  return (
    <div>
      {/* Modal import  */}
      <Modal
        title="Thông báo"
        open={modalConfirm}
        onCancel={() => {
          setModalConfirm(false);
        }}
        onOk={handleConfirm}
      >
        <>Xác nhận mượn thiết bị?</>
      </Modal>

      <ThemeProvider theme={theme}>
        <MaterialReactTable
          displayColumnDefOptions={{
            "mrt-row-actions": {
              muiTableHeadCellProps: {
                align: "center",
              },
              header: "",
              size: 80,
            },
          }} //Thay đổi css cho cột Action
          // Minimal table //
          enableColumnActions={false}
          enableColumnFilters={false}
          // enablePagination={false}
          enableSorting={false}
          // enableBottomToolbar={false}
          enableTopToolbar={false}
          muiTableBodyRowProps={{ hover: false }}
          // Bật số thử tự theo hàng
          enableRowNumbers
          rowNumberMode="original"
          /////////////////////////////////
          columns={columns}
          data={newData}
          editingMode="modal" //default
          enableStickyHeader
          // enableStickyFooter
          // enableColumnOrdering
          enableEditing
          initialState={{ columnVisibility: { id: false } }} // Ẩn cột id khi tạo mới
          onEditingRowSave={handleSaveRowEdits}
          onEditingRowCancel={handleCancelRowEdits}
          // muiTableContainerProps={{ sx: { maxHeight: "500px" } }}
          // enableRowActions
          renderRowActions={({ row, table }) => (
            <>
              {row.original.status === statusBorrow[1].name ||
              row.original.status === statusBorrow[2].name ? (
                ""
              ) : (
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    setDataConfirm(row.original);
                    setModalConfirm(true);
                  }}
                >
                  Xác nhận
                </Button>
              )}
            </>
          )}
          // renderTopToolbarCustomActions={() => (
          //   <>
          //     <div>
          //       <Button
          //         color="secondary"
          //         onClick={() => setCreateModalOpen(true)}
          //         variant="contained"
          //       >
          //         + New
          //       </Button>

          //       <Button onClick={() => setModalConfirm(true)}>Import</Button>
          //       <Button onClick={exportExcel}>Export</Button>
          //     </div>
          //   </>
          // )}
        />
      </ThemeProvider>
    </div>
  );
};

export default BorrowItem;
