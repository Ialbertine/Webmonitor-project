import React, { useState, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { IconButton, Box, Stack, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { GET_ALL_WEBSITES, DELETE_WEBSITE } from "../graphql/queries";

interface Website {
  id: number;
  name: string;
  url: string;
  status: string;
}

const Homepage: React.FC = () => {
  const { loading, error, data } = useQuery<{ websites: Website[] }>(
    GET_ALL_WEBSITES,
    {
      fetchPolicy: "network-only",
    }
  );
  const [deleteWebsite] = useMutation<
    { deleteWebsite: Website },
    { id: string }
  >(DELETE_WEBSITE);

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Handle Delete Action
  const handleDelete = async (id: string) => {
    try {
      await deleteWebsite({
        variables: { id },
        refetchQueries: [{ query: GET_ALL_WEBSITES }],
      });
    } catch (error) {
      console.error("Error deleting website:", error);
    }
  };

  // Filter rows based on search term with error handling
  const filteredRows = useMemo(() => {
    if (!data || !data.websites) return [];
    return data.websites
      .map((website) => ({
        id: website.id || "N/A",
        name: website.name || "No Name", // camelCase
        url: website.url || "No URL", // camelCase
        status: website.status || "No Status", // camelCase
      }))
      .filter((website) => {
        return website.name.toLowerCase().includes(searchTerm.toLowerCase());
      });
  }, [data, searchTerm]);

  // Column Definitions
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "name", // camelCase
      headerName: "Name",
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "url", // camelCase
      headerName: "URL",
      width: 250,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "status", // camelCase
      headerName: "Status",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams) => (
        <>
          <IconButton size="large">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)} size="large">
            <DeleteIcon />
          </IconButton>
        </>
      ),
      sortable: false,
    },
  ];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      padding={4}
    >
      <div className="text-center">
        <p className="text-lg mb-8">This is the list of all your Websites</p>
      </div>
      <Stack spacing={3} alignItems="center" width="100%" maxWidth="1200px">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
        >
          <TextField
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: "300px" }}
          />
        </Stack>
        <Box sx={{ width: "100%", backgroundColor: "#fff" }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 25]}
            disableRowSelectionOnClick
            autoHeight
            sx={{
              backgroundColor: "#ffffff",
              border: "1px solid #e0e0e0",
              borderRadius: 1,
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#e0e0e0",
                borderBottom: "1px solid #e0e0e0",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid #e0e0e0",
                "&:not(:last-child)": {
                  borderRight: "1px solid #e0e0e0",
                },
              },
              "& .MuiDataGrid-row": {
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#f0f7ff",
                },
              },
            }}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default Homepage;
