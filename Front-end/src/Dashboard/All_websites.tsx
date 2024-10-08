import React, { useState, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { Box, Stack, TextField } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { GET_ALL_WEBSITES } from "../graphql/graphqlQueries";

interface Website {
  id: number;
  name: string;
  url: string;
  status: string;
}

const All_Websites: React.FC = () => {
  const { loading, error, data } = useQuery<{ websites: Website[] }>(
    GET_ALL_WEBSITES,
    {
      fetchPolicy: "network-only",
    }
  );

  const [searchTerm, setSearchTerm] = useState<string>("");

  // Filter
  const filteredRows = useMemo(() => {
    if (!data || !data.websites) return [];

    // Filter online websites
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
      flex: 1, // Adjust width on smaller screens
    },
    {
      field: "name",
      headerName: "Name",
      width: 200,
      align: "center",
      headerAlign: "center",
      flex: 2,
    },
    {
      field: "url",
      headerName: "URL",
      width: 250,
      align: "center",
      headerAlign: "center",
      flex: 3,
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      align: "center",
      headerAlign: "center",
      flex: 1,
    },
  ];

  if (loading)
    return (
      <p className="text-center p-4 text-2xl text-[green]">Loading...</p>
    );
  if (error)
    return (
      <p className="text-center p-4 text-2xl text-[red]">
        Error: {error.message}
      </p>
    );

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      padding={4}
      sx={{
        width: "100%",
        maxWidth: "1200px",
        "@media (max-width: 600px)": {
          padding: 2,
        },
      }}
    >
      <div className="text-center">
        <p className="text-3xl mb-7 text-[#1077ec] font-semibold">
          Active Websites
        </p>
      </div>
      <Stack spacing={3} alignItems="center" width="100%">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
          sx={{
            "@media (max-width: 600px)": {
              flexDirection: "column",
              alignItems: "stretch",
            },
          }}
        >
          <TextField
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              width: "300px",
              "@media (max-width: 600px)": {
                width: "100%",
                marginBottom: "16px",
              },
            }}
          />
        </Stack>
        <Box
          sx={{
            width: "100%",
            backgroundColor: "#fff",
            "@media (max-width: 600px)": {
              "& .MuiDataGrid-root": {
                fontSize: "12px", 
              },
            },
          }}
        >
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

export default All_Websites;
