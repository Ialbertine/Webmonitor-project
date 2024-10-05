import React, { useState, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { Box, Stack, TextField } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { GET_ALL_WEBSITES } from "../graphql/queries";

interface Website {
  id: number;
  name: string;
  url: string;
  status: string;
}

const All_website: React.FC = () => {
  const { loading, error, data } = useQuery<{ websites: Website[] }>(
    GET_ALL_WEBSITES,
    {
      fetchPolicy: "network-only",
    }
  );

  const [searchTerm, setSearchTerm] = useState<string>("");

  // Filter and sort online websites
  const filteredRows = useMemo(() => {
    if (!data || !data.websites) return [];

    const onlineWebsites = data.websites.filter(
      (website) => website.status.toLowerCase() === "online"
    );

    // Filter by search term
    const filtered = onlineWebsites.filter((website) => {
      return website.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    // Sort by id in ascending order
    return filtered.sort((a, b) => a.id - b.id);
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
      field: "name",
      headerName: "Name",
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "url",
      headerName: "URL",
      width: 250,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      align: "center",
      headerAlign: "center",
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
        <p className="text-lg mb-8">Active Websites</p>
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
            autoHeight
            disableRowSelectionOnClick
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

export default All_website;
