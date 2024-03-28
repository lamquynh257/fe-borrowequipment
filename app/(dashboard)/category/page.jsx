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

export default function Computer() {
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const [validationErrors, setValidationErrors] = useState({});
  const [modalImport, setModalImport] = useState(false);
  const [servers, setServers] = useState([]);

  const router = useRouter();
  const [isDark] = useDarkMode();
  // console.log(isDark);
  const { mutate } = useSWRConfig();

  const { cosoState } = storeZus((state) => state);
  const user = storeZus((state) => state.userState.data);
  const getcoso = storeZus((state) => state.getCoso);
  // console.log(cosoState);

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
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/createcate`,
        {
          name: values.name,
          createdby: user.username,
        },
        {
          headers: {
            Authorization: process.env.NEXT_PUBLIC_BACKEND_AUTHEN,
            "Content-Type": "application/x-www-form-urlencoded",
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
        mutate(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/getallcate`);
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
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/editcate`,
        {
          id: values.id,
          name: values.name,
          createdby: user.username,
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
        mutate(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/getallcate`);
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
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/deletecate`,
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
        mutate(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/getallcate`);
      })
      .catch((err) => {
        toast.error(`Xoá thất bại: ${err.response.data}`, {
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
        accessorKey: "name",
        header: "Tên danh mục",
        size: 150,
      },

      {
        accessorKey: "createdby",
        header: "Người tạo",
        enableEditing: false,
        size: 500,
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

  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/api/getallcate`,
    fetcher
  );
  if (error) return "Lỗi khi tải dữ liệu.";
  if (isLoading) return <Loading />;

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
          // enableColumnOrdering
          enableEditing
          initialState={{ columnVisibility: { id: false } }} // Ẩn cột id khi tạo mới
          onEditingRowSave={handleSaveRowEdits}
          onEditingRowCancel={handleCancelRowEdits}
          renderRowActions={({ row, table }) => (
            <Box sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}>
              <Tooltip arrow placement="left" title="Edit">
                <IconButton onClick={() => table.setEditingRow(row)}>
                  <Edit />
                </IconButton>
              </Tooltip>

              <Popconfirm
                title={`Bạn muốn xoá : ${row.original.name}`}
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
          coSo={cosoState?.data}
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
  coSo,
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
      item.accessorKey !== "createdby"
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
              <TextField
                key={column.accessorKey}
                label={column.header}
                name={column.accessorKey}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
              />
            ))}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: "1.25rem" }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">
          Create New
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
