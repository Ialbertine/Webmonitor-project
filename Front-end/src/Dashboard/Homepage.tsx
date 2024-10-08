import React, { useState, useEffect } from "react";
import { IconButton, Box, Stack, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useFetchWebsites, useDeleteWebsite } from "../graphql/useWebsiteQueries";

const Homepage: React.FC = () => {
  const [success, setSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [websites, setWebsites] = useState<any[]>([]); // Local state for websites

  // Fetch websites using the custom hook
  const { data, isLoading, error } = useFetchWebsites();

  // Use the delete mutation hook
  const deleteWebsite = useDeleteWebsite();

  // Update local state when fetched data changes
  useEffect(() => {
    if (data) {
      setWebsites(data);
    }
  }, [data]);

  const handleDelete = async (id: string) => {
    try {
      await deleteWebsite.mutateAsync(id);
      setSuccess("Website deleted successfully!");

      // Remove the deleted website from the local state
      setWebsites((prevWebsites) => prevWebsites.filter((website) => website.id !== id));

      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      console.error("Error deleting website:", error);
      setErrorMessage("Failed to delete website. Please try again.");
    }
  };

  // Handle loading and error states
  if (isLoading) {
    return (
      <p className="text-center p-4 text-2xl text-[green]">Loading...</p>
    );
  }

  if (error) {
    return (
      <p className="text-center p-4 text-2xl text-[red]">
        Error: {error.message}
      </p>
    );
  }

  const filteredWebsites = websites.filter((website) =>
    website.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "name",
      headerName: "Name",
      width: 200,
      flex: 2,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "url",
      headerName: "URL",
      width: 250,
      flex: 2,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      flex: 1,
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
            <EditIcon color="primary" />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)} size="large">
            <DeleteIcon color="error" />
          </IconButton>
        </>
      ),
      sortable: false,
    },
  ];

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      padding={4}
    >
      {errorMessage && <p className="text-center text-red-600">{errorMessage}</p>}
      {success && <p className="text-center text-green-600">{success}</p>}
      <div className="text-center">
        <p className="text-3xl mb-7 text-[#1077ec] font-semibold">All Websites</p>
      </div>
      <Stack spacing={3} alignItems="center" width="100%" maxWidth="1200px">
        <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
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
            rows={filteredWebsites}
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
