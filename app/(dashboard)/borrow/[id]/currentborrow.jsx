"use client";

import { useEffect } from "react";
import useSWR, { useSWRConfig } from "swr";
import React, { useCallback, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import {
  Avatar,
  Box,
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
  Button,
  Modal,
  Typography,
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
import { Input, Popconfirm, Tag } from "antd";
import * as XLSX from "xlsx";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import moment from "moment";
import { roleid, statusBorrow } from "@/constant/status";
import { statusEquip } from "@/constant/status";

// import Modal from "@/components/ui/Modal";

const { TextArea } = Input;

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
  const [modalImport, setModalImport] = useState(false);
  const [servers, setServers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedEquipId, setSelectedEquipId] = useState(null);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [dataConfirm, setDataConfirm] = useState({});
  const [noteConfirm, setNoteConfirm] = useState("");

  const router = useRouter();
  const [isDark] = useDarkMode();
  // console.log(isDark);
  const { mutate } = useSWRConfig();

  const { cosoState, equipmentTypeState } = storeZus((state) => state);
  const user = storeZus((state) => state.userState.data);

  // const getcoso = storeZus((state) => state.getCoso);
  // console.log(equipmentTypeState);

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

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const importedUsers = jsonData.slice(1).map((row) => ({
        name: row[1],
        model: row[2],
        coso: row[3],
        phongban: row[4],
        vitri: row[5],
        servicetag: row[6],
        ngaymua: row[7],
        ngayhethanbaohanh: row[8],
      }));
      setServers(importedUsers);
      setModalImport(true);
    };

    reader.readAsArrayBuffer(file);
  };
  const handleImport = () => {
    servers.forEach((server) => {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/api/createcoso`,
          {
            coso: server.coso,
          },
          {
            headers: {
              Authorization: process.env.NEXT_PUBLIC_BACKEND_AUTHEN,
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        )
        .then((response) => {
          // Xử lý thành công
          setServers([]);
          setModalImport(false);
          toast.success("Tạo thành công.", {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          mutate(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/getallbranch`);
        })
        .catch((error) => {
          // Xử lý lỗi
          setServers([]);
          setModalImport(false);
          toast.error("Trùng tên.", {
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
    });
  };
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Example Data");
    XLSX.writeFile(workbook, "AP-list.xlsx");
  };

  const handleCreateNewRow = async (values) => {
    // console.log(values);

    await axios
      .post(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/createborrow`,
        {
          equipmentid: values.equipmentid,
          userid: values.userid,
          start: values.start,
          note: values.note,
          status: statusBorrow[0].name, // "Chờ xác nhận"
          equipmentstatus: statusBorrow[0].name, // "Chờ xác nhận"
          createdby: user.username,
        },
        {
          headers: {
            Authorization: process.env.NEXT_PUBLIC_BACKEND_AUTHEN,
            "Content-Type": "application/x-www-form-urlencoded",
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(() => {
        toast.success("Tạo thành công.", {
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
      .catch(() => {
        toast.error("Tạo thất bại.", {
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

  const handleConfirm = async () => {
    // console.log(dataConfirm);
    const startTime = moment(dataConfirm.start);
    const endTime = moment(moment().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"));

    const duration = moment.duration(endTime.diff(startTime));

    const preTime = dataConfirm.equipmentinfo?.usetime; // thời gian sử dụng trước đó
    const caseTime = duration.asHours().toFixed(2);

    const totalTimeUse = parseFloat(preTime) + parseFloat(caseTime);

    axios
      .post(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/confirmborrow`,
        {
          id: dataConfirm.id, // id của borrow
          end: endTime._i, // gửi lên để set endtime cho borrow
          equipmentid: dataConfirm.equipmentid, //id của equipment
          quantity: 1,
          usenum: parseInt(dataConfirm.equipmentinfo?.usenum) + 1,
          usetimeEquip: totalTimeUse,
          usetime: caseTime,
          note: noteConfirm,
          equipmentstatus: statusEquip[0].name, // "Sãn sàng"
          // status: "Đã được trả",
          status: statusBorrow[2].name, // "Đã được trả"
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

  const handleFileUpload = (e) => {
    const file = e.target.files[0]; // Lấy file đầu tiên từ sự kiện onChange
    // console.log(file);
    setEquipImg(file);
  };
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
    (item) =>
      item.branchname === parseInt(params.id) &&
      item.status === statusEquip[0].name
  );
  // console.log(newAllEquip);

  const newData = data.filter(
    (item) =>
      item.equipmentinfo.branchinfo.id === parseInt(params.id) &&
      item.status != statusBorrow[2].name //"Đã được trả"
  );
  // console.log(newData);

  const columns = [
    {
      accessorKey: "index",
      header: "#",
      Cell: ({ cell, row }) => {
        return <div>{parseInt(row.id) + 1}</div>;
      },
      // enableColumnActions: false,
      // enableEditing: false,
      // enableResizing: false,
      size: 50,
      Edit: ({ cell, column, table }) => <></>, //Ẩn khi edit
    },
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
      enableColumnActions: false,
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
      size: 180,
      Cell: ({ cell }) => {
        const row = cell.getValue();
        // console.log(row);
        return (
          <span>
            {cell.row.original.equipmentinfo?.name} -{" "}
            {cell.row.original.equipmentinfo?.code}
          </span>
        );
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
        children: allEquip
          .filter((item) => item.branchname === parseInt(params.id))
          ?.map((state) => (
            <MenuItem key={state.name} value={state.name}>
              {state.name} - {state.code}
            </MenuItem>
          )),
      },
    },

    {
      accessorFn: (row) => `${row.userinfo.username}`,
      id: "userid",
      header: "Người mượn",
      size: 150,
      muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
        ...getCommonEditTextFieldProps(cell),
      }),
      Cell: ({ cell }) => {
        return <span>{cell.row.original.userinfo?.username}</span>;
      },

      muiTableBodyCellEditTextFieldProps: {
        select: true, //change to select for a dropdown
        onChange: (event) => {
          const selectedUsername = event.target.value; // Lấy username của mục đã chọn
          const selectedId = allUser.find(
            (user) => user.username === selectedUsername
          ).id; // Tìm id tương ứng với username đã chọn
          setSelectedUserId(selectedId); // Lưu trữ ID được chọn vào state
          // console.log(selectedId); //
        },
        children: allUser?.map((state) => (
          <MenuItem key={state.username} value={state.username}>
            {state.username}
          </MenuItem>
        )),
      },
    },
    {
      accessorFn: (row) => row.start,
      id: "start",
      header: "Ngày mượn",
      size: 150,
      Cell: ({ cell }) => (
        <> {moment.utc(cell.getValue()).format("DD/MM/YYYY HH:mm")}</>
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
    {
      accessorKey: "usetime",
      header: "Thời gian mượn",
      size: 190,
      enableEditing: false,
      Edit: ({ cell, column, table }) => <></>,
    },
    {
      accessorKey: "note",
      header: "Ghi chú",
      size: 150,
    },

    {
      accessorKey: "status",
      header: "Trạng thái",
      size: 190,
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
      header: "Người tạo",
      enableEditing: false,
      size: 150,
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
  function debounce(func, wait = 500) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), wait);
    };
  }
  const debouncedSetNote = debounce((value) => setNoteConfirm(value), 500);
  const handleChange = (event) => {
    debouncedSetNote(event.target.value);
  };
  const style = {
    position: "absolute",
    top: "20%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  return (
    <div>
      {/* Modal  */}
      <Modal
        open={modalConfirm}
        onClose={() => {
          setModalConfirm(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <>
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Xác nhận thu hồi
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <TextArea
                rows={2}
                placeholder="Tình trạng thiết bị (nếu có)"
                onChange={handleChange}
              />
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              {" "}
              {/* Added Box for button styling */}
              <Button variant="contained" onClick={handleConfirm}>
                {/* Replace handleSave with your actual save logic */}
                Save
              </Button>
            </Box>
          </Box>
        </>
      </Modal>

      {/* <Modal
        title="Thông báo"
        open={modalConfirm}
        onCancel={() => {
          setModalConfirm(false);
        }}
        onOk={handleConfirm}
      >
        <Box>
          Xác nhận thu hồi thiết bị?
          <br />
          <TextArea
            rows={2}
            placeholder="maxLength is 6"
            maxLength={6}
            onChange={handleChange}
          />
        </Box>
      </Modal> */}
      {/* <div style={{ display: "flex", flexDirection: "row-reverse" }}>
        <Button onClick={() => setModalImport(true)}>Import</Button>
        <Button onClick={exportExcel}>Export</Button>
      </div> */}
      <ThemeProvider theme={theme}>
        <MaterialReactTable
          displayColumnDefOptions={{
            "mrt-row-actions": {
              muiTableHeadCellProps: {
                align: "center",
              },
              header: "Action",
              size: 80,
            },
          }} //Thay đổi css cho cột Action
          columns={columns}
          data={newData}
          editingMode="modal" //default
          // enableColumnResizing
          enableStickyHeader
          enableSorting={false}
          // enableStickyFooter
          // enableColumnOrdering
          // enableEditing
          initialState={{ columnVisibility: { id: false } }} // Ẩn cột id khi tạo mới
          onEditingRowSave={handleSaveRowEdits}
          onEditingRowCancel={handleCancelRowEdits}
          // muiTableContainerProps={{ sx: { maxHeight: "500px" } }}
          enableRowActions
          renderRowActionMenuItems={({ row, table }) => [
            <MenuItem key="edit" onClick={() => table.setEditingRow(row)}>
              Edit
            </MenuItem>,
            <MenuItem key="delete" onClick={() => handleDelete(row)}>
              Delete
            </MenuItem>,
            row.original.status != statusBorrow[1].name ? (
              ""
            ) : (
              <MenuItem
                key="thuhoi"
                onClick={() => {
                  setDataConfirm(row.original);
                  setModalConfirm(true);
                }}
              >
                Thu hồi
              </MenuItem>
            ),
          ]}
          renderTopToolbarCustomActions={() => (
            <>
              <div>
                <Button
                  color="secondary"
                  onClick={() => setCreateModalOpen(true)}
                  variant="contained"
                >
                  + New
                </Button>

                <Button onClick={() => setModalImport(true)}>Import</Button>
                <Button onClick={exportExcel}>Export</Button>
              </div>
            </>
          )}
        />
        <CreateNewAccountModal
          columns={columns}
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSubmit={handleCreateNewRow}
          Equips={newAllEquip}
          Users={allUser}
        />
      </ThemeProvider>
    </div>
  );
};
export const CreateNewAccountModal = ({
  open,
  columns,
  onClose,
  onSubmit,
  Equips,
  Users,
}) => {
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ""] = "";
      return acc;
    }, {})
  );
  const filteredColumns = columns.filter(
    (item) =>
      item.accessorKey !== "index" &&
      item.accessorKey !== "action" &&
      item.accessorKey !== "id" &&
      item.accessorKey !== "createdby" &&
      item.accessorKey !== "usetime" &&
      item.id !== "start" &&
      item.accessorKey !== "end" &&
      item.id !== "image" &&
      item.id !== "status" &&
      item.id !== "equipmentid" &&
      item.id !== "userid" &&
      item.id !== "usetime"
  );

  const handleSubmit = () => {
    //put your validation logic here
    if (!values.equipmentid || !values.userid || !values.start) {
      // console.log("Please input");
      toast.error("Các trường * không được trống.", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
    onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Tạo mới</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: "100%",
              minWidth: { xs: "300px", sm: "360px", md: "400px" },
              gap: "1.5rem",
            }}
          >
            {filteredColumns.map((column) => (
              <>
                {column.accessorKey === "note" && (
                  <>
                    <Autocomplete
                      disablePortal
                      id="equip"
                      // options={Equips.filter((item) => item.quantity !== 0)}
                      options={Equips}
                      getOptionLabel={(equip) =>
                        `${equip.name} - ${equip.code}`
                      }
                      // sx={{ width: "auto" }}
                      onChange={(event, newValue) => {
                        // console.log(newValue);
                        setValues({
                          ...values,
                          equipmentid: newValue?.id,
                        });
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Thiết bị mượn" required />
                      )}
                    />
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={Users.filter(
                        (users) => users.roleid == roleid[2].rolename
                      )}
                      getOptionLabel={(user) =>
                        `${user.fullname} - ${user.department}`
                      }
                      // sx={{ width: 300 }}
                      onChange={(event, newValue) => {
                        // console.log(newValue.id);
                        setValues({
                          ...values,
                          userid: newValue?.id,
                        });
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Người mượn" required />
                      )}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["DateTimePicker"]}>
                        <DateTimePicker
                          slotProps={{ textField: { required: true } }}
                          label="Ngày mượn"
                          format="DD/MM/YYYY HH:mm"
                          onChange={(event, newValue) => {
                            // console.log(event.$d);
                            setValues({
                              ...values,
                              start: event?.$d,
                            });
                          }}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </>
                )}

                <TextField
                  key={column.accessorKey}
                  label={column.header}
                  name={column.accessorKey}
                  onChange={(e) =>
                    setValues({ ...values, [e.target.name]: e.target.value })
                  }
                />
              </>
            ))}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: "1.25rem" }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BorrowItem;

function convertTimeToMinutes(timeString) {
  const parts = timeString.split(" ");
  let totalMinutes = 0;

  for (let i = 0; i < parts.length; i += 2) {
    const value = parseInt(parts[i]);
    const unit = parts[i + 1];

    if (unit === "ngày," || unit === "ngày") {
      totalMinutes += value * 24 * 60; // 1 ngày = 24 giờ * 60 phút
    } else if (unit === "giờ") {
      totalMinutes += value * 60; // 1 giờ = 60 phút
    } else if (unit === "phút") {
      totalMinutes += value;
    }
  }

  return totalMinutes;
}

function addTimeValues(time1, time2) {
  let totalMinutes = 0;

  // Kiểm tra nếu time1 là một số nguyên
  if (!isNaN(time1)) {
    totalMinutes += parseInt(time1); // Thêm giá trị của time1 vào tổng số phút
  } else {
    totalMinutes += convertTimeToMinutes(time1); // Chuyển đổi time1 thành số phút và cộng vào tổng số phút
  }

  totalMinutes += convertTimeToMinutes(time2); // Chuyển đổi time2 thành số phút và cộng vào tổng số phút

  // Tiếp tục với phần code cũ
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;

  return `${days} ngày, ${hours} giờ ${minutes} phút`;
}

const parseTimeStringToHours = (timeString) => {
  // Tách chuỗi thành các thành phần riêng biệt: ngày, giờ, phút
  const [daysString, hoursString, minutesString] =
    timeString.split(/ ngày, | giờ | phút/);

  // Chuyển đổi thành số nguyên
  const days = parseInt(daysString);
  const hours = parseInt(hoursString);
  const minutes = parseInt(minutesString);

  // Tính tổng giờ
  const totalHours = days * 24 + hours + minutes / 60;

  // Làm tròn kết quả với 2 chữ số thập phân
  return totalHours.toFixed(2);
};
