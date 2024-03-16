"use client";
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
import { useEffect } from "react";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";
import unidecode from "unidecode";

const status = [];

export default function Computer() {
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const [validationErrors, setValidationErrors] = useState({});
  const [modalImport, setModalImport] = useState(false);
  const [servers, setServers] = useState([]);

  const router = useRouter();
  const [isDark] = useDarkMode();
  // console.log(isDark);
  const { mutate } = useSWRConfig();

  const { cosoState, equipmentTypeState } = storeZus((state) => state);
  const user = storeZus((state) => state.userState.data);
  const getcoso = storeZus((state) => state.getCoso);
  console.log(equipmentTypeState);

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
    // console.log(values)
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/createequipment`,
        {
          name: values.name,
          image: values.image,
          branchname: values.branchname,
          type: values.type,
          code: values.code,
          status: values.status,
          note: values.note,
          quantity: values.quantity,
          usenum: values.usenum,
          usetime: values.usetime,
          code: values.code,
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
        getcoso(); //update lại store
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
        mutate(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/getallequipment`);
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

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    // console.log(values);
    // console.log("row:", row.original.id);
    axios
      .post(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/editequipment`,
        {
          id: values.id,
          image: req.values.image,
          name: req.values.name,
          type: req.values.type,
          code: req.values.code,
          status: req.values.status,
          note: req.values.note,
          quantity: req.values.quantity,
          usenum: req.values.usenum,
          usetime: req.values.usetime,
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
        getcoso(); //update lại store
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
        mutate(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/getallbranch`);
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
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/deleteCoso`,
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
        getcoso(); //update lại store
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
        mutate(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/getallcoso`);
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
    setAvatar(file);
  };

  const columns = useMemo(
    () => [
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
        accessorKey: "image",
        header: "",
        size: 80,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
        Cell: ({ cell }) => (
          <Stack direction="row" spacing={2}>
            <Avatar
              variant="square"
              alt=""
              src={`${process.env.NEXT_PUBLIC_BACKEND_API}/equipment/${cell.row.original.image}`}
            />
          </Stack>
        ),
        Edit: ({ cell, column, table }) => (
          <Box>
            <InputLabel>Hình ảnh</InputLabel>
            <input type="file" onChange={handleFileUpload} />
          </Box>
        ),
      },
      {
        accessorKey: "name",
        header: "Tên thiết bị",
        size: 150,
      },
      {
        accessorKey: "quantity",
        header: "Số lượng",
        size: 150,
        Footer: () => (
          <Stack>
            Tổng tồn:
            <Box color="warning.main">Test</Box>
          </Stack>
        ),
      },
      {
        accessorKey: "code",
        header: "Mã",
        size: 100,
      },

      {
        accessorFn: (row) => `${row.branchinfo.name}`,
        header: "Chi nhánh",
        size: 150,
        Cell: ({ cell }) => {
          const row = cell.getValue();
          // console.log(row);
          return <span>{cell.row.original.branchinfo?.name}</span>;
        },

        muiTableBodyCellEditTextFieldProps: {
          select: true, //change to select for a dropdown
          children: cosoState?.data?.map((state) => (
            <MenuItem key={state.name} value={state.name}>
              {state.name}
            </MenuItem>
          )),
        },
      },
      {
        accessorKey: "type",
        header: "Phân loại",
        size: 150,
        Cell: ({ cell }) => (
          <Stack direction="row" spacing={2}>
            {cell.row.original.typeinfo?.name}
          </Stack>
        ),
      },
      {
        accessorKey: "usenum",
        header: "Số lần cho mượn",
        size: 150,
      },
      {
        accessorKey: "usetime",
        header: "Thời gian cho mượn",
        size: 150,
      },

      {
        accessorKey: "status",
        header: "Trạng thái",
        size: 120,
        Cell: ({ cell }) => {
          return (
            <div>
              <Chip
                label={cell.getValue()}
                color="success"
                variant="outlined"
              />
            </div>
          );
        },
      },
      {
        accessorKey: "createdby",
        header: "Người tạo",
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
      },
    ],
    []
  );
  const fetcher = (url) =>
    axios
      .get(url, {
        headers: {
          Authorization: "Basic YWRtaW46VGhhbmhsYW0xMjM=",
        },
      })
      .then((res) => res.data);
  const {
    data: allEquipType,
    error: EquipTypeEr,
    isLoading: typeLoading,
  } = useSWR(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/api/getallequipmenttype`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/api/getallequipment`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  if (error) return "Lỗi khi tải dữ liệu.";
  if (isLoading) return <Loading />;
  if (EquipTypeEr) return "Lỗi khi tải dữ liệu.";
  if (typeLoading) return <Loading />;
  // console.log(allEquipType);

  // console.log(data);

  return (
    <div>
      {/* Modal import  */}
      <Modal
        title="Import data"
        visible={modalImport}
        onCancel={() => {
          setServers([]);
          setModalImport(false);
        }}
        onOk={handleImport}
      >
        <div>
          <Input type="file" accept=".xlsx" onChange={handleFileChange} />
          {servers?.length > 0 && (
            <>
              <p>Danh sách đã import:</p>
              <ul>
                {servers.map((server, index) => (
                  <li key={index}>
                    {server.name} - {server.vitri}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </Modal>
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
          data={data}
          editingMode="modal" //default
          enableColumnResizing
          enableStickyHeader
          // enableStickyFooter
          // enableColumnOrdering
          enableEditing
          initialState={
            ({ columnVisibility: { id: false } }, { showColumnFilters: true })
          } // Ẩn cột id khi tạo mới
          onEditingRowSave={handleSaveRowEdits}
          onEditingRowCancel={handleCancelRowEdits}
          // muiTableContainerProps={{ sx: { maxHeight: "500px" } }}
          renderRowActions={({ row, table }) => (
            <Box sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}>
              <Tooltip arrow placement="left" title="Edit">
                <IconButton onClick={() => table.setEditingRow(row)}>
                  <Edit />
                </IconButton>
              </Tooltip>

              <Popconfirm
                title={`Bạn muốn xoá : ${row.original.coso}`}
                onConfirm={() => handleDelete(row)}
                okText="Yes"
                cancelText="No"
              >
                <IconButton>
                  <Delete />
                </IconButton>
              </Popconfirm>
            </Box>
          )}
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
          branchs={cosoState?.data}
          equipType={allEquipType}
        />
      </ThemeProvider>
    </div>
  );
}

export const CreateNewAccountModal = ({
  open,
  columns,
  onClose,
  onSubmit,
  branchs,
  equipType,
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
      item.accessorKey !== "branchname" &&
      item.accessorKey !== "image" &&
      item.accessorKey !== "type"
  );

  const handleSubmit = () => {
    //put your validation logic here
    onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Create New</DialogTitle>
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
                {column.accessorKey === "quantity" && (
                  <>
                    <Box>
                      <InputLabel>Hình ảnh</InputLabel>
                      <input
                        type="file"
                        onChange={(e) =>
                          setValues({ ...values, image: e.target.files[0] })
                        }
                      />
                    </Box>
                    <FormControl>
                      <InputLabel id="ntl-coso">Chi nhánh</InputLabel>
                      <Select
                        labelId="ntl-coso"
                        id="ntl-coso"
                        value={values.branchname}
                        label="Chi nhánh"
                        onChange={(e) =>
                          setValues({
                            ...values,
                            branchname: e.target.value,
                          })
                        }
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {branchs?.map((state) => (
                          <MenuItem key={state.id} value={state.id}>
                            {state.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </>
                )}
                {column.accessorKey === "code" && (
                  <>
                    <FormControl>
                      <InputLabel id="ntl-type">Phân loại</InputLabel>
                      <Select
                        labelId="ntl-type"
                        id="ntl-type"
                        value={values.type}
                        label="Phân loại"
                        onChange={(e) =>
                          setValues({
                            ...values,
                            type: e.target.value,
                          })
                        }
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {equipType?.map((state) => (
                          <MenuItem key={state.id} value={state.id}>
                            {state.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
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

const validateRequired = (value) => !!value.length;
const validateEmail = (email) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
const validateAge = (age) => age >= 18 && age <= 50;
